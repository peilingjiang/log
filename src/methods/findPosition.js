import {
  logStreamGapToAnchorPx,
  pageElementsQuery,
  positionFindingWorstAllowed,
  switchPositionRegistrationDifferenceThresholdPx2,
  _B,
  _L,
  _R,
  _T,
} from '../constants.js'
import {
  assertExistence,
  getElementBounding,
  keyWithSmallestValue,
  mergeBoundingRects,
} from './utils.js'

export const findPosition = (
  anchorElement,
  logElement,
  existingRegistration = undefined
) => {
  // TODO avoid being outside of the page view

  // get all rects of page elements
  const existingPageRects = []
  const existingPageElements = document.querySelectorAll(pageElementsQuery)

  // let pageElements = []
  for (let e of existingPageElements) {
    if (
      !e.isSameNode(anchorElement) &&
      !anchorElement.contains(e) &&
      !e.contains(anchorElement) &&
      (!assertExistence(e.dataset.id) || e.dataset.id !== logElement.dataset.id)
    ) {
      existingPageRects.push(getElementBounding(e))
      // pageElements.push(e)
    }
  }

  const anchorBounding = getElementBounding(anchorElement)

  let boundingRectForLog = mergeBoundingRects(
    [...logElement.children].map(el => {
      return getElementBounding(el)
    })
  )

  const logBounding = {
    left: boundingRectForLog.left,
    right: boundingRectForLog.right,
    top: boundingRectForLog.top,
    bottom: boundingRectForLog.bottom,
    width: boundingRectForLog.width,
    height: boundingRectForLog.height,
    x: boundingRectForLog.x,
    y: boundingRectForLog.y,
  }
  if (logBounding.height === 0) {
    logBounding.height = 100 // TODO reserve actual height for log streams
    logBounding.bottom -= 100
  }

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
    const overlapWithOffscreenArea = isAnyOffscreen(testPseudoRect)
      ? pseudoOffscreenOverlap(testPseudoRect)
      : 0

    // weighted sum
    // offscreen is bad
    overlapByPosId[posId] =
      overlapWithExistingPageElements + overlapWithOffscreenArea
  }

  const smallestKey = keyWithSmallestValue(overlapByPosId)
  const smallestOverlap = overlapByPosId[smallestKey]

  if (
    existingRegistration !== undefined &&
    overlapByPosId[existingRegistration] - smallestOverlap <
      switchPositionRegistrationDifferenceThresholdPx2
  ) {
    return registeredPositions(existingRegistration, anchorBounding)
  }

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

export const pseudoOffscreenOverlap = testRect => {
  // the area of testRect minus the area of window
  return (
    testRect.width * testRect.height -
    overlappingArea(testRect, {
      left: 0,
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
    })
  )
}

export const isAnyOffscreen = rect => {
  return (
    rect.left < 0 ||
    rect.right > window.innerWidth ||
    rect.top < 0 ||
    rect.bottom > window.innerHeight
  )
}

/* -------------------------------------------------------------------------- */

export const _getPos = (
  leftNum,
  topNum,
  rightNum,
  bottomNum,
  horizontalAlign,
  verticalAlign,
  registration
) => {
  return {
    left: pxWrap(leftNum),
    top: pxWrap(topNum),
    right: pxWrap(rightNum),
    bottom: pxWrap(bottomNum),
    horizontalAlign: horizontalAlign,
    verticalAlign: verticalAlign,
    registration: registration,
  }
}

export const registeredPositions = (posId, anchorBounding) => {
  const { left, right, top, bottom } = anchorBounding
  const { innerWidth, innerHeight } = window

  const gap = logStreamGapToAnchorPx

  /**
   *    5 7
   *  6     2
   *  8     4
   *    1 3
   */

  switch (Number(posId)) {
    case 1:
      return _getPos(left, bottom + gap, undefined, undefined, _L, _T, 1)

    case 2:
      return _getPos(right + gap, top, undefined, undefined, _L, _T, 2)

    case 3:
      return _getPos(
        undefined,
        bottom + gap,
        innerWidth - right,
        undefined,
        _R,
        _T,
        3
      )

    case 4:
      return _getPos(
        right + gap,
        undefined,
        undefined,
        innerHeight - bottom,
        _L,
        _B,
        4
      )

    case 5:
      return _getPos(
        left,
        undefined,
        undefined,
        innerHeight - top + gap,
        _L,
        _B,
        5
      )

    case 6:
      return _getPos(
        undefined,
        top,
        innerWidth - left + gap,
        undefined,
        _R,
        _T,
        6
      )

    case 7:
      return _getPos(
        undefined,
        undefined,
        innerWidth - right,
        innerHeight - top + gap,
        _R,
        _B,
        7
      )

    case 8:
      return _getPos(
        undefined,
        undefined,
        innerWidth - left + gap,
        innerHeight - bottom,
        _R,
        _B,
        8
      )

    default:
      break
  }
}

export const pxWrap = value => {
  if (value === 0) return '0px'
  return value ? `${value}px` : ''
}

export const pxTrim = value => {
  return Number(value.replace(/px/, ''))
}

export const getTestValue = (accessor, testPosition) => {
  if (testPosition[accessor].length) return pxTrim(testPosition[accessor])

  switch (accessor) {
    case 'left':
      // return innerWidth - pxTrim(testPosition.right) - testPosition.width
      return pxTrim(testPosition.right) - testPosition.width

    case 'right':
      return pxTrim(testPosition.left) + testPosition.width

    case 'top':
      // return innerHeight - pxTrim(testPosition.bottom) - testPosition.height
      return pxTrim(testPosition.bottom) - testPosition.height

    case 'bottom':
      return pxTrim(testPosition.top) + testPosition.height

    default:
      return 0
  }
}
