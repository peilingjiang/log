import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import App from './App.js'
import PagesList from './pages/PagesList.js'
import Button from './pages/Button.js'
import SmartPix from './pages/SmartPix.js'

import './css/main.scss'
// import reportWebVitals from './reportWebVitals'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <>
              <App />
              <PagesList />
            </>
          }
        />
        <Route path="/" element={<App />}>
          <Route path="button" element={<Button />} />
          <Route path="px" element={<SmartPix />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
