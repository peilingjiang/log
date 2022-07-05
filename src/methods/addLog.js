import isEqual from 'react-fast-compare'
import { v4 as uuid } from 'uuid'

import {
  boundingDefault,
  logViewDefault,
  _config,
  _DEF,
  _H,
} from '../constants.js'

import { g } from '../global.js'
import {
  assertArguments,
  assertArray,
  assertElement,
  assertExistence,
  assertNumber,
  assertObject,
  assertString,
  cloneLogGroups,
  getObjectIds,
  getTimestamp,
  idFromString,
  parseStack,
  randomColor,
  stringifyDOMElement,
  _getStacks,
} from './utils.js'

export const newLog = (
  args,
  element,
  groupId,
  timestamp,
  parsedStack,
  requests
) => {
  assertArguments([
    {
      value: args,
      assertion: assertArray,
    },
    {
      value: groupId,
      assertion: assertString,
    },
    {
      value: timestamp,
      assertion: assertObject,
      // shape: ['now', 'date'],
      shape: ['now'],
    },
  ])

  return {
    id: uuid(),
    groupId: groupId,
    element: element,
    args: [...args],
    timestamps: [timestamp],
    stack: parsedStack,
    count: 1,
    ////
    // customization
    color: requests.color || _DEF,
    unit: requests.unit || '',
    history: assertNumber(requests.history)
      ? requests.history
      : _config.logStreamHistoryRenderDepth - 1,
  }
}

export const addLog = (logHost, args, element = null, requests = {}) => {
  // ! do not do anything when paused
  if (logHost.state.logPaused) return

  const timestamp = getTimestamp()

  // Traditional
  if (g.preserveConsole) window.console.log(...args)

  // HyperLog
  parseStack(_getStacks(logHost.state.logGroups), parsedStack => {
    // add log to logHost
    logHost.setState(prevState => {
      // ! Access requests in setState only
      const newState = {
        ...prevState,
        logGroups: cloneLogGroups(prevState.logGroups),
      }

      const prevIds = getObjectIds(prevState.logGroups)

      // ! element
      if (!element) {
        if (requests.element && assertElement(requests.element))
          element = requests.element
      }

      // ! groupId
      const groupId =
        requests.id ||
        idFromString(
          `${parsedStack.file}:${parsedStack.line}:${parsedStack.char}`
        )
      const groupElementId = idFromString(stringifyDOMElement(element))

      // ! first log of its group
      // can't find id among current groups
      if (prevIds.length === 0 || !prevIds.includes(groupId))
        newState.logGroups[groupId] = {
          name: requests.name || `${parsedStack.file}:${parsedStack.line}`,
          ////
          logs: [],
          ////
          groupId: groupId,
          groupElementId: groupElementId,
          element: element,
          ////
          format: requests.format || 'text',
          ////
          orientation: _H,
          snap: false,
          snapElement: null,
          snapElementId: null,
          snapAnchorSide: 'right',
          // snapTargetSide: 'right',
          snapAnchorPercent: 0.5,
          ////
          bounding: boundingDefault,
          followType: assertExistence(element) ? 'stick' : 'independent', // TODO remove?
          ////
          groupColor: requests.color || randomColor(),
          ////
          paused: false,
          deleted: false,
          ////
          view: logViewDefault,
          ////
          // customization
        }
      else if (prevIds.includes(groupId)) {
        // ! logStream paused or deleted
        if (
          prevState.logGroups[groupId].paused ||
          prevState.logGroups[groupId].deleted
        )
          return prevState
      }

      // ! snap
      if (requests.snap && requests.snap.snapElement) {
        const thisGroup = newState.logGroups[groupId]
        thisGroup.snap = true
        thisGroup.snapElement = requests.snap.snapElement
        thisGroup.snapAnchorSide =
          requests.snap.snapAnchorSide || thisGroup.snapAnchorSide
        // thisGroup.snapTargetSide =
        //   requests.snap.snapTargetSide || thisGroup.snapTargetSide
        thisGroup.snapAnchorPercent = assertNumber(
          requests.snap.snapAnchorPercent
        )
          ? requests.snap.snapAnchorPercent
          : thisGroup.snapAnchorPercent
      }

      // check if got exactly the same as the last log
      // if so, just increment count
      const logs = newState.logGroups[groupId].logs
      if (logs.length) {
        const lastLog = logs[logs.length - 1]
        if (isEqual(lastLog.args, args)) {
          return {
            ...newState,
            logGroups: {
              ...newState.logGroups,
              [groupId]: {
                ...newState.logGroups[groupId],
                logs: [
                  ...logs.slice(0, logs.length - 1),
                  {
                    ...lastLog,
                    timestamps: [...lastLog.timestamps, timestamp],
                    count: lastLog.count + 1,
                  },
                ],
              },
            },
          }
        }
      }

      // ! actually add a log here
      const aFreshNewLog = newLog(
        args,
        element,
        groupId,
        timestamp,
        parsedStack,
        requests
      )
      // newState.logGroups[groupId].logs.push(aFreshNewLog)
      // return newState

      return {
        ...newState,
        logGroups: {
          ...newState.logGroups,
          [groupId]: {
            ...newState.logGroups[groupId],
            logs: [...logs, aFreshNewLog],
          },
        },
      }
    })
  })
}
