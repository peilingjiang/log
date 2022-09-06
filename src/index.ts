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

function setLog(options: GlobalSettings, save: boolean = true): void {
  if (!assertObject(options)) return

  g.preserveConsole = options.preserveConsole || g.preserveConsole
  g.useSourceMaps = options.useSourceMaps || g.useSourceMaps
  g.directionDown = options.directionDown || g.directionDown
  g.defaultOrganization = options.defaultOrganization || g.defaultOrganization
  g.vsLogPort = options.vsLogPort || g.vsLogPort

  if (save) localStorage.setItem(localStorageKeys.DEFAULT, JSON.stringify(g))
}

function errorBoundary(func: () => void, element?: HTMLElement | string): void {
  try {
    func()
  } catch (error: any) {
    globalStackParser.push(undefined, error, (processedStack: any) => {
      log(`${error.message} (${processedStack.method})`)
        .error()
        .name(
          `[error] ${processedStack.file}:${processedStack.line}:${processedStack.char}`
        )
        .element(element)
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
