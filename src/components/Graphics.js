import React, { Component, useState, memo, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'

import {
  graphicsHistoryLength,
  graphicsHistoryOpacityFadeRate,
  groupIdExtendingConnector,
  _rootStyles,
} from '../constants.js'
import {
  anySize,
  assertExistence,
  canGraphics,
  centerStagedArgInd,
  getArgsArrayFromRawCodeObject,
  getIdentifier,
  getValidPairs,
  parseCenterStagedValueFromId,
  preventEventWrapper,
  trimStringToLength,
} from '../methods/utils.js'
import { pxOrStringWrap } from '../methods/findPosition.js'
import EngineeringMeasures from './Measures.js'

import Measures from '../icons/measures.svg'
import AllWayMove from '../icons/all-way-move.svg'

const GraphicsHostMemo = ({ logGroups, registries }) => {
  const [showMeasures, setShowMeasures] = useState([])

  const toggleShowMeasures = groupId => {
    setShowMeasures(
      showMeasures.includes(groupId)
        ? showMeasures.filter(id => id !== groupId)
        : [...showMeasures, groupId]
    )
  }

  const gElements = Object.keys(logGroups)
    .map(groupId => {
      const logGroup = logGroups[groupId]

      const selectedLogInd =
        logGroup.logs.length - logGroup.timelineLogOrderReversed - 1
      const log = logGroup.logs[selectedLogInd]
      const centerStagedId = logGroup.view.centerStagedId

      if (logGroup.syncGraphics === 0 || !canGraphics(log, centerStagedId))
        return null
      else if (logGroup.syncGraphics === 1) {
        // ! one
        return (
          <Graphics
            key={`g-${groupId}-${selectedLogInd}`}
            args={log.args}
            id={log.id}
            stack={log.stack}
            centerStagedId={centerStagedId}
            groupId={groupId}
            groupColor={logGroup.groupColor}
            registries={registries}
            currentGraphics={true}
            orderReversed={0}
            ////
            showMeasures={showMeasures}
            setShowMeasures={toggleShowMeasures}
          />
        )
      } else if (logGroup.syncGraphics === 2) {
        // ! all
        const centerStagedId = logGroup.view.centerStagedId
        return logGroup.logs.map((log, ind) => {
          const orderReversed = logGroup.logs.length - 1 - ind
          return (
            <Graphics
              key={`g-${groupId}-${ind}`}
              args={log.args}
              id={log.id}
              stack={log.stack}
              centerStagedId={centerStagedId}
              groupId={groupId}
              groupColor={logGroup.groupColor}
              registries={registries}
              currentGraphics={ind === selectedLogInd}
              orderReversed={orderReversed}
              ////
              showMeasures={showMeasures}
              setShowMeasures={toggleShowMeasures}
            />
          )
        })
      }
    })
    .flat()

  return (
    <div key="graphics-host" className="graphics-host">
      {gElements}
    </div>
  )
}

GraphicsHostMemo.propTypes = {
  logGroups: PropTypes.object.isRequired,
  registries: PropTypes.object.isRequired,
}

export const GraphicsHost = memo(GraphicsHostMemo)

/* -------------------------------------------------------------------------- */

export class Graphics extends Component {
  static get propTypes() {
    return {
      args: PropTypes.array.isRequired,
      id: PropTypes.string.isRequired,
      stack: PropTypes.object.isRequired,
      centerStagedId: PropTypes.string.isRequired,
      groupId: PropTypes.string.isRequired,
      groupColor: PropTypes.string.isRequired,
      registries: PropTypes.object.isRequired,
      currentGraphics: PropTypes.bool.isRequired,
      orderReversed: PropTypes.number.isRequired,
      ////
      showMeasures: PropTypes.array.isRequired,
      setShowMeasures: PropTypes.func.isRequired,
    }
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps)
  }

  render() {
    const {
      args,
      id,
      stack: { path, line, char },
      centerStagedId,
      groupId,
      groupColor,
      registries,
      currentGraphics,
      orderReversed,
      ////
      showMeasures,
      setShowMeasures,
    } = this.props

    if (!currentGraphics && orderReversed >= graphicsHistoryLength) return null

    const locationIdentifier = getIdentifier(path, line, char)
    const argInd = centerStagedId.length
      ? centerStagedArgInd(centerStagedId)
      : 0

    let graphics = []

    let focusArg
    if (centerStagedId.length) {
      const [centeredArg] = parseCenterStagedValueFromId(args, centerStagedId)
      focusArg = centeredArg
    } else {
      focusArg = args[argInd]
    }

    const boxGraphics = anySize(focusArg)

    // rawContent
    const logGroupIdExtended = `${groupId}${groupIdExtendingConnector}${locationIdentifier}`

    let rawContent =
      registries && logGroupIdExtended in registries
        ? registries[logGroupIdExtended]?.rawCodeObject?.rawCodeContent
        : undefined
    if (rawContent)
      rawContent = getArgsArrayFromRawCodeObject(
        rawContent,
        registries[logGroupIdExtended].rawCodeObject
      )
    ////

    if (boxGraphics) {
      graphics.push(
        ...getValidPairs(focusArg, 'size').map(pairConfig => {
          const {
            size: [sizeA, sizeB],
            position: [positionA, positionB],
            keyWord,
          } = pairConfig

          let argSize, argPosition
          if (
            assertExistence(focusArg[sizeA]) &&
            assertExistence(focusArg[sizeB])
          )
            argSize = { [sizeA]: focusArg[sizeA], [sizeB]: focusArg[sizeB] }
          if (
            assertExistence(focusArg[positionA]) &&
            assertExistence(focusArg[positionB])
          )
            argPosition = {
              [positionA]: focusArg[positionA],
              [positionB]: focusArg[positionB],
            }

          return (
            <BoxGraphics
              key={`box-${id}-${keyWord}`}
              // log={log}
              size={argSize}
              position={argPosition}
              keyWord={keyWord}
              rawContent={rawContent ? rawContent[argInd] : ''}
              groupId={groupId}
              groupColor={groupColor}
              currentGraphics={currentGraphics}
              orderReversed={orderReversed}
              ////
              showMeasures={showMeasures}
              setShowMeasures={setShowMeasures}
            />
          )
        })
      )
    } else {
      graphics.push(
        ...getValidPairs(focusArg, 'position').map(pairConfig => {
          const {
            position: [positionA, positionB],
            keyWord,
          } = pairConfig

          let argPosition
          if (
            assertExistence(focusArg[positionA]) &&
            assertExistence(focusArg[positionB])
          )
            argPosition = {
              [positionA]: focusArg[positionA],
              [positionB]: focusArg[positionB],
            }

          return (
            <DotGraphics
              key={`box-${id}-${keyWord}`}
              // log={log}
              position={argPosition}
              keyWord={keyWord}
              rawContent={rawContent ? rawContent[argInd] : ''}
              groupId={groupId}
              groupColor={groupColor}
              currentGraphics={currentGraphics}
              orderReversed={orderReversed}
              ////
              showMeasures={showMeasures}
              setShowMeasures={setShowMeasures}
            />
          )
        })
      )
    }

    return <>{graphics}</>
  }
}

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */

