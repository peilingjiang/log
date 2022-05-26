import PropTypes from 'prop-types'

export const logInterface = PropTypes.shape({
  id: PropTypes.string,
  groupId: PropTypes.string,
  element: PropTypes.object,
  args: PropTypes.array,
  timestamp: PropTypes.shape({
    now: PropTypes.number,
    date: PropTypes.object,
  }),
  stack: PropTypes.shape({
    line: PropTypes.number,
    char: PropTypes.number,
    method: PropTypes.string,
    file: PropTypes.string,
    path: PropTypes.string,
  }),
})

export const logGroupInterface = PropTypes.shape({
  ////
  logs: PropTypes.arrayOf(logInterface),
  ////
  groupId: PropTypes.string,
  offset: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  followType: PropTypes.string,
})

/* -------------------------------------------------------------------------- */

export const stackActualCallerDepth = 2
