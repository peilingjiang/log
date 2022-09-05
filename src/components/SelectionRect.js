import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'

import { constrain } from '../methods/utils.js'
import { pxTrim, pxWrap } from '../methods/findPosition.js'
import { timelineSelectionAreaOffsetButterPx } from '../constants.js'

import AllWayMove from '../icons/all-way-move.svg'

export const SelectionRect = ({ filterArea, handleTimelineSetArea }) => {
  const selectionSize = {
    width: pxWrap(pxTrim(filterArea.right) - pxTrim(filterArea.left)),
    height: pxWrap(pxTrim(filterArea.bottom) - pxTrim(filterArea.top)),
  }
  return (
    <div className="hyper-selection-rect">
      {/* <div className="hyper-selection-area-unselected"></div> */}
      <div
        className="hyper-selection-rect-area"
        style={{
          left: filterArea.left,
          top: filterArea.top,
          width: selectionSize.width,
          height: selectionSize.height,
        }}
      />
      <SelectionDot
        id="lt"
        filterArea={filterArea}
        handleTimelineSetArea={handleTimelineSetArea}
      />
      <SelectionDot
        id="rt"
        filterArea={filterArea}
        handleTimelineSetArea={handleTimelineSetArea}
      />
      <SelectionDot
        id="rb"
        filterArea={filterArea}
        handleTimelineSetArea={handleTimelineSetArea}
      />
      <SelectionDot
        id="lb"
        filterArea={filterArea}
        handleTimelineSetArea={handleTimelineSetArea}
      />
      <AllWayMoveDot
        id="lb"
        filterArea={filterArea}
        handleTimelineSetArea={handleTimelineSetArea}
      />
    </div>
  )
}

const SelectionDotMemo = ({ id, filterArea, handleTimelineSetArea }) => {
  const [grab, setGrab] = useState(false)

  const horizontalSide = _shortPosIdToFullName(id[0])
  const verticalSide = _shortPosIdToFullName(id[1])

  const handleDotDrag = e => {
    e.preventDefault()
    setGrab(true)

    const original = {
      x: filterArea[horizontalSide],
      y: filterArea[verticalSide],
      mouseX: e.clientX,
      mouseY: e.clientY,
    }

    const handleDotDragMove = e => {
      e.preventDefault()
      e.stopPropagation()

      handleTimelineSetArea({
        [horizontalSide]: pxWrap(
          _constrainDotPos(
            pxTrim(original.x) + e.clientX - original.mouseX,
            horizontalSide,
            filterArea
          )
        ),
        [verticalSide]: pxWrap(
          _constrainDotPos(
            pxTrim(original.y) + e.clientY - original.mouseY,
            verticalSide,
            filterArea
          )
        ),
      })
    }

    document.addEventListener('mousemove', handleDotDragMove)
    document.addEventListener('mouseup', function _() {
      document.removeEventListener('mousemove', handleDotDragMove)
      document.removeEventListener('mouseup', _)
      setGrab(false)
    })
  }

  return (
    <div
      className={`hyper-selection-dot s-dot s-dot-${id} s-dot-${id[0]} s-dot-${
        id[1]
      }${grab ? ' cursor-grabbing' : ' cursor-grab'}`}
      style={{
        left: filterArea[horizontalSide],
        top: filterArea[verticalSide],
      }}
      onMouseDown={handleDotDrag}
    />
  )
}
const SelectionDot = memo(SelectionDotMemo, isEqual)

const AllWayMoveDot = ({ filterArea, handleTimelineSetArea }) => {
  const dotX = () =>
    // TODO make robust
    pxWrap(
      pxTrim(filterArea.left) + 2 * timelineSelectionAreaOffsetButterPx + 2 // plus 2 for the outline
    )

  const handleDotDrag = e => {
    e.preventDefault()

    const original = {
      left: filterArea.left,
      right: filterArea.right,
      top: filterArea.top,
      bottom: filterArea.bottom,
      mouseX: e.clientX,
      mouseY: e.clientY,
    }

    const handleDotDragMove = e => {
      e.preventDefault()
      e.stopPropagation()

      const offset = timelineSelectionAreaOffsetButterPx

      handleTimelineSetArea({
        left: pxWrap(
          constrain(
            pxTrim(original.left) + e.clientX - original.mouseX,
            offset,
            window.innerWidth - 3 * offset
          )
        ),
        right: pxWrap(
          constrain(
            pxTrim(original.right) + e.clientX - original.mouseX,
            2 * offset,
            window.innerWidth - offset
          )
        ),
        top: pxWrap(
          constrain(
            pxTrim(original.top) + e.clientY - original.mouseY,
            offset,
            window.innerHeight - 2 * offset
          )
        ),
        bottom: pxWrap(
          constrain(
            pxTrim(original.bottom) + e.clientY - original.mouseY,
            2 * offset,
            window.innerHeight - offset
          )
        ),
      })
    }

    document.addEventListener('mousemove', handleDotDragMove)
    document.addEventListener('mouseup', function _() {
      document.removeEventListener('mousemove', handleDotDragMove)
      document.removeEventListener('mouseup', _)
    })
  }

  return (
    <div
      className={`hyper-selection-dot all-way-move-dot`}
      style={{
        left: dotX(),
        top: filterArea.top,
      }}
      onMouseDown={handleDotDrag}
    >
      <AllWayMove />
    </div>
  )
}

SelectionRect.propTypes = {
  filterArea: PropTypes.object.isRequired,
  handleTimelineSetArea: PropTypes.func.isRequired,
}

SelectionDotMemo.propTypes = {
  id: PropTypes.string.isRequired,
  filterArea: PropTypes.object.isRequired,
  handleTimelineSetArea: PropTypes.func.isRequired,
}

AllWayMoveDot.propTypes = {
  filterArea: PropTypes.object.isRequired,
  handleTimelineSetArea: PropTypes.func.isRequired,
}

/* -------------------------------------------------------------------------- */

const _shortPosIdToFullName = id => {
  return {
    l: 'left',
    r: 'right',
    t: 'top',
    b: 'bottom',
  }[id]
}

const _constrainDotPos = (pos, side, filterArea) => {
  const offset = timelineSelectionAreaOffsetButterPx

  switch (side) {
    case 'left':
      return constrain(pos, offset, pxTrim(filterArea.right) - offset)
    case 'right':
      return constrain(
        pos,
        pxTrim(filterArea.left) + offset,
        window.innerWidth - offset
      )
    case 'top':
      return constrain(pos, offset, pxTrim(filterArea.bottom) - offset)
    case 'bottom':
      return constrain(
        pos,
        pxTrim(filterArea.top) + offset,
        window.innerHeight - offset
      )
    default:
      return pos
  }
}