// ! box

const BoxGraphicsMemo = ({
  size,
  position,
  keyWord,
  rawContent,
  groupId,
  groupColor,
  currentGraphics,
  orderReversed,
  ////
  showMeasures,
  setShowMeasures,
}) => {
  const boxRef = useRef(null)
  const [draggedPosition, setDraggedPosition] = useState({
    x: 0,
    y: 0,
  })
  // const timeoutRef = useRef(null)

  // useEffect(() => {
  //   if (currentGraphics && !timeoutRef.current)
  //     timeoutRef.current = setTimeout(() => {
  //       boxRef.current?.classList.remove('prevent-pointer-events')
  //     }, 1000)
  //   else if (!currentGraphics) {
  //     if (timeoutRef.current) {
  //       clearTimeout(timeoutRef.current)
  //       timeoutRef.current = null
  //     }
  //     boxRef.current?.classList.add('prevent-pointer-events')
  //   }
  // })

  const fadedGraphics = !currentGraphics

  const handleMouseDown = e => {
    preventEventWrapper(e, () => {
      const starter = {
        x: e.clientX,
        y: e.clientY,
        top: draggedPosition.y,
        left: draggedPosition.x,
      }

      const handleMouseMove = event => {
        preventEventWrapper(event, () => {
          const { x, y } = {
            x: event.clientX - starter.x,
            y: event.clientY - starter.y,
          }
          setDraggedPosition({
            x: starter.left + x,
            y: starter.top + y,
          })
        })
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', function _() {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', _)
      })
    })
  }

  return (
    <div
      ref={boxRef}
      className={`hyper-graphics-box ${keyWord}-graphics${
        fadedGraphics ? ' faded-graphics' : ''
      }`}
      style={{
        opacity: fadedGraphics
          ? _rootStyles.opacityXh -
            orderReversed * graphicsHistoryOpacityFadeRate
          : undefined,
        zIndex: fadedGraphics ? -1 : 0,
        ...offsetStylesFromKeyWord(
          keyWord,
          position ? position : draggedPosition
        ),
      }}
    >
      <div
        className={`the-box ${keyWord}-box box-animation-bounce-in`}
        style={{
          ...sizeStylesFromKeyWord(keyWord, size),
        }}
      ></div>
      {!fadedGraphics && (
        <>
          <div className="box-info">
            {/* <Measures
              className="box-icon icon-measures"
              onClick={() => {
                setShowMeasures(groupId)
              }}
            /> */}
            {!assertExistence(position) && (
              <AllWayMove
                className="box-icon icon-move"
                onMouseDown={handleMouseDown}
              />
            )}
          </div>
          <div
            className={`graphics-description box-description ${keyWord}-description`}
            style={{
              borderLeftColor: `${groupColor}`,
            }}
          >
            <span className="description-key-word">
              {keyWord === 'native' ? '' : `${keyWord} `}rect
            </span>
            <span>{trimStringToLength(rawContent, 22)}</span>
          </div>
          {showMeasures.includes(groupId) && currentGraphics && (
            <EngineeringMeasures
              keyWord={keyWord}
              position={position ? position : draggedPosition}
              size={size}
            />
          )}
        </>
      )}
    </div>
  )
}

