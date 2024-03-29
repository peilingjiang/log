import React, { memo } from 'react'
import PropTypes from 'prop-types'

import { pxTrim, pxWrap } from '../methods/findPosition.js'
import { measuresLineWidth } from '../constants.js'

const EngineeringMeasuresMemo = ({ keyWord, position, size }) => {
  let positionEl = [],
    sizeEl = []

  let x, y
  if (position) {
    const pos = getPositionBasedOnKeyWord(keyWord, position)
    x = pos.x
    y = pos.y

    positionEl.push(
      ...[
        // y
        y !== 0 ? (
          <MeasureLine
            key={'line-y'}
            identifier="y"
            x={`calc(${pxWrap(x)} - ${measuresLineWidth})`}
            y={'0px'}
            width={measuresLineWidth}
            height={pxWrap(y)}
            textPosition={1}
            value={y}
          />
        ) : null,
        // x
        x !== 0 ? (
          <MeasureLine
            key={'line-x'}
            identifier="x"
            x={'0px'}
            y={`calc(${pxWrap(y)} - ${measuresLineWidth})`}
            width={pxWrap(x)}
            height={measuresLineWidth}
            textPosition={2}
            value={x}
          />
        ) : null,
      ]
    )
  }

  if (size) {
    const { width, height } = getSizeBasedOnKeyWord(keyWord, size)
    sizeEl.push(
      ...[
        // width
        width > 0 ? (
          <MeasureLine
            key={'line-width'}
            identifier="w"
            x={pxWrap(x)}
            y={`calc(${pxWrap(y)} - ${measuresLineWidth})`}
            width={pxWrap(width)}
            height={measuresLineWidth}
            textPosition={4}
            value={width}
          />
        ) : null,
        // height
        height > 0 ? (
          <MeasureLine
            key={'line-height'}
            identifier="h"
            x={`calc(${pxWrap(x)} - ${measuresLineWidth})`}
            y={pxWrap(y)}
            width={measuresLineWidth}
            height={pxWrap(height)}
            textPosition={3}
            value={height}
          />
        ) : null,
      ]
    )
  }

  return (
    <div className="hyper-measures">
      {positionEl}
      {sizeEl}
    </div>
  )
}

EngineeringMeasuresMemo.propTypes = {
  keyWord: PropTypes.string.isRequired,
  position: PropTypes.object,
  size: PropTypes.object,
}

export default memo(EngineeringMeasuresMemo)

const MeasureLine = props => {
  const { identifier, x, y, width, height, textPosition, value } = props

  return (
    <div
      className="measure-line-holder"
      style={{
        left: x,
        top: y,
        width: width,
        height: height,
      }}
    >
      <div className={`measure-line ${identifier}-line`}></div>
      <div
        className="measure-line-text"
        style={{
          ...textPositionOnAxis(textPosition),
        }}
      >
        {pxWrap(Math.round(value))}
      </div>
    </div>
  )
}

MeasureLine.propTypes = {
  identifier: PropTypes.string.isRequired,
  x: PropTypes.string.isRequired,
  y: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  textPosition: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

/* -------------------------------------------------------------------------- */

const getPositionBasedOnKeyWord = (keyWord, position) => {
  switch (keyWord) {
    case 'native':
      return {
        x: position.x,
        y: position.y,
      }

    case 'client':
      return {
        x: position.clientX,
        y: position.clientY,
      }
  }
}

const getSizeBasedOnKeyWord = (keyWord, size) => {
  switch (keyWord) {
    case 'native':
      return {
        width: size.width,
        height: size.height,
      }

    case 'client':
      return {
        width: size.clientWidth,
        height: size.clientHeight,
      }
  }
}

const textPositionOnAxis = quadrant => {
  switch (quadrant) {
    case 1:
      return {
        left: '200%',
        bottom: '50%',
        transform: `translateY(50%)`,
      }

    case 2:
      return {
        right: '50%',
        bottom: '200%',
        transform: `translateX(50%)`,
      }

    case 3:
      return {
        top: '50%',
        left: '200%',
        transform: `translateY(-50%)`,
      }

    case 4:
      return {
        left: '50%',
        top: '200%',
        transform: `translateX(-50%)`,
      }
  }
}
