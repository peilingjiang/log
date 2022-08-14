import isEqual from 'react-fast-compare'
import StackTrace from 'stacktrace-js'
import ErrorStackParser from 'error-stack-parser'
import tinycolor from 'tinycolor2'
import { v5 as uuidv5 } from 'uuid'

import { stackActualCallerDepth, validUnits } from '../constants.js'
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

export const arrayLast = (arr, n = 1) => {
  return n >= arr.length ? arr : arr.slice(arr.length - n)
}

export const arrayFirst = (arr, n = 1) => {
  return n >= arr.length ? arr : arr.slice(0, n)
}

export const preventEventWrapper = (e, callback) => {
  if (e && e.preventDefault) {
    e.preventDefault()
    e.stopPropagation()
  }
  callback()
}

/* -------------------------------------------------------------------------- */
// id

export const matchLocInObjectByRemovingLogId = (ids, targetId) => {
  for (const id of ids) {
    if (id === removeLogId(targetId)) return true
  }
  return false
}

export const removeLogId = id => {
  return id.replace(/\((.*?)\)/g, '')
}

export const removeArgsDescriptions = args => {
  return args.replace(/\[(.*?)\]/g, '')
}

export const parseCenterStagedValueFromId = (args, id) => {
  const sequentialGetters = removeArgsDescriptions(id).split('-')

  let progressId = ''
  for (const getterInd in sequentialGetters) {
    const getter = sequentialGetters[getterInd]
    const parsedGetter = assertNumber(getter) ? parseInt(getter) : getter
    // keep going only when args[parsedGetter] has a value,
    // or, if it's the last getter (the inner-most value could just be undefined)
    if (args[parsedGetter] || getterInd === sequentialGetters.length - 1) {
      args = args[parsedGetter]
      progressId += getter
    } else return [args, progressId]
  }

  return [args, id]
}

/* -------------------------------------------------------------------------- */
// math

export const constrain = (x, min, max) => {
  return Math.max(min, Math.min(x, max))
}

export const dist = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

export const onlyNumbers = str => {
  return /^[0-9]+$/.test(str)
}

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

export const getElementBounding = (element, draggedOffset = null) => {
  if (!draggedOffset) return element.getBoundingClientRect()
  const { left, top, width, height, right, bottom } =
    element.getBoundingClientRect()
  return {
    left: left - draggedOffset.x,
    top: top - draggedOffset.y,
    right: right - draggedOffset.x,
    bottom: bottom - draggedOffset.y,
    width: width,
    height: height,
  }
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

export const cloneLogTimeline = logTimeline => {
  const newLogTimeline = []
  logTimeline.map(logInfo => {
    newLogTimeline.push({ ...logInfo })
  })

  return newLogTimeline
}

export const cloneLogGroups = logGroups => {
  const newLogGroups = {}
  for (const logGroupId in logGroups) {
    const prevLogGroup = logGroups[logGroupId]
    newLogGroups[logGroupId] = {
      ...prevLogGroup,
      logs: deepCopyArrayOfLogs(prevLogGroup.logs),
    }
  }

  return newLogGroups
}

export const cloneLogGroup = logGroup => {
  return {
    ...logGroup,
    logs: deepCopyArrayOfLogs(logGroup.logs),
  }
}

export const deepCopyArrayOfLogs = arr => {
  return arr.map(log => {
    return { ...log }
  })
}

export const keyWithSmallestValue = obj => {
  const smallestValue = Math.min(...Object.keys(obj).map(key => obj[key]))
  return Number(Object.keys(obj).filter(key => obj[key] === smallestValue)[0])
}

/* -------------------------------------------------------------------------- */
// parse stack

export const getActualFrame = (frames, rawError) => {
  const actualStackframe = frames[stackActualCallerDepth]
  const result = {}

  result.line = actualStackframe.lineNumber
  result.char = actualStackframe.columnNumber
  result.method = actualStackframe.functionName || 'anonymous'
  result.file = actualStackframe.fileName.replace(/^.*[\\/]/, '')
  result.path = actualStackframe.fileName
  result.raw = rawError

  return result
}

export const parseStack = (pastStacks, callback) => {
  const sudoError = new Error()

  const rawFrames = ErrorStackParser.parse(sudoError)
  const preprocessStack = getActualFrame(rawFrames, sudoError)

  if (!g.useSourceMaps) {
    return callback(preprocessStack)
  } else {
    for (const stack of pastStacks) {
      if (isEqual(ErrorStackParser.parse(stack.raw), rawFrames)) {
        return callback(stack)
      }
    }

    StackTrace.fromError(sudoError, {
      offline: false,
    }).then(processedFrames => {
      const processedStack = getActualFrame(processedFrames, sudoError)
      callback(processedStack)
    })
  }
}

export const _getStacks = logGroups => {
  return Object.keys(logGroups)
    .map(logGroupId => {
      return logGroups[logGroupId].logs.map(log => log.stack)
    })
    .flat(1)
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

export const assertBoolean = a => {
  return typeof a === 'boolean'
}

export const assertFunction = a => {
  return typeof a === 'function'
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

export const assertElement = a => {
  return assertExistence(a) && a instanceof Element
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
  if (assertBoolean(arg)) return 'boolean'
  if (assertFunction(arg)) return 'function'
  if (assertArray(arg)) return 'array'
  // if (assertElement(arg)) return 'element'
  if (assertObject(arg)) return 'object'
  return 'unknown'
}

/* -------------------------------------------------------------------------- */
// colors

export const tinyColorToRGBStyleString = tinyColor => {
  const { r, g, b } = tinyColor.toRgb()
  return `${r}, ${g}, ${b}`
}

export const hexAndOpacityToRGBA = (hex, opacity) => {
  return `rgba(${tinyColorToRGBStyleString(tinycolor(hex))}, ${opacity})`
}

export const randomColor = () => {
  let c

  do {
    c = tinycolor(
      '#' + Math.floor(Math.random() * 16777215).toString(16) + 'ff'
    )
  } while (!c.isValid())

  return c.toHex8String()
}

export const applyOpacityTo = (rgbaHex, opacity) => {
  return tinycolor(rgbaHex).setAlpha(opacity).toRgbString()
}

/* -------------------------------------------------------------------------- */
// units

export const _unitIsValid = unit => {
  return validUnits.includes(unit)
}

export const _checkIfContainsValidUnit = arg => {
  for (const unit of validUnits) {
    if (arg.includes(unit) && assertNumber(arg.replace(unit, ''))) return true
  }
  return false
}

export const canUseShape = (log, centerStagedId = '') => {
  const rawArgs = log.args

  let args
  if (centerStagedId.length)
    args = [parseCenterStagedValueFromId(rawArgs, centerStagedId)[0]]
  else args = rawArgs

  if (args.length !== 1) return false
  // return (
  //   (!!log.unit && _unitIsValid(log.unit) && assertNumber(log.args[0])) ||
  //   (assertString(log.args[0]) && _checkIfContainsValidUnit(log.args[0]))
  // )
  return (
    assertNumber(args[0]) ||
    (assertString(args[0]) && _checkIfContainsValidUnit(args[0]))
  )
}
