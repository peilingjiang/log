import React, { Component, createRef } from 'react'

import LogStream from './organizations/LogStream.js'

import { g } from './global.js'
import { addLog } from './methods/addLog.js'
import { boundingDefault } from './constants.js'
import LogStreamsHolder from './LogStreamsHolder.js'
import { HyperLog } from './globalLogObject.js'
import isEqual from 'react-fast-compare'
import { copyObject } from './methods/utils.js'

export default class LogHost extends Component {
  constructor(props) {
    super(props)

    this.state = {
      logGroups: {},
      organization: 'augmented', // list, grid, timeline
    }

    this.ref = createRef()
    this.streamsHoldersRefs = []

    this.windowResizeTimer = null

    this.updateLogGroup = this.updateLogGroup.bind(this)
    this.updateLog = this.updateLog.bind(this)
  }

  componentDidMount() {
    // register log functions

    // ADD LOG
    this.defineLogs()

    // add event listeners
    window.addEventListener('resize', () => {
      clearTimeout(this.windowResizeTimer)
      this.windowResizeTimer = setTimeout(() => {
        // window resized
        // for (let groupId in this.state.logGroups) {
        //   const logGroup = this.state.logGroups[groupId]
        //   this.updateLogGroup(groupId, {
        //     ...logGroup,
        //     bounding: boundingDefault,
        //   })
        // }
        this.streamsHoldersRefs.forEach(ref => {
          ref.current.optimizePosition()
        })
      }, 50)
    })
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return !isEqual(this.state, nextState) || !isEqual(this.props, nextProps)
  // }

  defineLogs() {
    // window.log
    window.log = (...args) => {
      const newHyperLog = new HyperLog(this, gotId => {
        addLog(this, args, null, gotId)
      })

      return newHyperLog
    }
    // window.log = (...args) => {
    //   addLog(this, args, null)
    //   return this
    // }

    // element.log
    const logHost = this
    // HTMLElement.prototype.log = function (...args) {
    //   addLog(logHost, args, this)
    // }
    HTMLElement.prototype.log = function (...args) {
      const newHyperLog = new HyperLog(logHost, gotId => {
        addLog(logHost, args, this, gotId)
      })

      return newHyperLog
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
    if (!this.state.logGroups[logGroupId]) return

    this.setState(prevState => {
      const newState = copyObject(prevState)
      const { logGroups } = newState

      for (const originalLog of logGroups[logGroupId].logs) {
        if (originalLog.id === logId) {
          for (const key in log) originalLog[key] = log[key]
        }
      }

      return newState
    })
  }

  /* -------------------------------------------------------------------------- */

  _getElementFromLogGroups(logGroups, groupElementId) {
    for (let groupId in logGroups) {
      const logGroup = logGroups[groupId]
      if (logGroup.groupElementId === groupElementId) return logGroup.element
    }
    return null
  }

  renderAugmentedLogs(logGroups) {
    this.streamsHoldersRefs = []

    const streamsHoldersByElement = {}
    for (const logGroupId in logGroups) {
      const thisGroup = logGroups[logGroupId]
      if (!streamsHoldersByElement[thisGroup.groupElementId])
        streamsHoldersByElement[thisGroup.groupElementId] = []
      streamsHoldersByElement[thisGroup.groupElementId].push(thisGroup)
    }

    const streamsHolders = []
    for (let groupElementId in streamsHoldersByElement) {
      const newHolderRef = createRef()
      this.streamsHoldersRefs.push(newHolderRef)
      streamsHolders.push(
        <LogStreamsHolder
          key={groupElementId}
          ref={newHolderRef}
          element={this._getElementFromLogGroups(logGroups, groupElementId)}
          elementId={groupElementId}
          logGroups={streamsHoldersByElement[groupElementId]}
          updateLogGroup={this.updateLogGroup}
          updateLog={this.updateLog}
          hostRef={this.ref}
        />
      )
    }

    return streamsHolders
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
      <div id="hyper-log-host" className="hyper-log-host" ref={this.ref}>
        {renderedLogElements}
      </div>
    )
  }
}
