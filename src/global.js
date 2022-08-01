// customizable

import { _Aug, _Time } from './constants.js'
import { assertObject } from './methods/utils.js'

export const g = Object.seal({
  preserveConsole: false,
  useSourceMaps: false,
  directionDown: true,
  defaultOrganization: _Aug,
})

// ! setLog
;(() => {
  window.setLog = (options = {}) => {
    if (!assertObject(g)) return
    options = Object.assign(g, options)
    g.preserveConsole = options.preserveConsole
    g.useSourceMaps = options.useSourceMaps
    g.directionDown = options.directionDown
    g.defaultOrganization = options.defaultOrganization
  }
})()
