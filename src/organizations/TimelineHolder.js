import React, { Component, createRef, memo, useRef } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'

import { TimelineName } from '../components/TimelineName.js'
import LogStreamWrapperInTimeline from './LogStreamWrapperInTimeline.js'
// import TimelineExpandSlider from '../components/TimelineExpandSlider.js'

import {
  applyOpacityTo,
  bindableElement,
  constrain,
  getElementBounding,
  idFromString,
  preventEventWrapper,
  stringifyDOMElement,
} from '../methods/utils.js'
import {
  logGroupInterface,
  logInterface,
  logTimelineItemInterface,
  pageElementsQuery,
  timelineDisableAutoScrollThresholdPx,
  timelineGroupWiseOffsetPx,
  timelineSelectionAreaOffsetButterPx,
  timelineSideDragLevelWidth,
  _Time,
} from '../constants.js'
import { getLog } from '../methods/getLog.js'
import { isOverlapped, pxTrim, pxWrap } from '../methods/findPosition.js'
import { SelectionRect } from '../components/SelectionRect.js'
import { socket } from '../global.js'
import {
  getExpandLevels,
  getTimelineOffset,
  getTimelineOffsets,
  hasLeastOneExpandLevel,
  preprocessASTsToGetRegistries,
  sumRegistries,
} from '../methods/ast.js'
import TimelineExpandSideDragger from '../components/TimelineExpandSideDragger.js'

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
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      folded: false,
      hovered: false,
      grabbing: false,
      right: '0px',
      filterArea: {
        left: pxWrap(window.innerWidth * 0.2),
        top: pxWrap(window.innerHeight * 0.2),
        right: pxWrap(window.innerWidth * (1 - 0.2)),
        bottom: pxWrap(window.innerHeight * (1 - 0.2)),
      }, // { left, top, right, bottom }
      enableFilterArea: false,
      pinnedGroupId: null, // TODO
      /* -------------------------------------------------------------------------- */
      // ! AST
      asts: {},
      registries: {},
      /* -------------------------------------------------------------------------- */
      offsetBudget: 0,
    }

    this.ref = createRef()
    this.scrollWrapperRef = createRef()

    this.handleStreamHover = this.handleStreamHover.bind(this)
    this.handleStreamDragAround = this.handleStreamDragAround.bind(this) // placeholder

    this.handleTimelineDragAround = this.handleTimelineDragAround.bind(this)
    this.handleTimelinePositionReset =
      this.handleTimelinePositionReset.bind(this)

    this.handleTimelineArea = this.handleTimelineArea.bind(this)
    this.handleTimelineSetArea = this.handleTimelineSetArea.bind(this)

    this.handleTimelineFold = this.handleTimelineFold.bind(this)

    this.setTimelineOffsetBudget = this.setTimelineOffsetBudget.bind(this)
  }

  componentDidMount() {
    socket.on('ast', data => {
      console.log('%cReceived AST', 'color: #ff42a1')

      const newRegistries = preprocessASTsToGetRegistries(
        this.props.logGroups,
        this.props.logTimeline,
        data,
        this.state.registries
      )

      if (Object.keys(data).length > 0)
        this.setState({
          asts: data,
          registries: newRegistries,
        })
    })
    socket.emit('request:ast')
  }

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

  handleStreamHover(newState = true) {
    this.setState({ hovered: newState })
  }

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

  handleTimelineArea() {
    this.setState({ enableFilterArea: !this.state.enableFilterArea })
  }

  // drag selection area dots around
  handleTimelineSetArea(newAreaData) {
    this.setState({
      filterArea: {
        ...this.state.filterArea,
        ...newAreaData,
      },
    })
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

  render() {
    const {
      logPaused,
      logGroups,
      logTimeline,
      updateLogGroup,
      updateLog,
      hostRef,
      hostFunctions,
    } = this.props

    const {
      folded,
      hovered,
      grabbing,
      right,
      filterArea,
      enableFilterArea,
      asts,
      registries,
      offsetBudget,
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
      const existingPageElements = document.querySelectorAll(pageElementsQuery)
      for (let el of existingPageElements) {
        if (bindableElement(el)) {
          if (
            !isOverlapped(getElementBounding(el), {
              left: pxTrim(filterArea.left),
              top: pxTrim(filterArea.top),
              right: pxTrim(filterArea.right),
              bottom: pxTrim(filterArea.bottom),
            })
          ) {
            filteredOutElements.push(el)
          }
        }
      }
    }

    const { offsets, indentationOffsets, declarationOffsets } =
      getTimelineOffsets(
        logGroups,
        registriesByFileName,
        offsetBudget,
        expandLevels
      )

    return (
      <>
        {enableFilterArea && (
          <SelectionRect
            filterArea={filterArea}
            handleTimelineSetArea={this.handleTimelineSetArea}
          />
        )}
        <div
          key="unified-timeline"
          ref={this.ref}
          className={`hyper-log-timeline${
            hovered || grabbing ? ' up-front' : ''
          }`}
          style={{
            right: right,
          }}
        >
          <TimelineName
            key={'timeline-name'}
            logPaused={logPaused}
            timelineFolded={folded}
            timelineGrabbing={grabbing}
            timelineEnableArea={enableFilterArea}
            handleTimelineDragAround={this.handleTimelineDragAround}
            handleTimelinePositionReset={this.handleTimelinePositionReset}
            handleTimelineArea={this.handleTimelineArea}
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
                    filteredOutElements={filteredOutElements}
                    ////
                    offsets={offsets}
                    // registriesByFileName={registriesByFileName}
                    // expandLevels={expandLevels}
                    // timelineOffsetBudget={offsetBudget}
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
      </>
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
  filteredOutElements,
  ////
  offsets,
  // registriesByFileName,
  // expandLevels,
  // timelineOffsetBudget,
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

  const toFilterOutElements = filteredOutElements.length > 0

  // ! get offsets for each log group
  // let offsets = {}
  // Object.keys(logGroups).forEach(key => {
  //   offsets[key] = getTimelineOffset(
  //     logGroups[key],
  //     registriesByFileName,
  //     timelineOffsetBudget,
  //     expandLevels
  //   )
  // })

  // ! map
  return logTimeline.map((logIdentifier, ind) => {
    const logGroup = logGroups[logIdentifier.groupId]

    // ! filter out elements
    if (toFilterOutElements && logGroup.element) {
      for (let el of filteredOutElements) {
        if (
          // idFromString(stringifyDOMElement(el)) === logGroup.groupElementId
          el.isSameNode(logGroup.element)
        ) {
          return null
        }
      }
    }

    const logObj = getLog(logGroup, logIdentifier)

    return (
      <div
        key={`${ind}-time`}
        className="timeline-log-item-wrapper"
        style={{
          borderLeft: `${pxWrap(
            logIdentifier.groupId in offsets
              ? offsets[logIdentifier.groupId]
              : 0
          )} solid ${applyOpacityTo(logGroup.groupColor, 0.25)}`,
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
          // timelineOffset={offsets[logIdentifier.groupId]}
        />

        {/* <div
          className="pseudo-expander"
          style={{
            paddingLeft: pxWrap(
              timelineOffsetBudget - offsets[logIdentifier.groupId]
            ),
          }}
        ></div> */}

        <span
          className="timeline-timestamp"
          // style={{
          //   paddingLeft: pxWrap(offsets[logIdentifier.groupId]),
          // }}
        >
          {Math.round(logObj.timestamps[0].now)}
        </span>
      </div>
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
  filteredOutElements: PropTypes.arrayOf(PropTypes.instanceOf(Element))
    .isRequired,
  ////
  offsets: PropTypes.object.isRequired,
  // registriesByFileName: PropTypes.object.isRequired,
  // expandLevels: PropTypes.object.isRequired,
  // timelineOffsetBudget: PropTypes.number.isRequired,
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
