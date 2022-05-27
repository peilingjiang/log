import React, { Component } from 'react'

import LogStream from './organizations/LogStream.js'

import { g } from './global.js'
import { addLog } from './methods/addLog.js'

export default class LogHost extends Component {
  constructor(props) {
    super(props)

    this.state = {
      logGroups: {},
      organization: 'augmented', // list, grid, timeline
    }

    this.updateLogGroup = this.updateLogGroup.bind(this)
  }

  componentDidMount() {
    // register log functions

    // ADD LOG
    this.defineLogs()
  }

  defineLogs() {
    // window.log
    window.log = (...args) => {
      addLog(this, args, null)
    }

    // element.log
    const logHost = this
    HTMLElement.prototype.log = function (...args) {
      addLog(logHost, args, this)
    }
  }

  /* -------------------------------------------------------------------------- */
  // update logs

  updateLogGroup(logGroupId, logGroup) {
    const { logGroups } = this.state

    logGroups[logGroupId] = logGroup

    this.setState({
      logGroups,
    })
  }

  updateLog(logGroupId, logId, log) {
    const { logGroups } = this.state

    const logGroup = logGroups[logGroupId]
    if (!logGroup) return

    logGroup.logs[logId] = log

    this.setState({
      logGroups,
    })
  }

  /* -------------------------------------------------------------------------- */

  renderAugmentedLogs(logGroups) {
    const streamElements = []
    for (const logGroupId in logGroups)
      streamElements.push(
        <LogStream
          key={logGroupId}
          logGroup={logGroups[logGroupId]}
          updateLogGroup={this.updateLogGroup}
        />
      )

    return streamElements
  }

  /* -------------------------------------------------------------------------- */

  render() {
    const { logGroups, organization } = this.state

    let renderedLogElements
    switch (organization) {
      case 'augmented':
        renderedLogElements = this.renderAugmentedLogs(logGroups)
        break

      default:
        break
    }

    return (
      <div id="hyper-log-host" className="hyper-log-host">
        {renderedLogElements}
      </div>
    )
  }
}
