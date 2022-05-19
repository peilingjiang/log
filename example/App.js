import React, { Component } from 'react'
import { Outlet } from 'react-router-dom'

import '../src/index.js'

import './css/App.scss'

export default class App extends Component {
  render() {
    return (
      <>
        <header>HyperLog Examples</header>
        <Outlet />
      </>
    )
  }
}
