export const TimelineName: React.MemoExoticComponent<{
  ({
    logPaused,
    timelineFolded,
    timelineGrabbing,
    timelineEnableArea,
    handleTimelineDragAround,
    handleTimelinePositionReset,
    handleTimelineArea,
    handleTimelineFold,
    hostFunctions,
  }: {
    logPaused: any
    timelineFolded: any
    timelineGrabbing: any
    timelineEnableArea: any
    handleTimelineDragAround: any
    handleTimelinePositionReset: any
    handleTimelineArea: any
    handleTimelineFold: any
    hostFunctions: any
  }): JSX.Element
  propTypes: {
    logPaused: PropTypes.Validator<boolean>
    timelineFolded: PropTypes.Validator<boolean>
    timelineGrabbing: PropTypes.Validator<boolean>
    timelineEnableArea: PropTypes.Validator<boolean>
    handleTimelineDragAround: PropTypes.Validator<(...args: any[]) => any>
    handleTimelinePositionReset: PropTypes.Validator<(...args: any[]) => any>
    handleTimelineArea: PropTypes.Validator<(...args: any[]) => any>
    handleTimelineFold: PropTypes.Validator<(...args: any[]) => any>
    hostFunctions: PropTypes.Validator<object>
  }
}>
import PropTypes from 'prop-types'
import React from 'react'
