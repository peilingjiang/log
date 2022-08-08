// customizable

import { io } from 'socket.io-client'

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

/* -------------------------------------------------------------------------- */

const globalAST = Object.seal({ current: {} })

const host = window.location.hostname
export const socket = io.connect(`http://${host}:2022/`)

// ? is it the best practice to open the socket here?
socket.on('connect', () => {
  console.log('%cConnected to VS Log Server!', 'color: #ff42a1')

  socket.on('ast', data => {
    globalAST.current = data
  })
})
