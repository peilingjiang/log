import {
  logStreamGapToAnchorPx,
  positionFindingWorstAllowed,
  _B,
  _L,
  _R,
  _T,
} from '../constants.js'
import { assertExistence, getElementBounding } from './utils.js'

export const findPosition = (
  anchorElement,
  logElement,
  logChildrenRect = null
) => {
  // get all rects of page elements
  const existingPageRects = []
  const existingPageElements = document.querySelectorAll(
    'body * :not(.hyper-log-host, .hyper-log-stream *)'
  )
  for (let e of existingPageElements) {
    if (
      !e.isSameNode(anchorElement) &&
      (!assertExistence(e.dataset.id) || e.dataset.id !== logElement.dataset.id)
    )
      existingPageRects.push(getElementBounding(e))
  }

  const anchorBounding = getElementBounding(anchorElement)
  const logBounding = assertExistence(logChildrenRect)
    ? logChildrenRect
    : getElementBounding(logElement)

  const overlapByPosId = {}
  for (let posId = 1; posId <= positionFindingWorstAllowed; posId++) {
    const testPosition = registeredPositions(posId, anchorBounding, logBounding)
    const testPseudoRect = {
      left: pxTrim(testPosition.left),
      right: pxTrim(testPosition.right),
      top: pxTrim(testPosition.top),
      bottom: pxTrim(testPosition.bottom),
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

  const optimizedId = Object.keys(overlapByPosId).reduce((a, b) =>
    overlapByPosId[a] < overlapByPosId[b] ? a : b
  )

  return registeredPositions(optimizedId, anchorBounding, logBounding)
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
  horizontalAlign,
  verticalAlign,
  width,
  height
) => {
  return {
    left: pxWrap(leftNum),
    top: pxWrap(topNum),
    right: pxWrap(leftNum + width),
    bottom: pxWrap(topNum + height),
    horizontalAlign: horizontalAlign,
    verticalAlign: verticalAlign,
  }
}

export const registeredPositions = (posId, anchorBounding, logBounding) => {
  const { left, right, top, bottom } = anchorBounding
  const { width, height } = logBounding
  const gap = logStreamGapToAnchorPx

  switch (Number(posId)) {
    case 1:
      return _getPos(left, bottom + gap, _L, _T, width, height)

    case 2:
      return _getPos(right + gap, top, _L, _T, width, height)

    case 3:
      return _getPos(left, top - gap - height, _L, _B, width, height)

    case 4:
      return _getPos(left - gap - width, top, _R, _T, width, height)

    case 5:
      return _getPos(right - width, bottom + gap, _R, _T, width, height)

    case 6:
      return _getPos(right + gap, bottom - height, _R, _B, width, height)

    case 7:
      return _getPos(
        right - width,
        bottom - gap - height,
        _R,
        _B,
        width,
        height
      )

    case 8:
      return _getPos(left - gap - width, bottom - height, _R, _B, width, height)

    default:
      break
  }
}

export const pxWrap = value => {
  return `${value}px`
}

export const pxTrim = value => {
  return Number(value.replace('px', ''))
}
