import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import App from './App.js'
import Button from './pages/Button.js'
// import reportWebVitals from './reportWebVitals'

import './css/main.scss'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<App />} />
        <Route path="/" element={<App />}>
          <Route path="button" element={<Button />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
