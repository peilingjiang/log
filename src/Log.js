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
    }
  }

  shouldComponentUpdate(nextProps /*, nextState*/) {
    return !isEqual(nextProps, this.props)
  }

  render() {
    const { log, orderReversed, logsCount } = this.props
    const orderInHistoryDisplayStack =
      Math.min(logsCount, _config.logStreamHistoryRenderDepth) -
      orderReversed -
      1

    const historyRenderStyle = {
      zIndex: orderInHistoryDisplayStack,
      opacity: `${
        _rootStyles.opacityDefault -
        _config.logStreamHistoryRenderOpacityUnitDecrease * orderReversed
      }`,
      transform: `translateY(calc(-${100 * orderInHistoryDisplayStack}% + ${
        _config.logStreamHistoryRenderUnitOffsetPx * orderInHistoryDisplayStack
      }px)) scale(${1 - 0.2 * orderReversed})`,
    }

    return (
      orderReversed < _config.logStreamHistoryRenderDepth && (
        <div
          className={`hyper-log${orderReversed === 0 ? '' : ' log-in-history'}`}
          style={historyRenderStyle}
        >
          <LogHeader log={log} />
          <LogBody log={log} orderReversed={orderReversed} />
        </div>
      )
    )
  }
}
