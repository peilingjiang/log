import { v4 as uuid } from 'uuid'
import { v5 as uuidv5 } from 'uuid'
import { boundingDefault, _L, _T } from '../constants.js'

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
  idFromString,
  parseStack,
  stringifyDOMElement,
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

export const addLog = (logHost, args, element = null, gotId = null) => {
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
    logHost.setState(
      prevState => {
        const newState = {
          ...prevState,
          logGroups: cloneLogGroups(prevState.logGroups),
        }

        const prevIds = getObjectIds(prevState.logGroups)

        // can't find id among current groups
        if (prevIds.length === 0 || !prevIds.includes(groupId))
          newState.logGroups[groupId] = {
            name: '',
            logs: [],
            groupId: groupId,
            groupElementId: groupElementId,
            element: element,
            bounding: boundingDefault,
            followType: assertExistence(element) ? 'stick' : 'independent',
          }

        newState.logGroups[groupId].logs.push(
          newLog(args, element, groupId, timestamp, parsedStack)
        )

        return newState
      },
      () => {
        if (gotId) gotId(groupId, groupElementId)
      }
    )
  })
}
