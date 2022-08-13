import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { constrain, preventEventWrapper } from '../methods/utils.js'

import ThisWay from '../icons/this-way.svg'
import { getMaxExpandOffset } from '../methods/ast.js'
import {
  timelineSideDraggerSnapThresholdPx,
  timelineSideDragLevelWidth,
} from '../constants.js'

export default class TimelineExpandSideDragger extends Component {
  static get propTypes() {
    return {
      expandLevels: PropTypes.object.isRequired,
      timelineOffsetBudget: PropTypes.number.isRequired,
      setTimelineOffsetBudget: PropTypes.func.isRequired,
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      active: false,
    }

    this.handleMouseDown = this.handleMouseDown.bind(this)
  }

  handleMouseDown(e) {
    const that = this
    const { expandLevels, timelineOffsetBudget, setTimelineOffsetBudget } =
      this.props

    preventEventWrapper(e, () => {
      this.setState({ active: true })

      const startPosition = {
        x: e.clientX,
        offset: timelineOffsetBudget,
      }

      const mouseMove = moveEvent => {
        const delta = moveEvent.clientX - startPosition.x
        let newOffset = constrain(
          startPosition.offset - delta,
          0,
          getMaxExpandOffset(expandLevels)
        )

        // ! snap
        const { indentationPx, declarationPx } = timelineSideDragLevelWidth
        for (let snappingOffset of [
          0,
          indentationPx,
          indentationPx + declarationPx,
        ]) {
          if (
            Math.abs(newOffset - snappingOffset) <
            timelineSideDraggerSnapThresholdPx
          ) {
            newOffset = snappingOffset
            break
          }
        }

        setTimelineOffsetBudget(newOffset)
      }

      document.addEventListener('mousemove', mouseMove)
      document.addEventListener('mouseup', function _() {
        document.removeEventListener('mousemove', mouseMove)
        document.removeEventListener('mouseup', _)

        that.setState({ active: false })
      })
    })
  }

  render() {
    return (
      <div
        className={`timeline-side-dragger animation-width-expand${
          this.state.active ? ' timeline-side-dragger-active' : ''
        }`}
        onMouseDown={this.handleMouseDown}
      >
        <ThisWay />
      </div>
    )
  }
}
