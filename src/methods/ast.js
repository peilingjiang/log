import {
  stackFilePathCompareDepth,
  timelineSideDragLevelWidth,
} from '../constants.js'
import { assertArray, assertObject, assertString, copyObject } from './utils.js'

export const preprocessASTsToGetRegistries = (
  logGroups,
  logTimeline,
  newASTs,
  prevRegistries
) => {
  /**
   * registry
   *
   * [logGroupId]: {
   *   identifier: `${stackPath}:${line}:${char}`
   *   filePath: astFilePath,
   *   stackPath: webStackFilePath,
   *   stackFile: webStackFileName,
   *   stackLine: webStackLine,
   *   stackChar: webStackChar,
   *   depth: depthInAST,
   *   depthStack: depthStackInAST,
   * }
   *
   */
  const newRegistries = {}

  // delete all related registries for a new (or changed) file
  const newFilePaths = Object.keys(newASTs)

  for (const registryGroupId in prevRegistries) {
    if (!newFilePaths.includes(prevRegistries[registryGroupId].filePath)) {
      newRegistries[registryGroupId] = { ...prevRegistries[registryGroupId] }
    }
  }

  // register new registries
  for (const logIdentifier of logTimeline) {
    const logGroupId = logIdentifier.groupId

    if (!(logGroupId in newRegistries)) {
      const repLog = logGroups[logGroupId].logs[0]

      for (const astFilePath in newASTs) {
        if (matchWebPathAndFilePath(repLog.stack.path, astFilePath)) {
          const astTree = newASTs[astFilePath].result.program.body
          const logLine = repLog.stack.line
          const logChar = repLog.stack.char

          // const depthStack = parseAST(astTree, logLine, logChar)
          let depthStack
          try {
            depthStack = parseAST(astTree, logLine, logChar)
          } catch (e) {
            depthStack = ['Unknown']
          }

          depthStack = depthStack || ['Unknown']

          newRegistries[logGroupId] = {
            identifier: getIdentifier(repLog.stack.path, logLine, logChar),
            filePath: astFilePath,
            stackPath: repLog.stack.path,
            stackFile: repLog.stack.file,
            stackLine: repLog.stack.line,
            stackChar: repLog.stack.char,
            depth: depthStack.length,
            depthStack: depthStack,
          }
        }
      }
    }
  }

  return newRegistries
}

const parseAST = (astProgramBody, targetLine, targetChar) => {
  const depthStack = []
  return parseASTPart(astProgramBody, targetLine, targetChar, depthStack)
}

const parseASTPart = (bodyArray, targetLine, targetChar, prevDepthStack) => {
  // when final body is the single only child, they will not be placed in an array
  if (assertObject(bodyArray) && reachedTheLogStatement(bodyArray))
    return prevDepthStack

  for (const bodyInd in bodyArray) {
    const body = bodyArray[bodyInd]

    if (targetPositionWithinBody(body, targetLine, targetChar)) {
      // stop proceed when reaching the log statement
      if (reachedTheLogStatement(body)) return prevDepthStack
      // proceed deeper
      const [increasedStack, next] = proceed(body, bodyInd)

      return parseASTPart(next, targetLine, targetChar, [
        ...prevDepthStack,
        ...increasedStack,
      ])
    }
  }
}

/* -------------------------------------------------------------------------- */

export const matchWebPathAndFilePath = (webPath, filePath) => {
  if (!assertString(webPath) || !assertString(filePath)) return

  // TODO is this robust enough?
  const webPathParts = webPath.includes('//')
    ? webPath.split('//')[1]?.split('/')
    : webPath.split('/')
  const filePathParts = filePath.split('/').splice(1)

  const wLen = webPathParts.length
  const fLen = filePathParts.length

  const compareTimes = Math.min(Math.min(wLen, fLen), stackFilePathCompareDepth)

  for (let i = 1; i <= compareTimes; i++) {
    if (webPathParts[wLen - i] !== filePathParts[fLen - i]) return false
  }

  return true
}

const getIdentifier = (stackPath, line, char) => {
  return `${stackPath}:${line}:${char}`
}

const targetPositionWithinBody = (body, targetLine, targetChar) => {
  if (body.loc.start.line > targetLine || body.loc.end.line < targetLine)
    return false

  if (body.loc.start.line === targetLine)
    return body.loc.start.column <= targetChar

  if (body.loc.end.line === targetLine) return body.loc.end.column >= targetChar

  return true
}

const proceed = (instance, bodyInd) => {
  let result = instance
  const increasedStack = [`[${bodyInd}]${instance.type}`]

  while (result && !assertArray(result) && !reachedTheLogStatement(result)) {
    result = proceedDeeper(result)
    if (result && result.type) increasedStack.push(result.type)
  }

  return [increasedStack, result]
}

