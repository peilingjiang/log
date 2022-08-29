export function pseudoFunc(): void
export function getTimestamp(): {
  now: number
}
export function getObjectIds(obj: any): string[]
export function diffObjects(obj1: any, obj2: any): {}
export function idFromString(str: any): any
export function trimStringToLength(str: any, length: any): any
export function getIdentifier(stackPath: any, line: any, char: any): string
export function brutalFindGroupIdInRegistries(
  groupId: any,
  registries: any
): number
export function arrayLast(arr: any, n?: number): any
export function arrayFirst(arr: any, n?: number): any
export function preventEventWrapper(e: any, callback: any): void
export function getArgsArrayFromRawCodeObject(
  argsString: any,
  rawObject: any
): any
export function areArgsEqual(args1: any, args2: any): boolean
export function matchLocInObjectByRemovingLogId(
  ids: any,
  targetId: any
): boolean
export function removeLogId(id: any): any
export function removeArgsDescriptions(args: any): any
export function centerStagedArgInd(centerStagedId: any): number
export function parseCenterStagedValueFromId(args: any, id?: string): any[]
export function constrain(x: any, min: any, max: any): number
export function map(
  x: any,
  inMin: any,
  inMax: any,
  outMin: any,
  outMax: any
): any
export function dist(x1: any, y1: any, x2: any, y2: any): number
export function onlyNumbers(str: any): boolean
export function bindableElement(element: any): any
export function stringifyDOMElement(ele: any, _depth?: number): any
export function getFilteredOutElements(filterArea: any): any[]
export function getElementBounding(element: any, draggedOffset?: null): any
export function mergeBoundingRects(rects: any): {
  left: number
  right: number
  top: number
  bottom: number
  width: number
  height: number
}
export function copyObject(obj: any): any
export function cloneLogTimeline(logTimeline: any): any[]
export function cloneLogGroups(logGroups: any): {}
export function cloneLogGroup(logGroup: any): any
export function deepCopyArrayOfLogs(arr: any): any
export function keyWithSmallestValue(obj: any): number
export function objectKeys(obj: any): string[]
export function getActualFrame(
  frames: any,
  rawError: any
): {
  line: any
  char: any
  method: any
  file: any
  path: any
  raw: any
}
export function parseStack(pastStacks: any, callback: any): any
export function _getStacks(logGroups: any): any[]
export function assertExistence(a: any): boolean
export function assertNumber(a: any): boolean
export function assertArray(a: any): boolean
export function assertString(a: any): boolean
export function assertBoolean(a: any): boolean
export function assertFunction(a: any): boolean
export function assertClass(a: any, nameOfObjectClass: any): boolean
export function assertObject(a: any, shape?: null): boolean
export function assertElement(a: any): boolean
export function assertArguments(argsAndAssertions: any): void
export function assertTypeOfArg(
  arg: any
):
  | 'string'
  | 'object'
  | 'number'
  | 'null'
  | 'undefined'
  | 'boolean'
  | 'function'
  | 'array'
  | 'unknown'
export function containsOnlyNumber(str: any): boolean
export function containsOnlyString(str: any): boolean
export function containsOnlyNull(str: any): boolean
export function tinyColorToRGBStyleString(tinyColor: any): string
export function hexAndOpacityToRGBA(hex: any, opacity: any): string
export function randomColor(): any
export function applyOpacityTo(rgbaHex: any, opacity: any): any
export function parseDefaultColor(
  color: any,
  groupColor: any,
  useDefaultGrey?: boolean
): any
export function _unitIsValid(unit: any): boolean
export function _checkIfContainsValidUnit(arg: any): boolean
export function canUseShape(log: any, centerStagedId?: string): boolean
export const acceptableGraphicsSourcePairs: {
  size: string[]
  position: string[]
  keyWord: string
}[]
export function canGraphics(log: any, centerStagedId?: string): boolean
export function anySize(arg: any): boolean
export function getValidPairs(
  arg: any,
  retrievalType: any
): {
  size: string[]
  position: string[]
  keyWord: string
}[]
export function getLogStats(
  logs: any,
  centerStagedId?: string
): {
  min: number
  max: number
  sum: number
  count: number
  average: number
}
