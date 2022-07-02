import React from 'react'
import isEqual from 'react-fast-compare'

import LogStream from './LogStream.js'
import Log from '../components/Log.js'
import ShapeLog from '../components/ShapeLog.js'
import { checkForUnit } from '../methods/utils.js'
import { _H } from '../constants.js'
import { pxWrap } from '../methods/findPosition.js'
import LogStreamMenu from './LogStreamMenu.js'
import LogStreamName from '../components/LogStreamName.js'

export default class LogStreamWrapperInTimeline extends LogStream {
  // not an actual stream, works as a wrap to host a single log object

  componentDidUpdate() {}

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(nextProps.log, this.props.log) || !isEqual(nextState, this.state)
    )
  }

  render() {
    const { expand, hovered, grabbing, current } = this.state
    const {
      logGroup: { groupColor, format },
      log,
      organization,
      hostFunctions,
      timelineOffset,
    } = this.props

    const isShape = format === 'shape'

    return (
      <div
        ref={this.ref}
        className={`hyper-log-stream hyper-log-stream-in-time stream-horizontal${
          expand ? ' stream-expand' : ''
        }${isShape ? ' shape-stream' : ''}${
          hovered ? ' stream-hovered up-front' : ''
        }${current ? ' stream-current' : ''}`}
        // style={{
        //   borderLeft: `7px solid ${groupColor}`,
        //   marginLeft: pxWrap(timelineOffset),
        // }}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseOut}
        ////
        data-id={log.id}
      >
        <div
          className="logs-wrapper"
          ref={this.logsWrapperRef}
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          }}
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

          {!isShape || !checkForUnit(log) ? (
            <Log
              key={`${log.id} ${log.timestamps.at(-1).now}`}
              log={log}
              orderReversed={0}
              expandedLog={expand}
              snap={false}
              hostFunctions={hostFunctions}
              organization={organization}
            />
          ) : (
            <ShapeLog
              key={`S ${log.id} ${log.timestamps.at(-1).now}`}
              log={log}
              orderReversed={0}
              expandedLog={expand}
              // groupBounding={bounding}
              // logsCount={logs.length}
              snap={false}
              orientation={_H}
              hostFunctions={hostFunctions}
              organization={organization}
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
