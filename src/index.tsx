import React from 'react'
import ReactDOM from 'react-dom/client'

import { HyperLog, Timestamp } from './hyperLog'
import { logProcessor } from './log'
// import './objectLog.js'
import LogHost from './components/LogHost.js'

import './css/main.scss'

window.addEventListener('DOMContentLoaded', () => {
  const logHostElement = document.createElement('div')
  logHostElement.id = 'log-root'
  document.body.appendChild(logHostElement)

  const root = ReactDOM.createRoot(
    document.getElementById('log-root') as HTMLElement
  )

  // root.render(<LogHost />)

  root.render(
    <React.StrictMode>
      <LogHost />
    </React.StrictMode>
  )
})

/* -------------------------------------------------------------------------- */

declare global {
  interface Window {
    log: (...args: any[]) => HyperLog
    errorBoundary: (func: () => void) => void
  }
}

window.log = function (...args: any[]): HyperLog {
  // if (!g.access) return

  const timestamp: Timestamp = {
    now: performance.now(),
  }
  const error = new Error()

  const thisHyperLog = new HyperLog(args, timestamp, error)
  logProcessor.add(thisHyperLog)

  return thisHyperLog
}

window.errorBoundary = function (func: () => void): void {
  try {
    func()
  } catch (error) {
    window.log(error).level('error')
  }
}

/* -------------------------------------------------------------------------- */

window.console.log(
  '%cLog Right Here, Right Now! [HyperLog]\nTime to turn off the console : )',
  'background: #ff42a1; font-weight: bold; color: #fff; padding: 1rem;'
)

export default window.log
