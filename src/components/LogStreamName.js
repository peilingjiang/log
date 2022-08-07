import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'

import { logGroupInterface, _V } from '../constants.js'
import { removeArgsDescriptions } from '../methods/utils.js'

import Move from '../icons/move.svg'
import Relink from '../icons/relink-name.svg'
import Snap from '../icons/snap.svg'
import Copy from '../icons/copy.svg'

export default class LogStreamName extends Component {
  static get propTypes() {
    return {
      name: PropTypes.string.isRequired,
      logGroup: logGroupInterface.isRequired,
      paused: PropTypes.bool.isRequired,
      orientation: PropTypes.string.isRequired,
      canSnap: PropTypes.bool.isRequired,
      snap: PropTypes.bool.isRequired,
      streamGrabbing: PropTypes.bool.isRequired,
      handleDragAround: PropTypes.func.isRequired,
      handlePositionReset: PropTypes.func.isRequired,
      centerStagedId: PropTypes.string.isRequired,
      menuFunctions: PropTypes.object.isRequired,
    }
  }

  constructor(props) {
    super(props)

    this.ref = createRef()

    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleDbClick = this.handleDbClick.bind(this)
  }

  componentDidMount() {
    this.ref.current.addEventListener('dblclick', this.handleDbClick)
    this.ref.current.addEventListener('mousedown', this.handleMouseDown)
  }

  componentWillUnmount() {
    this.ref.current.removeEventListener('dblclick', this.handleDbClick)
    this.ref.current.removeEventListener('mousedown', this.handleMouseDown)
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps, this.props)
  }

  handleDbClick(e) {
    this.props.handlePositionReset(e)
  }

  handleMouseDown(e) {
    this.props.handleDragAround(e)
  }

  render() {
    const {
      name,
      logGroup,
      canSnap,
      snap,
      streamGrabbing,
      orientation,
      paused,
      centerStagedId,
      menuFunctions: { startSnap },
    } = this.props

    const attachedToElement = logGroup.element !== null

    return (
      <div
        className={`hyper-log-stream-name${
          streamGrabbing ? ' cursor-grabbing' : ' cursor-grab'
        }`}
        ref={this.ref}
        style={{
          writingMode: snap && orientation === _V ? 'vertical-lr' : undefined,
        }}
      >
        <div className="display-name">
          <RelinkName
            attachedToElement={attachedToElement}
            canSnap={canSnap}
            snap={snap}
            startSnap={startSnap}
          />
          <Move />{' '}
          <span
            style={{
              textDecoration: paused ? 'line-through' : undefined,
            }}
          >
            {name || 'logs'}
          </span>
        </div>

        {centerStagedId ? (
          <CenterStageNav centerStagedId={centerStagedId} />
        ) : null}
      </div>
    )
  }
}

/* -------------------------------------------------------------------------- */

class RelinkName extends Component {
  static get propTypes() {
    return {
      attachedToElement: PropTypes.bool.isRequired,
      canSnap: PropTypes.bool.isRequired,
      snap: PropTypes.bool.isRequired,
      startSnap: PropTypes.func.isRequired,
    }
  }

  render() {
    const { attachedToElement, canSnap, snap, startSnap } = this.props
    const activeIcon = attachedToElement || snap ? ' active-icon' : ''

    return (
      <div
        className={`hyper-log-stream-name-relink name-icon${activeIcon}`}
        onMouseDown={e => {
          startSnap(e, canSnap)
        }}
      >
        {snap ? <Snap /> : <Relink />}
      </div>
    )
  }
}

/* -------------------------------------------------------------------------- */

class CenterStageNav extends Component {
  static get propTypes() {
    return {
      centerStagedId: PropTypes.string.isRequired,
    }
  }

  render() {
    const { centerStagedId } = this.props
    return (
      <div className="center-stage-holder">
        <div className="center-stage-id-copy name-icon">
          <Copy />
        </div>
        <span className="font-bold">{parseCenterStagedId(centerStagedId)}</span>
      </div>
    )
  }
}

/* -------------------------------------------------------------------------- */

const parseCenterStagedId = centerStagedId => {
  return `.${removeArgsDescriptions(centerStagedId)
    .split('-')
    .slice(1)
    .join('.')}`
}
