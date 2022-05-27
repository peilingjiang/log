import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'

import Log from '../Log.js'

import { logGroupInterface } from '../constants.js'
import {
  assertExistence,
  getElementBounding,
  mergeBoundingRects,
} from '../methods/utils.js'
import { findPosition } from '../methods/findPosition.js'

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

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props)
  }

  optimizePosition() {
    const { logGroup, updateLogGroup } = this.props

    // Get stream element [display] size
    // by merging the bounding rects of all its children
    const mergedChildRects = mergeBoundingRects(
      [...this.ref.current.children].map(child => getElementBounding(child))
    )

    if (!assertExistence(logGroup.element)) return

    const optimizedPosition = findPosition(
      logGroup.element,
      this.ref.current,
      mergedChildRects
    )
    updateLogGroup(logGroup.groupId, {
      ...logGroup,
      bounding: optimizedPosition,
    })
  }

  expandStream() {}

  render() {
    const { logGroup } = this.props

    const logElements = []
    for (let log of logGroup.logs)
      logElements.push(
        <Log
          key={`${log.id} ${log.timestamp.now}`}
          log={log}
          groupBounding={logGroup.bounding}
        />
      )

    return (
      <div
        className="hyper-log-stream"
        style={{
          top: logGroup.bounding.top,
          left: logGroup.bounding.left,
        }}
        data-id={logGroup.groupId}
        ref={this.ref}
      >
        {logElements}
      </div>
    )
  }
}