const proceedDeeper = instance => {
  const type = instance.type

  if (type.includes('Declaration')) {
    switch (type) {
      case 'ImportDeclaration':
        return instance.specifiers
      case 'ClassDeclaration':
        return instance.body
      case 'FunctionDeclaration':
        return instance.body
      default:
        return instance.declaration
    }
  }

  if (type.includes('Method')) {
    switch (type) {
      case 'MethodDefinition':
        return instance.value
      case 'ClassMethod':
        return instance.body.body
    }
  }

  if (type.includes('Statement')) {
    switch (type) {
      case 'ExpressionStatement':
        return instance.expression
    }
    return instance.body
  }

  if (type.includes('Expression')) {
    switch (type) {
      case 'CallExpression':
        return [...instance.arguments, instance.callee]
      case 'MemberExpression':
        return [instance.object, instance.property]
      case 'ArrowFunctionExpression':
        return instance.body
    }

    return instance.body
  }

  if (type.includes('Body')) {
    return instance.body
  }

  console.error('[HyperLog Dev] unsupported ast instance', instance)
  return
}

const reachedTheLogStatement = expression => {
  return (
    (expression.type === 'CallExpression' &&
      expression.callee.name === 'log') ||
    (expression.type === 'Identifier' && expression.name === 'log')
  )
}

/* -------------------------------------------------------------------------- */

// export const parseRegistries = registries => {
//   const relationships = {}

//   for (const registryGroupId in registries) {
//     const registry = registries[registryGroupId]

//     if (!(registry.stackPath in relationships))
//       relationships[registry.stackPath] = {}

//     let depthTracker = relationships[registry.stackPath]
//     for (const component of registry.depthStack) {
//       if (!(component in depthTracker)) {
//         if (component === 'Unknown' || component === 'CallExpression') {
//           depthTracker[component] = {
//             groupId: registryGroupId,
//             identifier: registry.identifier,
//           }
//         } else {
//           depthTracker[component] = {}
//           depthTracker = depthTracker[component]
//         }
//       }
//     }
//   }

//   return relationships
// }

export const sumRegistries = registries => {
  const files = {}

  for (const registryGroupId in registries) {
    const registry = registries[registryGroupId]

    if (!(registry.stackFile in files))
      files[registry.stackFile] = {
        groups: {},
        topLevelDeclarations: [],
        minDepth: Infinity,
        maxDepth: 0,
      }
  }

  for (const registryGroupId in registries) {
    const registry = registries[registryGroupId]
    const recordInFiles = files[registry.stackFile]

    if (!(registryGroupId in recordInFiles.groups)) {
      recordInFiles.groups[registryGroupId] = {
        identifier: registry.identifier,
        topLevelDeclaration: registry.depthStack[0],
        depth: registry.depth,
      }
    }

    if (registry.depth < recordInFiles.minDepth)
      recordInFiles.minDepth = registry.depth
    if (registry.depth > recordInFiles.maxDepth)
      recordInFiles.maxDepth = registry.depth

    if (!recordInFiles.topLevelDeclarations.includes(registry.depthStack[0]))
      recordInFiles.topLevelDeclarations.push(registry.depthStack[0])
  }

  return files
}

export const getExpandLevels = files => {
  let hasIndentation = false
  let hasMultipleDeclarations = false

  for (const fileName in files) {
    if (files[fileName].topLevelDeclarations.length > 1)
      hasMultipleDeclarations = true
    if (files[fileName].maxDepth > files[fileName].minDepth)
      hasIndentation = true
  }

  return {
    indentation: hasIndentation,
    declarations: hasMultipleDeclarations,
    files: Object.keys(files).length > 0,
  }
}

/* -------------------------------------------------------------------------- */

// ! ui calculations

export const getMaxExpandOffset = expandLevels => {
  const { indentation, declarations, files } = expandLevels
  const { indentationPx, declarationPx, filePx } = timelineSideDragLevelWidth
  return (
    indentation * indentationPx + declarations * declarationPx + files * filePx
  )
}

export const getTimelineOffset = (
  logGroup,
  registriesByFileName,
  budget,
  expandLevels
) => {
  if (budget === 0 || getMaxExpandOffset(expandLevels) === 0) return 0

  let totalOffset = 0

  const { indentationPx, declarationPx, filePx } = timelineSideDragLevelWidth

  const logObj = logGroup.logs[0] // repLog
  const logFile = logObj.stack.file
  const fileRegistry = registriesByFileName[logFile] // !
  const logGroupRegistry = fileRegistry.groups[logGroup.groupId]

  // ! indentation
  if (expandLevels.indentation) {
    // const extremeDepthsOfAll = overallExtremeDepths(registriesByFileName)
    const extremeDepthsOfAll = {
      max: fileRegistry.maxDepth,
      min: fileRegistry.minDepth,
    }
    const overallLevels = extremeDepthsOfAll.max - extremeDepthsOfAll.min + 1

    const budgetForIndentation = Math.min(budget, indentationPx)
    const eachLevelOffset = budgetForIndentation / overallLevels

    totalOffset +=
      eachLevelOffset * (logGroupRegistry.depth - extremeDepthsOfAll.min)
  }

  // ! declarations

  // ! files

  return totalOffset
}

/* -------------------------------------------------------------------------- */

// helpers

export const overallExtremeDepths = registriesByFileName => {
  let max = 0
  let min = Infinity
  for (const fileName in registriesByFileName) {
    const registry = registriesByFileName[fileName]
    if (registry.maxDepth > max) max = registry.maxDepth
    if (registry.minDepth < min) min = registry.minDepth
  }
  return { max, min }
}
