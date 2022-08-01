import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './css/main.scss'
// import reportWebVitals from './reportWebVitals'

import App from './App.js'
import PagesList from './PagesList.js'
import Types from './pages/Types.js'
import Button from './pages/Button.js'
import SmartPix from './pages/SmartPix.js'
import AdHocPositions from './pages/adHocPositions.js'
import ViewDist from './pages/ViewDist.js'
import Tracking from './pages/Tracking.js'
import { Here } from './pages/here.js'

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
          <Route path="types" element={<Types />} />
          <Route path="button" element={<Button />} />
          <Route path="px" element={<SmartPix />} />
          <Route path="adhoc" element={<AdHocPositions />} />
          <Route path="distance" element={<ViewDist />} />
          <Route path="tracking" element={<Tracking />} />
          <Route path="here" element={<Here />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
