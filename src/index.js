import React from 'react'
import ReactDOM from 'react-dom/client'

import LogHost from './LogHost.js'

const logHostElement = document.createElement('div')
logHostElement.id = 'log-root'
document.body.appendChild(logHostElement)

const root = ReactDOM.createRoot(document.getElementById('log-root'))
root.render(<LogHost />)
