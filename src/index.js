import React from 'react'
import ReactDOM from 'react-dom/client'

import LogHost from './LogHost.js'

const logHostElement = document.createElement('div')
logHostElement.id = 'log-host'
document.body.appendChild(logHostElement)

const root = ReactDOM.createRoot(document.getElementById('log-host'))
root.render(<LogHost />)
