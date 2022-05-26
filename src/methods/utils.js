import { mapStackTrace } from 'sourcemapped-stacktrace'

import { stackActualCallerDepth } from '../constants.js'

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

export const parseStack = (stack, callback) => {
  // https://github.com/novocaine/sourcemapped-stacktrace
  mapStackTrace(stack, mappedStack => {
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
}

/* -------------------------------------------------------------------------- */

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
