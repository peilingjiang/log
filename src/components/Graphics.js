import React, { Component, memo, useRef, useEffect } from 'react'
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
  centerStagedArgInd,
  getArgsArrayFromRawCodeObject,
  getIdentifier,
  getValidPairs,
  parseCenterStagedValueFromId,
  trimStringToLength,
} from '../methods/utils.js'
import { pxOrStringWrap } from '../methods/findPosition.js'

export default class Graphics extends Component {
  static get propTypes() {
    return {
      args: PropTypes.array.isRequired,
      id: PropTypes.string.isRequired,
      stack: PropTypes.object.isRequired,
      centerStagedId: PropTypes.string.isRequired,
      groupId: PropTypes.string.isRequired,
      registries: PropTypes.object.isRequired,
      currentGraphics: PropTypes.bool.isRequired,
      orderReversed: PropTypes.number.isRequired,
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
      registries,
      currentGraphics,
      orderReversed,
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
              currentGraphics={currentGraphics}
              orderReversed={orderReversed}
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
              currentGraphics={currentGraphics}
              orderReversed={orderReversed}
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
  currentGraphics,
  orderReversed,
}) => {
  const boxRef = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (currentGraphics && !timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        boxRef.current?.classList.remove('prevent-pointer-events')
      }, 1000)
    else if (!currentGraphics) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      boxRef.current?.classList.add('prevent-pointer-events')
    }
  })

  const fadedGraphics = !currentGraphics

  return (
    <div
      ref={boxRef}
      className={`hyper-graphics-box prevent-pointer-events${
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
        className={`the-box ${keyWord}-box box-animation-bounce-in`}
        style={{
          ...sizeStylesFromKeyWord(keyWord, size),
        }}
      ></div>
    </div>
  )
}

BoxGraphicsMemo.propTypes = {
  // log: logInterface.isRequired,
  size: PropTypes.object.isRequired,
  position: PropTypes.object.isRequired,
  keyWord: PropTypes.string.isRequired,
  currentGraphics: PropTypes.bool.isRequired,
  orderReversed: PropTypes.number.isRequired,
}

const BoxGraphics = memo(BoxGraphicsMemo, isEqual)

/* -------------------------------------------------------------------------- */

// ! dot

const DotGraphicsMemo = ({
  position,
  keyWord,
  rawContent,
  currentGraphics,
  orderReversed,
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
        className={`the-dot-shadow ${keyWord}-dot-shadow dot-animation-bounce-in`}
      >
        <div className={`the-dot ${keyWord}-dot dot-animation-bounce-in`}></div>
      </div>

      <div className={`dot-description ${keyWord}-description`}>
        <span className="description-key-word">
          {keyWord === 'native' ? '' : keyWord}XY
        </span>
        <span>{trimStringToLength(rawContent, 22)}</span>
      </div>
    </div>
  )
}

DotGraphicsMemo.propTypes = {
  // log: logInterface.isRequired,
  position: PropTypes.object.isRequired,
  keyWord: PropTypes.string.isRequired,
  rawContent: PropTypes.string.isRequired,
  currentGraphics: PropTypes.bool.isRequired,
  orderReversed: PropTypes.number.isRequired,
}

const DotGraphics = memo(DotGraphicsMemo, isEqual)

/* -------------------------------------------------------------------------- */

const sizeStylesFromKeyWord = (keyWord, size) => {
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

const offsetStylesFromKeyWord = (keyWord, position) => {
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
