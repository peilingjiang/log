import { HyperLog, Timestamp } from './hyperLog'
import { globalStackParser } from './methods/stackParser'
import { logProcessor } from './logProcessor'
import { GlobalSettings, g } from './global'
import { assertObject } from './methods/utils'
import { localStorageKeys } from './constants'
import './rendering'

import './css/main.scss'

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

function configLog(options: GlobalSettings, save: boolean = true): void {
  if (!assertObject(options)) return

  g.preserveConsole = options.preserveConsole || g.preserveConsole
  g.useSourceMaps = options.useSourceMaps || g.useSourceMaps
  g.directionDown = options.directionDown || g.directionDown
  g.defaultOrganization = options.defaultOrganization || g.defaultOrganization
  g.logHistoryLength = options.logHistoryLength || g.logHistoryLength
  g.useShortcuts = options.useShortcuts || g.useShortcuts
  g.useVsLog = options.useVsLog || g.useVsLog
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
export { configLog, errorBoundary }
