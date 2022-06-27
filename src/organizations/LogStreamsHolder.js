import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'

import LogStream from './LogStream.js'
import { assertExistence } from '../methods/utils.js'
import { findPosition, pxWrap } from '../methods/findPosition.js'
import { logStreamGapToAnchorPx, _L, _R, _T } from '../constants.js'
import isEqual from 'react-fast-compare'
import { getSnapPosition } from '../methods/snap.js'

export default class LogStreamsHolder extends Component {
  static get propTypes() {
    return {
      element: PropTypes.instanceOf(Element),
      elementId: PropTypes.string,
      logGroups: PropTypes.array,
      updateLogGroup: PropTypes.func,
      updateLog: PropTypes.func,
      hostRef: PropTypes.object,
      ////
      snap: PropTypes.bool,
      snapElement: PropTypes.instanceOf(Element),
      snapElementId: PropTypes.string,
      snapAnchorSide: PropTypes.string,
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      hovered: false,
      grabbing: false,
      bounding: {
        left: '0px',
        right: '0px',
        top: '0px',
        bottom: '0px',
        verticalAlign: _T,
        horizontalAlign: _L,
      },
    }

    this.ref = createRef()

    this.handleStreamHover = this.handleStreamHover.bind(this)
    this.handleStreamDragAround = this.handleStreamDragAround.bind(this)
  }

  componentDidMount() {
    if (this.props.snap) {
      this.snapToPosition()
    } else this.optimizePosition()
  }

  componentDidUpdate() {
    if (this.props.snap) this.snapToPosition()
    else this.optimizePosition()

    // // reset height
    // if (this.ref.current)
    //   this.ref.current.style.height = pxWrap(this._getChildrenHeightsSum())
    // // scroll to the bottom
    // if (this.logsWrapperRef.current && this.state.expand)
    //   this.logsWrapperRef.current.scrollTop =
    //     this.logsWrapperRef.current.scrollHeight
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state)
  }

  /* -------------------------------------------------------------------------- */

  optimizePosition() {
    const { element, updateLogGroup } = this.props

    if (!assertExistence(element)) {
      // TODO find position on the page
      this.setState({
        bounding: {
          left: '',
          right: pxWrap(logStreamGapToAnchorPx),
          top: pxWrap(logStreamGapToAnchorPx),
          bottom: '',
          verticalAlign: _T,
          horizontalAlign: _R,
        },
      })
      // update groups
      this.props.logGroups.forEach(logGroup => {
        updateLogGroup(logGroup.groupId, {
          ...logGroup,
          bounding: {
            ...logGroup.bounding,
            verticalAlign: _T,
            horizontalAlign: _R,
          },
        })
      })
    } else {
      const optimizedPosition = findPosition(element, this.ref.current)
      this.setState({
        bounding: optimizedPosition,
      })
      // update groups
      this.props.logGroups.forEach(logGroup => {
        updateLogGroup(logGroup.groupId, {
          ...logGroup,
          bounding: {
            ...logGroup.bounding,
            verticalAlign: optimizedPosition.verticalAlign,
            horizontalAlign: optimizedPosition.horizontalAlign,
          },
        })
      })
    }
  }

  snapToPosition() {
    const { snapElement, snapAnchorSide } = this.props

    const snapPosition = getSnapPosition(
      snapElement,
      snapAnchorSide,
      this.ref.current
    )
    this.setState({
      bounding: {
        left: snapPosition.left,
        right: snapPosition.right,
        top: snapPosition.top,
        bottom: snapPosition.bottom,
        verticalAlign: snapPosition.verticalAlign,
        horizontalAlign: snapPosition.horizontalAlign,
      },
    })
  }

  /* -------------------------------------------------------------------------- */

  handleStreamHover(newState = true) {
    this.setState({ hovered: newState })
  }

  handleStreamDragAround(newState = true) {
    this.setState({ grabbing: newState })
  }

  /* -------------------------------------------------------------------------- */

  render() {
    const { elementId, logGroups, updateLogGroup, updateLog, hostRef } =
      this.props
    const { hovered, grabbing, bounding } = this.state

    return (
      <div
        className={`hyper-log-streams-holder${
          hovered || grabbing ? ' up-front' : ''
        }`}
        ref={this.ref}
        style={{
          left: bounding.left,
          top: bounding.top,
          right: bounding.right,
          bottom: bounding.bottom,
          alignItems:
            bounding.horizontalAlign === _L ? 'flex-start' : 'flex-end',
          justifyContent:
            bounding.verticalAlign === _T ? 'flex-start' : 'flex-end',
        }}
        data-element-id={elementId}
      >
        {logGroups
          .filter(logGroup => !logGroup.deleted)
          .map(logGroup => (
            <LogStream
              key={logGroup.groupId}
              logGroup={logGroup}
              updateLogGroup={updateLogGroup}
              updateLog={updateLog}
              hostRef={hostRef}
              handleStreamHover={this.handleStreamHover}
              handleStreamDragAround={this.handleStreamDragAround}
            />
          ))}
      </div>
    )
  }
}
