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
  }

  componentDidMount() {
    // register log functions

    // ADD LOG
    this.addLogsForPage()
    this.addLogsForElement()
  }

  addLogsForPage() {
    window.log = (...args) => {
      addLog(this, args, null)
    }
  }

  addLogsForElement() {
    const logHost = this
    HTMLElement.prototype.log = function (...args) {
      addLog(logHost, args, this)
    }
  }

  /* -------------------------------------------------------------------------- */

  renderAugmentedLogs(logGroups) {
    const streamElements = []
    for (const logGroupId in logGroups)
      streamElements.push(
        <LogStream key={logGroupId} logGroup={logGroups[logGroupId]} />
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
