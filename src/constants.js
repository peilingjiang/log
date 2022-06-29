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

export const logViewInterface = PropTypes.exact({
  left: PropTypes.number.isRequired,
  right: PropTypes.number.isRequired,
  unfolded: PropTypes.array.isRequired,
  highlighted: PropTypes.array.isRequired,
  changed: PropTypes.array.isRequired,
})

export const logViewDefault = Object.seal({
  left: '0px',
  right: '0px',
  unfolded: [],
  highlighted: [],
  changed: [],
})

export const logInterface = PropTypes.exact({
  id: PropTypes.string,
  groupId: PropTypes.string,
  element: PropTypes.instanceOf(Element),
  args: PropTypes.array,
  timestamps: PropTypes.arrayOf(
    PropTypes.exact({
      now: PropTypes.number,
      // ! change 3 places to re-enable this Date type
      // date: PropTypes.object,
    })
  ),
  stack: stackInterface,
  count: PropTypes.number,
  ////
  // customization
  color: PropTypes.string,
  unit: PropTypes.string,
  history: PropTypes.number,
})

export const logGroupInterface = PropTypes.exact({
  name: PropTypes.string,
  ////
  logs: PropTypes.arrayOf(logInterface).isRequired,
  ////
  groupId: PropTypes.string.isRequired,
  element: PropTypes.instanceOf(Element),
  groupElementId: PropTypes.string.isRequired,
  ////
  format: PropTypes.string.isRequired, // text, shape
  ////
  // shape format special
  orientation: PropTypes.string.isRequired, // horizontal, vertical
  snap: PropTypes.bool.isRequired, // snap to element or not
  snapElement: PropTypes.oneOfType([
    PropTypes.instanceOf(Element),
    PropTypes.string,
    PropTypes.number,
  ]), // element or 'window' or null
  snapElementId: PropTypes.string,
  snapAnchorSide: PropTypes.string.isRequired, // 'top' 0, 'right' 1, 'bottom' 2, 'left' 3, 'center' 4
  snapAnchorPercent: PropTypes.number.isRequired, // 0.0 to 1.0 ONLY for window
  ////
  bounding: boundingInterface.isRequired,
  followType: PropTypes.string.isRequired,
  ////
  paused: PropTypes.bool.isRequired,
  deleted: PropTypes.bool.isRequired,
  ////
  view: logViewInterface.isRequired,
  ////
  // customization
})

/* -------------------------------------------------------------------------- */

// the meaningful line of where the log is from should not be the log wrapper interface
// instead, we trace back to the actual caller
export const stackActualCallerDepth = 5

// out of 8 possible positions around the anchor element, we only allow the first N best ones
export const positionFindingWorstAllowed = 5

export const minimalStringShowLength = 7
export const foldedArrayShowItemCount = 3
export const foldedObjectShowItemCount = 3

export const _L = 'left'
export const _R = 'right'
export const _T = 'top'
export const _B = 'bottom'
export const _C = 'center'

export const _H = 'horizontal'
export const _V = 'vertical'

export const _DEF = 'default'

export const validUnits = ['px', '%', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax']

/* -------------------------------------------------------------------------- */

// default gap between the log and the anchor element
export const logStreamGapToAnchorPx = 10

/* -------------------------------------------------------------------------- */

export const _config = Object.seal({
  logStreamHistoryRenderDepth: 3,
  logStreamHistoryRenderUnitOffsetPx: 2,
  logStreamHistoryRenderOpacityUnitDecrease: 0.25,
  ////
  shapeRectWidth: '17px',
  ////
  snapThresholdPx: 15,
})

export const _rootStyles = Object.seal({
  darkGrey: '#666',
  lightGrey: '#cfcfcf',

  elegantRed: '#e23e57',

  elementOutlineBound: '#fba300',

  opacityDefault: 0.95,
})

export const _tinyColors = Object.seal({
  lightGrey: tinycolor(_rootStyles.lightGrey),
})
