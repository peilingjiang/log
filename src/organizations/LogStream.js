import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Log from '../Log.js'

// for augmented logs

export default class LogStream extends Component {
  static get propTypes() {
    return {
      logs: PropTypes.arrayOf(PropTypes.object), // [ log, log, log, ... ]
      groupId: PropTypes.string,
    }
  }

  expandStream() {}

  render() {
    const { logs, groupId } = this.props

    const logElements = []
    for (let log of logs)
      logElements.push(
        <Log
          key={`${log.id} ${log.timestamp.now}`}
          log={log}
          groupId={groupId}
        />
      )

    return <div className="hyper-log-stream">{logElements}</div>
  }
}
