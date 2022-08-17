import { _rootStyles } from '../constants.js'
import { parseDefaultColor } from './utils.js'

export const lightLogColor = (level, logColor, groupColor) =>
  level === 'log'
    ? parseDefaultColor(logColor, groupColor, false)
    : level === 'error'
    ? _rootStyles.errorRedLight
    : _rootStyles.warnYellowLight

export const logColor = (level, logColor, groupColor) =>
  level === 'log'
    ? parseDefaultColor(logColor, groupColor, false)
    : level === 'error'
    ? _rootStyles.errorRed
    : _rootStyles.warnYellow

export const darkLogColor = (level, logColor, groupColor) =>
  level === 'log'
    ? parseDefaultColor(logColor, groupColor, false)
    : level === 'error'
    ? _rootStyles.errorRedDark
    : _rootStyles.warnYellowDark
