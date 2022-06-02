import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'

import Log from '../Log.js'

import { logGroupInterface } from '../constants.js'
import {
  assertExistence,
  getElementBounding,
  // mergeBoundingRects,
} from '../methods/utils.js'
import { findPosition, pxWrap } from '../methods/findPosition.js'

// for augmented logs

export default class LogStream extends Component {
  static get propTypes() {
    return {
      logGroup: logGroupInterface,
      updateLogGroup: PropTypes.func,
    }
  }

  constructor(props) {
    super(props)

    this.ref = createRef()
  }

  componentDidMount() {
    this.optimizePosition()
  }

  componentDidUpdate() {
    this.optimizePosition()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props)
  }

  optimizePosition() {
    const { logGroup, updateLogGroup } = this.props

    if (!assertExistence(logGroup.element)) return

    const optimizedPosition = findPosition(
      logGroup.element,
      this.ref.current,
      this._getChildRects()
    )

    updateLogGroup(logGroup.groupId, {
      ...logGroup,
      bounding: optimizedPosition,
    })
  }

  expandStream() {}

  /* -------------------------------------------------------------------------- */

  _getChildRects() {
    // Get stream element [display] size
    // by merging the bounding rects of all its children
    // return mergeBoundingRects(
    //   [...this.ref.current.children].map(child => getElementBounding(child))
    // )
    // ...
    // get the rect of the most recent one
    return getElementBounding(
      this.ref.current.children[this.ref.current.children.length - 1]
    )
  }

  /* -------------------------------------------------------------------------- */

  render() {
    const { logGroup } = this.props

    const logElements = []
    let orderReversed = logGroup.logs.length
    for (let log of logGroup.logs) {
      logElements.push(
        <Log
          key={`${log.id} ${log.timestamp.now}`}
          log={log}
          groupBounding={logGroup.bounding}
          orderReversed={--orderReversed}
        />
      )
    }

    return (
      <div
        className="hyper-log-stream"
        style={{
          top: logGroup.bounding.top,
          left: logGroup.bounding.left,
          height: this.ref.current
            ? pxWrap(this._getChildRects().height)
            : null,
        }}
        data-id={logGroup.groupId}
        ref={this.ref}
      >
        {logElements}
      </div>
    )
  }
}
