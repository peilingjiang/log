import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'

// import LogHeader from './components/LogHeader.js'
import LogBody from './LogBody.js'

import {
  // boundingInterface,
  logInterface,
  logViewInterface,
  _config,
} from '../constants.js'
import { constrain } from '../methods/utils.js'

export default class Log extends Component {
  static get propTypes() {
    return {
      groupId: PropTypes.string.isRequired,
      log: logInterface.isRequired,
      orderReversed: PropTypes.number.isRequired,
      expandedLog: PropTypes.bool.isRequired,
      // groupBounding: boundingInterface,
      // logsCount: PropTypes.number,
      snap: PropTypes.bool.isRequired,
      orientation: PropTypes.string,
      ////
      hostFunctions: PropTypes.object.isRequired,
      streamFunctions: PropTypes.object.isRequired,
      organization: PropTypes.string.isRequired,
      ////
      view: logViewInterface.isRequired,
      choosingCenterStaged: PropTypes.bool.isRequired,
      highlightChanged: PropTypes.bool.isRequired,
      ////
      logStats: PropTypes.object.isRequired,
      useStats: PropTypes.bool.isRequired,
      ////
      registries: PropTypes.object.isRequired,
      showRegistries: PropTypes.bool.isRequired,
    }
  }

  shouldComponentUpdate(nextProps) {
    // const {
    //   expandedLog,
    //   orderReversed,
    //   log: { history },
    // } = nextProps
    // const { expandedLog: prevExpandedLog } = this.props

    // if the stream is not expanded, now and then,
    // and this log is not in the displayed history
    // we update one more time (history + 1) as we need to hide it
    // before stop updating it
    // if (!expandedLog && !prevExpandedLog && orderReversed > history * 2)
    //   return false

    return !isEqual(nextProps, this.props)
  }

  // componentDidMount() {
  //   const {
  //     groupId,
  //     log,
  //     view,
  //     asyncToGraphics,
  //     graphicsLifeCycle: { add },
  //   } = this.props

  //   if (asyncToGraphics) {
  //     add(groupId, log, view.centerStagedId)
  //   }
  // }

  // componentDidUpdate(prevProps) {
  //   const {
  //     groupId,
  //     log,
  //     view,
  //     asyncToGraphics,
  //     graphicsLifeCycle: { add },
  //   } = this.props

  //   if (
  //     asyncToGraphics &&
  //     (!prevProps.asyncToGraphics ||
  //       !areArgsEqual(log.args, prevProps.log.args))
  //   ) {
  //     add(groupId, log, view.centerStagedId)
  //   }
  // }

  // given the current adding mechanism, maybe we don't need to explicitly remove
  // componentWillUnmount() {
  //   const {
  //     groupId,
  //     asyncToGraphics,
  //     graphicsLifeCycle: { remove },
  //   } = this.props

  //   if (asyncToGraphics) remove(groupId)
  // }

  render() {
    const {
      groupId,
      log,
      orderReversed,
      expandedLog,
      hostFunctions,
      streamFunctions,
      organization,
      view,
      choosingCenterStaged,
      highlightChanged,
      registries,
      showRegistries,
    } = this.props
    const {
      log: { level, args, id, count, timestamps, stack, color, unit },
    } = this.props

    const hasNoArgs = args.length === 0

    if (!expandedLog && orderReversed > log.history) return undefined

    return (
      <div
        className={`hyper-log${
          orderReversed === 0 ? ' log-current' : ' log-in-history'
        }${expandedLog ? ' log-expand' : ' log-not-expand'}${
          hasNoArgs ? ' here-there-log' : ''
        } level-${level}`}
        style={logBaseStyles(orderReversed, expandedLog)}
        data-id={id}
      >
        {/* <LogHeader log={log} /> */}
        <LogBody
          // key={highlightChanged ? `${groupId}-stream-timeline-log-body` : undefined}
          args={args}
          groupId={groupId}
          id={id}
          count={count}
          timestamp={timestamps.at(-1).now}
          stack={stack}
          color={color}
          unit={unit}
          ////
          opacity={constrain(
            1 -
              _config.logStreamHistoryRenderOpacityUnitDecrease * orderReversed,
            0.5,
            1
          )}
          orderReversed={orderReversed}
          expandedLog={expandedLog}
          hostFunctions={hostFunctions}
          streamFunctions={streamFunctions}
          organization={organization}
          view={view}
          choosingCenterStaged={choosingCenterStaged}
          highlightChanged={highlightChanged}
          registries={registries}
          showRegistries={showRegistries}
        />
      </div>
    )
  }
}

export const logBaseStyles = (orderReversed, expanded) => ({
  // zIndex: 1000 - orderReversed,
  // opacity: expanded
  //   ? undefined
  //   : 1 - _config.logStreamHistoryRenderOpacityUnitDecrease * orderReversed,
  zIndex: 99999 - orderReversed,
})
