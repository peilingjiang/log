import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'

import Log from '../components/Log.js'

import {
  boundingDefault,
  expandedStreamDisableAutoScrollThresholdPx,
  logGroupInterface,
  logInterface,
  _Aug,
  _H,
  _L,
  _R,
  _rootStyles,
  _T,
} from '../constants.js'
import {
  assertArray,
  assertObject,
  bindableElement,
  checkForUnit,
  cloneLogGroup,
  idFromString,
  removeLogId,
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
import { setupLeaderLine } from '../others/leaderLine.js'
import { outlineToHighlightElement } from '../methods/attachElements.js'

// for augmented logs

export default class LogStream extends Component {
  static get propTypes() {
    return {
      logGroup: logGroupInterface.isRequired,
      log: logInterface,
      updateLogGroup: PropTypes.func.isRequired,
      updateLog: PropTypes.func.isRequired,
      hostRef: PropTypes.object.isRequired,
      ////
      handleStreamHover: PropTypes.func.isRequired,
      handleStreamDragAround: PropTypes.func.isRequired,
      organization: PropTypes.string.isRequired,
      ////
      hostFunctions: PropTypes.object.isRequired,
      ////
      // for timeline single-log streams
      timelineOffset: PropTypes.number,
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      expand: false,
      hovered: false,
      grabbing: false,
      current: false,
      ////
      choosingCenterStaged: false,
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
      toggleChoosingCenterStaged: this.toggleChoosingCenterStaged.bind(this),
      setCenterStagedId: this.setCenterStagedId.bind(this), // !
    }

    this.streamFunctions = {
      setCenterStagedId: this.setCenterStagedId.bind(this), // !
      setUnfoldedIds: this.setUnfoldedIds.bind(this),
      setHighlightedIds: this.setHighlightedIds.bind(this),
      setScrollView: this.setScrollView.bind(this),
    }
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    // scroll to the bottom
    // if the stream is expanded
    if (
      this.props.organization === _Aug
      // (prevProps.logGroup.logs.length !== this.props.logGroup.logs.length ||
      //   (!prevProps.logGroup.expanded && this.props.logGroup.expanded))
    )
      if (
        this.logsWrapperRef.current &&
        this.state.expand &&
        (this.logsWrapperRef.current.scrollHeight -
          this.logsWrapperRef.current.scrollTop <
          expandedStreamDisableAutoScrollThresholdPx ||
          (!prevState.expand && this.state.expand))
      ) {
        this.logsWrapperRef.current.scrollTop =
          this.logsWrapperRef.current.scrollHeight
      }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      // (!nextProps.logGroup.paused || !this.props.logGroup.paused) &&
      !isEqual(nextProps, this.props) || !isEqual(nextState, this.state)
    )
  }

  /* -------------------------------------------------------------------------- */

  // ! menu functions

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

      // leaderLine
      const { sudoPointerElement, leaderLine } = setupLeaderLine(
        e,
        sudoPointerElement => {
          hostRef.current.appendChild(sudoPointerElement)
        },
        _rootStyles.elementOutlineBound
      )

      // ! move
      function _mousemove(event) {
        sudoPointerElement.style.top = pxWrap(event.clientY)
        sudoPointerElement.style.left = pxWrap(event.clientX)
        leaderLine.position()

        // ! highlight the element
        // remove the old ones first
        outlineToHighlightElement(document.body, false, 'inside')
        const highlightedElements = document.querySelectorAll(
          '.forced-outline-bound'
        )
        for (let i = 0; i < highlightedElements.length; i++)
          if (!event.target.isSameNode(highlightedElements[i]))
            outlineToHighlightElement(highlightedElements[i], false)
        // add new ones
        if (bindableElement(event.target))
          outlineToHighlightElement(event.target, true)
        else outlineToHighlightElement(document.body, true, 'inside')
      }
      document.addEventListener('mousemove', _mousemove)

      // ! up
      document.addEventListener('mouseup', function _(e) {
        document.removeEventListener('mouseup', _)
        document.removeEventListener('mousemove', _mousemove)

        streamSetState({ current: false })
        hostRef.current.classList.remove('no-pointer-events')
        outlineToHighlightElement(document.body, false, 'inside')
        ;[...document.querySelectorAll('.forced-outline-bound')].forEach(el =>
          outlineToHighlightElement(el, false)
        )

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

    if (logGroup.element) outlineToHighlightElement(logGroup.element, false)

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

      // leaderLine
      const { sudoPointerElement, leaderLine } = setupLeaderLine(
        e,
        sudoPointerElement => {
          hostRef.current.appendChild(sudoPointerElement)
        },
        _rootStyles.elegantRed
      )

      let snapElement, snapAnchorPoint

      // ! move
      function _mousemove(event) {
        const nearest = findNearestSnapPoint(event.clientX, event.clientY)

        const highlightedElements = document.querySelectorAll(
          '.forced-outline-bound-mid'
        )
        for (let i = 0; i < highlightedElements.length; i++)
          if (!event.target.isSameNode(highlightedElements[i]))
            outlineToHighlightElement(highlightedElements[i], false, 'mid')

        if (nearest) {
          const { nearestPointElement, nearestPoint } = nearest
          sudoPointerElement.style.top = pxWrap(nearestPoint.y)
          sudoPointerElement.style.left = pxWrap(nearestPoint.x)

          snapElement = nearestPointElement
          snapAnchorPoint = nearestPoint

          outlineToHighlightElement(nearestPointElement, true, 'mid')
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
        ;[...document.querySelectorAll('.forced-outline-bound-mid')].forEach(
          el => {
            outlineToHighlightElement(el, false, 'mid')
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
        ...(logGroup?.bounding || boundingDefault),
        left: pxWrap(0),
        top: pxWrap(0),
        horizontalAlign: _L,
        verticalAlign: _T,
      },
      orientation: _H,
    }
  }

  toggleChoosingCenterStaged() {
    this.setState({ choosingCenterStaged: !this.state.choosingCenterStaged })
  }

  /* -------------------------------------------------------------------------- */

  // ! stream functions

  setCenterStagedId(groupId, newCenterStagedId) {
    const { logGroup, updateLogGroup } = this.props

    this.setState({
      choosingCenterStaged: false,
    })

    updateLogGroup(groupId, {
      ...cloneLogGroup(logGroup),
      view: {
        ...logGroup.view,
        centerStagedId: removeLogId(newCenterStagedId),
      },
    })
  }

  setUnfoldedIds(groupId, idToToggle, toUnfold = true) {
    // if toFold, add idToToggle to unfoldedIds
    const {
      logGroup,
      logGroup: {
        view: { unfoldedIds },
      },
      updateLogGroup,
    } = this.props

    const newUnfoldedIds = [...unfoldedIds]
    if (toUnfold) newUnfoldedIds.push(removeLogId(idToToggle))
    else
      newUnfoldedIds.splice(newUnfoldedIds.indexOf(removeLogId(idToToggle)), 1)

    updateLogGroup(groupId, {
      ...cloneLogGroup(logGroup),
      view: {
        ...logGroup.view,
        unfoldedIds: newUnfoldedIds,
      },
    })
  }

  setHighlightedIds(groupId, idToToggle, toHighlight = true) {
    const {
      logGroup,
      logGroup: {
        view: { highlightedIds },
      },
      updateLogGroup,
    } = this.props

    const newHighlightedIds = [...highlightedIds]
    if (toHighlight) newHighlightedIds.push(removeLogId(idToToggle))
    else
      newHighlightedIds.splice(
        newHighlightedIds.indexOf(removeLogId(idToToggle)),
        1
      )

    updateLogGroup(groupId, {
      ...cloneLogGroup(logGroup),
      view: {
        ...logGroup.view,
        highlightedIds: newHighlightedIds,
      },
    })
  }

  setScrollView(groupId, left, top) {
    const { logGroup, updateLogGroup } = this.props
    updateLogGroup(groupId, {
      ...cloneLogGroup(logGroup),
      view: {
        ...logGroup.view,
        left: pxWrap(left),
        top: pxWrap(top),
      },
    })
  }

  /* -------------------------------------------------------------------------- */

  handleMouseEnter() {
    // this.ref.current.classList.add('stream-hovered')
    // this.ref.current.classList.add('up-front')
    // if (this.ref.current.parentNode)
    //   this.ref.current.parentNode.classList.add('up-front')

    // add outline to the target element
    outlineToHighlightElement(this.props.logGroup?.element, true)
    this.setState({ hovered: true })
    this.props.handleStreamHover(true)
  }

  handleMouseOut() {
    // this.ref.current.classList.remove('stream-hovered')
    // this.ref.current.classList.remove('up-front')
    // if (this.ref.current.parentNode)
    //   this.ref.current.parentNode.classList.remove('up-front')
    if (!this.state.grabbing) {
      outlineToHighlightElement(this.props.logGroup?.element, false)
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
      offsetLeft: this.ref.current.offsetLeft,
      offsetTop: this.ref.current.offsetTop,
    }

    const handleMouseMove = e => {
      e.preventDefault()
      e.stopPropagation()

      const { clientX, clientY } = e

      updateLogGroup(logGroup.groupId, {
        ...logGroup,
        bounding: {
          ...logGroup.bounding,
          // left: pxWrap(startPos.left + clientX - startPos.x),
          // top: pxWrap(startPos.top + clientY - startPos.y),
          ////
          // left: pxWrap(startPos.left + clientX - startPos.x + startPos.offsetLeft),
          left: pxWrap(startPos.left + clientX - startPos.x), // TODO robust solution
          top: pxWrap(startPos.top + clientY - startPos.y + startPos.offsetTop),
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

  // has the stream been dragged around?
  _offsetFromAutoAttach() {
    const {
      logGroup: { bounding },
    } = this.props
    return pxTrim(bounding.left) || pxTrim(bounding.top)
  }

  _allowingCenterStaged() {
    const {
      logGroup: { logs },
    } = this.props
    const lastLogArgs = logs.at(-1).args

    if (lastLogArgs.length > 1) return true
    if (assertArray(lastLogArgs[0]) || assertObject(lastLogArgs[0])) return true
    return false
  }

  render() {
    const { expand, hovered, grabbing, current, choosingCenterStaged } =
      this.state
    const {
      logGroup: {
        name,
        logs,
        bounding,
        groupId,
        format,
        groupColor,
        paused,
        ////
        snap,
        // snapElement,
        // snapAnchorSide,
        // snapTargetSide, // ! dropped
        // snapAnchorPercent,
        ////
        orientation,
        view,
      },
      hostFunctions,
      organization,
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
            key={`${log.id} ${log.timestamps.at(-1).now}`}
            groupId={groupId}
            log={log}
            orderReversed={--orderReversed}
            expandedLog={expand}
            // groupBounding={bounding}
            // logsCount={logs.length}
            snap={snap}
            hostFunctions={hostFunctions}
            streamFunctions={this.streamFunctions}
            organization={organization}
            ////
            view={view}
            choosingCenterStaged={choosingCenterStaged}
          />
        ) : (
          <ShapeLog
            key={`${log.id} ${log.timestamps.at(-1).now}-shape`}
            groupId={groupId}
            log={log}
            orderReversed={--orderReversed}
            expandedLog={expand}
            // groupBounding={bounding}
            // logsCount={logs.length}
            snap={snap}
            orientation={orientation}
            hostFunctions={hostFunctions}
            streamFunctions={this.streamFunctions}
            organization={organization}
            ////
            view={view}
            choosingCenterStaged={false}
          />
        )
      )
    }

    const alignItemsValue = _getAlignment(
      orientation,
      expand,
      bounding.horizontalAlign,
      bounding.verticalAlign
    )

    // prep for logWrapper styles
    const logWrapperStyles = {}
    // const wrapperBorderStyle = expand ? `2px solid ${groupColor}` : null
    // logWrapperStyles.borderTop = wrapperBorderStyle
    // logWrapperStyles.borderBottom = wrapperBorderStyle
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
          position: this._offsetFromAutoAttach() ? 'absolute' : 'relative',
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
          centerStagedId={view.centerStagedId}
        />

        <div
          className="logs-wrapper"
          ref={this.logsWrapperRef}
          style={logWrapperStyles}
        >
          {logElements}
        </div>

        <LogStreamMenu
          groupId={groupId}
          paused={paused}
          format={format}
          orientation={orientation}
          streamState={this.state}
          menuFunctions={this.menuFunctions}
          snap={snap}
          useShape={checkForUnit(logs[logs.length - 1])}
          organization={organization}
          ////
          allowingCenterStaged={this._allowingCenterStaged()}
          choosingCenterStaged={choosingCenterStaged}
          centerStagedId={view.centerStagedId}
        />
      </div>
    )
  }
}
