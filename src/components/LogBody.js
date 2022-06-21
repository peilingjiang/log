import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { logInterface } from '../constants.js'
import { Formatter } from '../formatter/Main.js'
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
        stack: { file, line },
      },
      orderReversed,
      expandedLog,
    } = this.props

    return (
      <div className="hyper-log-body">
        <Formatter args={args} />
        {expandedLog && (
          <p className="source-location">
            {file}:{line}
          </p>
        )}
      </div>
    )
  }
}
