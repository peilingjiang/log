import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { logGroupInterface } from '../constants.js'

import Expand from '../icons/expand.svg'
import Fold from '../icons/fold.svg'
import Relink from '../icons/relink.svg'
import Pause from '../icons/pause.svg'
import Restart from '../icons/restart.svg'
import Delete from '../icons/delete.svg'

export default class LogStreamMenu extends Component {
  static propTypes = {
    logGroup: logGroupInterface,
    streamState: PropTypes.object,
    functions: PropTypes.object,
  }

  render() {
    const {
      logGroup,
      streamState: { expand },
      functions: { expandStream, startRelink, pauseStream, deleteStream },
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

        <p className="stream-menu-item" onMouseDown={pauseStream}>
          {logGroup.paused ? <Restart /> : <Pause />}{' '}
          {logGroup.paused ? 'resume' : 'pause'}
        </p>

        <p className="stream-menu-item" onMouseDown={deleteStream}>
          <Delete /> delete
        </p>
      </div>
    )
  }
}
