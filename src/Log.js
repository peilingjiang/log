import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'

import LogHeader from './components/LogHeader.js'
import LogBody from './components/LogBody.js'

import {
  boundingInterface,
  logInterface,
  _config,
  _rootStyles,
} from './constants.js'

export default class Log extends Component {
  static get propTypes() {
    return {
      log: logInterface,
      groupBounding: boundingInterface,
      orderReversed: PropTypes.number,
      logsCount: PropTypes.number,
      expandedLog: PropTypes.bool,
    }
  }

  shouldComponentUpdate(nextProps /*, nextState*/) {
    return !isEqual(nextProps, this.props)
  }

  render() {
    const { log, orderReversed, logsCount, expandedLog } = this.props
    const orderInHistoryDisplayStack =
      Math.min(logsCount, _config.logStreamHistoryRenderDepth) -
      orderReversed -
      1

    const historyRenderStyle = {
      zIndex: 100 + orderInHistoryDisplayStack,
      opacity: expandedLog
        ? undefined
        : `${
            _rootStyles.opacityDefault -
            _config.logStreamHistoryRenderOpacityUnitDecrease * orderReversed
          }`,
    }

    return (
      (expandedLog || orderReversed < _config.logStreamHistoryRenderDepth) && (
        <div
          className={`hyper-log${
            orderReversed === 0 ? ' log-current' : ' log-in-history'
          }${expandedLog ? ' log-expand' : ' log-not-expand'}`}
          style={historyRenderStyle}
        >
          {/* <LogHeader log={log} /> */}
          <LogBody
            log={log}
            orderReversed={orderReversed}
            expandedLog={expandedLog}
          />
        </div>
      )
    )
  }
}
