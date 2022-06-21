import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'

import { logGroupInterface } from '../constants.js'
import { pxTrim, pxWrap } from '../methods/findPosition.js'

import Move from '../icons/move.svg'

export default class LogStreamName extends Component {
  static get propTypes() {
    return {
      name: PropTypes.string,
      groupId: PropTypes.string,
      logGroup: logGroupInterface,
      updateLogGroup: PropTypes.func,
      streamRef: PropTypes.object,
      ////
      snap: PropTypes.bool,
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

  handleDbClick(e) {
    const { groupId, logGroup, updateLogGroup, snap } = this.props

    e.preventDefault()
    e.stopPropagation()

    // if (snap) return

    updateLogGroup(groupId, {
      ...logGroup,
      bounding: {
        ...logGroup.bounding,
        left: pxWrap(0),
        top: pxWrap(0),
      },
    })
  }

  handleMouseDown(e) {
    const { groupId, logGroup, updateLogGroup, streamRef, snap } = this.props

    e.preventDefault()
    e.stopPropagation()

    // if (snap) return

    if (streamRef.current) {
      streamRef.current.classList.add('up-front')
      streamRef.current.classList.add('in-grabbing')
    }
    if (streamRef.current.parentNode)
      streamRef.current.parentNode.classList.add('up-front')
    e.target.classList.replace('cursor-grab', 'cursor-grabbing')

    const startPos = {
      x: e.clientX,
      y: e.clientY,
      left: pxTrim(logGroup.bounding.left),
      top: pxTrim(logGroup.bounding.top),
    }

    const handleMouseMove = e => {
      e.preventDefault()
      e.stopPropagation()

      const { clientX, clientY } = e

      updateLogGroup(groupId, {
        ...logGroup,
        bounding: {
          ...logGroup.bounding,
          left: pxWrap(startPos.left + clientX - startPos.x),
          top: pxWrap(startPos.top + clientY - startPos.y),
        },
      })
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', function _() {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', _)

      if (streamRef.current) {
        // streamRef.current.classList.remove('up-front')
        streamRef.current.classList.remove('in-grabbing')
      }
      // if (streamRef.current.parentNode)
      //   streamRef.current.parentNode.classList.remove('up-front')
      e.target.classList.replace('cursor-grabbing', 'cursor-grab')
    })
  }

  render() {
    const { name, snap } = this.props
    return (
      <p
        className={`hyper-log-stream-name${
          snap ? ' cursor-grab' : ' cursor-grab'
        }`}
        ref={this.ref}
      >
        {/* {!snap && <Move />} {name || 'logs'} */}
        <Move /> {name || 'logs'}
      </p>
    )
  }
}
