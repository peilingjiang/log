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
    this.streamsHoldersRefs = {}

    this.windowResizeTimer = null

    this.updateLogGroup = this.updateLogGroup.bind(this)
    this.updateLog = this.updateLog.bind(this)

    this._resizeHandler = this._resizeHandler.bind(this)
  }

  componentDidMount() {
    // register log functions

    // ADD LOG
    this.defineLogs()

    // add event listeners
    window.addEventListener('resize', this._resizeHandler)
  }

  // componentDidUpdate() {}

  componentWillUnmount() {
    window.removeEventListener('resize', this._resizeHandler)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state)
  }

  _resizeHandler() {
    clearTimeout(this.windowResizeTimer)
    this.windowResizeTimer = setTimeout(() => {
      // window resized
      for (let refId in this.streamsHoldersRefs) {
        const ref = this.streamsHoldersRefs[refId]
        if (ref.current) {
          if (ref.current.props.snap) ref.current.snapToPosition()
          else ref.current.optimizePosition()
        }
      }
    }, 50)
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return !isEqual(this.state, nextState) || !isEqual(this.props, nextProps)
  // }

  defineLogs() {
    const logHost = this

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
    // HTMLElement.prototype.log = function (...args) {
    //   addLog(logHost, args, this)
    // }
    HTMLElement.prototype.log = function (...args) {
      return new HyperLog(logHost, requests => {
        addLog(logHost, args, this, requests)
      })
    }

    // Number.prototype.log = function (...args) {}
  }

  /* -------------------------------------------------------------------------- */
  // update logs

  updateLogGroup(logGroupId, logGroup) {
    const { logGroups } = this.state

    // 1
    if (!isEqual(logGroup, logGroups[logGroupId]))
      this.setState({
        logGroups: {
          ...logGroups,
          [logGroupId]: logGroup,
        },
      })

    // 2

    // logGroups[logGroupId] = logGroup
    // this.setState({
    //   logGroups,
    // })
  }

  updateLog(logGroupId, logId, log) {
    if (!this.state.logGroups[logGroupId]) return

    const prevLogs = deepCopyArrayOfLogs(this.state.logGroups[logGroupId].logs)

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
    // we remove old streamsHoldersRefs if corresponding holder has gone
    const currentlyExistingLogGroupHolderIds = []
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
      if (!this.streamsHoldersRefs[snapElementId])
        this.streamsHoldersRefs[snapElementId] = createRef()
      currentlyExistingLogGroupHolderIds.push(snapElementId)

      streamsHolders.push(
        <LogStreamsHolder
          key={snapElementId}
          ref={this.streamsHoldersRefs[snapElementId]}
          element={null}
          elementId={null}
          logGroups={streamsHolderSnapByElement[snapElementId]}
          updateLogGroup={this.updateLogGroup}
          updateLog={this.updateLog}
          hostRef={this.ref}
          // there might be multiple snapped streams with same snap settings,
          // that's why we construct a holder for them
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
      if (!this.streamsHoldersRefs[groupElementId])
        this.streamsHoldersRefs[groupElementId] = createRef()
      currentlyExistingLogGroupHolderIds.push(groupElementId)

      streamsHolders.push(
        <LogStreamsHolder
          key={groupElementId}
          ref={this.streamsHoldersRefs[groupElementId]}
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

    // remove old streamsHoldersRefs if corresponding holder has gone
    for (let groupElementId in this.streamsHoldersRefs)
      if (!currentlyExistingLogGroupHolderIds.includes(groupElementId)) {
        this.streamsHoldersRefs[groupElementId] = undefined
        delete this.streamsHoldersRefs[groupElementId]
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
