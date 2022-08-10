// customizable

import { io } from 'socket.io-client'

import { timelineWaitConnectionTimeout, _Aug, _Time } from './constants.js'
import { assertObject } from './methods/utils.js'

export const g = Object.seal({
  preserveConsole: false,
  useSourceMaps: true,
  directionDown: true,
  defaultOrganization: _Time,
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

// export const globalAST = Object.seal({ current: {} })

// const host = window.location.hostname
const host = 'localhost'

export const socket = io.connect(`http://${host}:2022/`, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: timelineWaitConnectionTimeout / 1000,
})

// ? is it the best practice to open the socket here?
socket.on('connect', () => {
  console.log(
    '%cConnected to VS Log Server',
    'color: #ff42a1; font-weight: bold'
  )

  // socket.on('ast', data => {
  //   globalAST.current = data
  // })
})
