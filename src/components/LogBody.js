import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { logInterface, _DEF, _rootStyles } from '../constants.js'
import { Formatter } from '../formatter/Main.js'
import { hexAndOpacityToRGBA } from '../methods/utils.js'
// import { tinyColorToRGBStyleString } from '../methods/utils.js'

export default class LogBody extends Component {
  static get propTypes() {
    return {
      log: logInterface,
      orderReversed: PropTypes.number,
      expandedLog: PropTypes.bool,
    }
  }

  render() {
    const {
      log: {
        args,
        timestamp: { now },
        stack: { file, line },
        color,
        unit,
      },
      // orderReversed,
      expandedLog,
    } = this.props

    return (
      <div
        className="hyper-log-body"
        style={{
          background:
            color === _DEF
              ? undefined
              : `${hexAndOpacityToRGBA(color, _rootStyles.opacityDefault)}`,
        }}
      >
        {expandedLog && (
          <div className="hyper-log-body-header">
            <p className="timestamp">{Math.round(now)}</p>
            <p className="source-location">
              {file}:{line}
            </p>
          </div>
        )}
        <div className="hyper-log-body-content">
          <Formatter args={args} />
          {unit ? `${unit}` : ''}
        </div>
      </div>
    )
  }
}
