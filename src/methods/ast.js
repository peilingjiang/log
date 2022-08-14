import {
  stackFilePathCompareDepth,
  timelineSideDragLevelWidth,
} from '../constants.js'
import { proceedDeeper } from './astTree.js'
import { assertArray, assertObject, assertString } from './utils.js'

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
    if (result && result.type && !ignoredStackTypes.includes(result.type))
      increasedStack.push(result.type)
  }

  return [increasedStack, result]
}

const ignoredStackTypes = ['BlockStatement']

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
    if (
      files[fileName].topLevelDeclarations.length > 1 ||
      Object.keys(files).length > 0
    )
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
    // indentation * indentationPx + declarations * declarationPx + files * filePx
    indentation * indentationPx + declarations * declarationPx + files * 0
  )
}

export const hasLeastOneExpandLevel = expandLevels => {
  const { indentation, declarations, files } = expandLevels
  return indentation || declarations
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
    // const extremeDepthsOfAll = {
    //   max: fileRegistry.maxDepth,
    //   min: fileRegistry.minDepth,
    // }
    const extremeDepthsOfAll = getExtremeDepthsByTopLevelDeclarations(
      fileRegistry,
      logGroupRegistry.topLevelDeclaration
    )
    const overallLevels = extremeDepthsOfAll.max - extremeDepthsOfAll.min

    const budgetForIndentation = Math.min(budget, indentationPx)
    const eachLevelOffset = budgetForIndentation / overallLevels

    totalOffset +=
      eachLevelOffset * (logGroupRegistry.depth - extremeDepthsOfAll.min)
  }

  budget = Math.max(0, budget - expandLevels.indentation * indentationPx)

  // ! declarations
  if (expandLevels.declarations && budget > 0) {
    const budgetForDeclarations = Math.min(budget, declarationPx)
    const eachDeclarationOffset =
      budgetForDeclarations / getTopLevelDeclarationsCount(registriesByFileName)

    totalOffset +=
      eachDeclarationOffset *
      fileRegistry.topLevelDeclarations.indexOf(
        logGroupRegistry.topLevelDeclaration
      )
    // + Math.min(1, budget / declarationPx) * indentationPx
  }

  // budget = Math.max(0, budget - expandLevels.declaration * declarationPx)

  // ! files
  // if (expandLevels.files && budget > 0) {
  //   const budgetForFiles = Math.min(budget, filePx)
  //   const eachFileOffset =
  //     budgetForFiles / Object.keys(registriesByFileName).length

  //   totalOffset +=
  //     eachFileOffset * Object.keys(registriesByFileName).indexOf(logFile)
  // }

  return totalOffset
}

export const getTimelineOffsets = (
  logGroups,
  registriesByFileName,
  budget,
  expandLevels
) => {
  const { indentationPx, declarationPx, filePx } = timelineSideDragLevelWidth
  const offsets = {}
  let indentationOffsets = {}
  let declarationOffsets = {}

  if (budget === 0 || getMaxExpandOffset(expandLevels) === 0)
    return { offsets, indentationOffsets, declarationOffsets }

  // ! indentation

  for (const logGroupId in logGroups) {
    offsets[logGroupId] = 0

    if (expandLevels.indentation) {
      const logGroup = logGroups[logGroupId]
      const logObj = logGroup.logs[0] // repLog
      const logFile = logObj.stack.file
      const fileRegistry = registriesByFileName[logFile] // !
      const logGroupRegistry = fileRegistry.groups[logGroup.groupId]

      const extremeDepthsOfAll = getExtremeDepthsByTopLevelDeclarations(
        fileRegistry,
        logGroupRegistry.topLevelDeclaration
      )
      const overallLevels = extremeDepthsOfAll.max - extremeDepthsOfAll.min

      const budgetForIndentation = Math.min(budget, indentationPx)
      const eachLevelOffset = budgetForIndentation / overallLevels

      offsets[logGroup.groupId] +=
        eachLevelOffset * (logGroupRegistry.depth - extremeDepthsOfAll.min)
      indentationOffsets = { ...offsets }
    }
  }

  budget = Math.max(0, budget - expandLevels.indentation * indentationPx)

  // ! declarations
  if (expandLevels.declarations && budget > 0) {
    const allDeclarations = getAllDeclarations(registriesByFileName, offsets)
    allDeclarations.sort((a, b) => a.totalOffset - b.totalOffset)
    for (const declarationIndex in allDeclarations)
      allDeclarations[declarationIndex].index = declarationIndex

    const budgetForDeclarations = Math.min(budget, declarationPx)
    const eachDeclarationOffset =
      budgetForDeclarations / (allDeclarations.length - 1)

    for (const logGroupId in logGroups) {
      const ind =
        eachDeclarationOffset *
        _getDeclarationByGroupId(allDeclarations, logGroupId).index
      offsets[logGroupId] += ind
      declarationOffsets[logGroupId] = ind
    }
  }

  return { offsets, indentationOffsets, declarationOffsets }
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

export const getExtremeDepthsByTopLevelDeclarations = (
  fileRegistry,
  targetDeclaration
) => {
  let min = Infinity
  let max = 0
  for (const groupId in fileRegistry.groups) {
    const thisRegistry = fileRegistry.groups[groupId]
    if (thisRegistry.topLevelDeclaration === targetDeclaration) {
      if (thisRegistry.depth < min) min = thisRegistry.depth
      if (thisRegistry.depth > max) max = thisRegistry.depth
    }
  }

  return { max, min }
}

/* -------------------------------------------------------------------------- */

export const _declarationExists = (declarations, declarationName) => {
  for (const declaration of declarations)
    if (declaration.name === declarationName) return true
  return false
}

export const _getDeclarationFromAllDeclarations = (
  declarations,
  declarationName
) => {
  for (const declaration of declarations)
    if (declaration.name === declarationName) return declaration
  return null
}

export const getAllDeclarations = (registriesByFileName, currentOffsets) => {
  const declarations = []
  for (const fileName in registriesByFileName) {
    const registry = registriesByFileName[fileName]
    for (const groupId in registry.groups) {
      const thisRegistry = registry.groups[groupId]

      if (_declarationExists(declarations, thisRegistry.topLevelDeclaration))
        _getDeclarationFromAllDeclarations(
          declarations,
          thisRegistry.topLevelDeclaration
        ).groupIds.push(groupId)
      else
        declarations.push({
          name: thisRegistry.topLevelDeclaration,
          file: fileName,
          groupIds: [groupId],
        })
    }
  }

  // get the total offsets from each of the groupId associated with this declaration
  for (const declaration of declarations) {
    declaration.totalOffsets = declaration.groupIds
      .map(groupId => {
        return currentOffsets[groupId]
      })
      .reduce((a, b) => a + b, 0)
  }

  return declarations
}

export const _getDeclarationByGroupId = (declarations, groupId) => {
  for (const declaration of declarations)
    if (declaration.groupIds.includes(groupId)) return declaration
  return null
}

export const getTopLevelDeclarationsCount = registriesByFileName => {
  let count = 0
  for (const fileName in registriesByFileName) {
    const registry = registriesByFileName[fileName]
    count += registry.topLevelDeclarations.length
  }

  return count - 1
}
