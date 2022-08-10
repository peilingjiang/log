import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'

import SliderDrag from '../icons/slider-drag.svg'
import ThisWay from '../icons/this-way.svg'

import { pxWrap } from '../methods/findPosition.js'
import { constrain, preventEventWrapper } from '../methods/utils.js'
import { timelineEachExpandLevelSliderWidthPx } from '../constants.js'

const sliderPaddingLeftRightPx = 0

export default class TimelineExpandSlider extends Component {
  static get propTypes() {
    return {
      timelineRef: PropTypes.object.isRequired,
    }
  }

  constructor(props) {
    super(props)

    this.sliderRef = createRef()
    this.dragRef = createRef()

    this.state = {
      width: timelineEachExpandLevelSliderWidthPx,
    }

    this.handleMouseDown = this.handleMouseDown.bind(this)
  }

  handleMouseDown(e) {
    preventEventWrapper(e, () => {
      const startPosition = {
        x: e.clientX,
        width: this.state.width,
      }

      const mouseMove = moveEvent => {
        const delta = moveEvent.clientX - startPosition.x
        const width = constrain(
          startPosition.width - delta,
          timelineEachExpandLevelSliderWidthPx,
          this.props.timelineRef.current.offsetWidth
        )
        this.setState({ width })
      }

      document.addEventListener('mousemove', mouseMove)
      document.addEventListener('mouseup', function _() {
        document.removeEventListener('mousemove', mouseMove)
        document.removeEventListener('mouseup', _)
      })
    })
  }

  render() {
    return (
      <div
        ref={this.sliderRef}
        className="timeline-expand-slider animation-height-expand"
        style={{
          width: pxWrap(this.state.width - sliderPaddingLeftRightPx),
        }}
      >
        <ThisWay
          className="this-way-icon"
          style={{
            opacity: Math.max(
              0,
              1 - this.state.width / (2 * timelineEachExpandLevelSliderWidthPx)
            ),
          }}
        />
        <div
          ref={this.dragRef}
          className="timeline-expand-slider-drag"
          onMouseDown={this.handleMouseDown}
        >
          <SliderDrag />
        </div>
      </div>
    )
  }
}
