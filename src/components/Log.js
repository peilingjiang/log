import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'

// import LogHeader from './components/LogHeader.js'
import LogBody from './LogBody.js'

import {
  // boundingInterface,
  logInterface,
  logViewInterface,
  _config,
  _rootStyles,
} from '../constants.js'

export default class Log extends Component {
  static get propTypes() {
    return {
      groupId: PropTypes.string.isRequired,
      log: logInterface.isRequired,
      orderReversed: PropTypes.number.isRequired,
      expandedLog: PropTypes.bool.isRequired,
      // groupBounding: boundingInterface,
      // logsCount: PropTypes.number,
      snap: PropTypes.bool.isRequired,
      orientation: PropTypes.string,
      ////
      hostFunctions: PropTypes.object.isRequired,
      streamFunctions: PropTypes.object.isRequired,
      organization: PropTypes.string.isRequired,
      ////
      view: logViewInterface.isRequired,
      choosingCenterStaged: PropTypes.bool.isRequired,
      highlightChanged: PropTypes.bool.isRequired,
    }
  }

  shouldComponentUpdate(nextProps) {
    // const {
    //   expandedLog,
    //   orderReversed,
    //   log: { history },
    // } = nextProps
    // const { expandedLog: prevExpandedLog } = this.props

    // if the stream is not expanded, now and then,
    // and this log is not in the displayed history
    // we update one more time (history + 1) as we need to hide it
    // before stop updating it
    // if (!expandedLog && !prevExpandedLog && orderReversed > history * 2)
    //   return false

    return !isEqual(nextProps, this.props)
  }

  render() {
    const {
      groupId,
      log,
      orderReversed,
      expandedLog,
      hostFunctions,
      streamFunctions,
      organization,
      view,
      choosingCenterStaged,
      highlightChanged,
    } = this.props
    const {
      log: { args, id, count, timestamps, stack, color, unit },
    } = this.props

    if (!expandedLog && orderReversed > log.history) return undefined
    return (
      <div
        className={`hyper-log${
          orderReversed === 0 ? ' log-current' : ' log-in-history'
        }${expandedLog ? ' log-expand' : ' log-not-expand'}`}
        style={logBaseStyles(orderReversed, expandedLog)}
        data-id={id}
      >
        {/* <LogHeader log={log} /> */}
        <LogBody
          // key={highlightChanged ? `${groupId}-stream-timeline-log-body` : undefined}
          args={args}
          groupId={groupId}
          id={id}
          count={count}
          timestamp={timestamps.at(-1).now}
          stack={stack}
          color={color}
          unit={unit}
          ////
          orderReversed={orderReversed}
          expandedLog={expandedLog}
          hostFunctions={hostFunctions}
          streamFunctions={streamFunctions}
          organization={organization}
          view={view}
          choosingCenterStaged={choosingCenterStaged}
          highlightChanged={highlightChanged}
        />
      </div>
    )
  }
}

export const logBaseStyles = (orderReversed, expanded) => ({
  // zIndex: 1000 - orderReversed,
  opacity: expanded
    ? undefined
    : _rootStyles.opacityDefault -
      _config.logStreamHistoryRenderOpacityUnitDecrease * orderReversed,
  zIndex: 99999 - orderReversed,
})
