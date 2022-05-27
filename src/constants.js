import PropTypes from 'prop-types'

export const stackInterface = PropTypes.exact({
  line: PropTypes.number,
  char: PropTypes.number,
  method: PropTypes.string,
  file: PropTypes.string,
  path: PropTypes.string,
})

export const boundingInterface = PropTypes.exact({
  left: PropTypes.string,
  right: PropTypes.string,
  top: PropTypes.string,
  bottom: PropTypes.string,
  horizontalAlign: PropTypes.string,
  verticalAlign: PropTypes.string,
})

export const logInterface = PropTypes.exact({
  id: PropTypes.string,
  groupId: PropTypes.string,
  element: PropTypes.object,
  args: PropTypes.array,
  timestamp: PropTypes.exact({
    now: PropTypes.number,
    date: PropTypes.object,
  }),
  stack: stackInterface,
})

export const logGroupInterface = PropTypes.exact({
  ////
  logs: PropTypes.arrayOf(logInterface),
  ////
  groupId: PropTypes.string,
  element: PropTypes.object,
  bounding: boundingInterface,
  followType: PropTypes.string,
})

/* -------------------------------------------------------------------------- */

export const stackActualCallerDepth = 2
export const positionFindingWorstAllowed = 7

export const _L = 'left'
export const _R = 'right'
export const _T = 'top'
export const _B = 'bottom'

/* -------------------------------------------------------------------------- */

export const logStreamGapToAnchorPx = 10 // px
