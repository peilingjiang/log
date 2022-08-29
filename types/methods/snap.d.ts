export function findNearestSnapPoint(
  mX: any,
  mY: any
): {
  nearestPointElement: any
  nearestPoint: {
    side: string
    x: any
    y: any
  } | null
} | null
export function getSnapPosition(
  anchorElement: any,
  anchorSide: any,
  holderElement: any
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
export function defaultBoundingAlignmentFromSnapSide(snapSide: any):
  | {
      horizontalAlign: string
      verticalAlign: string
      orientation: string
    }
  | undefined
export function _getAlignment(
  orientation: any,
  horizontalAlign: any,
  verticalAlign: any
): 'flex-start' | 'flex-end'
