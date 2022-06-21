import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Expand from '../icons/expand.svg'
import Fold from '../icons/fold.svg'
import Relink from '../icons/relink.svg'

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
          {expand ? <Fold /> : <Expand />} {expand ? 'fold' : 'expand'}
        </p>
        <p
          className="stream-menu-item cursor-crosshair"
          onMouseDown={startRelink}
        >
          <Relink /> relink
        </p>
      </div>
    )
  }
}
