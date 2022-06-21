import StackTrace from 'stacktrace-js'
import { v5 as uuidv5 } from 'uuid'

import { stackActualCallerDepth } from '../constants.js'
import { g } from '../global.js'

export const getTimestamp = () => {
  return {
    now: performance.now(),
    // date: new Date(),
  }
}

export const getObjectIds = obj => {
  return Object.keys(obj)
}

export const idFromString = str =>
  uuidv5(
    str,
    uuidv5.URL // ? any potential problems?
  )

/* -------------------------------------------------------------------------- */
// element

export const bindableElement = element => {
  return element.id && element.id !== 'root'
}

export const stringifyDOMElement = (ele, _depth = 1) => {
  if (!ele) return ''
  const accessors = ['tagName', 'id', 'className']

  return (
    accessors
      .map(accessor => (ele[accessor] ? `${ele[accessor]} ` : ''))
      .join('')
      .slice(0, -1) +
    ' ' +
    (_depth > 0 && ele.parentNode ? stringifyDOMElement(ele.parentNode, 0) : '')
  )
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

export const keyWithSmallestValue = obj => {
  const smallestValue = Math.min(...Object.keys(obj).map(key => obj[key]))
  return Object.keys(obj).filter(key => obj[key] === smallestValue)[0]
}

/* -------------------------------------------------------------------------- */
// parse stack

export const parseStack = callback => {
  StackTrace.get({
    offline: !g.useSourceMaps,
  }).then(stackframes => {
    const actualStackframe = stackframes[stackActualCallerDepth]

    const result = {}
    result.method = actualStackframe.functionName
    result.file = actualStackframe.fileName.replace(/^.*[\\/]/, '')
    result.line = actualStackframe.lineNumber
    result.char = actualStackframe.columnNumber

    callback(result)
  })
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

export const assertTypeOfArg = arg => {
  if (arg === undefined) return 'undefined'
  if (arg === null) return 'null'
  if (assertNumber(arg)) return 'number'
  if (assertString(arg)) return 'string'
  if (assertArray(arg)) return 'array'
  if (assertObject(arg)) return 'object'
  return 'unknown'
}

/* -------------------------------------------------------------------------- */
// colors

export const tinyColorToRGBStyleString = tinyColor => {
  const { r, g, b } = tinyColor.toRgb()
  return `${r}, ${g}, ${b}`
}
