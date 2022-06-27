import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'
import LeaderLine from 'leader-line-new'

import Log from '../components/Log.js'

import {
  boundingDefault,
  logGroupInterface,
  _H,
  _L,
  _R,
  _rootStyles,
  _T,
} from '../constants.js'
import {
  bindableElement,
  checkForUnit,
  getElementBounding,
  idFromString,
  stringifyDOMElement,
  // mergeBoundingRects,
} from '../methods/utils.js'
import { pxTrim, pxWrap } from '../methods/findPosition.js'
import LogStreamMenu from './LogStreamMenu.js'
import LogStreamName from '../components/LogStreamName.js'
import ShapeLog from '../components/ShapeLog.js'
import {
  defaultBoundingAlignmentFromSnapSide,
  findNearestSnapPoint,
  _getAlignment,
} from '../methods/snap.js'

// for augmented logs

export default class LogStream extends Component {
  static get propTypes() {
    return {
      logGroup: logGroupInterface,
      updateLogGroup: PropTypes.func,
      updateLog: PropTypes.func,
      hostRef: PropTypes.object,
      ////
      handleStreamHover: PropTypes.func,
      handleStreamDragAround: PropTypes.func,
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      expand: false,
      hovered: false,
      grabbing: false,
      current: false,
    }
    this.inExternalOperation = false

    this.ref = createRef()
    this.logsWrapperRef = createRef()

    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseOut = this.handleMouseOut.bind(this)
    this.handleDragAround = this.handleDragAround.bind(this)
    this.handlePositionReset = this.handlePositionReset.bind(this)

    this.menuFunctions = {
      expandStream: this.expandStream.bind(this),
      startRelink: this.startRelink.bind(this),
      pauseStream: this.pauseStream.bind(this),
      deleteStream: this.deleteStream.bind(this),
      shapeIt: this.shapeIt.bind(this),
      startSnap: this.startSnap.bind(this),
      undoSnap: this.undoSnap.bind(this),
    }
  }

  componentDidMount() {}

  componentDidUpdate() {
    // scroll to the bottom
    if (this.logsWrapperRef.current && this.state.expand)
      this.logsWrapperRef.current.scrollTop =
        this.logsWrapperRef.current.scrollHeight
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      // (!nextProps.logGroup.paused || !this.props.logGroup.paused) &&
      !isEqual(nextProps, this.props) || !isEqual(nextState, this.state)
    )
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
      // make this stream the current active stream
      this.setState({ current: true })
      const streamSetState = this.setState.bind(this)
      // hide hyper log elements from pointer events
      hostRef.current.classList.add('no-pointer-events')

      const sudoPointerElement = document.createElement('div')
      sudoPointerElement.classList.add('sudo-pointer-element')
      sudoPointerElement.id = 'sudo-pointer-element'
      sudoPointerElement.style.top = pxWrap(e.clientY)
      sudoPointerElement.style.left = pxWrap(e.clientX)

      hostRef.current.appendChild(sudoPointerElement)

