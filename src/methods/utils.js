import { getFramesFromError, getLocationsFromFrames } from 'get-current-line'
import { mapStackTrace } from 'sourcemapped-stacktrace'

import { stackActualCallerDepth } from '../constants.js'
import { g } from '../global.js'

export const getTimestamp = () => {
  return {
    now: performance.now(),
    date: new Date(),
  }
}

export const getObjectIds = obj => {
  return Object.keys(obj)
}

/* -------------------------------------------------------------------------- */
// geometry

export const getElementBounding = element => {
  return element.getBoundingClientRect()
}

export const mergeBoundingRects = rects => {
  const left = Math.min(...rects.map(rect => rect.left))
  const right = Math.max(...rects.map(rect => rect.right))
  const top = Math.min(...rects.map(rect => rect.top))
  const bottom = Math.max(...rects.map(rect => rect.bottom))
  const width = right - left
  const height = bottom - top
  return {
    left,
    right,
    top,
    bottom,
    width,
    height,
  }
}

/* -------------------------------------------------------------------------- */
// copy object

export const copyObject = obj => {
  return JSON.parse(JSON.stringify(obj))
}

export const cloneLogGroups = logGroups => {
  const newLogGroups = {}
  for (const logGroupId in logGroups) {
    const prevLogGroup = logGroups[logGroupId]
    newLogGroups[logGroupId] = {
      ...prevLogGroup,
      logs: [...prevLogGroup.logs],
    }
  }

  return newLogGroups
}

/* -------------------------------------------------------------------------- */
// parse stack

export const parseStack = (error, callback) => {
  if (g.useSourceMaps)
    // https://github.com/novocaine/sourcemapped-stacktrace
    mapStackTrace(error.stack, mappedStack => {
      // TODO somehow make async
      const actualCallerStack = mappedStack[stackActualCallerDepth]
      // https://github.com/bevry/get-current-line/blob/ccf9e903710123b73cc117a6a9250f519e21e4bf/source/index.ts#L85
      const result = actualCallerStack.match(
        /\s+at\s(?:(?<method>.+?)\s\()?(?<path>.+?):(?<line>\d+):(?<char>\d+)\)?\s*$/
      ).groups

      result.method = result.method || '<anonymous>'
      result.file = result.path.replace(/^.*[\\/]/, '')
      result.line = Number(result.line)
      result.char = Number(result.char)

      callback(result)
    })
  else {
    const result = getLocationsFromFrames(getFramesFromError(error))[
      stackActualCallerDepth
    ]

    result.method = result.method || '<anonymous>'
    result.path = result.file
    result.file = result.path.replace(/^.*[\\/]/, '')

    callback(result)
  }
}

/* -------------------------------------------------------------------------- */
// assertions

export const assertExistence = a => {
  return a !== undefined && a !== null
}

export const assertNumber = a => {
  return typeof a === 'number' && !isNaN(a)
}

export const assertArray = a => {
  return assertExistence(a) && Array.isArray(a)
}

export const assertString = a => {
  return typeof a === 'string' || a instanceof String
}

export const assertClass = (a, nameOfObjectClass) => {
  return a instanceof nameOfObjectClass
}

export const assertObject = (a, shape = null) => {
  if (!assertExistence(a) || typeof a !== 'object') return false

  if (assertArray(shape))
    for (const key of shape) if (!assertExistence(a[key])) return false

  return true
}

export const assertArguments = argsAndAssertions => {
  for (const argAndAssertion of argsAndAssertions) {
    const { value, assertion, shape } = argAndAssertion
    if (!assertion(value, shape)) throw `[ERROR assertArguments ${value}]`
  }
}
