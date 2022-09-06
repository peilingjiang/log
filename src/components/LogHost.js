import React, { Component, createRef } from 'react'
import isEqual from 'react-fast-compare'

import { setLog } from '../index.ts'
import { HyperLog } from '../hyperLog.ts'
import { logProcessor } from '../logProcessor.ts'

import { addLog } from '../methods/addLog.js'
import LogStreamsHolder from '../organizations/LogStreamsHolder.js'
import TimelineHolder from '../organizations/TimelineHolder.js'
import {
  cloneLogGroup,
  deepCopyArrayOfLogs,
  getFilteredOutElements,
  preventEventWrapper,
} from '../methods/utils.js'
import { localStorageKeys, _Aug, _Time } from '../constants.js'
import { g, socket, development } from '../global.ts'
import { clearAllOutlines } from '../methods/attachElements.js'
import { highlightElement } from '../methods/highlight.js'
import { globalStackParser } from '../methods/stackParser.js'
import { preprocessASTsToGetRegistries } from '../methods/ast.js'
import { GraphicsHost } from './Graphics.js'
import { pxWrap } from '../methods/findPosition.js'
import { SelectionRect } from './SelectionRect.js'
import Shortcuts from './Shortcuts.js'

export default class LogHost extends Component {
  constructor(props) {
    super(props)

    // ! recover defaults
    let recoveredDefaults = localStorage.getItem(localStorageKeys.DEFAULT)
    window.console.log(recoveredDefaults)
    const hasRecoveredDefaults = recoveredDefaults && recoveredDefaults.length

    if (hasRecoveredDefaults) {
      recoveredDefaults = JSON.parse(recoveredDefaults)
      setLog(recoveredDefaults, false)
      window.console.log(g)
    }

    // ! recover filter from session storage
    let recoveredFilterArea = sessionStorage.getItem(localStorageKeys.AREA)
    if (recoveredFilterArea && recoveredFilterArea.length)
      recoveredFilterArea = JSON.parse(recoveredFilterArea)
    else recoveredFilterArea = undefined

    // ! init state
    this.state = {
      logPaused: false,
      logGroups: {},
      logTimeline: [],
      organization: hasRecoveredDefaults
        ? recoveredDefaults.defaultOrganization
        : g.defaultOrganization, // timeline, augmented
      ////
      timelineHighlightedLogId: null,
      ////
      // ! AST
      asts: {},
      registries: {},
      ////
      // ! adjust for page elements
      clearance: false,
      ////
      filterArea: recoveredFilterArea || {
        left: pxWrap(window.innerWidth * 0.2),
        top: pxWrap(window.innerHeight * 0.2),
        right: pxWrap(window.innerWidth * (1 - 0.2)),
        bottom: pxWrap(window.innerHeight * (1 - 0.2)),
      }, // { left, top, right, bottom }
      enableFilterArea: recoveredFilterArea ? true : false,
      ////
      showShortcuts: false,
    }

    this.ref = createRef()
    this.streamsHoldersRefs = {} // for _Aug organization

    this.windowResizeTimer = null

    this.updateLogGroup = this.updateLogGroup.bind(this)
    this.updateLog = this.updateLog.bind(this)

    this._resizeHandler = this._resizeHandler.bind(this)
    this._shortcutHandler = this._shortcutHandler.bind(this)
    this._shortcutEndHandler = this._shortcutEndHandler.bind(this)

    this.hostFunctions = {
      togglePauseTheWholeLogSystem:
        this.togglePauseTheWholeLogSystem.bind(this),
      changeOrganization: this.changeOrganization.bind(this),
      setTimelineLogOrderReversed: this.setTimelineLogOrderReversed.bind(this),
      ////
      updateSyncGraphics: this.updateSyncGraphics.bind(this),
      // addLogForGraphics: this.addLogForGraphics.bind(this),
      // removeGraphicsGroup: this.removeGraphicsGroup.bind(this),
      ////
      handleFilterArea: this.handleFilterArea.bind(this),
      handleFilterAreaChange: this.handleFilterAreaChange.bind(this),
    }

    this.loggedCounter = 0

    this.stackParser = globalStackParser

    // register log functions
    // ! ADD LOG
    // this.defineLogs()
  }

