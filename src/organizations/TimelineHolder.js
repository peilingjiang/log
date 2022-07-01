import React, { Component, createRef, memo } from 'react'
import PropTypes from 'prop-types'

import { TimelineName } from '../components/TimelineName.js'
import LogStreamWrapperInTimeline from './LogStreamWrapperInTimeline.js'

import { constrain } from '../methods/utils.js'
import {
  timelineDisableAutoScrollThresholdPx,
  timelineGroupWiseOffsetPx,
  _Time,
} from '../constants.js'
import { pxTrim, pxWrap } from '../methods/findPosition.js'
import isEqual from 'react-fast-compare'

export default class TimelineHolder extends Component {
  static get propTypes() {
    return {
      logPaused: PropTypes.bool.isRequired,
      logGroups: PropTypes.object.isRequired,
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
    }

    this.ref = createRef()
    this.scrollWrapperRef = createRef()

    this.handleStreamHover = this.handleStreamHover.bind(this)
    this.handleStreamDragAround = this.handleStreamDragAround.bind(this) // placeholder

    this.handleTimelineDragAround = this.handleTimelineDragAround.bind(this)
    this.handleTimelinePositionReset =
      this.handleTimelinePositionReset.bind(this)

    this.handleTimelineFold = this.handleTimelineFold.bind(this)
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
        e.preventDefault()
        e.stopPropagation()

        this.setState({
          right: pxWrap(
            constrain(
              start.right - moveEvent.clientX + start.x,
              0,
              window.innerWidth - this.ref.current.offsetWidth
            )
          ),
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

  render() {
    const {
      logPaused,
      logGroups,
      updateLogGroup,
      updateLog,
      hostRef,
      hostFunctions,
    } = this.props

    const { folded, hovered, grabbing, right } = this.state

    // const numberOfThreads = Object.keys(logGroups).length

    // const backgroundAlignmentElements = []

    // const standardOffset = constrain(
    //   timelineGroupWiseOffsetPx.shared / numberOfThreads,
    //   timelineGroupWiseOffsetPx.min,
    //   timelineGroupWiseOffsetPx.max
    // )

    return (
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
          logPaused={logPaused}
          timelineFolded={folded}
          timelineGrabbing={grabbing}
          handleTimelineDragAround={this.handleTimelineDragAround}
          handleTimelinePositionReset={this.handleTimelinePositionReset}
          handleTimelineFold={this.handleTimelineFold}
          hostFunctions={hostFunctions}
        />
        {!folded && (
          <div ref={this.scrollWrapperRef} className="timeline-scroll-wrapper">
            <div className="timeline-wrapper">
              {/* {backgroundAlignmentElements} */}
              <TimelineLogItems
                logGroups={logGroups}
                updateLogGroup={updateLogGroup}
                updateLog={updateLog}
                hostRef={hostRef}
                hostFunctions={hostFunctions}
                handleStreamHover={this.handleStreamHover}
                handleStreamDragAround={this.handleStreamDragAround}
              />
            </div>
          </div>
        )}
      </div>
    )
  }
}

const TimelineLogItemsMemo = ({
  logGroups,
  updateLogGroup,
  updateLog,
  hostRef,
  hostFunctions,
  handleStreamHover,
  handleStreamDragAround,
}) => {
  return Object.keys(logGroups)
    .map(key => {
      const logGroup = logGroups[key]
      const logs = logGroup.logs

      // const offset = standardOffset * threadInd // !

      // background alignment element
      // backgroundAlignmentElements.push(
      //   <div
      //     key={groupId}
      //     className="timeline-background-alignment"
      //     style={{
      //       marginLeft: pxWrap(offset),
      //       padding: `0 ${pxWrap(standardOffset)} 0 0`,
      //     }}
      //   ></div>
      // )

      return logs.map(logObj => {
        if (logObj.count > 1) {
          return logObj.timestamps.map((timestamp, timestampInd) => ({
            logGroup: logGroup,
            logObj: {
              ...logObj,
              count: 1,
              timestamps: [timestamp],
            },
            rawInd: timestampInd,
          }))
        } else {
          return [{ logGroup, logObj, rawInd: 0 }]
        }
      })
    })
    .flat(2)
    .sort((a, b) => {
      return a.logObj.timestamps[0].now - b.logObj.timestamps[0].now
    })
    .map(({ logGroup, logObj, /* offset, */ rawInd }) => {
      // const isShape = logGroup.format === 'shape'

      return (
        // ! timeline-log-item-wrapper
        <div
          key={`${logObj.id}-${rawInd}-time`}
          className="timeline-log-item-wrapper"
          style={{
            borderLeft: `5px solid ${logGroup.groupColor}`,
          }}
        >
          <LogStreamWrapperInTimeline
            key={`${logObj.id}-${rawInd}-time-stream`}
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
            timelineOffset={0} // !
          />

          <span className="timeline-timestamp">
            {Math.round(logObj.timestamps[0].now)}
          </span>
        </div>
      )
    })
}

const TimelineLogItems = memo(TimelineLogItemsMemo, isEqual)
