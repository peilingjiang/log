import React, { Component, createRef } from 'react'
import isEqual from 'react-fast-compare'

import { addLog } from './methods/addLog.js'
import LogStreamsHolder from './organizations/LogStreamsHolder.js'
import { HyperLog } from './globalLogObject.js'
import { deepCopyArrayOfLogs } from './methods/utils.js'

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
      return new HyperLog(this, requests => {
        addLog(this, args, null, requests)
      })
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
      return new HyperLog(logHost, requests => {
        addLog(logHost, args, this, requests)
      })
    }
  }

  /* -------------------------------------------------------------------------- */
  // update logs

  updateLogGroup(logGroupId, logGroup) {
    const { logGroups } = this.state

    this.setState({
      logGroups: {
        ...logGroups,
        [logGroupId]: logGroup,
      },
    })
  }

  updateLog(logGroupId, logId, log) {
    if (!this.state.logGroups[logGroupId]) return
    console.log(log)

    const prevLogs = deepCopyArrayOfLogs(this.state.logGroups[logGroupId].logs)
    console.log(prevLogs)
    for (const originalLog of prevLogs) {
      if (originalLog.id === logId) {
        for (const key in log) originalLog[key] = log[key]
      }
    }

    this.setState({
      logGroups: {
        ...this.state.logGroups,
        [logGroupId]: {
          ...this.state.logGroups[logGroupId],
          logs: [...prevLogs],
        },
      },
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

  _getSnapElementFromGroups(logGroups, snapElementId) {
    for (let groupId in logGroups) {
      const logGroup = logGroups[groupId]
      if (logGroup.snapElementId === snapElementId) return logGroup.snapElement
    }
    return null
  }

  _getSnapAnchorSideFromGroups(logGroups, snapElementId) {
    for (let groupId in logGroups) {
      const logGroup = logGroups[groupId]
      if (logGroup.snapElementId === snapElementId)
        return logGroup.snapAnchorSide
    }
    return null
  }

  renderAugmentedLogs(logGroups) {
    this.streamsHoldersRefs = []

    const streamsHolders = []

    const streamsHoldersByElement = {}
    const streamsHolderSnapByElement = {}

    for (const logGroupId in logGroups) {
      const thisGroup = logGroups[logGroupId]

      if (thisGroup.snap) {
        if (!streamsHolderSnapByElement[thisGroup.snapElementId])
          streamsHolderSnapByElement[thisGroup.snapElementId] = []
        streamsHolderSnapByElement[thisGroup.snapElementId].push(thisGroup)
      } else {
        if (!streamsHoldersByElement[thisGroup.groupElementId])
          streamsHoldersByElement[thisGroup.groupElementId] = []
        streamsHoldersByElement[thisGroup.groupElementId].push(thisGroup)
      }
    }

    for (const snapElementId in streamsHolderSnapByElement) {
      const newHolderRef = createRef()
      this.streamsHoldersRefs.push(newHolderRef)
      streamsHolders.push(
        <LogStreamsHolder
          key={snapElementId}
          ref={newHolderRef}
          element={null}
          elementId={null}
          logGroups={streamsHolderSnapByElement[snapElementId]}
          updateLogGroup={this.updateLogGroup}
          updateLog={this.updateLog}
          hostRef={this.ref}
          snap={true}
          snapElement={this._getSnapElementFromGroups(logGroups, snapElementId)}
          snapElementId={snapElementId}
          snapAnchorSide={this._getSnapAnchorSideFromGroups(
            logGroups,
            snapElementId
          )}
        />
      )
    }

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
          snap={false}
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
