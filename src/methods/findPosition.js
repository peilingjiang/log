import {
  logStreamGapToAnchorPx,
  positionFindingWorstAllowed,
  _B,
  _L,
  _R,
  _T,
} from '../constants.js'
import {
  assertExistence,
  getElementBounding,
  keyWithSmallestValue,
} from './utils.js'

export const findPosition = (anchorElement, logElement) => {
  // TODO avoid being outside of the page view

  // get all rects of page elements
  const existingPageRects = []
  const existingPageElements = document.querySelectorAll(
    'body * :not(.hyper-log-host, .hyper-log-streams-holder, .hyper-log-streams-holder *)'
  )

  for (let e of existingPageElements) {
    if (
      !e.isSameNode(anchorElement) &&
      !anchorElement.contains(e) &&
      !e.contains(anchorElement) &&
      (!assertExistence(e.dataset.id) || e.dataset.id !== logElement.dataset.id)
    )
      existingPageRects.push(getElementBounding(e))
  }

  const anchorBounding = getElementBounding(anchorElement)
  const logBounding = getElementBounding(logElement)

  const overlapByPosId = {}

  for (let posId = 1; posId <= positionFindingWorstAllowed; posId++) {
    const testPosition = {
      ...registeredPositions(posId, anchorBounding),
      width: logBounding.width,
      height: logBounding.height,
    }
    const testPseudoRect = {
      left: getTestValue('left', testPosition),
      right: getTestValue('right', testPosition),
      top: getTestValue('top', testPosition),
      bottom: getTestValue('bottom', testPosition),
      width: logBounding.width,
      height: logBounding.height,
    }

    const overlapWithExistingPageElements = existingPageRects
      .map(pageRect => {
        if (isOverlapped(pageRect, testPseudoRect)) {
          return overlappingArea(pageRect, testPseudoRect)
        } else {
          return 0
        }
      })
      .reduce((a, b) => a + b, 0)
    overlapByPosId[posId] = overlapWithExistingPageElements
  }

  const smallestKey = keyWithSmallestValue(overlapByPosId)
  return registeredPositions(smallestKey, anchorBounding)
}

export const overlappingArea = (rect1, rect2) => {
  const xOverlap =
    Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left)
  const yOverlap =
    Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top)
  return xOverlap * yOverlap
}

export const isOverlapped = (rect1, rect2) => {
  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  )
}

/* -------------------------------------------------------------------------- */

const _getPos = (
  leftNum,
  topNum,
  rightNum,
  bottomNum,
  horizontalAlign,
  verticalAlign
) => {
  return {
    left: pxWrap(leftNum),
    top: pxWrap(topNum),
    right: pxWrap(rightNum),
    bottom: pxWrap(bottomNum),
    horizontalAlign: horizontalAlign,
    verticalAlign: verticalAlign,
  }
}

export const registeredPositions = (posId, anchorBounding) => {
  const { left, right, top, bottom } = anchorBounding
  const { innerWidth, innerHeight } = window

  const gap = logStreamGapToAnchorPx

  switch (Number(posId)) {
    case 1:
      return _getPos(left, bottom + gap, undefined, undefined, _L, _T)

    case 2:
      return _getPos(right + gap, top, undefined, undefined, _L, _T)

    case 3:
      return _getPos(left, undefined, undefined, innerWidth - top + gap, _L, _B)

    case 4:
      return _getPos(undefined, top, innerWidth - left + gap, undefined, _R, _T)

    case 5:
      return _getPos(
        undefined,
        bottom + gap,
        innerWidth - right,
        undefined,
        _R,
        _T
      )

    case 6:
      return _getPos(
        right + gap,
        undefined,
        undefined,
        innerHeight - bottom,
        _R,
        _B
      )

    case 7:
      return _getPos(
        undefined,
        undefined,
        innerWidth - right,
        innerHeight - top + gap,
        _R,
        _B
      )

    case 8:
      return _getPos(
        undefined,
        undefined,
        innerWidth - left + gap,
        innerHeight - bottom,
        _R,
        _B
      )

    default:
      break
  }
}

export const pxWrap = value => {
  return value ? `${value}px` : ''
}

export const pxTrim = value => {
  return Number(value.replace('px', ''))
}

export const getTestValue = (accessor, testPosition) => {
  if (testPosition[accessor]) return pxTrim(testPosition[accessor])
  const { innerWidth, innerHeight } = window
  switch (accessor) {
    case 'left':
      return innerWidth - pxTrim(testPosition.right) - testPosition.width

    case 'right':
      return pxTrim(testPosition.left) + testPosition.width

    case 'top':
      return innerHeight - pxTrim(testPosition.bottom) - testPosition.height

    case 'bottom':
      return pxTrim(testPosition.top) + testPosition.height

    default:
      return 0
  }
}
