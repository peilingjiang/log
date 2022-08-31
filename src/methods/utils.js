import isEqual from 'react-fast-compare'
import StackTrace from 'stacktrace-js'
import ErrorStackParser from 'error-stack-parser'
import tinycolor from 'tinycolor2'
import { v5 as uuidv5 } from 'uuid'

import {
  groupIdExtendingConnector,
  pageElementsQuery,
  stackActualCallerDepth,
  validUnits,
  _DEF,
  _rootStyles,
} from '../constants.js'
import { g } from '../global.ts'
import { isOverlapped, pxTrim } from './findPosition.js'

export const pseudoFunc = () => {}

export const getTimestamp = () => {
  return {
    now: performance.now(),
    // date: new Date(),
  }
}

export const getObjectIds = obj => {
  return Object.keys(obj)
}

export const diffObjects = (obj1, obj2) => {
  // return how obj2 is different from obj1
  const diff = {}
  for (const key in obj1) {
    if (obj1[key] !== obj2[key]) {
      diff[key] = obj2[key]
    }
  }
  return diff
}

export const idFromString = str =>
  uuidv5(
    str,
    uuidv5.URL // ? any potential problems?
  )

export const trimStringToLength = (str, length) => {
  // remove multiple spaces
  str = str.replace(/\s+/g, ' ')

  if (str.length > length) {
    return str.slice(0, length) + ' …'
  } else {
    return str
  }
}

export const getIdentifier = (stackPath, line, char) => {
  return `${stackPath}:${line}:${char}`
}

export const parseCenterStagedId = centerStagedId => {
  return centerStagedId.split('-')
}

export const brutalFindGroupIdInRegistries = (groupId, registries) => {
  let groupIdCount = 0

  const registriesKeys = Object.keys(registries)
  for (const registryKey of registriesKeys) {
    const cleanedRegistryKey = registryKey.split(groupIdExtendingConnector)[0]
    if (cleanedRegistryKey === groupId) groupIdCount++
  }

  return groupIdCount
}

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

export const getArgsArrayFromRawCodeObject = (argsString, rawObject) => {
  // split a string of args into an array of args, avoid comma inside an array or object
  const args = []

  if (rawObject.type === 'CallExpression') {
    const overallStart = rawObject.start + 'log('.length
    for (const argument of rawObject.arguments) {
      const rawString = argsString
        .slice(argument.start - overallStart, argument.end - overallStart)
        .replace(/\n/g, ' ')
      args.push(
        containsOnlyNumber(rawString) ||
          containsOnlyString(rawString) ||
          containsOnlyNull(rawString)
          ? ''
          : rawString
      )
    }

    return args
  } else {
    return argsString.split(', ')
  }
}

/* -------------------------------------------------------------------------- */

// compare args

export const areArgsEqual = (args1, args2) => {
  if (args1.length !== args2.length) return false

  for (let i = 0; i < args1.length; i++) {
    if (!isArgEqual(args1[i], args2[i])) {
      return false
    }
  }

  return true
}

