import React, { Component, PureComponent, createRef } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'

import { _V } from '../constants.js'
import { onlyNumbers, removeArgsDescriptions } from '../methods/utils.js'

import Move from '../icons/move.svg'
import Relink from '../icons/relink-name.svg'
import Snap from '../icons/snap.svg'
import Copy from '../icons/copy.svg'

export default class LogStreamName extends Component {
  static get propTypes() {
    return {
      name: PropTypes.string.isRequired,
      ////
      logGroupElement: PropTypes.instanceOf(HTMLElement),
      logGroupId: PropTypes.string.isRequired,
      ////
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
      logGroupElement,
      logGroupId,
      canSnap,
      snap,
      streamGrabbing,
      orientation,
      paused,
      centerStagedId,
      menuFunctions: { startSnap, setCenterStagedId },
    } = this.props

    const attachedToElement = logGroupElement !== null

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
          <CenterStageNav
            centerStagedId={centerStagedId}
            setCenterStagedId={setCenterStagedId}
            logGroupId={logGroupId}
          />
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

class CenterStageNav extends PureComponent {
  static get propTypes() {
    return {
      centerStagedId: PropTypes.string.isRequired,
      logGroupId: PropTypes.string.isRequired,
      setCenterStagedId: PropTypes.func.isRequired,
    }
  }

  constructor(props) {
    super(props)

    this.idRef = createRef()
    this.copyIconRef = createRef()
  }

  render() {
    const { centerStagedId, logGroupId, setCenterStagedId } = this.props

    const parsedIdParts = parseCenterStagedId(centerStagedId)
    const centerStagedSequence = parsedIdParts.slice(1)

    return (
      <div className="center-stage-holder">
        <div
          ref={this.copyIconRef}
          className="center-stage-id-copy name-icon"
          onClick={() => {
            // this.copyIconRef.current.style.background =
            //   _rootStyles.elementOutlineBound
            // setTimeout(() => {
            //   this.copyIconRef.current.style.background = ''
            // }, 300)

            navigator.clipboard.writeText(
              this.idRef.current.innerText.replace(/\n/g, '')
            )
          }}
        >
          <Copy />
        </div>
        <p ref={this.idRef} className="stage-id-nav">
          {centerStagedSequence.map((part, ind) => (
            <CenterStageNavItem
              key={`${centerStagedId}-${ind}`}
              centerStagedIdPart={removeArgsDescriptions(part)}
              ind={ind}
              isLastPart={ind === centerStagedSequence.length - 1}
              parsedIdParts={parsedIdParts}
              logGroupId={logGroupId}
              setCenterStagedId={setCenterStagedId}
            />
          ))}
        </p>
      </div>
    )
  }
}

const CenterStageNavItem = ({
  centerStagedIdPart,
  ind,
  isLastPart,
  parsedIdParts,
  logGroupId,
  setCenterStagedId,
}) => {
  return (
    <span
      className={`center-stage-id-part font-bold${
        isLastPart ? ' center-stage-id-last' : ''
      }`}
      onClick={() => {
        setCenterStagedId(
          logGroupId,
          reconstructCenterStagedId(ind, parsedIdParts)
        )
      }}
    >
      {parseIdPart(centerStagedIdPart)}
    </span>
  )
}

CenterStageNavItem.propTypes = {
  centerStagedIdPart: PropTypes.string.isRequired,
  ind: PropTypes.number.isRequired,
  isLastPart: PropTypes.bool.isRequired,
  parsedIdParts: PropTypes.array.isRequired,
  logGroupId: PropTypes.string.isRequired,
  setCenterStagedId: PropTypes.func.isRequired,
}

/* -------------------------------------------------------------------------- */

const parseCenterStagedId = centerStagedId => {
  return centerStagedId.split('-')
}

const parseIdPart = id => {
  return onlyNumbers(id) ? `[${id}]` : `.${id}`
}

const reconstructCenterStagedId = (indInSequence, parsedIdParts) => {
  // the second plus 1 is for uselessArgsPositionIndex
  return parsedIdParts.slice(0, indInSequence + 1 + 1).join('-')
}
