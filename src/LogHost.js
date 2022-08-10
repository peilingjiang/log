import React, { Component, createRef } from 'react'
import isEqual from 'react-fast-compare'

import { addLog } from './methods/addLog.js'
import LogStreamsHolder from './organizations/LogStreamsHolder.js'
import TimelineHolder from './organizations/TimelineHolder.js'
import { HyperLog } from './globalLogObject.js'
import { deepCopyArrayOfLogs } from './methods/utils.js'
import { _Aug, _Time } from './constants.js'
import { g } from './global.js'
import { clearAllOutlines } from './methods/attachElements.js'
import { highlightElement } from './methods/highlight.js'

export default class LogHost extends Component {
  constructor(props) {
    super(props)

    this.state = {
      logPaused: false,
      logGroups: {},
      logTimeline: [],
      organization: g.defaultOrganization, // timeline, augmented, list?, grid?
      ////
      timelineHighlightedLogId: null,
    }

    this.ref = createRef()
    this.streamsHoldersRefs = {} // for _Aug organization

    this.windowResizeTimer = null

    this.updateLogGroup = this.updateLogGroup.bind(this)
    this.updateLog = this.updateLog.bind(this)

    this._resizeHandler = this._resizeHandler.bind(this)
    this._shortcutHandler = this._shortcutHandler.bind(this)

    this.hostFunctions = {
      togglePauseTheWholeLogSystem:
        this.togglePauseTheWholeLogSystem.bind(this),
      changeOrganization: this.changeOrganization.bind(this),
    }

    this.loggedCounter = 0
  }

  componentDidMount() {
    // register log functions

    // ADD LOG
    this.defineLogs()

    // add event listeners
    window.addEventListener('resize', this._resizeHandler)
    window.addEventListener('keypress', this._shortcutHandler)
  }

  componentDidUpdate(prevProps, prevState) {
    // if switched to timeline organization from an item, highlight the item and scroll to it
    if (
      prevState.organization !== this.state.organization &&
      this.state.organization === _Time &&
      this.state.logId !== null
    ) {
      // highlight the item
      this.ref.current?.querySelectorAll('.logs-wrapper').forEach(el => {
        if (el.dataset?.id === this.state.timelineHighlightedLogId)
          highlightElement(el, {
            style: 'outline',
            animate: true,
            scrollIntoView: true,
            upFront: true,
          })
      })
    }
  }

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
      if (this.state.organization === _Aug)
        for (let refId in this.streamsHoldersRefs) {
          const ref = this.streamsHoldersRefs[refId]
          if (ref.current) {
            if (ref.current.props.snap) ref.current.snapToPosition()
            else ref.current.optimizePosition()
          }
        }
    }, 50)
  }

  _shortcutHandler(e) {
    if (e.ctrlKey) {
      if (e.key === 's') {
        e.preventDefault()
        e.stopPropagation()

        // add new smart stream here
      }
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return !isEqual(this.state, nextState) || !isEqual(this.props, nextProps)
  // }

  defineLogs() {
    // const logHost = this

    // window.log
    window.log = (...args) => {
      return new HyperLog(this, args, requests => {
        addLog(this, args, null, requests)
      })
    }

    // element.log
    // ! functional approach
    // HTMLElement.prototype.log = function (...args) {
    //   return new HyperLog(logHost, args, requests => {
    //     addLog(logHost, args, this, requests)
    //   })
    // }

    // Number.prototype.log = function (...args) {}
  }

  // TODO use it?
  incLoggedCounter() {
    this.loggedCounter++
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

  /* -------------------------------------------------------------------------- */

  togglePauseTheWholeLogSystem() {
    this.setState({
      logPaused: !this.state.logPaused,
    })
  }

  changeOrganization(newOrganization, logId = null) {
    // clear all element highlighting
    clearAllOutlines()

    this.setState({
      organization: newOrganization,
      timelineHighlightedLogId: logId,
    })
  }

  renderAugmentedLogs(logGroups) {
    // we remove old streamsHoldersRefs if corresponding holder has gone
    const currentlyExistingLogGroupHolderIds = []
    const streamsHolders = []

    const streamsHoldersByElement = {}
    const streamsHolderSnapByElement = {}

    for (const logGroupId in logGroups) {
      const thisGroup = logGroups[logGroupId]

      // if this is a snapped group, then append to a snap holder
      // if not, then append to a normal holder
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
          hostFunctions={this.hostFunctions}
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
          hostFunctions={this.hostFunctions}
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

  renderTimelineLogs(logGroups, logTimeline, logPaused) {
    // calculate the total number of logs
    let totalLogs = 0
    for (const logGroupId in logGroups) {
      const logGroup = logGroups[logGroupId]
      totalLogs += logGroup.logs.length
    }

    return (
      Object.keys(logGroups).length > 0 && (
        <TimelineHolder
          logPaused={logPaused}
          logGroups={logGroups}
          logTimeline={logTimeline}
          totalLogCount={totalLogs}
          updateLogGroup={this.updateLogGroup}
          updateLog={this.updateLog}
          hostRef={this.ref}
          hostFunctions={this.hostFunctions}
        />
      )
    )
  }

  /* -------------------------------------------------------------------------- */

  render() {
    const { logPaused, logGroups, logTimeline, organization } = this.state

    let renderedLogElements
    switch (organization) {
      case _Aug:
        renderedLogElements = this.renderAugmentedLogs(logGroups)
        break
      case _Time:
        renderedLogElements = this.renderTimelineLogs(
          logGroups,
          logTimeline,
          logPaused
        )
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
