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
  element: PropTypes.instanceOf(Element),
  args: PropTypes.array,
  timestamp: PropTypes.exact({
    now: PropTypes.number,
    // ! change 3 places to re-enable this Date type
    // date: PropTypes.object,
  }),
  stack: stackInterface,
  ////
  // customization
  color: PropTypes.string,
})

// export const logGroupInterface = PropTypes.object
export const logGroupInterface = PropTypes.exact({
  name: PropTypes.string,
  ////
  logs: PropTypes.arrayOf(logInterface),
  ////
  groupId: PropTypes.string,
  element: PropTypes.instanceOf(Element),
  groupElementId: PropTypes.string,
  bounding: boundingInterface,
  followType: PropTypes.string,
  ////
  paused: PropTypes.bool,
  deleted: PropTypes.bool,
  ////
  // customization
})

/* -------------------------------------------------------------------------- */

// the meaningful line of where the log is from should not be the log wrapper interface
// instead, we trace back to the actual caller
export const stackActualCallerDepth = 5

// out of 8 possible positions around the anchor element, we only allow the first N best ones
export const positionFindingWorstAllowed = 5

export const _L = 'left'
export const _R = 'right'
export const _T = 'top'
export const _B = 'bottom'

export const _DEF = 'default'

/* -------------------------------------------------------------------------- */

// default gap between the log and the anchor element
export const logStreamGapToAnchorPx = 10

/* -------------------------------------------------------------------------- */

export const _config = Object.seal({
  logStreamHistoryRenderDepth: 3,
  logStreamHistoryRenderUnitOffsetPx: 2,
  logStreamHistoryRenderOpacityUnitDecrease: 0.25,
})

export const _rootStyles = Object.seal({
  lightGrey: '#cfcfcf',
  elementOutlineBound: '#ffa500',

  opacityDefault: 0.95,
})

export const _tinyColors = Object.seal({
  lightGrey: tinycolor(_rootStyles.lightGrey),
})
