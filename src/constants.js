import PropTypes from 'prop-types'
import tinycolor from 'tinycolor2'

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

export const boundingDefault = Object.seal({
  left: '0px',
  right: '0px',
  top: '0px',
  bottom: '0px',
  horizontalAlign: 'left',
  verticalAlign: 'top',
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

// the meaningful line of where the log is from should not be the log wrapper interface
// instead, we trace back to the actual caller
export const stackActualCallerDepth = 2

// out of 8 possible positions around the anchor element, we only allow the first N best ones
export const positionFindingWorstAllowed = 7

export const _L = 'left'
export const _R = 'right'
export const _T = 'top'
export const _B = 'bottom'

/* -------------------------------------------------------------------------- */

// default gap between the log and the anchor element
export const logStreamGapToAnchorPx = 10

/* -------------------------------------------------------------------------- */

export const _config = Object.seal({
  logStreamHistoryRenderDepth: 3,
  logStreamHistoryRenderUnitOffsetPx: 4,
  logStreamHistoryRenderOpacityUnitDecrease: 0.3,
})

export const _rootStyles = Object.seal({
  lightGrey: '#cfcfcf',

  opacityDefault: 0.95,
})

export const _tinyColors = Object.seal({
  lightGrey: tinycolor(_rootStyles.lightGrey),
})