  componentDidMount() {
    // !
    this.enableLogProcessing()

    // add event listeners
    window.addEventListener('resize', this._resizeHandler)
    window.addEventListener('keydown', this._shortcutHandler)
    window.addEventListener('keyup', this._shortcutEndHandler)

    // asts
    socket.on('ast', data => {
      if (development) window.console.log('%cReceived AST', 'color: #ff42a1')

      this._updateRegistries(
        data,
        this.state.registries,
        this.state.logGroups,
        this.state.logTimeline
      )
    })
    socket.emit('request:ast')
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
    window.addEventListener('keydown', this._shortcutHandler)
    window.addEventListener('keyup', this._shortcutEndHandler)

    this.setState({
      logGroups: {},
      logTimeline: [],
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state)
  }

  _updateRegistries(asts, registries, logGroups, logTimeline) {
    const newRegistries = preprocessASTsToGetRegistries(
      logGroups,
      logTimeline,
      asts,
      registries
    )

    if (Object.keys(asts).length > 0 && !isEqual(asts, this.state.asts))
      this.setState({
        asts: asts,
      })

    if (
      Object.keys(newRegistries).length > 0 &&
      !isEqual(newRegistries, this.state.registries)
    )
      this.setState({
        registries: newRegistries,
      })
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
    if (e.altKey) {
      if (e.key === 'Alt') {
        this.setState({
          showShortcuts: true,
        })
      } else if (e.code === 'KeyC') {
        // ! clearance
        preventEventWrapper(e, () => {
          // clear the whole log system
          this.setState({
            clearance: !this.state.clearance,
          })
        })
      } else if (e.code === 'KeyT' || e.code === 'KeyX') {
        // ! organization
        preventEventWrapper(e, () => {
          // clear all element highlighting
          clearAllOutlines()
          this.changeOrganization(
            this.state.organization === _Aug ? _Time : _Aug
          )

          this.setState({
            clearance: false,
          })
        })
      } else if (e.code === 'KeyA') {
        // ! area
        preventEventWrapper(e, () => {
          this.handleFilterArea()
        })
      } else if (e.code === 'KeyM') {
        // ! sync
        preventEventWrapper(e, () => {
          this.setState({
            logGroups: {},
            logTimeline: [],
            registries: {},
          })
        })
      }
    }
  }

  _shortcutEndHandler(e) {
    if (e.key === 'Alt') {
      this.setState({
        showShortcuts: false,
      })
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return !isEqual(this.state, nextState) || !isEqual(this.props, nextProps)
  // }

  defineLogs() {
    // const logHost = this

    // window.log
    window.log = (...args) => {
      if (!g.access) return

      return new HyperLog(args, requests => {
        addLog(this, this.stackParser, args, null, requests)
      })
    }

    // TODO not yet tested
    window.errorBoundary = func => {
      if (!g.access) return

      try {
        func()
      } catch (e) {
        log(e).level('error')
      }
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

  // ! -------------------------------------------------------------------------- //
  // ! -------------------------------------------------------------------------- //
  // ! -------------------------------------------------------------------------- //
  enableLogProcessing() {
    logProcessor.setProcessFunction(hyperLog => {
      addLog(
        this,
        this.stackParser,
        hyperLog.args,
        hyperLog.timestamp,
        hyperLog.rawError,
        hyperLog.requests,
        null
      )
    })
    logProcessor.process()
  }
  // ! -------------------------------------------------------------------------- //
  // ! -------------------------------------------------------------------------- //
  // ! -------------------------------------------------------------------------- //

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

    setLog({
      defaultOrganization: newOrganization,
    })
  }

  setTimelineLogOrderReversed(groupId, reversed) {
    const thisGroup = cloneLogGroup(this.state.logGroups[groupId])
    thisGroup.timelineLogOrderReversed = reversed
    this.updateLogGroup(groupId, thisGroup)
  }

  /* -------------------------------------------------------------------------- */

  // ! area

  handleFilterArea() {
    this.setState(
      {
        enableFilterArea: !this.state.enableFilterArea,
      },
      () => {
        if (!this.state.enableFilterArea) {
          sessionStorage.setItem(localStorageKeys.AREA, '')
        }
      }
    )
  }

  // drag selection area dots around
  handleFilterAreaChange(newAreaData) {
    this.setState(
      {
        filterArea: {
          ...this.state.filterArea,
          ...newAreaData,
        },
      },
      () => {
        sessionStorage.setItem(
          localStorageKeys.AREA,
          JSON.stringify(this.state.filterArea)
        )
      }
    )
  }

  /* -------------------------------------------------------------------------- */

  renderAugmentedLogs(logGroups, registries) {
    const { clearance, enableFilterArea, filterArea } = this.state

    // we remove old streamsHoldersRefs if corresponding holder has gone
    const currentlyExistingLogGroupHolderIds = []
    const streamsHolders = []

    const streamsHoldersByElement = {}
    const streamsHolderSnapByElement = {}

    ////
    const filteredOutElements = []
    if (enableFilterArea)
      filteredOutElements.push(...getFilteredOutElements(filterArea))
    ////

    for (const logGroupId in logGroups) {
      const thisGroup = logGroups[logGroupId]

      // filter out elements
      let toContinue = false
      if (enableFilterArea && !thisGroup.element) toContinue = true
      for (let el of filteredOutElements) {
        if (el.isSameNode(thisGroup.element)) toContinue = true
      }

      if (!toContinue) {
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
    }

    // ! snap
    for (const snapElementId in streamsHolderSnapByElement) {
      if (!this.streamsHoldersRefs[snapElementId])
        this.streamsHoldersRefs[snapElementId] = createRef()
      currentlyExistingLogGroupHolderIds.push(snapElementId)

      streamsHolders.push(
        <LogStreamsHolder
          key={snapElementId}
          ref={this.streamsHoldersRefs[snapElementId]}
          ////
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
          ////
          registries={registries}
          ////
          clearance={clearance}
        />
      )
    }

    // ! attached
    for (let groupElementId in streamsHoldersByElement) {
      if (!this.streamsHoldersRefs[groupElementId])
        this.streamsHoldersRefs[groupElementId] = createRef()
      currentlyExistingLogGroupHolderIds.push(groupElementId)

      streamsHolders.push(
        <LogStreamsHolder
          key={groupElementId}
          ref={this.streamsHoldersRefs[groupElementId]}
          ////
          element={this._getElementFromLogGroups(logGroups, groupElementId)}
          elementId={groupElementId}
          logGroups={streamsHoldersByElement[groupElementId]}
          updateLogGroup={this.updateLogGroup}
          updateLog={this.updateLog}
          hostRef={this.ref}
          snap={false}
          hostFunctions={this.hostFunctions}
          ////
          registries={registries}
          ////
          clearance={clearance}
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

  renderTimelineLogs(logGroups, logTimeline, logPaused, asts, registries) {
    const { clearance, filterArea, enableFilterArea } = this.state

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
          asts={asts}
          registries={registries}
          ////
          clearance={clearance}
          ////
          filterArea={filterArea}
          enableFilterArea={enableFilterArea}
        />
      )
    )
  }

  /* -------------------------------------------------------------------------- */

  // ! hello graphics

  updateSyncGraphics(groupId) {
    const thisGroup = cloneLogGroup(this.state.logGroups[groupId])

    thisGroup.syncGraphics++
    if (thisGroup.syncGraphics > 2) thisGroup.syncGraphics = 0

    this.updateLogGroup(groupId, thisGroup)
  }

  renderGraphicsElements() {
    const { logGroups, registries } = this.state
    return <GraphicsHost logGroups={logGroups} registries={registries} />
  }

  // addLogForGraphics(groupId, log, centerStagedId) {
  //   // keep it possible to have multiple graphics for one group
  //   const newGraphics = {
  //     ...this.state.graphics,
  //     [groupId]: [
  //       {
  //         log: log,
  //         centerStagedId: centerStagedId,
  //       },
  //     ],
  //   }
  //   this.setState({ graphics: newGraphics })
  // }

  // removeGraphicsGroup(groupId) {
  //   const newGraphics = { ...this.state.graphics }
  //   delete newGraphics[groupId]
  //   this.setState({ graphics: newGraphics })
  // }

  /* -------------------------------------------------------------------------- */

  render() {
    const {
      logPaused,
      logGroups,
      logTimeline,
      organization,
      asts,
      registries,
      filterArea,
      enableFilterArea,
      showShortcuts,
    } = this.state

    let renderedLogElements

    switch (organization) {
      case _Aug:
        renderedLogElements = this.renderAugmentedLogs(logGroups, registries)
        break
      case _Time:
        renderedLogElements = this.renderTimelineLogs(
          logGroups,
          logTimeline,
          logPaused,
          asts,
          registries
        )
        break
      default:
        break
    }

    return (
      <div id="hyper-log-host" className="hyper-log-host" ref={this.ref}>
        {enableFilterArea && (
          <SelectionRect
            filterArea={filterArea}
            handleTimelineSetArea={this.hostFunctions.handleFilterAreaChange}
          />
        )}
        {renderedLogElements}
        {organization === _Aug && this.renderGraphicsElements()}
        {<Shortcuts show={showShortcuts} />}
      </div>
    )
  }
}
