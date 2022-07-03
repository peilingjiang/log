import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'

import { _V } from '../constants.js'

import Move from '../icons/move.svg'
import isEqual from 'react-fast-compare'
import { removeArgsDescriptions } from '../methods/utils.js'

export default class LogStreamName extends Component {
  static get propTypes() {
    return {
      name: PropTypes.string.isRequired,
      paused: PropTypes.bool.isRequired,
      orientation: PropTypes.string.isRequired,
      snap: PropTypes.bool.isRequired,
      streamGrabbing: PropTypes.bool.isRequired,
      handleDragAround: PropTypes.func.isRequired,
      handlePositionReset: PropTypes.func.isRequired,
      centerStagedId: PropTypes.string.isRequired,
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
    const { name, snap, streamGrabbing, orientation, paused, centerStagedId } =
      this.props
    return (
      <p
        className={`hyper-log-stream-name${
          streamGrabbing ? ' cursor-grabbing' : ' cursor-grab'
        }`}
        ref={this.ref}
        style={{
          writingMode: snap && orientation === _V ? 'vertical-lr' : undefined,
        }}
      >
        {/* {!snap && <Move />} {name || 'logs'} */}
        <Move />{' '}
        <span
          style={{
            textDecoration: paused ? 'line-through' : undefined,
          }}
        >
          {name || 'logs'}
          {centerStagedId ? (
            <>
              <br />
              <span className="font-bold">
                {parseCenterStagedId(centerStagedId)}
              </span>
            </>
          ) : (
            ''
          )}
        </span>
      </p>
    )
  }
}

const parseCenterStagedId = centerStagedId => {
  return `.${removeArgsDescriptions(centerStagedId).replace(/-/g, '.')}`
}
