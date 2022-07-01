import React from 'react'
import PropTypes from 'prop-types'

import { preventEventWrapper } from '../methods/utils.js'
import { _Aug } from '../constants.js'

import Move from '../icons/move.svg'
import Arrow from '../icons/arrow.svg'
import Pause from '../icons/pause.svg'
import Restart from '../icons/restart.svg'
import Expand from '../icons/expand.svg'
import Fold from '../icons/fold.svg'

export const TimelineName = ({
  logPaused,
  timelineFolded,
  timelineGrabbing,
  handleTimelineDragAround,
  handleTimelinePositionReset,
  handleTimelineFold,
  hostFunctions,
}) => {
  return (
    <div
      className={`hyper-log-stream-name timeline-name${
        timelineGrabbing ? ' cursor-grabbing' : ' cursor-grab'
      }`}
      // ref={ref}
      onMouseDown={handleTimelineDragAround}
      onDoubleClick={handleTimelinePositionReset}
    >
      <Move />{' '}
      <span
        className="timeline-name-text"
        style={{
          textDecoration: logPaused ? 'line-through' : undefined,
        }}
      >
        timeline
      </span>
      <Arrow
        className="timeline-icon rotate-180 timeline-back-icon"
        title="back to augmented mode"
        onClick={e =>
          preventEventWrapper(e, () => hostFunctions.changeOrganization(_Aug))
        }
      />
      {logPaused ? (
        <Restart
          className="timeline-icon timeline-restart-icon"
          title="resume"
          onClick={e =>
            preventEventWrapper(e, hostFunctions.togglePauseTheWholeLogSystem)
          }
        />
      ) : (
        <Pause
          className="timeline-icon timeline-pause-icon"
          title="pause"
          onClick={e =>
            preventEventWrapper(e, hostFunctions.togglePauseTheWholeLogSystem)
          }
        />
      )}
      {timelineFolded ? (
        <Expand
          className="timeline-icon timeline-expand-icon"
          title="unfold the timeline view"
          onClick={e => preventEventWrapper(e, handleTimelineFold)}
        />
      ) : (
        <Fold
          className="timeline-icon timeline-fold-icon"
          title="minimize the timeline view"
          onClick={e => preventEventWrapper(e, handleTimelineFold)}
        />
      )}
    </div>
  )
}

TimelineName.propTypes = {
  logPaused: PropTypes.bool.isRequired,
  timelineFolded: PropTypes.bool.isRequired,
  timelineGrabbing: PropTypes.bool.isRequired,
  handleTimelineDragAround: PropTypes.func.isRequired,
  handleTimelinePositionReset: PropTypes.func.isRequired,
  handleTimelineFold: PropTypes.func.isRequired,
  hostFunctions: PropTypes.object.isRequired,
}
