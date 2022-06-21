import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'

import Log from '../Log.js'

import { logGroupInterface, _L, _rootStyles } from '../constants.js'
import {
  assertExistence,
  bindableElement,
  getElementBounding,
  idFromString,
  stringifyDOMElement,
  // mergeBoundingRects,
} from '../methods/utils.js'
import { findPosition, pxWrap } from '../methods/findPosition.js'
import LogStreamMenu from './LogStreamMenu.js'
import LeaderLine from 'leader-line-new'

// for augmented logs

export default class LogStream extends Component {
  static get propTypes() {
    return {
      logGroup: logGroupInterface,
      updateLogGroup: PropTypes.func,
      updateLog: PropTypes.func,
      hostRef: PropTypes.object,
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      expand: false,
    }

    this.ref = createRef()
    this.logsWrapperRef = createRef()

    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseOut = this.handleMouseOut.bind(this)

    this.menuFunctions = {
      expandStream: this.expandStream.bind(this),
      startRelink: this.startRelink.bind(this),
    }
  }

  componentDidMount() {
    // this.optimizePosition()
  }

  componentDidUpdate() {
    // this.optimizePosition()
    // // reset height
    // if (this.ref.current)
    //   this.ref.current.style.height = pxWrap(this._getChildrenHeightsSum())
    // scroll to the bottom
    if (this.logsWrapperRef.current && this.state.expand)
      this.logsWrapperRef.current.scrollTop =
        this.logsWrapperRef.current.scrollHeight
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state)
  }

  // optimizePosition() {
  //   const { logGroup, updateLogGroup } = this.props

  //   if (!assertExistence(logGroup.element)) {
  //     return
  //   }

  //   const optimizedPosition = findPosition(
  //     logGroup.element,
  //     this.ref.current,
  //     this._getChildRects()
  //   )

  //   updateLogGroup(logGroup.groupId, {
  //     ...logGroup,
  //     bounding: optimizedPosition,
  //   })
  // }

  /* -------------------------------------------------------------------------- */

  expandStream() {
    this.setState({ expand: !this.state.expand })
  }

  startRelink(e) {
    const { logGroup, updateLogGroup, updateLog, hostRef } = this.props
    if (hostRef.current) {
      const streamRef = this.ref
      // make this stream the current active stream
      streamRef.current.classList.add('stream-current')
      // hide hyper log elements from pointer events
      hostRef.current.classList.add('no-pointer-events')

      const sudoPointerElement = document.createElement('div')
      sudoPointerElement.classList.add('sudo-pointer-element')
      sudoPointerElement.id = 'sudo-pointer-element'
      sudoPointerElement.style.top = pxWrap(e.clientY)
      sudoPointerElement.style.left = pxWrap(e.clientX)

      hostRef.current.appendChild(sudoPointerElement)

      const leaderLine = new LeaderLine(
        // this.ref.current,
        LeaderLine.pointAnchor(e.target),
        sudoPointerElement,
        // LeaderLine.pointAnchor(sudoPointerElement, {
        //   x: '50%',
        //   y: '50%',
        // }),
        {
          path: 'straight',
          endPlug: 'arrow2',
        }
      )
      // leaderLine.size = 3
      leaderLine.color = _rootStyles.elementOutlineBound

      // ! move
      function _mousemove(event) {
        sudoPointerElement.style.top = pxWrap(event.clientY)
        sudoPointerElement.style.left = pxWrap(event.clientX)
        leaderLine.position()

        // highlight the element
        document.body.classList.remove('forced-outline-bound-inside')
        const highlightedElements = document.querySelectorAll(
          '.forced-outline-bound'
        )
        for (let i = 0; i < highlightedElements.length; i++)
          if (!event.target.isSameNode(highlightedElements[i]))
            highlightedElements[i].classList.remove('forced-outline-bound')

        if (bindableElement(event.target))
          event.target.classList.add('forced-outline-bound')
        else {
          document.body.classList.add('forced-outline-bound-inside')
        }
      }
      document.addEventListener('mousemove', _mousemove)

      // ! up
      document.addEventListener('mouseup', function _(e) {
        document.removeEventListener('mouseup', _)
        document.removeEventListener('mousemove', _mousemove)

        streamRef.current.classList.remove('stream-current')
        hostRef.current.classList.remove('no-pointer-events')
        document.body.classList.remove('forced-outline-bound-inside')
        ;[...document.querySelectorAll('.forced-outline-bound')].forEach(el => {
          el.classList.remove('forced-outline-bound')
        })

        if (sudoPointerElement) sudoPointerElement.remove()
        leaderLine.remove()

        // check if there's a new element to link
        const newElement = bindableElement(e.target) ? e.target : null

        // update stream element to e.target
        updateLogGroup(logGroup.groupId, {
          ...logGroup,
          element: newElement,
          groupElementId: idFromString(stringifyDOMElement(newElement)),
          followType: newElement ? 'stick' : 'independent',
        })
        for (let log of logGroup.logs) {
          updateLog(logGroup.id, log.id, {
            ...log,
            element: newElement,
          })
        }
      })
    }
  }

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

  _getChildrenHeightsSum() {
    return this.ref.current
      ? [...this.ref.current.children]
          .filter(ele => ele.classList.contains('logs-wrapper'))
          .reduce((acc, child) => acc + child.offsetHeight, 0)
      : 0
  }

  /* -------------------------------------------------------------------------- */

  handleMouseEnter(e) {
    this.ref.current.classList.add('stream-hovered')

    // add outline to the target element
    if (this.props.logGroup.element)
      this.props.logGroup.element.classList.add('forced-outline-bound')
  }

  handleMouseOut(e) {
    this.ref.current.classList.remove('stream-hovered')

    if (this.props.logGroup.element)
      this.props.logGroup.element.classList.remove('forced-outline-bound')
  }

  /* -------------------------------------------------------------------------- */

  render() {
    const { expand } = this.state
    const {
      logGroup: { name, logs, bounding, groupId },
    } = this.props

    const logElements = []
    let orderReversed = logs.length
    for (let log of logs) {
      logElements.push(
        <Log
          key={`${log.id} ${log.timestamp.now}`}
          log={log}
          groupBounding={bounding}
          orderReversed={--orderReversed}
          logsCount={logs.length}
          expandedLog={expand}
        />
      )
    }

    return (
      <div
        className={`hyper-log-stream${expand ? ' stream-expand' : ''}`}
        style={{
          alignItems:
            bounding.horizontalAlign === _L ? 'flex-start' : 'flex-end',
        }}
        data-id={groupId}
        ref={this.ref}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseOut}
      >
        {name && <p className="hyper-log-stream-name">{name}</p>}
        <LogStreamMenu
          functions={this.menuFunctions}
          streamState={this.state}
        />
        <div className="logs-wrapper" ref={this.logsWrapperRef}>
          {logElements}
        </div>
      </div>
    )
  }
}
