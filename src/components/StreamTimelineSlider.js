import React from 'react'
import PropTypes from 'prop-types'

export const StreamTimelineSlider = ({
  logsCount,
  timelineLogOrderReversed,
  setTimelineLogOrderReversed,
  currentLogTimestamp,
  isForShape,
}) => {
  return (
    <div
      className={`hyper-log-stream-slider${
        isForShape ? ' stream-slider-for-shape' : ''
      }`}
    >
      {/* <div className='slider-track' />
      <div className='slider-thumb' /> */}
      <input
        className="slider-input"
        type="range"
        value={logsCount - timelineLogOrderReversed}
        min={1}
        max={logsCount}
        step={1}
        onChange={e => {
          setTimelineLogOrderReversed(logsCount - Number(e.target.value))
        }}
      />
      <span className="slider-timestamp">
        {Math.round(currentLogTimestamp)}
      </span>
    </div>
  )
}

StreamTimelineSlider.propTypes = {
  logsCount: PropTypes.number.isRequired,
  timelineLogOrderReversed: PropTypes.number.isRequired,
  setTimelineLogOrderReversed: PropTypes.func.isRequired,
  currentLogTimestamp: PropTypes.number.isRequired,
  isForShape: PropTypes.bool.isRequired,
}
