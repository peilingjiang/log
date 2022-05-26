import React, { Component } from 'react'
import { Link, Outlet } from 'react-router-dom'

import '../src/index.js'

import './css/App.scss'

export default class App extends Component {
  render() {
    return (
      <>
        <header>
          HyperLog Examples{' '}
          <Link
            to={'/'}
            style={{
              marginLeft: '1rem',
              fontSize: '0.875rem',
              color: '#999',
            }}
          >
            Home
          </Link>
        </header>
        <Outlet />
      </>
    )
  }
}
