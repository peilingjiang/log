import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { logGroupInterface } from '../constants.js'
import {
  assertNumber,
  assertString,
  checkForUnit,
  _checkIfContainsValidUnit,
  _unitIsValid,
} from '../methods/utils.js'

import Expand from '../icons/expand.svg'
import Fold from '../icons/fold.svg'
import Relink from '../icons/relink.svg'
import Pause from '../icons/pause.svg'
import Restart from '../icons/restart.svg'
import Delete from '../icons/delete.svg'

import Shape from '../icons/shape.svg'
import Text from '../icons/text.svg'
import Snap from '../icons/snap.svg'
import Unsnap from '../icons/unsnap.svg'

export default class LogStreamMenu extends Component {
  static propTypes = {
    logGroup: logGroupInterface,
    streamState: PropTypes.object,
    functions: PropTypes.object,
    ////
    snap: PropTypes.bool,
  }

  componentDidMount() {}

  render() {
    const {
      logGroup,
      streamState: { expand },
      functions: {
        expandStream,
        startRelink,
        pauseStream,
        deleteStream,
        shapeIt,
        startSnap,
        undoSnap,
      },
    } = this.props
    const {
      logGroup: { logs, format },
      snap,
    } = this.props

    const isShape = format === 'shape'

    return (
      <div className="hyper-log-stream-menu">
        <p className="stream-menu-item" onClick={expandStream}>
          {expand ? <Fold /> : <Expand />} {expand ? 'fold' : 'expand'}
        </p>

        <p
          className="stream-menu-item cursor-crosshair"
          onMouseDown={startRelink}
        >
          <Relink /> attach
        </p>

        <p className="stream-menu-item" onMouseDown={pauseStream}>
          {logGroup.paused ? <Restart /> : <Pause />}{' '}
          {logGroup.paused ? 'resume' : 'pause'}
        </p>

        <p className="stream-menu-item" onMouseDown={deleteStream}>
          <Delete /> delete
        </p>

        {/* special items */}
        {isShape && (
          <p
            key={'menu-snap'}
            className="stream-menu-item special-menu-item cursor-crosshair"
            onMouseDown={startSnap}
          >
            <Snap /> snap
          </p>
        )}
        {isShape && snap && (
          <p
            key={'menu-unsnap'}
            className="stream-menu-item"
            onMouseDown={undoSnap}
          >
            <Unsnap /> unsnap
          </p>
        )}

        {checkForUnit(logs[logs.length - 1]) && (
          <p
            className="stream-menu-item special-menu-item"
            onClick={() => {
              shapeIt(!isShape ? 'shape' : 'text')
            }}
          >
            {!isShape ? <Shape /> : <Text />} {!isShape ? 'shape' : 'text'}
          </p>
        )}
      </div>
    )
  }
}
