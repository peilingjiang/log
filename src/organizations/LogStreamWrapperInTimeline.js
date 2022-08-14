import React from 'react'
import isEqual from 'react-fast-compare'

import LogStream from './LogStream.js'
import Log from '../components/Log.js'
import ShapeLog from '../components/ShapeLog.js'
import { canUseShape, getLogStats } from '../methods/utils.js'
import { _H } from '../constants.js'
import { pxWrap } from '../methods/findPosition.js'
// import LogStreamMenu from './LogStreamMenu.js'
// import LogStreamName from '../components/LogStreamName.js'

export default class LogStreamWrapperInTimeline extends LogStream {
  // not an actual stream, works as a wrap to host a single log object
  /* ! registriesByFileName, expandedLevels, timelineOffsetBudget */

  componentDidUpdate() {}

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(nextProps.logGroup.view, this.props.logGroup.view) ||
      !isEqual(nextProps.log, this.props.log) ||
      !isEqual(nextProps.timelineOffset, this.props.timelineOffset) ||
      !isEqual(nextState, this.state) ||
      !isEqual(
        getLogStats(
          nextProps.logGroup.logs,
          nextProps.logGroup.view.centerStagedId
        ),
        getLogStats(
          this.props.logGroup.logs,
          this.props.logGroup.view.centerStagedId
        )
      )
    )
    // return false
  }

  render() {
    const { expand, hovered, grabbing, current } = this.state
    const {
      logGroup: { groupId, groupColor, format, view, logs },
      log,
      organization,
      hostFunctions,
    } = this.props

    const isShape = format === 'shape'
    const logStats = getLogStats(logs, view.centerStagedId)

    return (
      <div
        ref={this.ref}
        className={`hyper-log-stream hyper-log-stream-in-time stream-horizontal${
          expand ? ' stream-expand' : ''
        }${isShape ? ' shape-stream' : ''}${
          hovered ? ' stream-hovered up-front' : ''
        }${current ? ' stream-current' : ''}`}
        ////
        style={{
          // marginLeft: pxWrap(timelineOffset),
          boxShadow: `-0.25rem 0 0 0 ${groupColor}`,
        }}
        ////
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseOut}
      >
        <div
          className="logs-wrapper"
          ref={this.logsWrapperRef}
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          }}
          data-id={log.id}
        >
          {/* <LogStreamName
            name={name}
            paused={false}
            orientation={_H}
            snap={false}
            streamGrabbing={grabbing}
            handleDragAround={this.handleDragAround}
            handlePositionReset={this.handlePositionReset}
          /> */}

          {!isShape || !canUseShape(log, view.centerStagedId) ? (
            <Log
              key={`${log.id} ${log.timestamps.at(-1).now}`}
              groupId={groupId}
              log={log}
              orderReversed={0}
              expandedLog={expand}
              snap={false}
              hostFunctions={hostFunctions}
              streamFunctions={this.streamFunctions}
              organization={organization}
              view={view}
              choosingCenterStaged={false} // TODO
              highlightChanged={false}
              ////
              logStats={logStats}
            />
          ) : (
            <ShapeLog
              key={`S ${log.id} ${log.timestamps.at(-1).now}`}
              groupId={groupId}
              log={log}
              orderReversed={0}
              expandedLog={expand}
              // groupBounding={bounding}
              // logsCount={logs.length}
              snap={false}
              orientation={_H}
              hostFunctions={hostFunctions}
              streamFunctions={this.streamFunctions}
              organization={organization}
              view={view}
              choosingCenterStaged={false} // TODO
              highlightChanged={false}
              ////
              logStats={logStats}
              useStats={true}
            />
          )}
        </div>

        {/* <LogStreamMenu
          paused={false}
          format={format}
          orientation={_H}
          streamState={this.state}
          menuFunctions={this.menuFunctions}
          snap={false}
          useShape={isShape}
          organization={organization}
        /> */}
      </div>
    )
  }
}