      const leaderLine = new LeaderLine(
        LeaderLine.pointAnchor(e.target),
        sudoPointerElement,
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

        streamSetState({ current: false })
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
          bounding: boundingDefault,
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

  pauseStream() {
    const { logGroup, updateLogGroup } = this.props
    updateLogGroup(logGroup.groupId, {
      ...logGroup,
      paused: !logGroup.paused,
    })
  }

  deleteStream() {
    const { logGroup, updateLogGroup } = this.props

    if (logGroup.element)
      logGroup.element.classList.remove('forced-outline-bound')

    updateLogGroup(logGroup.groupId, {
      ...logGroup,
      deleted: true,
    })
  }

  // special ones

  shapeIt(newFormat) {
    const { logGroup, updateLogGroup } = this.props

    const unsnapExtraState =
      newFormat === 'text' ? this._unsnapState(logGroup) : {}

    const newGroup = {
      ...logGroup,
      format: newFormat,
      ...unsnapExtraState,
    }

    updateLogGroup(logGroup.groupId, newGroup)
  }

  startSnap(e) {
    const { logGroup, updateLogGroup, hostRef } = this.props
    const undoSnap = this.undoSnap.bind(this)

    if (hostRef.current) {
      // make this stream the current active stream
      this.setState({ current: true })
      const streamSetState = this.setState.bind(this)
      // hide hyper log elements from pointer events
      hostRef.current.classList.add('no-pointer-events')

      const sudoPointerElement = document.createElement('div')
      sudoPointerElement.classList.add('sudo-pointer-element')
      sudoPointerElement.id = 'sudo-pointer-element'
      sudoPointerElement.style.top = pxWrap(e.clientY)
      sudoPointerElement.style.left = pxWrap(e.clientX)

      hostRef.current.appendChild(sudoPointerElement)

      const leaderLine = new LeaderLine(
        LeaderLine.pointAnchor(e.target),
        sudoPointerElement,
        {
          path: 'straight',
          endPlug: 'arrow2',
        }
      )
      // leaderLine.size = 3
      leaderLine.color = _rootStyles.elegantRed

      let snapElement, snapAnchorPoint

      // ! move
      function _mousemove(event) {
        const nearest = findNearestSnapPoint(event.clientX, event.clientY)

        // document.body.classList.remove('forced-outline-bound-inside')
        const highlightedElements = document.querySelectorAll(
          '.forced-outline-bound-mid'
        )
        for (let i = 0; i < highlightedElements.length; i++)
          if (!event.target.isSameNode(highlightedElements[i]))
            highlightedElements[i].classList.remove('forced-outline-bound-mid')

        if (nearest) {
          const { nearestPointElement, nearestPoint } = nearest
          sudoPointerElement.style.top = pxWrap(nearestPoint.y)
          sudoPointerElement.style.left = pxWrap(nearestPoint.x)

          snapElement = nearestPointElement
          snapAnchorPoint = nearestPoint

          nearestPointElement.classList.add('forced-outline-bound-mid')
          sudoPointerElement.classList.add('show-sudo-pointer')
        } else {
          sudoPointerElement.style.top = pxWrap(event.clientY)
          sudoPointerElement.style.left = pxWrap(event.clientX)
          snapElement = snapAnchorPoint = null
          sudoPointerElement.classList.remove('show-sudo-pointer')
        }

        leaderLine.position()

        // highlight the element
        // document.body.classList.add('forced-outline-bound-inside')
      }

      document.addEventListener('mousemove', _mousemove)

      // ! up
      document.addEventListener('mouseup', function _(e) {
        document.removeEventListener('mouseup', _)
        document.removeEventListener('mousemove', _mousemove)

        streamSetState({ current: false })
        hostRef.current.classList.remove('no-pointer-events')
        // document.body.classList.remove('forced-outline-bound-inside')
        ;[...document.querySelectorAll('.forced-outline-bound-mid')].forEach(
          el => {
            el.classList.remove('forced-outline-bound-mid')
          }
        )

        if (sudoPointerElement) sudoPointerElement.remove()
        leaderLine.remove()

        // check if there's an element to snap to
        if (snapElement) {
          // update stream element to e.target
          const snapBounding = defaultBoundingAlignmentFromSnapSide(
            snapAnchorPoint.side
          ) // TODO allow change
          updateLogGroup(logGroup.groupId, {
            ...logGroup,
            snap: true,
            snapElement: snapElement,
            snapElementId: idFromString(
              stringifyDOMElement(snapElement) + ' ' + snapAnchorPoint.side
            ),
            snapAnchorSide: snapAnchorPoint.side,
            bounding: {
              ...logGroup.bounding,
              left: pxWrap(0),
              top: pxWrap(0),
              horizontalAlign: snapBounding.horizontalAlign,
              verticalAlign: snapBounding.verticalAlign,
            },
            orientation: snapBounding.orientation,
          })
        } else {
          undoSnap()
        }
      })
    }
  }

  undoSnap() {
    const { logGroup, updateLogGroup } = this.props
    updateLogGroup(logGroup.groupId, {
      ...logGroup,
      ...this._unsnapState(logGroup),
    })
  }

  _unsnapState(logGroup) {
    return {
      snap: false,
      snapElement: null,
      snapAnchorSide: _R,
      bounding: {
        ...logGroup.bounding,
        left: pxWrap(0),
        top: pxWrap(0),
        horizontalAlign: _L,
        verticalAlign: _T,
      },
      orientation: _H,
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

  handleMouseEnter() {
    // this.ref.current.classList.add('stream-hovered')
    // this.ref.current.classList.add('up-front')
    // if (this.ref.current.parentNode)
    //   this.ref.current.parentNode.classList.add('up-front')

    // add outline to the target element
    if (this.props.logGroup.element)
      this.props.logGroup.element.classList.add('forced-outline-bound')
    this.setState({ hovered: true })
    this.props.handleStreamHover(true)
  }

  handleMouseOut() {
    // this.ref.current.classList.remove('stream-hovered')
    // this.ref.current.classList.remove('up-front')
    // if (this.ref.current.parentNode)
    //   this.ref.current.parentNode.classList.remove('up-front')
    if (!this.state.grabbing) {
      if (this.props.logGroup.element)
        this.props.logGroup.element.classList.remove('forced-outline-bound')
      this.setState({ hovered: false })
      this.props.handleStreamHover(false)
    }
  }

  handleDragAround(e) {
    const { logGroup, updateLogGroup, handleStreamDragAround } = this.props
    const streamSetState = this.setState.bind(this)

    e.preventDefault()
    e.stopPropagation()

    // if (snap) return

    this.setState({ grabbing: true })
    handleStreamDragAround(true)

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

      updateLogGroup(logGroup.groupId, {
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

      streamSetState({ grabbing: false })
      handleStreamDragAround(false)
    })
  }

  handlePositionReset(e) {
    const { logGroup, updateLogGroup } = this.props

    e.preventDefault()
    e.stopPropagation()

    // if (snap) return

    updateLogGroup(logGroup.groupId, {
      ...logGroup,
      bounding: {
        ...logGroup.bounding,
        left: pxWrap(0),
        top: pxWrap(0),
      },
    })
  }

  /* -------------------------------------------------------------------------- */

  render() {
    const { expand, hovered, grabbing, current } = this.state
    const {
      logGroup: {
        name,
        logs,
        bounding,
        groupId,
        format,
        paused,
        ////
        snap,
        // snapElement,
        // snapAnchorSide,
        // snapTargetSide, // ! dropped
        // snapAnchorPercent,
        ////
        orientation,
      },
    } = this.props

    // the format definition of the thread
    const isShape = format === 'shape'

    const logElements = []

    let orderReversed = logs.length
    for (let log of logs) {
      logElements.push(
        // to add a valid shape log, the stream must be a shape (format)
        // and this log must have a valid unit
        !isShape || !checkForUnit(log) ? (
          <Log
            key={`${log.id} ${log.timestamp.now}`}
            log={log}
            orderReversed={--orderReversed}
            expandedLog={expand}
            // groupBounding={bounding}
            // logsCount={logs.length}
            // snap={snap}
          />
        ) : (
          <ShapeLog
            key={`S ${log.id} ${log.timestamp.now}`}
            log={log}
            orderReversed={--orderReversed}
            expandedLog={expand}
            // groupBounding={bounding}
            // logsCount={logs.length}
            snap={snap}
            orientation={orientation}
          />
        )
      )
    }

    const alignItemsValue = _getAlignment(
      orientation,
      bounding.horizontalAlign,
      bounding.verticalAlign
    )

    // prep for logWrapper styles
    const logWrapperStyles = {}
    logWrapperStyles.alignItems = alignItemsValue
    if (orientation === _H) {
      logWrapperStyles.flexDirection = 'column'
    } else {
      // vertical
      logWrapperStyles.flexDirection = 'row'
    }

    return (
      <div
        className={`hyper-log-stream${expand ? ' stream-expand' : ''}${
          isShape ? ' shape-stream' : ''
        }${orientation === _H ? ' stream-horizontal' : 'stream-vertical'}${
          hovered ? ' stream-hovered up-front' : ''
        }${current ? ' stream-current' : ''}`}
        style={{
          alignItems: alignItemsValue,
          // transform: snap
          //   ? undefined
          //   : `translate(${bounding.left}, ${bounding.top})`,
          transform: `translate(${bounding.left}, ${bounding.top})`,
        }}
        data-id={groupId}
        ref={this.ref}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseOut}
      >
        <LogStreamName
          name={name}
          paused={paused}
          orientation={orientation}
          snap={snap}
          streamGrabbing={grabbing}
          handleDragAround={this.handleDragAround}
          handlePositionReset={this.handlePositionReset}
        />

        <LogStreamMenu
          paused={paused}
          format={format}
          orientation={orientation}
          streamState={this.state}
          functions={this.menuFunctions}
          snap={snap}
          useShape={checkForUnit(logs[logs.length - 1])}
        />

        <div
          className="logs-wrapper"
          ref={this.logsWrapperRef}
          style={logWrapperStyles}
        >
          {logElements}
        </div>
      </div>
    )
  }
}
