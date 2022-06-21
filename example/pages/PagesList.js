import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class PagesList extends Component {
  render() {
    return (
      <ul
        style={{
          margin: '3rem',
          listStyle: 'none',
        }}
      >
        <li>
          <Link to={'/button'}>Button and Text</Link>
        </li>
        <li>
          <Link to={'/px'}>Display Numbers with Units</Link>
        </li>
      </ul>
    )
  }
}
