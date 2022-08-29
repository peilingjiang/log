import React, { Component, createRef, memo, Fragment } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'

import { TimelineName } from '../components/TimelineName.js'
import LogStreamWrapperInTimeline from './LogStreamWrapperInTimeline.js'
// import TimelineExpandSlider from '../components/TimelineExpandSlider.js'

import {
  applyOpacityTo,
  constrain,
  getFilteredOutElements,
  getIdentifier,
  parseDefaultColor,
  preventEventWrapper,
} from '../methods/utils.js'
import {
  groupIdExtendingConnector,
  logTimelineItemInterface,
  timelineDisableAutoScrollThresholdPx,
  timelineSelectionAreaOffsetButterPx,
  timelineSideDragLevelWidth,
  _rootStyles,
  _Time,
} from '../constants.js'
import { getLog } from '../methods/getLog.js'
import { pxTrim, pxWrap } from '../methods/findPosition.js'
import { socket } from '../global.js'
import {
  getExpandLevels,
  getTimelineOffsets,
  hasLeastOneExpandLevel,
  sumRegistries,
} from '../methods/ast.js'
import TimelineExpandSideDragger from '../components/TimelineExpandSideDragger.js'
import { darkLogColor, lightLogColor, logColor } from '../methods/levels.js'

export default class TimelineHolder extends Component {
  static get propTypes() {
    return {
      logPaused: PropTypes.bool.isRequired,
      logGroups: PropTypes.object.isRequired,
      logTimeline: PropTypes.arrayOf(logTimelineItemInterface).isRequired,
      totalLogCount: PropTypes.number.isRequired,
      updateLogGroup: PropTypes.func.isRequired,
      updateLog: PropTypes.func.isRequired,
      hostRef: PropTypes.object.isRequired,
      ////
      hostFunctions: PropTypes.object.isRequired,
      ////
      asts: PropTypes.object.isRequired,
      registries: PropTypes.object.isRequired,
      ////
      clearance: PropTypes.bool.isRequired,
      ////
      filterArea: PropTypes.object.isRequired,
      enableFilterArea: PropTypes.bool.isRequired,
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      folded: false,
      hovered: true, // !
      grabbing: false,
      right: '0px',
      pinnedGroupId: null, // TODO
      /* -------------------------------------------------------------------------- */
      // ! AST
      // asts: {},
      // registries: {},
      /* -------------------------------------------------------------------------- */
      offsetBudget: 0,
      /* -------------------------------------------------------------------------- */
      filteredOutGroupIds: new Set(),
    }

    this.ref = createRef()
    this.scrollWrapperRef = createRef()

    this.handleTimelineHover = this.handleTimelineHover.bind(this)
    this.handleStreamHover = this.handleStreamHover.bind(this)
    this.handleStreamDragAround = this.handleStreamDragAround.bind(this) // placeholder

    this.handleTimelineDragAround = this.handleTimelineDragAround.bind(this)
    this.handleTimelinePositionReset =
      this.handleTimelinePositionReset.bind(this)

    this.handleTimelineFold = this.handleTimelineFold.bind(this)

    this.setTimelineOffsetBudget = this.setTimelineOffsetBudget.bind(this)

    // folding by group id in the timeline
    this.filterGroupIdsFunctions = {
      add: this.addFilteredGroupId.bind(this),
      remove: this.removeFilteredGroupId.bind(this),
    }
  }

  // componentDidMount() {}

  componentDidUpdate(prevProps) {
    // check if left overflow the screen

    // scroll to bottom
    // TODO make robust
    if (prevProps.totalLogCount !== this.props.totalLogCount)
      if (
        this.scrollWrapperRef.current?.scrollHeight -
          this.scrollWrapperRef.current?.scrollTop <
        window.innerHeight + timelineDisableAutoScrollThresholdPx
      ) {
        this.scrollWrapperRef.current.scrollTop =
          this.scrollWrapperRef.current?.scrollHeight
      }
  }

  componentWillUnmount() {
    socket.off('ast')
  }

  /* -------------------------------------------------------------------------- */

  handleTimelineHover(newState = true) {
    if (newState !== this.state.hovered) this.setState({ hovered: newState })
  }

  handleStreamHover() {}

