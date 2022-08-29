import { HyperLog, Timestamp } from './hyperLog'
import { logProcessor } from './logProcessor'
import './rendering'
// import './objectLog.js'

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

// function errorBoundary(func: () => void): void {
//   try {
//     func()
//   } catch (error) {
//     window.log(error).level('error')
//   }
// }

;(window as any).log = log
// window.errorBoundary = errorBoundary

/* -------------------------------------------------------------------------- */

window.console.log(
  '%cLog Right Here, Right Now! [HyperLog]\nTime to turn off the console : )',
  'background: #ff42a1; font-weight: bold; color: #fff; padding: 1rem;'
)

export { log as log }
