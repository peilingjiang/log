import {
  pageElementsQuery,
  _B,
  _C,
  _config,
  _H,
  _L,
  _R,
  _T,
  _V,
} from '../constants.js'
import { _getPos } from './findPosition.js'
import { bindableElement, getElementBounding } from './utils.js'

export const findNearestSnapPoint = (mX, mY) => {
  const existingPageElements = document.querySelectorAll(pageElementsQuery)

  let minDistance = Infinity
  let nearestPointElement = null
  let nearestPoint = null
  for (let e of existingPageElements) {
    if (bindableElement(e)) {
      const midPoints = findFourMidPointsOfElement(e)
      for (let midPoint of midPoints) {
        const distance = Math.sqrt(
          Math.pow(midPoint.x - mX, 2) + Math.pow(midPoint.y - mY, 2)
        )
        if (distance < minDistance) {
          minDistance = distance
          nearestPointElement = e
          nearestPoint = midPoint
        }
      }
    }
  }

  if (minDistance < _config.snapThresholdPx)
    return { nearestPointElement, nearestPoint }
  else return null
}

export const getSnapPosition = (anchorElement, anchorSide, holderElement) => {
  const elementBounding = getElementBounding(anchorElement)
  const holderBounding = getElementBounding(holderElement)
  const { left, right, top, bottom, width, height } = elementBounding
  const { innerWidth, innerHeight } = window

  switch (anchorSide) {
    case _T:
      return _getPos(
        left + width / 2 - holderBounding.width / 2,
        undefined,
        undefined,
        innerHeight - top,
        _L,
        _B
      )
    case _L:
      return _getPos(
        undefined,
        top + height / 2 - holderBounding.height / 2,
        innerWidth - left,
        undefined,
        _R,
        _T
      )
    case _B:
      return _getPos(
        left + width / 2 - holderBounding.width / 2,
        bottom,
        undefined,
        undefined,
        _L,
        _T
      )
    case _R:
      return _getPos(
        right,
        top + height / 2 - holderBounding.height / 2,
        undefined,
        undefined,
        _L,
        _T
      )
  }
}

const findFourMidPointsOfElement = element => {
  const elementBounding = getElementBounding(element)
  return [
    // {
    //   side: 'center',
    //   x: elementBounding.left + elementBounding.width / 2,
    //   y: elementBounding.top + elementBounding.height / 2,
    // },
    {
      side: 'top',
      x: elementBounding.left + elementBounding.width / 2,
      y: elementBounding.top,
    },
    {
      side: 'left',
      x: elementBounding.left,
      y: elementBounding.top + elementBounding.height / 2,
    },
    {
      side: 'bottom',
      x: elementBounding.left + elementBounding.width / 2,
      y: elementBounding.bottom,
    },
    {
      side: 'right',
      x: elementBounding.right,
      y: elementBounding.top + elementBounding.height / 2,
    },
  ]
}

export const defaultBoundingAlignmentFromSnapSide = snapSide => {
  switch (snapSide) {
    case _T:
      return {
        horizontalAlign: _C,
        verticalAlign: _B,
        orientation: _V,
      }
    case _B:
      return {
        horizontalAlign: _C,
        verticalAlign: _T,
        orientation: _V,
      }
    case _L:
      return {
        horizontalAlign: _R,
        verticalAlign: _C,
        orientation: _H,
      }
    case _R:
      return {
        horizontalAlign: _L,
        verticalAlign: _C,
        orientation: _H,
      }
    case _C:
      // TODO
      return {
        horizontalAlign: _L,
        verticalAlign: _C,
        orientation: _H,
      }
  }
}

export const _getAlignment = (orientation, horizontalAlign, verticalAlign) => {
  // Get alignItems value
  if (orientation === _H)
    return horizontalAlign === _L ? 'flex-start' : 'flex-end'
  else return verticalAlign === _T ? 'flex-start' : 'flex-end'
}
