import React, { Component } from 'react'

import { logInterface } from '../constants.js'
import { Formatter } from '../formatter/formatter.js'

export default class LogBody extends Component {
  static get propTypes() {
    return {
      log: logInterface,
    }
  }

  render() {
    const {
      log: {
        args,
        stack: { file, line },
      },
    } = this.props
    return (
      <div className="hyper-log-body">
        <Formatter args={args} />
        <p className="source-location">
          {file}:{line}
        </p>
      </div>
    )
  }
}
