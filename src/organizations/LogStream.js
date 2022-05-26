import React, { Component } from 'react'
import isEqual from 'react-fast-compare'

import Log from '../Log.js'

import { logGroupInterface } from '../constants.js'

// for augmented logs

export default class LogStream extends Component {
  static get propTypes() {
    return {
      logGroup: logGroupInterface,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props)
  }

  expandStream() {}

  render() {
    const { logGroup } = this.props

    const logElements = []
    for (let log of logGroup.logs)
      logElements.push(<Log key={`${log.id} ${log.timestamp.now}`} log={log} />)

    return <div className="hyper-log-stream">{logElements}</div>
  }
}
