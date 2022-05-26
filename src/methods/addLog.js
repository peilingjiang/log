import { v4 as uuid } from 'uuid'
import { v5 as uuidv5 } from 'uuid'

import { g } from '../global.js'
import {
  assertArguments,
  assertArray,
  assertExistence,
  assertObject,
  assertString,
  cloneLogGroups,
  getObjectIds,
  getTimestamp,
  parseStack,
} from './utils.js'

export const newLog = (args, element, groupId, timestamp, parsedStack) => {
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
    groupId: groupId,
    element: element,
    args: [...args],
    timestamp: timestamp,
    stack: parsedStack,
  }
}

export const addLog = (logHost, args, element = null) => {
  const timestamp = getTimestamp()

  // Traditional
  if (g.preserveConsole) window.console.log(...args)

  // HyperLog
  parseStack(new Error().stack, parsedStack => {
    const groupId = uuidv5(
      `${parsedStack.path}:${parsedStack.line}:${parsedStack.char}`,
      uuidv5.URL
    )

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
          logs: [],
          groupId: groupId,
          offset: {
            x: 0,
            y: 0,
          },
          followType: assertExistence(element) ? 'stick' : 'independent',
        }

      newState.logGroups[groupId].logs.push(
        newLog(args, element, groupId, timestamp, parsedStack)
      )

      return newState
    })
  })
}
