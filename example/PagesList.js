import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class PagesList extends Component {
  render() {
    return (
      <ul
        style={{
          fontSize: '1.6em',
          margin: '3rem',
          listStyle: 'none',
          lineHeight: '170%',
          textDecoration: 'none',
        }}
      >
        <li>
          <Link to={'/types'}>💡 Everything</Link>
        </li>
        <li>
          <Link to={'/button'}>🖼️ Basic Components - Button and Text</Link>
        </li>
        <li>
          <Link to={'/px'}>📊 Shapes and Snapping</Link>
        </li>
        <li>
          <Link to={'/adhoc'}>📏 Show Offsets - Ad hoc Module</Link>
        </li>
        <li>
          <Link to={'/distance'}>
            🍱 Explore Objects I - Measure Viewing Distances
          </Link>
        </li>
        <li>
          <Link to={'/tracking'}>
            🍱 Explore Objects II - Track Viewing Distances and Gaze
          </Link>
        </li>
        <li>
          <Link to={'/here'}>🎯 Reachability - Here and There</Link>
        </li>
      </ul>
    )
  }
}
