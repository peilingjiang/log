import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'

import { logViewInterface, _Aug, _DEF, _rootStyles } from '../constants.js'
import { Formatter } from '../formatter/Formatter.js'
import { hexAndOpacityToRGBA } from '../methods/utils.js'

import Arrow from '../icons/arrow.svg'
import CenterStage from '../icons/center-stage.svg'
import { pxTrim } from '../methods/findPosition.js'

export default class LogBody extends Component {
  static get propTypes() {
    return {
      // log: logInterface,
      args: PropTypes.array.isRequired,
      groupId: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
      timestamp: PropTypes.number.isRequired,
      stack: PropTypes.object.isRequired,
      color: PropTypes.string.isRequired,
      unit: PropTypes.string,
      ////
      orderReversed: PropTypes.number.isRequired,
      expandedLog: PropTypes.bool.isRequired,
      ////
      hostFunctions: PropTypes.object.isRequired,
      streamFunctions: PropTypes.object.isRequired,
      organization: PropTypes.string.isRequired,
      view: logViewInterface.isRequired,
      choosingCenterStaged: PropTypes.bool.isRequired,
    }
  }

  constructor(props) {
    super(props)

    this.bodyRef = createRef()
  }

  componentDidMount() {
    this.syncScroll()
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps)
  }

  componentDidUpdate() {
    this.syncScroll()
  }

  handleScroll = e => {
    e.preventDefault()
    e.stopPropagation()

    const {
      groupId,
      streamFunctions: { setScrollView },
    } = this.props

    setScrollView(
      groupId,
      this.bodyRef.current.scrollLeft,
      this.bodyRef.current.scrollTop
    )
  }

  syncScroll = () => {
    this.bodyRef.current.scrollLeft = pxTrim(this.props.view.left)
    this.bodyRef.current.scrollTop = pxTrim(this.props.view.top)
  }

  render() {
    const {
      args,
      groupId,
      id,
      count,
      timestamp,
      stack: { file, line },
      color,
      unit,
      // orderReversed,
      expandedLog,
      hostFunctions,
      streamFunctions,
      organization,
      view,
      choosingCenterStaged,
    } = this.props

    const isAugmented = organization === _Aug

    return (
      <div
        ref={this.bodyRef}
        className="hyper-log-body"
        style={{
          background:
            color === _DEF
              ? undefined
              : `${hexAndOpacityToRGBA(color, _rootStyles.opacityDefault)}`,
        }}
        onScroll={this.handleScroll}
      >
        {expandedLog && (
          <div
            className={`hyper-log-body-header${
              isAugmented ? '' : ' timeline-log-body-header'
            }`}
          >
            {isAugmented ? (
              <p
                className="log-body-timestamp cursor-pointer"
                onClick={() => {
                  hostFunctions.changeOrganization('timeline', id)
                }}
              >
                <span>{Math.round(timestamp)}</span>
                <Arrow />
              </p>
            ) : // ) : (
            //   <p className="log-body-timestamp">
            //     <span>{Math.round(timestamp)}</span>
            //   </p>
            // )}
            null}
            <p className="source-location">
              {file}:{line}
            </p>
          </div>
        )}
        <div className="hyper-log-body-content">
          {view.centerStagedId.length > 0 && (
            <CenterStage className="hyper-log-center-stage" />
          )}
          {count > 1 && <span className="hyper-log-count">{count}</span>}
          <Formatter
            args={args}
            groupId={groupId}
            logId={id}
            view={view}
            streamFunctions={streamFunctions}
            choosingCenterStaged={choosingCenterStaged}
          />
          {unit ? <span className="hyper-log-unit">{unit}</span> : null}
        </div>
      </div>
    )
  }
}
