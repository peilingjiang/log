import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'

import { _Aug } from '../constants.js'

import Expand from '../icons/expand.svg'
import Fold from '../icons/fold.svg'
// import Relink from '../icons/relink.svg'
import Pause from '../icons/pause.svg'
import Restart from '../icons/restart.svg'
import Delete from '../icons/delete.svg'

import Shape from '../icons/shape.svg'
import Text from '../icons/text.svg'
// import Snap from '../icons/snap.svg'
// import Unsnap from '../icons/unsnap.svg'
import CenterStage from '../icons/center-stage.svg'
// import UnCenterStage from '../icons/un-center-stage.svg'
import TimelineSlider from '../icons/slider.svg'
import Stack from '../icons/stack.svg'

export default class LogStreamMenu extends Component {
  static propTypes = {
    groupId: PropTypes.string.isRequired,
    logsCount: PropTypes.number.isRequired,
    paused: PropTypes.bool.isRequired,
    format: PropTypes.string.isRequired,
    orientation: PropTypes.string.isRequired,
    alignment: PropTypes.string.isRequired,
    streamState: PropTypes.object.isRequired,
    menuFunctions: PropTypes.object.isRequired,
    ////
    snap: PropTypes.bool.isRequired,
    ////
    useShape: PropTypes.bool.isRequired,
    ////
    organization: PropTypes.string.isRequired,
    allowingCenterStaged: PropTypes.bool.isRequired,
    choosingCenterStaged: PropTypes.bool.isRequired,
    centerStagedId: PropTypes.string.isRequired,
    ////
    useTimeline: PropTypes.bool.isRequired,
  }

  componentDidMount() {}

  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps, this.props)
  }

  render() {
    const {
      groupId,
      logsCount,
      paused,
      format,
      orientation,
      alignment,
      useShape,
      organization,
      allowingCenterStaged,
      choosingCenterStaged,
      centerStagedId,
      streamState: { expand },
      menuFunctions: {
        toggleUseTimeline,
        expandStream,
        // startRelink,
        pauseStream,
        deleteStream,
        shapeIt,
        // startSnap,
        // undoSnap,
        toggleChoosingCenterStaged,
        setCenterStagedId,
      },
      // snap,
      useTimeline,
    } = this.props

    const isShape = format === 'shape'
    const isAugmented = organization === _Aug
    const shouldDisable = choosingCenterStaged

    const specialItems = []

    if (logsCount > 2) {
      specialItems.push(
        useTimeline ? (
          <p
            key={'menu-use-timeline'}
            className={`stream-menu-item special-menu-item${
              shouldDisable ? ' disabled' : ''
            }`}
            onMouseDown={toggleUseTimeline}
            title="view the stream in stack view"
          >
            <Stack />
            <span>stack</span>
          </p>
        ) : (
          <p
            key={'menu-use-timeline'}
            className={`stream-menu-item special-menu-item${
              shouldDisable ? ' disabled' : ''
            }`}
            onMouseDown={toggleUseTimeline}
            title="view the stream with a timeline slider"
          >
            <TimelineSlider />
            <span>slider</span>
          </p>
        )
      )
    }

    if (useShape) {
      specialItems.push(
        <p
          key={'shape'}
          className={`stream-menu-item special-menu-item${
            shouldDisable ? ' disabled' : ''
          }`}
          onClick={() => {
            shapeIt(!isShape ? 'shape' : 'text')
          }}
          title={isShape ? 'show as text' : 'show as shape'}
        >
          {!isShape ? <Shape /> : <Text />}
          <span>{!isShape ? 'shape' : 'text'}</span>
        </p>
      )
    }

    // if (isShape && isAugmented) {
    //   specialItems.push(
    //     !snap ? (
    //       <p
    //         key={'menu-snap'}
    //         className={`stream-menu-item special-menu-item cursor-crosshair${
    //           shouldDisable ? ' disabled' : ''
    //         }`}
    //         onMouseDown={startSnap}
    //         title="snap to element point"
    //       >
    //         <Snap />
    //         <span>snap</span>
    //       </p>
    //     ) : (
    //       <p
    //         key={'menu-snap'}
    //         className={`stream-menu-item special-menu-item${
    //           shouldDisable ? ' disabled' : ''
    //         }`}
    //         onMouseDown={undoSnap}
    //         title="unsnap"
    //       >
    //         <Unsnap />
    //         <span>unsnap</span>
    //       </p>
    //     )
    //   )
    // }

    if (allowingCenterStaged) {
      specialItems.push(
        <p
          key={'menu-center-staged'}
          className={`stream-menu-item special-menu-item${
            choosingCenterStaged ? ' menu-choosing-item' : ''
          }${centerStagedId.length ? ' menu-already-center-staged' : ''}`}
          onClick={() => {
            if (choosingCenterStaged) {
              setCenterStagedId(groupId, '')
              // no need to toggle, set choosing to false when update id
              // toggleChoosingCenterStaged()
            } else {
              toggleChoosingCenterStaged()
            }
          }}
          title={
            choosingCenterStaged
              ? 'dismantle the center stage'
              : 'center stage a component'
          }
        >
          <CenterStage />
          <span>{choosingCenterStaged ? 'un-stage' : 'stage'}</span>
        </p>
      )
      // if (centerStagedId.length) {
      //   // already has a center staged id
      //   specialItems.push(
      //     <p
      //       key={'menu-un-center-staged'}
      //       className={`stream-menu-item special-menu-item menu-un-center-staged-item`}
      //       onClick={() => {
      //         setCenterStagedId(groupId, '')
      //       }}
      //       title="dismantle the center stage"
      //     >
      //       <CenterStage />
      //     </p>
      //   )
      // } else {}
    }

    return (
      <div
        className={`hyper-log-stream-menu stream-menu-${orientation}`}
        style={{
          justifyContent: alignment,
        }}
      >
        {!useTimeline && (
          <p
            className={`stream-menu-item menu-expand-item${
              useTimeline ? ' disabled' : ''
            }`}
            onClick={expandStream}
            title="expand"
          >
            {/* {expand ? <Fold /> : <Expand />} {expand ? 'fold' : 'expand'} */}
            {expand ? <Fold /> : <Expand />}
            <span>{expand ? 'fold' : 'expand'}</span>
          </p>
        )}

        {/* {isAugmented && (
          <p
            className={`stream-menu-item cursor-crosshair${
              shouldDisable ? ' disabled' : ''
            }`}
            onMouseDown={startRelink}
            title="attach to element"
          >
            <Relink />
            <span>attach</span>
          </p>
        )} */}

        {/* -------------------------------------------------------------------------- */}
        {/* special items */}
        {specialItems.length ? specialItems : null}
        {/* -------------------------------------------------------------------------- */}

        {isAugmented && (
          <p
            key={'menu-pause'}
            className={`stream-menu-item menu-${
              paused ? 'resume' : 'pause'
            }-item`}
            onMouseDown={pauseStream}
            title={paused ? 'resume' : 'pause'}
          >
            {paused ? <Restart /> : <Pause />}
            <span>{paused ? 'resume' : 'pause'}</span>
          </p>
        )}

        {isAugmented && paused && (
          <p
            key={'menu-delete'}
            className="stream-menu-item menu-delete-item"
            onMouseDown={deleteStream}
            title="delete"
          >
            <Delete />
            <span>delete</span>
            {/* <Delete /> */}
          </p>
        )}
      </div>
    )
  }
}
