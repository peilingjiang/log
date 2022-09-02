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
    this.handleClick = this.handleClick.bind(this)
  }

  handleMouseDown(e) {
    const that = this

    let clickTimeOut = false
    setTimeout(() => {
      clickTimeOut = true
    }, 300)

    preventEventWrapper(e, () => {
      this.setState({ active: true })

      // const startPosition = {
      //   x: e.clientX,
      //   offset: timelineOffsetBudget,
      // }

      // const mouseMove = moveEvent => {
      //   const delta = moveEvent.clientX - startPosition.x
      //   let newOffset = constrain(
      //     startPosition.offset - delta,
      //     0,
      //     getMaxExpandOffset(expandLevels)
      //   )

      //   // ! snap
      //   const { indentationPx, declarationPx } = timelineSideDragLevelWidth

      //   const possibleLevels = [0]
      //   if (expandLevels.indentation) possibleLevels.push(indentationPx)
      //   if (expandLevels.declarations)
      //     possibleLevels.push(indentationPx + declarationPx)

      //   for (let snappingOffset of possibleLevels) {
      //     if (
      //       Math.abs(newOffset - snappingOffset) <
      //       timelineSideDraggerSnapThresholdPx
      //     ) {
      //       newOffset = snappingOffset
      //       break
      //     }
      //   }

      //   setTimelineOffsetBudget(newOffset)
      // }

      // document.addEventListener('mousemove', mouseMove)
      document.addEventListener('mouseup', function _() {
        // document.removeEventListener('mousemove', mouseMove)
        document.removeEventListener('mouseup', _)

        if (!clickTimeOut) {
          that.handleClick()
        }

        that.setState({ active: false })
      })
    })
  }

  getTargetBudget() {
    const { expandLevels, timelineOffsetBudget } = this.props

    let targetBudget
    const { indentationPx, declarationPx } = timelineSideDragLevelWidth

    const budgetCutoffs = [0]
    if (expandLevels.indentation) budgetCutoffs.push(indentationPx)
    if (expandLevels.declarations)
      budgetCutoffs.push(indentationPx + declarationPx)

    for (const c of budgetCutoffs)
      if (c > timelineOffsetBudget) {
        targetBudget = c
        break
      }

    if (targetBudget === undefined) targetBudget = 0

    return targetBudget
  }

  handleClick(e) {
    const { setTimelineOffsetBudget } = this.props

    preventEventWrapper(e, () => {
      // this.setState({ active: true })

      const targetBudget = this.getTargetBudget()

      // let newOffset = timelineOffsetBudget
      setTimelineOffsetBudget(targetBudget)
      // const autoMoveInterval = setInterval(() => {
      //   newOffset = newOffset + 0.3 * (targetBudget - newOffset)

      //   if (Math.abs(newOffset - targetBudget) < 2) {
      //     clearInterval(autoMoveInterval)
      //     setTimelineOffsetBudget(targetBudget)
      //   } else {
      //     setTimelineOffsetBudget(newOffset)
      //   }
      // }, 15)
    })
  }

  render() {
    const targetBudget = this.getTargetBudget()

    return (
      <div
        className={`timeline-side-dragger animation-width-expand${
          this.state.active ? ' timeline-side-dragger-active' : ''
        }`}
        onMouseDown={this.handleMouseDown}
        // onClick={this.handleClick}
      >
        <ThisWay className={targetBudget === 0 ? 'this-way-back' : ''} />
      </div>
    )
  }
}
