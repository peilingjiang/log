import React, { Component } from 'react'
import { Link, Outlet } from 'react-router-dom'

// ! load HyperLog
import '../src/index.tsx'

import './css/App.scss'

setLog({
  access: true,
})

export default class App extends Component {
  render() {
    return (
      <>
        <header id="examples-header">
          HyperLog Examples{' '}
          <Link
            to={'/'}
            id="home-link"
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
