import PropTypes from 'prop-types'
import tinycolor from 'tinycolor2'

export const stackInterface = PropTypes.exact({
  line: PropTypes.number.isRequired,
  char: PropTypes.number.isRequired,
  method: PropTypes.string.isRequired,
  file: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  raw: PropTypes.object.isRequired,
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

/* -------------------------------------------------------------------------- */

export const idViewsInterface = PropTypes.exact({
  centerStagedId: PropTypes.string.isRequired,
  unfoldedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  highlightedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
})

export const logViewInterface = PropTypes.exact({
  left: PropTypes.string.isRequired,
  top: PropTypes.string.isRequired,
  centerStagedId: PropTypes.string.isRequired,
  unfoldedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  highlightedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  // changed: PropTypes.array.isRequired,
})

export const logViewDefault = Object.seal({
  left: '0px',
  top: '0px',
  centerStagedId: '',
  unfoldedIds: [],
  highlightedIds: [],
  // changed: [],
})

/* -------------------------------------------------------------------------- */

export const timestampItemInterface = PropTypes.exact({
  now: PropTypes.number,
  // ! change 3 places to re-enable this Date type
  // date: PropTypes.object,
})

// ! log
export const logInterface = PropTypes.exact({
  id: PropTypes.string,
  groupId: PropTypes.string,
  element: PropTypes.instanceOf(Element),
  args: PropTypes.array,
  timestamps: PropTypes.arrayOf(timestampItemInterface).isRequired,
  stack: stackInterface,
  count: PropTypes.number,
  ////
  // customization
  color: PropTypes.string,
  unit: PropTypes.string,
  history: PropTypes.number,
})

// ! logGroup
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
  groupColor: PropTypes.string.isRequired,
  ////
  paused: PropTypes.bool.isRequired,
  deleted: PropTypes.bool.isRequired,
  ////
  view: logViewInterface.isRequired,
  ////
  // customization
})

// ! logTimelineItem
export const logTimelineItemInterface = PropTypes.exact({
  timestamp: timestampItemInterface.isRequired,
  groupId: PropTypes.string.isRequired,
  logInd: PropTypes.number.isRequired,
  timestampInd: PropTypes.number.isRequired,
})

export const registryInterface = PropTypes.exact({
  identifier: PropTypes.string.isRequired,
  filePath: PropTypes.string.isRequired,
  stackPath: PropTypes.string.isRequired,
  stackFile: PropTypes.string.isRequired,
  stackLine: PropTypes.number.isRequired,
  stackChar: PropTypes.number.isRequired,
  depth: PropTypes.number.isRequired,
  depthStack: PropTypes.arrayOf(PropTypes.string).isRequired,
})

/* -------------------------------------------------------------------------- */

// the meaningful line of where the log is from should not be the log wrapper interface
// instead, we trace back to the actual caller
export const stackActualCallerDepth = 5
// when comparing two paths, from web and file system,
// we only care about the last part of the path
export const stackFilePathCompareDepth = 3

// out of 8 possible positions around the anchor element, we only allow the first N best ones
export const positionFindingWorstAllowed = 3
export const switchPositionRegistrationDifferenceThresholdPx2 = 2500

export const minimalStringShowLength = 7
export const foldedArrayShowItemCount = 3
export const foldedObjectShowItemCount = 3

export const expandedStreamDisableAutoScrollThresholdPx = 700
export const timelineDisableAutoScrollThresholdPx = 200
export const timelineSelectionAreaOffsetButterPx = 20

export const timelineWaitConnectionTimeout = 5000
export const timelineEachExpandLevelSliderWidthPx = 20

export const timelineSideDragLevelWidth = {
  indentationPx: 100,
  declarationPx: 150,
  filePx: 250,
}

export const timelineGroupWiseOffsetPx = {
  shared: 100,
  max: 15,
  min: 5,
}

export const _L = 'left'
export const _R = 'right'
export const _T = 'top'
export const _B = 'bottom'
export const _C = 'center'

export const _H = 'horizontal'
export const _V = 'vertical'

export const _DEF = 'default'

export const validUnits = ['px', '%', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax']

// organization
export const _Aug = 'augmented'
export const _Time = 'timeline'

export const pageElementsQuery =
  'body * :not(#root, .hyper-log-host, .hyper-log-streams-holder, .hyper-log-streams-holder *, #sudo-pointer-element, .leader-line, .leader-line *, .hyper-log-timeline, .hyper-log-timeline *)'

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
  attachLineLengthThresholdPx: 15,
})

export const _rootStyles = Object.seal({
  darkGrey: '#666',
  grey: '#999',
  lightGrey: '#cfcfcf',

  elegantRed: '#e23e57',

  elementOutlineBound: '#fba300',

  opacityDefault: 0.95,

  transitionFastMs: 100,
  transitionNormalMs: 300,
  transitionSlowMs: 700,
  transitionHighlightMs: 1500,
})

export const _tinyColors = Object.seal({
  lightGrey: tinycolor(_rootStyles.lightGrey),
})
