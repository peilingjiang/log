import StackTrace from 'stacktrace-js'

import { HyperLog, Timestamp } from './hyperLog'
import { logProcessor } from './logProcessor'
import { GlobalSettings, g } from './global'
import './rendering'
// import './objectLog.js'
import { assertObject } from './methods/utils'
import { localStorageKeys } from './constants'

import './css/main.scss'
import { globalStackParser } from './methods/stackParser'

/* -------------------------------------------------------------------------- */

// declare global {
//   interface Window {
//     log: LogFunc
//     // errorBoundary: (func: () => void) => void
//   }
// }

function log(...args: any[]): HyperLog {
  // if (!g.access) return

  const timestamp: Timestamp = {
    now: performance.now(),
  }
  const error = new Error()

  const thisHyperLog = new HyperLog(args, timestamp, error)
  logProcessor.add(thisHyperLog)

  return thisHyperLog
}

function setLog(options: GlobalSettings): void {
  if (!assertObject(options)) return

  g.preserveConsole = g.preserveConsole || options.preserveConsole
  g.useSourceMaps = g.useSourceMaps || options.useSourceMaps
  g.directionDown = g.directionDown || options.directionDown
  g.defaultOrganization = g.defaultOrganization || options.defaultOrganization
  g.vsLogPort = g.vsLogPort || options.vsLogPort

  localStorage.setItem(localStorageKeys.DEFAULT, JSON.stringify(options))
}

function errorBoundary(func: () => void): void {
  try {
    func()
  } catch (error: any) {
    globalStackParser.push(undefined, error, (processedStack: any) => {
      log(`${error.message} (${processedStack.method})`)
        .error()
        .name(
          `[error] ${processedStack.file}:${processedStack.line}:${processedStack.char}`
        )
    })
  }
}

// ;(window as any).log = log
// window.errorBoundary = errorBoundary

/* -------------------------------------------------------------------------- */

window.console.log(
  '%c[Log-it] Log Right Here, Right Now!\nTime to turn off the console : )',
  'background: #ff42a1; font-weight: bold; color: #fff; padding: 1rem;'
)

export default log
export { setLog, errorBoundary }
