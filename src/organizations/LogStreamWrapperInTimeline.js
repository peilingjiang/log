import React from 'react'
import isEqual from 'react-fast-compare'

import LogStream from './LogStream.js'
import Log from '../components/Log.js'
import ShapeLog from '../components/ShapeLog.js'
import { canUseShape, getLogStats } from '../methods/utils.js'
import { _H } from '../constants.js'
import { logColor } from '../methods/levels.js'
// import LogStreamMenu from './LogStreamMenu.js'
// import LogStreamName from '../components/LogStreamName.js'

export default class LogStreamWrapperInTimeline extends LogStream {
  // not an actual stream, works as a wrap to host a single log object
  /* ! registriesByFileName, expandedLevels, timelineOffsetBudget */

  componentDidUpdate() {}

  shouldComponentUpdate(nextProps, nextState) {
    // return (
    //   !isEqual(nextProps.logGroup.view, this.props.logGroup.view) ||
    //   !isEqual(nextProps.log, this.props.log) ||
    //   !isEqual(nextProps.timelineOffset, this.props.timelineOffset) ||
    //   !isEqual(nextState, this.state) ||
    //   !isEqual(
    //     getLogStats(
    //       nextProps.logGroup.logs,
    //       nextProps.logGroup.view.centerStagedId
    //     ),
    //     getLogStats(
    //       this.props.logGroup.logs,
    //       this.props.logGroup.view.centerStagedId
    //     )
    //   )
    // )
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state)
  }

  /* -------------------------------------------------------------------------- */

  handleMouseEnter() {}
  handleMouseOut() {}

  /* -------------------------------------------------------------------------- */

  render() {
    const { expand, hovered, current } = this.state
    const {
      logGroup: { groupId, groupColor, format, view, logs },
      log,
      log: { level, color },
      organization,
      hostFunctions,
      registries,
      showRegistries,
    } = this.props

    const isShape = format === 'shape'
    const logStats = getLogStats(logs, view.centerStagedId)

    const rulerColor = logColor(level, color, groupColor)

    return (
      <div
        ref={this.ref}
        className={`hyper-log-stream hyper-log-stream-in-time stream-horizontal${
          expand ? ' stream-expand' : ''
        }${isShape ? ' shape-stream' : ''}${
          ''
          // hovered ? ' stream-hovered up-front' : ''
        }${current ? ' stream-current' : ''}`}
        ////
        style={{
          boxShadow: `-0.25rem 0 0 0 ${rulerColor}`,
        }}
        ////
        // onMouseEnter={this.handleMouseEnter}
        // onMouseLeave={this.handleMouseOut}
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
              useStats={false}
              ////
              registries={registries}
              showRegistries={showRegistries}
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
              ////
              registries={registries}
              showRegistries={showRegistries}
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
