import { v4 as uuid } from 'uuid'

import { g } from '../global.js'
import {
  assertArguments,
  assertArray,
  assertObject,
  assertString,
  getGroupIds,
  getTimestamp,
} from './utils.js'

export const newLog = (args, element, groupId, timestamp) => {
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
      shape: ['now', 'date'],
    },
  ])

  return {
    id: uuid(),
    groupId: groupId, // 'page' or uuid()
    element: element,
    args: [...args],
    timestamp: timestamp,
    offset: {
      x: 0,
      y: 0,
    },
  }
}

export const addLog = (logHost, args, element = null, groupId) => {
  const timestamp = getTimestamp()

  // Traditional
  if (g.preserveConsole) window.console.log(...args)

  // HyperLog
  logHost.setState(prevState => {
    const newState = { ...prevState } // might need deeper copy
    const prevIds = getGroupIds(prevState.logs)

    // can't find id among current groups
    if (prevIds.length === 0 || !prevIds.includes(groupId))
      newState.logs[groupId] = []

    newState.logs[groupId].push(newLog(args, element, groupId, timestamp))

    return newState
  })
}
