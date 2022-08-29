export function findPosition(
  anchorElement: any,
  logElement: any,
  existingRegistration?: undefined
): any
export function overlappingArea(rect1: any, rect2: any): number
export function isOverlapped(rect1: any, rect2: any): boolean
export function pseudoOffscreenOverlap(testRect: any): number
export function isAnyOffscreen(rect: any): boolean
export function moveInsideWindow(rect: any): any
export function cssify(rect: any): any
export function _getPos(
  leftNum: any,
  topNum: any,
  rightNum: any,
  bottomNum: any,
  horizontalAlign: any,
  verticalAlign: any,
  registration: any
): {
  left: string
  top: string
  right: string
  bottom: string
  horizontalAlign: any
  verticalAlign: any
  registration: any
}
export function registeredPositions(
  posId: any,
  anchorBounding: any
):
  | {
      left: string
      top: string
      right: string
      bottom: string
      horizontalAlign: any
      verticalAlign: any
      registration: any
    }
  | undefined
export function pxWrap(value: any): string
export function pxTrim(value: any): number
export function pxOrStringWrap(value: any): any
export function getTestValue(accessor: any, testPosition: any): any
