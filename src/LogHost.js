import React, { Component } from 'react'

import LogStream from './organizations/LogStream.js'

import { g } from './global.js'
import { addLog } from './methods/addLog.js'
import { getTimestamp } from './methods/utils.js'

export default class LogHost extends Component {
  constructor(props) {
    super(props)

    this.state = {
      logs: {},
      organization: 'augmented', // list, grid, timeline
    }
  }

  componentDidMount() {
    // register log functions

    // ADD LOG
    this.addLogsForPage()
    this.addLogsForElement()
  }

  addLogsForPage() {
    window.log = (...args) => {
      addLog(this, args, null, 'page')
    }
  }

  addLogsForElement() {
    const logHost = this
    HTMLElement.prototype.log = function (...args) {
      addLog(logHost, args, this, 'page')
    }
  }

  /* -------------------------------------------------------------------------- */

  renderAugmentedLogs(logs) {
    const streamElements = []
    for (const logGroupId in logs)
      streamElements.push(
        <LogStream
          key={logGroupId}
          groupId={logGroupId}
          logs={logs[logGroupId]}
        />
      )

    return streamElements
  }

  /* -------------------------------------------------------------------------- */

  render() {
    const { logs, organization } = this.state

    let renderedLogElements
    switch (organization) {
      case 'augmented':
        renderedLogElements = this.renderAugmentedLogs(logs)
        break

      default:
        break
    }

    return <div id="log-host">{renderedLogElements}</div>
  }
}
