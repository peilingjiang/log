import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'

import { _DEF, _rootStyles } from '../constants.js'
import { Formatter } from '../formatter/Formatter.js'
import { hexAndOpacityToRGBA } from '../methods/utils.js'
// import { tinyColorToRGBStyleString } from '../methods/utils.js'

export default class LogBody extends Component {
  static get propTypes() {
    return {
      // log: logInterface,
      args: PropTypes.array.isRequired,
      id: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
      timestamp: PropTypes.number.isRequired,
      stack: PropTypes.object.isRequired,
      color: PropTypes.string,
      unit: PropTypes.string,
      ////
      orderReversed: PropTypes.number,
      expandedLog: PropTypes.bool,
    }
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps)
  }

  render() {
    const {
      args,
      id,
      count,
      timestamp,
      stack: { file, line },
      color,
      unit,
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
            <p className="timestamp">{Math.round(timestamp)}</p>
            <p className="source-location">
              {file}:{line}
            </p>
          </div>
        )}
        <div className="hyper-log-body-content">
          {count > 1 && <span className="hyper-log-count">{count}</span>}
          <Formatter args={args} logId={id} />
          {unit ? `${unit}` : ''}
        </div>
      </div>
    )
  }
}
