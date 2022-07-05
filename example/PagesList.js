import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class PagesList extends Component {
  render() {
    return (
      <ul
        style={{
          margin: '3rem',
          listStyle: 'none',
          lineHeight: '150%',
        }}
      >
        <li>
          <Link to={'/types'}>Different Types</Link>
        </li>
        <li>
          <Link to={'/button'}>Button and Text</Link>
        </li>
        <li>
          <Link to={'/px'}>Display Numbers with Units</Link>
        </li>
        <li>
          <Link to={'/distance'}>Measuring Viewing Distances</Link>
        </li>
        <li>
          <Link to={'/tracking'}>Track Viewing Distances and Gaze</Link>
        </li>
      </ul>
    )
  }
}
