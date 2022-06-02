import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'

import LogHeader from './components/LogHeader.js'
import LogBody from './components/LogBody.js'

import { boundingInterface, logInterface, _config } from './constants.js'

export default class Log extends Component {
  static get propTypes() {
    return {
      log: logInterface,
      groupBounding: boundingInterface,
      orderReversed: PropTypes.number,
    }
  }

  shouldComponentUpdate(nextProps /*, nextState*/) {
    return !isEqual(nextProps, this.props)
  }

  render() {
    const { log, groupBounding, orderReversed } = this.props

    const historyRenderStyle =
      orderReversed === 0
        ? {}
        : {
            left: `${
              _config.logStreamHistoryRenderUnitOffsetPx * orderReversed
            }px`,
            bottom: `${
              _config.logStreamHistoryRenderUnitOffsetPx * orderReversed
            }px`,
          }

    return (
      orderReversed < _config.logStreamHistoryRenderDepth && (
        <div className={`hyper-log`} style={historyRenderStyle}>
          <LogHeader log={log} />
          <LogBody log={log} orderReversed={orderReversed} />
        </div>
      )
    )
  }
}
