// customizable

import { io } from 'socket.io-client'

// eslint-disable-next-line no-unused-vars
import {
  localStorageKeys,
  timelineWaitConnectionTimeout,
  _Time,
} from './constants.js'

// eslint-disable-next-line no-undef
export const development = process.env.NODE_ENV === 'development'

export interface GlobalSettings {
  // access: boolean | undefined
  preserveConsole: boolean | undefined
  useSourceMaps: boolean | undefined
  directionDown: boolean | undefined
  defaultOrganization: string | undefined
  logHistoryLength: number | undefined
  vsLogPort: number | undefined
}

const defaultGlobalSettings: GlobalSettings = {
  preserveConsole: false,
  useSourceMaps: true,
  directionDown: true,
  defaultOrganization: _Time,
  logHistoryLength: 100,
  vsLogPort: 2022,
}

// recover from localStorage
let recoveredDefaults: string =
  localStorage.getItem(localStorageKeys.DEFAULT) || ''
const hasRecoveredDefaults: boolean =
  typeof recoveredDefaults === 'string' && recoveredDefaults.length > 0

let recoveredSettings: object = {}
if (hasRecoveredDefaults) {
  recoveredSettings = { ...JSON.parse(recoveredDefaults) }
}

export const g: GlobalSettings = Object.seal({
  ...defaultGlobalSettings,
  ...recoveredSettings,
})

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
    '%cConnected to VS Log',
    'color: #ff42a1; font-weight: bold'
  )

  // socket.on('ast', data => {
  //   globalAST.current = data
  // })
})

// extra headers
// https://github.com/socketio/socket.io/issues/3929