  // placeholder
  handleStreamDragAround() {}

  handleTimelineDragAround(e) {
    if (
      e.target.parentNode?.classList.contains('timeline-icon') ||
      e.target.classList.contains('timeline-icon')
    )
      return

    const streamSetState = this.setState.bind(this)

    e.preventDefault()
    e.stopPropagation()

    if (this.ref.current) {
      this.setState({ grabbing: true })

      const start = {
        x: e.clientX,
        right: pxTrim(this.ref.current.style.right),
      }

      const handleMouseMove = moveEvent => {
        preventEventWrapper(moveEvent, () => {
          this.setState({
            right: pxWrap(
              constrain(
                start.right - moveEvent.clientX + start.x,
                -this.ref.current.offsetWidth +
                  timelineSelectionAreaOffsetButterPx * 2,
                window.innerWidth - timelineSelectionAreaOffsetButterPx * 2
              )
            ),
          })
        })
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', function _() {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', _)
        streamSetState({ grabbing: false })
      })
    }
  }

  handleTimelinePositionReset() {
    this.setState({ right: '0px' })
  }

  handleTimelineFold() {
    this.setState({ folded: !this.state.folded })
  }

  /* -------------------------------------------------------------------------- */

  // ! expand timeline
  setTimelineOffsetBudget(newBudget) {
    this.setState({ offsetBudget: newBudget })
  }

  /* -------------------------------------------------------------------------- */

  getClearanceTransform(clearance, right) {
    return {
      opacity: clearance ? 0 : 1,
      transform: clearance
        ? `translateX(${
            pxTrim(right) > window.innerWidth / 2 ? '-100vw' : '100vw'
          })`
        : `translateX(0)`,
    }
  }

  /* -------------------------------------------------------------------------- */

  addFilteredGroupId(groupId) {
    this.setState({
      filteredOutGroupIds: new Set([
        ...this.state.filteredOutGroupIds,
        groupId,
      ]),
    })
  }

  removeFilteredGroupId(groupId) {
    this.setState({
      filteredOutGroupIds: new Set(
        [...this.state.filteredOutGroupIds].filter(id => id !== groupId)
      ),
    })
  }

  /* -------------------------------------------------------------------------- */

  render() {
    const {
      logPaused,
      logGroups,
      logTimeline,
      updateLogGroup,
      updateLog,
      hostRef,
      hostFunctions,
      asts,
      registries,
      clearance,
      filterArea,
      enableFilterArea,
    } = this.props

    const {
      folded,
      hovered,
      grabbing,
      right,
      offsetBudget,
      filteredOutGroupIds,
    } = this.state

    const hasSomeAST = asts === null ? false : Object.keys(asts).length > 0

    // ! recover depth relationships from registries
    const registriesByFileName = hasSomeAST ? sumRegistries(registries) : {}
    const expandLevels = getExpandLevels(registriesByFileName)

    // const numberOfThreads = Object.keys(logGroups).length

    // const backgroundAlignmentElements = []

    // const standardOffset = constrain(
    //   timelineGroupWiseOffsetPx.shared / numberOfThreads,
    //   timelineGroupWiseOffsetPx.min,
    //   timelineGroupWiseOffsetPx.max
    // )

    const filteredOutElements = []

    if (enableFilterArea) {
      // check which element is selected
      filteredOutElements.push(...getFilteredOutElements(filterArea))
    }

    const { offsets, indentationOffsets, declarationOffsets } =
      getTimelineOffsets(
        logGroups,
        registriesByFileName,
        offsetBudget,
        expandLevels
      )

    return (
      <div
        key="unified-timeline"
        ref={this.ref}
        className={`hyper-log-timeline${
          hovered || grabbing ? ' up-front' : ''
        }`}
        style={{
          right: right,
          ...this.getClearanceTransform(clearance, right),
        }}
        // onMouseEnter={() => this.handleTimelineHover(true)}
        // onMouseLeave={() => this.handleTimelineHover(false)}
      >
        <TimelineName
          key={'timeline-name'}
          logPaused={logPaused}
          timelineFolded={folded}
          timelineGrabbing={grabbing}
          timelineEnableArea={enableFilterArea}
          handleTimelineDragAround={this.handleTimelineDragAround}
          handleTimelinePositionReset={this.handleTimelinePositionReset}
          handleTimelineArea={hostFunctions.handleFilterArea}
          handleTimelineFold={this.handleTimelineFold}
          hostFunctions={hostFunctions}
          timelineOffsetBudget={offsetBudget}
        />
        {!folded && (
          <div className="side-dragger-wrapper">
            {/* {hasSomeAST && (
                <TimelineExpandSlider
                  key={'timeline-expand-slider'}
                  timelineRef={this.ref}
                />
              )} */}
            {hasSomeAST && hasLeastOneExpandLevel(expandLevels) && (
              <TimelineExpandSideDragger
                expandLevels={expandLevels}
                timelineOffsetBudget={offsetBudget}
                setTimelineOffsetBudget={this.setTimelineOffsetBudget}
              />
            )}
            <div
              ref={this.scrollWrapperRef}
              className="timeline-scroll-wrapper"
            >
              <div className="timeline-wrapper">
                {/* {backgroundAlignmentElements} */}
                <TimelineLogItems
                  logGroups={logGroups}
                  logTimeline={logTimeline}
                  updateLogGroup={updateLogGroup}
                  updateLog={updateLog}
                  hostRef={hostRef}
                  hostFunctions={hostFunctions}
                  handleStreamHover={this.handleStreamHover}
                  handleStreamDragAround={this.handleStreamDragAround}
                  ////
                  enableFilterArea={enableFilterArea}
                  filteredOutElements={filteredOutElements}
                  ////
                  offsets={offsets}
                  ////
                  registries={registries}
                  ////
                  filteredOutGroupIds={filteredOutGroupIds}
                  filterGroupIdsFunctions={this.filterGroupIdsFunctions}
                />
                <AlignmentBoxes
                  indentationOffsets={indentationOffsets}
                  declarationOffsets={declarationOffsets}
                  budget={offsetBudget}
                  scrollTop={this.scrollWrapperRef}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}

/* -------------------------------------------------------------------------- */

const TimelineLogItemsMemo = ({
  logGroups,
  logTimeline,
  updateLogGroup,
  updateLog,
  hostRef,
  hostFunctions,
  handleStreamHover,
  handleStreamDragAround,
  ////
  enableFilterArea,
  filteredOutElements,
  ////
  offsets,
  ////
  registries,
  ////
  filteredOutGroupIds,
  filterGroupIdsFunctions,
}) => {
  // Object.keys(logGroups)
  //   .map(key => {
  //     const logGroup = logGroups[key]
  //     const logs = logGroup.logs

  //     if (filteredOutElements.length) {
  //       for (let el of filteredOutElements) {
  //         if (
  //           // idFromString(stringifyDOMElement(el)) === logGroup.groupElementId
  //           el.isSameNode(logGroup.element)
  //         ) {
  //           return []
  //         }
  //       }
  //     }

  //     // const offset = standardOffset * threadInd // !

  //     // background alignment element
  //     // backgroundAlignmentElements.push(
  //     //   <div
  //     //     key={groupId}
  //     //     className="timeline-background-alignment"
  //     //     style={{
  //     //       marginLeft: pxWrap(offset),
  //     //       padding: `0 ${pxWrap(standardOffset)} 0 0`,
  //     //     }}
  //     //   ></div>
  //     // )

  //     return logs.map(logObj => {
  //       if (logObj.count > 1) {
  //         return logObj.timestamps.map((timestamp, timestampInd) => ({
  //           logGroup: logGroup,
  //           logObj: {
  //             ...logObj,
  //             count: 1,
  //             timestamps: [timestamp],
  //           },
  //           rawInd: timestampInd,
  //         }))
  //       } else {
  //         return [{ logGroup, logObj, rawInd: 0 }]
  //       }
  //     })
  //   })
  //   .flat(2)
  //   .sort((a, b) => {
  //     return a.logObj.timestamps[0].now - b.logObj.timestamps[0].now
  //   })
  //   .map(({ logGroup, logObj, /* offset, */ rawInd }) => {
  //     // const isShape = logGroup.format === 'shape'

  //     const logLocationDepthRegistry = getDepthRegistry(
  //       asts,
  //       logObj,
  //       parsedLogASTRegistries
  //     )

  //     return (
  //       // ! timeline-log-item-wrapper
  //       <div
  //         key={`${logObj.id}-${rawInd}-time`}
  //         className="timeline-log-item-wrapper"
  //         style={{
  //           borderLeft: `5px solid ${logGroup.groupColor}`,
  //         }}
  //         data-id={logObj.id}
  //       >
  //         <LogStreamWrapperInTimeline
  //           key={`${logObj.id}-${rawInd}-time-stream`}
  //           logGroup={logGroup}
  //           log={logObj}
  //           updateLogGroup={updateLogGroup}
  //           updateLog={updateLog}
  //           hostRef={hostRef}
  //           handleStreamHover={handleStreamHover}
  //           handleStreamDragAround={handleStreamDragAround}
  //           organization={_Time}
  //           hostFunctions={hostFunctions}
  //           ////
  //           // timelineOffset={0} // !
  //           logLocationDepthRegistry={logLocationDepthRegistry}
  //         />

  //         <span className="timeline-timestamp">
  //           {Math.round(logObj.timestamps[0].now)}
  //         </span>
  //       </div>
  //     )
  //   })

  const handleFilterGroupIds = id => {
    if (filteredOutGroupIds.has(id)) filterGroupIdsFunctions.remove(id)
    else filterGroupIdsFunctions.add(id)
  }

  /* -------------------------------------------------------------------------- */
  // ! MAP MAP MAP
  /* -------------------------------------------------------------------------- */
  let lastItem = null
  let visitedIdExtendedDuringSameIdentifier = new Set()
  return logTimeline.map((logIdentifier, ind) => {
    const logGroup = logGroups[logIdentifier.groupId]

    // ! filter out elements
    if (enableFilterArea) {
      if (logGroup.element) {
        for (let el of filteredOutElements) {
          if (
            // idFromString(stringifyDOMElement(el)) === logGroup.groupElementId
            el.isSameNode(logGroup.element)
          ) {
            return null
          }
        }
      } else {
        return null
      }
    }

    const logObj = getLog(logGroup, logIdentifier)
    if (!logObj) return null

    const level = logObj.level // ! always look at the log level here in timeline

    const offsetBackgroundColor = lightLogColor(
      level,
      logObj.color,
      logGroup.groupColor
    )
    const rulerColor = logColor(level, logObj.color, logGroup.groupColor)
    const darkColor = darkLogColor(level, logObj.color, logGroup.groupColor)

    const groupIdExtended = `${
      logGroup.groupId
    }${groupIdExtendingConnector}${getIdentifier(
      logObj.stack.path,
      logObj.stack.line,
      logObj.stack.char
    )}`

    const thisItem = {
      offsetPx: pxWrap(
        groupIdExtended in offsets ? offsets[groupIdExtended] : 0
      ),
      groupName: logGroup.name,
      groupId: logGroup.groupId,
      stack: logObj.stack,
    }

    const pseudoBorderLeft = `${thisItem.offsetPx} solid ${applyOpacityTo(
      offsetBackgroundColor,
      0.25
    )}`

    const firstOfTheIdentifier =
      !lastItem || !isEqual(lastItem.groupId, thisItem.groupId)

    if (firstOfTheIdentifier) {
      lastItem = thisItem
      visitedIdExtendedDuringSameIdentifier = new Set()
    }

    const showRegistries =
      firstOfTheIdentifier ||
      !visitedIdExtendedDuringSameIdentifier.has(groupIdExtended)
    visitedIdExtendedDuringSameIdentifier.add(groupIdExtended)

    return (
      <Fragment key={`timeline-${ind}`}>
        {firstOfTheIdentifier && (
          <div
            key={`header-${ind}-time`}
            className={`timeline-stream-item-wrappers-header${
              filteredOutGroupIds.has(logGroup.groupId)
                ? ' filtered-out-group-header'
                : ''
            }`}
            style={{
              borderLeft:
                level === 'log'
                  ? pseudoBorderLeft
                  : `${thisItem.offsetPx} solid ${rulerColor}`,
              background: filteredOutGroupIds.has(logGroup.groupId)
                ? applyOpacityTo(_rootStyles.grey, 0.25)
                : undefined,
            }}
            onClick={() => {
              handleFilterGroupIds(logGroup.groupId)
            }}
          >
            <span
              style={{
                boxShadow: `-0.25rem 0 0 0 ${rulerColor}`,
                color: level === 'log' ? undefined : darkColor,
              }}
            >
              {thisItem.groupName}
            </span>
          </div>
        )}

        <div
          key={`${ind}-time`}
          className={`timeline-log-item-wrapper level-${logObj.level}`}
          style={{
            borderLeft: pseudoBorderLeft,
            maxHeight: !filteredOutGroupIds.has(logIdentifier.groupId)
              ? '32rem'
              : 0,
          }}
          // data-id={logObj.id}
        >
          <LogStreamWrapperInTimeline
            key={`${ind}-time-stream`}
            logGroup={logGroup}
            log={logObj}
            updateLogGroup={updateLogGroup}
            updateLog={updateLog}
            hostRef={hostRef}
            handleStreamHover={handleStreamHover}
            handleStreamDragAround={handleStreamDragAround}
            organization={_Time}
            hostFunctions={hostFunctions}
            ////
            registries={registries}
            showRegistries={showRegistries}
          />

          <span
            className="timeline-timestamp"
            style={{
              color:
                // variation of darkColor module
                level === 'log'
                  ? parseDefaultColor(logObj.color, logGroup.groupColor, true)
                  : level === 'error'
                  ? _rootStyles.errorRedDark
                  : _rootStyles.warnYellowDark,
            }}
          >
            {Math.round(logObj.timestamps[0].now)}
          </span>
        </div>
      </Fragment>
    )
  })
}

TimelineLogItemsMemo.propTypes = {
  logGroups: PropTypes.object.isRequired,
  logTimeline: PropTypes.arrayOf(logTimelineItemInterface).isRequired,
  updateLogGroup: PropTypes.func.isRequired,
  updateLog: PropTypes.func.isRequired,
  hostRef: PropTypes.object.isRequired,
  hostFunctions: PropTypes.object.isRequired,
  handleStreamHover: PropTypes.func.isRequired,
  handleStreamDragAround: PropTypes.func.isRequired,
  enableFilterArea: PropTypes.bool.isRequired,
  filteredOutElements: PropTypes.arrayOf(PropTypes.instanceOf(Element))
    .isRequired,
  ////
  offsets: PropTypes.object.isRequired,
  ////
  registries: PropTypes.object.isRequired,
  ////
  filteredOutGroupIds: PropTypes.object.isRequired,
  filterGroupIdsFunctions: PropTypes.object.isRequired,
}

const TimelineLogItems = memo(TimelineLogItemsMemo, isEqual)

/* -------------------------------------------------------------------------- */

const AlignmentBoxes = ({ indentationOffsets, declarationOffsets, budget }) => {
  const { indentationPx, declarationPx } = timelineSideDragLevelWidth

  const indentationBoxes = Object.keys(indentationOffsets).map(
    (groupId, ind) => {
      const offset =
        indentationOffsets[groupId] +
        (declarationOffsets[groupId] ? declarationOffsets[groupId] : 0)

      return (
        <div
          key={`indentation-${ind}`}
          className="timeline-alignment-box indentation-box"
          style={{
            // top: pxWrap(scrollTop),
            left: pxWrap(offset),
            opacity: constrain(budget / indentationPx, 0, 1),
          }}
        ></div>
      )
    }
  )

  const declarationBoxes = [...new Set(Object.values(declarationOffsets))].map(
    (offset, ind) => {
      return (
        <div
          key={`declaration-${ind}`}
          className="timeline-alignment-box declaration-box"
          style={{
            // top: pxWrap(scrollTop),
            left: pxWrap(offset),
            opacity: constrain((budget - indentationPx) / declarationPx, 0, 1),
          }}
        ></div>
      )
    }
  )

  return (
    <>
      {indentationBoxes}
      {declarationBoxes}
    </>
  )
}

AlignmentBoxes.propTypes = {
  indentationOffsets: PropTypes.object.isRequired,
  declarationOffsets: PropTypes.object.isRequired,
  budget: PropTypes.number.isRequired,
}
