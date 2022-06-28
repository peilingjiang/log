import isEqual from 'react-fast-compare'
import { v4 as uuid } from 'uuid'

import { boundingDefault, _config, _DEF, _H } from '../constants.js'

import { g } from '../global.js'
import {
  assertArguments,
  assertArray,
  assertExistence,
  assertNumber,
  assertObject,
  assertString,
  cloneLogGroups,
  getObjectIds,
  getTimestamp,
  idFromString,
  parseStack,
  stringifyDOMElement,
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
  const timestamp = getTimestamp()

  // Traditional
  if (g.preserveConsole) window.console.log(...args)

  // HyperLog
  parseStack(parsedStack => {
    const groupId = idFromString(
      `${parsedStack.path}:${parsedStack.line}:${parsedStack.char}`
    )
    const groupElementId = idFromString(stringifyDOMElement(element))

    // add log to logHost
    logHost.setState(prevState => {
      const newState = {
        ...prevState,
        logGroups: cloneLogGroups(prevState.logGroups),
      }

      const prevIds = getObjectIds(prevState.logGroups)

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
          paused: false,
          deleted: false,
          ////
          // customization
        }
      else if (prevIds.includes(groupId)) {
        if (
          prevState.logGroups[groupId].paused ||
          prevState.logGroups[groupId].deleted
        )
          return prevState
      }

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
                  ...logs.slice(0, logs.length - 2),
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

      const aFreshNewLog = newLog(
        args,
        element,
        groupId,
        timestamp,
        parsedStack,
        requests
      )
      newState.logGroups[groupId].logs.push(aFreshNewLog)
      return newState
    })
  })
}
