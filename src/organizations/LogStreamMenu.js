import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'

import { _Aug } from '../constants.js'

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
    paused: PropTypes.bool.isRequired,
    format: PropTypes.string.isRequired,
    orientation: PropTypes.string.isRequired,
    streamState: PropTypes.object.isRequired,
    menuFunctions: PropTypes.object.isRequired,
    ////
    snap: PropTypes.bool.isRequired,
    ////
    useShape: PropTypes.bool.isRequired,
    ////
    organization: PropTypes.string.isRequired,
  }

  componentDidMount() {}

  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps, this.props)
  }

  render() {
    const {
      paused,
      format,
      orientation,
      useShape,
      organization,
      streamState: { expand },
      menuFunctions: {
        expandStream,
        startRelink,
        pauseStream,
        deleteStream,
        shapeIt,
        startSnap,
        undoSnap,
      },
      snap,
    } = this.props

    const isShape = format === 'shape'
    const isAugmented = organization === _Aug

    const specialItems = []

    if (useShape) {
      specialItems.push(
        <p
          key={'shape'}
          className="stream-menu-item special-menu-item"
          onClick={() => {
            shapeIt(!isShape ? 'shape' : 'text')
          }}
          title={isShape ? 'show as text' : 'show as shape'}
        >
          {!isShape ? <Shape /> : <Text />}
          <span>{!isShape ? 'shape' : 'text'}</span>
        </p>
      )
    }

    if (isShape && isAugmented) {
      specialItems.push(
        !snap ? (
          <p
            key={'menu-snap'}
            className={`stream-menu-item special-menu-item cursor-crosshair`}
            onMouseDown={startSnap}
            title="snap to element point"
          >
            <Snap />
            <span>snap</span>
          </p>
        ) : (
          <p
            key={'menu-snap'}
            className="stream-menu-item special-menu-item"
            onMouseDown={undoSnap}
            title="unsnap"
          >
            <Unsnap />
            <span>unsnap</span>
          </p>
        )
      )
    }

    return (
      <div className={`hyper-log-stream-menu stream-menu-${orientation}`}>
        <p
          className="stream-menu-item menu-expand-item"
          onClick={expandStream}
          title="expand"
        >
          {/* {expand ? <Fold /> : <Expand />} {expand ? 'fold' : 'expand'} */}
          {expand ? <Fold /> : <Expand />}
          <span>{expand ? 'fold' : 'expand'}</span>
        </p>

        {isAugmented && (
          <p
            className="stream-menu-item cursor-crosshair"
            onMouseDown={startRelink}
            title="attach to element"
          >
            {/* <Relink /> attach */}
            <Relink />
            <span>attach</span>
          </p>
        )}

        {/* -------------------------------------------------------------------------- */}
        {/* special items */}
        {specialItems.length ? specialItems : null}
        {/* -------------------------------------------------------------------------- */}

        {isAugmented && (
          <p
            key={'menu-pause'}
            className={`stream-menu-item menu-${
              paused ? 'resume' : 'pause'
            }-item`}
            onMouseDown={pauseStream}
            title={paused ? 'resume' : 'pause'}
          >
            {paused ? <Restart /> : <Pause />}
            <span>{paused ? 'resume' : 'pause'}</span>
          </p>
        )}

        {isAugmented && (
          <p
            key={'menu-delete'}
            className="stream-menu-item menu-delete-item"
            onMouseDown={deleteStream}
            title="delete"
          >
            <Delete />
            <span>delete</span>
            {/* <Delete /> */}
          </p>
        )}
      </div>
    )
  }
}
