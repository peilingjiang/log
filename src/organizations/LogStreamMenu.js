import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class LogStreamMenu extends Component {
  static propTypes = {
    streamState: PropTypes.object,
    functions: PropTypes.object,
  }

  render() {
    const {
      streamState: { expand },
      functions: { expandStream, startRelink },
    } = this.props

    return (
      <div className="hyper-log-stream-menu">
        <p className="stream-menu-item" onClick={expandStream}>
          {expand ? 'fold' : 'expand'}
        </p>
        <p
          className="stream-menu-item cursor-crosshair"
          onMouseDown={startRelink}
        >
          relink
        </p>
      </div>
    )
  }
}
