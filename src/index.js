import React from 'react'
import ReactDOM from 'react-dom/client'

import './globalLogObject.js'
import './objectLog.js'
import LogHost from './LogHost.js'

import './css/main.scss'

const logHostElement = document.createElement('div')
logHostElement.id = 'log-root'
document.body.appendChild(logHostElement)

const root = ReactDOM.createRoot(document.getElementById('log-root'))

// root.render(<LogHost />)

root.render(
  <React.StrictMode>
    <LogHost />
  </React.StrictMode>
)

window.console.log(
  '%cLog Right Here, Right Now! [HyperLog]\nTime to turn off the console : )',
  'background: #ff42a1; font-weight: bold; color: #fff; padding: 1rem;'
)
