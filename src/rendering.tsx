import React from 'react'
import ReactDOM from 'react-dom/client'

import LogHost from './components/LogHost.js'

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