BoxGraphicsMemo.propTypes = {
  // log: logInterface.isRequired,
  size: PropTypes.object.isRequired,
  position: PropTypes.object,
  keyWord: PropTypes.string.isRequired,
  rawContent: PropTypes.string.isRequired,
  groupId: PropTypes.string.isRequired,
  groupColor: PropTypes.string.isRequired,
  currentGraphics: PropTypes.bool.isRequired,
  orderReversed: PropTypes.number.isRequired,
  showMeasures: PropTypes.array.isRequired,
  setShowMeasures: PropTypes.func.isRequired,
}

const BoxGraphics = memo(BoxGraphicsMemo, isEqual)

/* -------------------------------------------------------------------------- */

// ! dot

const DotGraphicsMemo = ({
  position,
  keyWord,
  rawContent,
  groupId,
  groupColor,
  currentGraphics,
  orderReversed,
  ////
  showMeasures,
  setShowMeasures,
}) => {
  const dotRef = useRef(null)
  const timeoutRef = useRef(null)

  const fadedGraphics = !currentGraphics

  useEffect(() => {
    if (currentGraphics && !timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        dotRef.current?.classList.remove('prevent-pointer-events')
      }, 1000)
    else if (!currentGraphics) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      dotRef.current?.classList.add('prevent-pointer-events')
    }
  })

  return (
    <div
      ref={dotRef}
      className={`hyper-graphics-dot prevent-pointer-events${
        fadedGraphics ? ' faded-graphics' : ''
      }`}
      style={{
        opacity: fadedGraphics
          ? _rootStyles.opacityXh -
            orderReversed * graphicsHistoryOpacityFadeRate
          : undefined,
        zIndex: fadedGraphics ? -1 : 0,
        ...offsetStylesFromKeyWord(keyWord, position),
      }}
    >
      <div
        className={`the-dot-shadow ${keyWord}-dot-shadow${
          currentGraphics ? ' dot-animation-bounce-in' : ''
        }`}
        onClick={() => {
          setShowMeasures(groupId)
        }}
      >
        <div
          className={`the-dot ${keyWord}-dot${
            currentGraphics ? ' dot-animation-bounce-in' : ''
          }`}
        ></div>
      </div>

      <div
        className={`graphics-description dot-description ${keyWord}-description`}
        style={{
          borderLeftColor: `${groupColor}`,
        }}
      >
        <span className="description-key-word">
          {keyWord === 'native' ? '' : `${keyWord} `}xy
        </span>
        <span>{trimStringToLength(rawContent, 22)}</span>
      </div>

      {showMeasures.includes(groupId) && currentGraphics && (
        <EngineeringMeasures keyWord={keyWord} position={position} />
      )}
    </div>
  )
}

DotGraphicsMemo.propTypes = {
  // log: logInterface.isRequired,
  position: PropTypes.object.isRequired,
  keyWord: PropTypes.string.isRequired,
  rawContent: PropTypes.string.isRequired,
  groupId: PropTypes.string.isRequired,
  groupColor: PropTypes.string.isRequired,
  currentGraphics: PropTypes.bool.isRequired,
  orderReversed: PropTypes.number.isRequired,
  showMeasures: PropTypes.array.isRequired,
  setShowMeasures: PropTypes.func.isRequired,
}

const DotGraphics = memo(DotGraphicsMemo, isEqual)

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */

export const sizeStylesFromKeyWord = (keyWord, size) => {
  switch (keyWord) {
    case 'native':
      return {
        width: pxOrStringWrap(size.width),
        height: pxOrStringWrap(size.height),
      }

    case 'client':
      return {
        width: pxOrStringWrap(size.clientWidth),
        height: pxOrStringWrap(size.clientWidth),
      }

    default:
      return {}
  }
}

export const offsetStylesFromKeyWord = (keyWord, position) => {
  switch (keyWord) {
    case 'native':
      return {
        position: 'absolute',
        top: pxOrStringWrap(position.y),
        left: pxOrStringWrap(position.x),
      }

    case 'client':
      return {
        position: 'fixed',
        top: pxOrStringWrap(position.clientY),
        left: pxOrStringWrap(position.clientX),
      }

    case 'offset':
      return {
        position: 'absolute',
        top: pxOrStringWrap(position.offsetY),
        left: pxOrStringWrap(position.offsetX),
      }

    case 'scroll':
      return {
        position: 'absolute',
        top: pxOrStringWrap(position.scrollY),
        left: pxOrStringWrap(position.scrollX),
      }

    default:
      return {}
  }
}
