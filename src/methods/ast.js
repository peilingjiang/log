import {
  groupIdExtendingConnector,
  stackFilePathCompareDepth,
  timelineSideDragLevelWidth,
} from '../constants.js'
import { proceedDeeper } from './astTree.js'
import {
  assertArray,
  assertObject,
  assertString,
  getIdentifier,
} from './utils.js'

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
  for (const registryGroupIdExtended in prevRegistries) {
    if (
      !newFilePaths.includes(prevRegistries[registryGroupIdExtended].filePath)
    ) {
      newRegistries[registryGroupIdExtended] = {
        ...prevRegistries[registryGroupIdExtended],
      }
    }
  }

  // register new registries
  for (const logIdentifier of logTimeline) {
    const logGroupId = logIdentifier.groupId

    logGroups[logGroupId].logs.map(repLog => {
      const logLine = repLog.stack.line
      const logChar = repLog.stack.char

      const identifier = getIdentifier(repLog.stack.path, logLine, logChar)
      const logGroupIdExtended = `${logGroupId}${groupIdExtendingConnector}${identifier}`

      if (!(logGroupIdExtended in newRegistries)) {
        for (const astFilePath in newASTs) {
          if (matchWebPathAndFilePath(repLog.stack.path, astFilePath)) {
            const rawCodeFile = newASTs[astFilePath].text
            const astTree = newASTs[astFilePath].result.program.body

            let depthStack, rawCodeObject
            try {
              // eslint-disable-next-line no-extra-semi
              const astParseResult = parseAST(astTree, logLine, logChar)
              if (astParseResult) {
                depthStack = astParseResult[0]
                rawCodeObject = astParseResult[1]
                rawCodeObject.rawCodeContent = getRawLogContent(
                  rawCodeFile,
                  rawCodeObject
                )
              }
            } catch (e) {
              window.console.error(e)
            }

            depthStack = depthStack || ['Unknown']
            rawCodeObject = rawCodeObject || {
              rawCodeContent: '',
            }

            newRegistries[logGroupIdExtended] = {
              identifier: identifier,
              rawCodeObject,
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
    })
  }

  return newRegistries
}

const parseAST = (astProgramBody, targetLine, targetChar) => {
  const depthStack = []
  return parseASTPart(astProgramBody, targetLine, targetChar, depthStack)
}

const parseASTPart = (bodyArray, targetLine, targetChar, prevDepthStack) => {
  // when final body is the single only child, they will not be placed in an array
  if (assertObject(bodyArray) && reachedTheLogStatement(bodyArray)) {
    return [prevDepthStack, bodyArray]
  }

  // if there's no exact match, we try to find one that has the minimum distance
  const diffRecord = []

  for (const bodyInd in bodyArray) {
    const body = bodyArray[bodyInd]

    if (targetPositionWithinBody(body, targetLine, targetChar)) {
      // stop proceed when reaching the log statement
      if (reachedTheLogStatement(body)) return [prevDepthStack, body]

      // proceed deeper
      const [increasedStack, next] = proceed(body, bodyInd)

      return parseASTPart(next, targetLine, targetChar, [
        ...prevDepthStack,
        ...increasedStack,
      ])
    } else if (body.loc.start.line === targetLine) {
      const diff = body.loc.start.column - targetChar
      diffRecord.push({
        bodyInd,
        diff: Math.abs(diff),
      })
    }
  }

  // ! no matching found
  if (diffRecord.length > 0) {
    const minDiff = Math.min(...diffRecord.map(record => record.diff))
    const minDiffRecord = diffRecord.find(record => record.diff === minDiff)
    const body = bodyArray[minDiffRecord.bodyInd]

    if (reachedTheLogStatement(body)) return [prevDepthStack, body]

    const [increasedStack, next] = proceed(body, minDiffRecord.bodyInd)
    return parseASTPart(next, targetLine, targetChar, [
      ...prevDepthStack,
      ...increasedStack,
    ])
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
  const increasedStack = []

  if (
    result &&
    !assertArray(result) &&
    !reachedTheLogStatement(result) &&
    !isIgnoredStackType(result.type)
  )
    increasedStack.push(`[${bodyInd}]${instance.type}`)

  while (result && !assertArray(result) && !reachedTheLogStatement(result)) {
    result = proceedDeeper(result)
    if (result && result.type && !isIgnoredStackType(result.type))
      increasedStack.push(result.type)
  }

  return [increasedStack, result]
}

const ignoredStackTypesPatterns = [
  'BlockStatement',
  'ExpressionStatement',
  'MemberExpression',
  'CallExpression',
  'ClassBody',
  'JSXExpressionContainer',
]

const isIgnoredStackType = type => {
  for (const pattern of ignoredStackTypesPatterns)
    if (type.includes(pattern)) return true

  return false
}

const reachedTheLogStatement = expression => {
  return (
    (expression.type === 'CallExpression' &&
      (expression.callee.name === 'log' ||
        expression.callee.name === 'window')) ||
    (expression.type === 'Identifier' &&
      (expression.name === 'log' || expression.name === 'window'))
  )
}

const getRawLogContent = (rawCodeText, rawCodeObject) => {
  let subString = rawCodeText.substring(
    rawCodeObject.start,
    rawCodeObject.end + 1
  )

  if (subString.includes('window')) {
    // TODO support window.log
    return '*'
  }

  // use regex to get content inside log( * )
  // s is for matching multiple lines
  const regex = /log\((.*)\)/s
  let match = regex.exec(subString)[1]

  // remove // comments which stop at \n
  // match = match.replace(/\/\/.*\n/g, '')

  // remove /* comments */
  // match = match.replace(/\/\*.*\*\//g, '')

  // remove \n
  // match = match.replace(/\n/g, '')

  // remove multiple spaces into one
  // match = match.replace(/\s{2,}/g, ' ')

  return match
}

/* -------------------------------------------------------------------------- */

export const sumRegistries = registries => {
  const files = {}

  for (const registryGroupIdExtended in registries) {
    const registry = registries[registryGroupIdExtended]

    if (!(registry.stackFile in files))
      files[registry.stackFile] = {
        groups: {},
        topLevelDeclarations: [],
        minDepth: Infinity,
        maxDepth: 0,
      }
  }

  for (const registryGroupIdExtended in registries) {
    const registry = registries[registryGroupIdExtended]
    const recordInFiles = files[registry.stackFile]

    if (!(registryGroupIdExtended in recordInFiles.groups)) {
      recordInFiles.groups[registryGroupIdExtended] = {
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
      Object.keys(files).length > 1
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
  const { indentationPx, declarationPx /* filePx */ } =
    timelineSideDragLevelWidth
  return (
    // indentation * indentationPx + declarations * declarationPx + files * filePx
    indentation * indentationPx + declarations * declarationPx + files * 0
  )
}

export const hasLeastOneExpandLevel = expandLevels => {
  const { indentation, declarations } = expandLevels
  return indentation || declarations
}

export const getTimelineOffsets = (
  logGroups,
  registriesByFileName,
  budget,
  expandLevels
) => {
  const { indentationPx, declarationPx, declarationSingleMaxPx } =
    timelineSideDragLevelWidth
  const offsets = {}
  let indentationOffsets = {}
  let declarationOffsets = {}

  if (budget === 0 || getMaxExpandOffset(expandLevels) === 0)
    return { offsets, indentationOffsets, declarationOffsets }

  // ! indentation

  const toDoDeclarations =
    expandLevels.declarations &&
    Math.max(0, budget - expandLevels.indentation * indentationPx) > 0

  for (const logGroupId in logGroups) {
    const logGroup = logGroups[logGroupId]

    logGroup.logs.map(logObj => {
      const groupIdExtended = `${logGroupId}${groupIdExtendingConnector}${getIdentifier(
        logObj.stack.path,
        logObj.stack.line,
        logObj.stack.char
      )}`

      offsets[groupIdExtended] = 0

      if (expandLevels.indentation) {
        const logFile = logObj.stack.file
        const fileRegistry = registriesByFileName[logFile] // !
        const logGroupRegistry = fileRegistry.groups[groupIdExtended]

        const extremeDepthsOfAll = getExtremeDepthsByTopLevelDeclarations(
          fileRegistry,
          logGroupRegistry.topLevelDeclaration,
          toDoDeclarations
        )
        const overallLevels = Math.max(
          extremeDepthsOfAll.max - extremeDepthsOfAll.min,
          1
        )

        const budgetForIndentation = Math.min(budget, indentationPx)
        const eachLevelOffset = budgetForIndentation / overallLevels

        offsets[groupIdExtended] +=
          eachLevelOffset * (logGroupRegistry.depth - extremeDepthsOfAll.min)
        indentationOffsets = { ...offsets }
      }
    })
  }

  budget = Math.max(0, budget - expandLevels.indentation * indentationPx)

  // ! declarations
  if (expandLevels.declarations && budget > 0) {
    const allDeclarations = getAllDeclarations(registriesByFileName, offsets)
    allDeclarations.sort((a, b) => a.totalOffset - b.totalOffset)

    for (const declarationIndex in allDeclarations)
      allDeclarations[declarationIndex].index = declarationIndex

    const budgetForDeclarations = Math.min(budget, declarationPx)
    const eachDeclarationOffset = Math.min(
      budgetForDeclarations / (allDeclarations.length - 1),
      declarationSingleMaxPx
    )

    for (const logGroupId in logGroups) {
      const logGroup = logGroups[logGroupId]

      const visitedGroupIdExtended = new Set()

      logGroup.logs.map(logObj => {
        const groupIdExtended = `${logGroupId}${groupIdExtendingConnector}${getIdentifier(
          logObj.stack.path,
          logObj.stack.line,
          logObj.stack.char
        )}`

        if (!visitedGroupIdExtended.has(groupIdExtended)) {
          visitedGroupIdExtended.add(groupIdExtended)

          const ind =
            eachDeclarationOffset *
            _getDeclarationByGroupId(allDeclarations, groupIdExtended).index

          offsets[groupIdExtended] += ind
          declarationOffsets[groupIdExtended] = ind
        }
      })
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
  targetDeclaration,
  toDoDeclarations
) => {
  let min = Infinity
  let max = 0
  for (const groupIdExtended in fileRegistry.groups) {
    const thisRegistry = fileRegistry.groups[groupIdExtended]

    if (
      !toDoDeclarations ||
      thisRegistry.topLevelDeclaration === targetDeclaration
    ) {
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
    for (const groupIdExtended in registry.groups) {
      const thisRegistry = registry.groups[groupIdExtended]

      if (_declarationExists(declarations, thisRegistry.topLevelDeclaration))
        _getDeclarationFromAllDeclarations(
          declarations,
          thisRegistry.topLevelDeclaration
        ).groupIds.push(groupIdExtended)
      else
        declarations.push({
          name: thisRegistry.topLevelDeclaration,
          file: fileName,
          groupIds: [groupIdExtended],
        })
    }
  }

  // get the total offsets from each of the groupId associated with this declaration
  for (const declaration of declarations) {
    declaration.totalOffsets = declaration.groupIds
      .map(groupIdExtended => {
        return currentOffsets[groupIdExtended]
      })
      .reduce((a, b) => a + b, 0)
  }

  return declarations
}

export const _getDeclarationByGroupId = (declarations, groupIdExtended) => {
  for (const declaration of declarations)
    if (declaration.groupIds.includes(groupIdExtended)) return declaration
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
