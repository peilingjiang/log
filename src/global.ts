// customizable

import { io } from 'socket.io-client'

// eslint-disable-next-line no-unused-vars
import {
  localStorageKeys,
  timelineWaitConnectionTimeout,
  _Time,
} from './constants.js'
import { assertObject } from './methods/utils.js'

// eslint-disable-next-line no-undef
// const development = process.env.NODE_ENV === 'development'

export interface GlobalSettings {
  // access: boolean | undefined
  preserveConsole: boolean | undefined
  useSourceMaps: boolean | undefined
  directionDown: boolean | undefined
  defaultOrganization: string | undefined
  logHistoryLength: number | undefined
  vsLogPort: number | undefined
}

const defaultFromLocalStorage = localStorage.getItem(localStorageKeys.DEFAULT)

const defaultGlobalSettings: GlobalSettings = {
  preserveConsole: false,
  useSourceMaps: true,
  directionDown: true,
  defaultOrganization: _Time,
  logHistoryLength: 50,
  vsLogPort: 2022,
}

export const g: GlobalSettings = Object.seal(
  defaultFromLocalStorage
    ? ({
        ...defaultGlobalSettings,
        ...JSON.parse(defaultFromLocalStorage),
        // access: true, // ! to be ENABLE after review process
      } as GlobalSettings)
    : defaultGlobalSettings
)

// ! setLog
// ;(() => {
//   window.setLog = (options = {}) => {
//     if (!assertObject(options)) return
//     options = Object.assign(g, options)

//     // g.access = options.access // ! to be REMOVED after review process
//     g.preserveConsole = options.preserveConsole
//     g.useSourceMaps = options.useSourceMaps
//     g.directionDown = options.directionDown
//     g.defaultOrganization = options.defaultOrganization
//     g.vsLogPort = options.vsLogPort

//     // save to localStorage
//     localStorage.setItem(localStorageKeys.DEFAULT, JSON.stringify(options))
//   }
// })()

/* -------------------------------------------------------------------------- */

// export const globalAST = Object.seal({ current: {} })

// const host = window.location.hostname
const host = 'localhost'

export const socket = (io as any).connect(`http://${host}:${g.vsLogPort}/`, {
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

// extra headers
// https://github.com/socketio/socket.io/issues/3929
