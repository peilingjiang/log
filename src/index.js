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
root.render(<LogHost />)