const isArgEqual = (arg1, arg2) => {
  if (typeof arg1 === 'object' && typeof arg2 === 'object') {
    for (const key in arg1) {
      if (!isEqual(arg1[key], arg2[key])) {
        return false
      }
    }
  } else {
    return isEqual(arg1, arg2)
  }
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

export const centerStagedArgInd = centerStagedId => {
  return Number(centerStagedId.split('-')[0].replace(/\[.*\]/g, ''))
}

export const parseCenterStagedValueFromId = (args, id = '') => {
  if (id.length === 0) return [args, id]

  const sequentialGetters = removeArgsDescriptions(id).split('-')
  let progressId = ''

  for (const getterInd in sequentialGetters) {
    const getter = sequentialGetters[getterInd]
    const parsedGetter = assertNumber(getter) ? parseInt(getter) : getter
    // keep going only when args[parsedGetter] has a value,
    // or, if it's the last getter (the inner-most value could just be undefined)
    if (assertSet(args)) {
      // TODO this is the worst possible way of doing this
      const arrArgs = Array.from(args)
      if (arrArgs[parsedGetter]) {
        args = arrArgs[parsedGetter]
        progressId += getter
      }
    } else if (
      args[parsedGetter] ||
      (parsedGetter && parsedGetter in args) ||
      getterInd === sequentialGetters.length - 1
    ) {
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

export const map = (x, inMin, inMax, outMin, outMax) => {
  if (inMin === inMax) return outMax
  return ((x - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
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

export const getFilteredOutElements = filterArea => {
  const filteredOutElements = []
  const existingPageElements = document.querySelectorAll(pageElementsQuery)

  for (let el of existingPageElements) {
    if (bindableElement(el)) {
      if (
        !isOverlapped(getElementBounding(el), {
          left: pxTrim(filterArea.left),
          top: pxTrim(filterArea.top),
          right: pxTrim(filterArea.right),
          bottom: pxTrim(filterArea.bottom),
        })
      ) {
        filteredOutElements.push(el)
      }
    }
  }

  return filteredOutElements
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

export const objectKeys = obj => {
  const k = []
  for (const key in obj) k.push(key)
  return k
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
  return (
    assertExistence(a) && (a instanceof Element || a instanceof HTMLElement)
  )
}

export const assertSet = a => {
  return assertExistence(a) && a instanceof Set
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
  if (assertSet(arg)) return 'set'
  if (assertArray(arg)) return 'array'
  // if (assertElement(arg)) return 'element'
  if (assertObject(arg)) return 'object'
  return 'unknown'
}

export const containsOnlyNumber = str => {
  return /^[0-9]+$/.test(str)
}

export const containsOnlyString = str => {
  const firstChar = str.charAt(0)
  const lastChar = str.charAt(str.length - 1)
  return (
    (firstChar === '"' && lastChar === '"') ||
    (firstChar === "'" && lastChar === "'") ||
    (firstChar === '`' && lastChar === '`' && !str.includes('$'))
  )
}

export const containsOnlyNull = str => {
  return str === 'null' || str === 'undefined'
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

export const parseDefaultColor = (color, groupColor, useDefaultGrey = true) => {
  if (color === _DEF) return useDefaultGrey ? _rootStyles.darkGrey : groupColor
  return color
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
  if (centerStagedId.length) {
    args = [parseCenterStagedValueFromId(rawArgs, centerStagedId)[0]]
  } else args = rawArgs

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

export const acceptableGraphicsSourcePairs = [
  {
    size: ['width', 'height'],
    position: ['x', 'y'],
    keyWord: 'native',
  },
  {
    size: ['clientWidth', 'clientHeight'],
    position: ['clientX', 'clientY'],
    keyWord: 'client',
  },
  // {
  //   size: ['offsetWidth', 'offsetHeight'],
  //   position: ['offsetX', 'offsetY'],
  //   keyWord: 'offset',
  // },
  // {
  //   size: ['scrollWidth', 'scrollHeight'],
  //   position: ['scrollX', 'scrollY'],
  //   keyWord: 'scroll',
  // },
  // ['top', 'left'],
]

export const canGraphics = (log, centerStagedId = '') => {
  const rawArgs = log.args

  let args
  if (centerStagedId.length) {
    args = [parseCenterStagedValueFromId(rawArgs, centerStagedId)[0]]
  } else args = rawArgs

  // TODO support all args?
  const firstArg = args[0]
  if (!assertObject(firstArg)) return false

  const keys = objectKeys(firstArg)
  for (const configuration of acceptableGraphicsSourcePairs) {
    const { size, position } = configuration
    if (
      (keys.includes(position[0]) && keys.includes(position[1])) ||
      (keys.includes(size[0]) && keys.includes(size[1]))
    )
      return true
  }

  return false
}

export const anySize = arg => {
  const keys = objectKeys(arg)
  for (const configuration of acceptableGraphicsSourcePairs) {
    const { size } = configuration
    if (keys.includes(size[0]) && keys.includes(size[1])) return true
  }
  return false
}

export const getValidPairs = (arg, retrievalType) => {
  const validPairs = []

  const keys = objectKeys(arg)
  for (const configuration of acceptableGraphicsSourcePairs) {
    const retrieval = configuration[retrievalType]
    if (keys.includes(retrieval[0]) && keys.includes(retrieval[1]))
      validPairs.push(configuration)
  }

  return validPairs
}

/* -------------------------------------------------------------------------- */

export const getLogStats = (logs, centerStagedId = '') => {
  let min = Infinity,
    max = -Infinity,
    sum = 0,
    count = 0

  logs.map(log => {
    if (canUseShape(log, centerStagedId)) {
      let arg
      if (centerStagedId.length) {
        arg = parseCenterStagedValueFromId(log.args, centerStagedId)[0]
      } else arg = log.args[0]

      min = Math.min(min, arg)
      max = Math.max(max, arg)
      sum += arg
      count++
    }
  })

  return {
    min,
    max,
    sum,
    count,
    average: sum / count,
  }
}
