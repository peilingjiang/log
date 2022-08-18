// customizable

import { io } from 'socket.io-client'

import { timelineWaitConnectionTimeout, _Aug, _Time } from './constants.js'
import { assertObject } from './methods/utils.js'

// eslint-disable-next-line no-undef
const development = process.env.NODE_ENV === 'development'

export const g = Object.seal({
  ////
  access: development,
  ////
  preserveConsole: false,
  useSourceMaps: true,
  directionDown: true,
  defaultOrganization: _Time,
  vsLogPort: 2022,
})

// ! setLog
;(() => {
  window.setLog = (options = {}) => {
    if (!assertObject(g)) return
    options = Object.assign(g, options)

    g.access = options.access
    g.preserveConsole = options.preserveConsole
    g.useSourceMaps = options.useSourceMaps
    g.directionDown = options.directionDown
    g.defaultOrganization = options.defaultOrganization
    g.vsLogPort = options.vsLogPort
  }
})()

/* -------------------------------------------------------------------------- */

// export const globalAST = Object.seal({ current: {} })

// const host = window.location.hostname
const host = 'localhost'

export const socket = io.connect(`http://${host}:${g.vsLogPort}/`, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: timelineWaitConnectionTimeout / 1000,
})

// ? is it the best practice to open the socket here?
socket.on('connect', () => {
  window.console.log(
    '%cConnected to VS Log Server',
    'color: #ff42a1; font-weight: bold'
  )

  // socket.on('ast', data => {
  //   globalAST.current = data
  // })
})
