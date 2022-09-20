import React from 'react'

import Log, { logBaseStyles } from './Log.js'
import {
  _Aug,
  _config,
  _DEF,
  _H,
  _rootStyles,
  _Time,
  _V,
} from '../constants.js'
import {
  assertNumber,
  constrain,
  hexAndOpacityToRGBA,
  map,
  parseCenterStagedValueFromId,
} from '../methods/utils.js'
// import { Formatter } from '../formatter/Main.js'

import Arrow from '../icons/arrow.svg'
import { pxTrim, unitTrim } from '../methods/findPosition.js'

export default class ShapeLog extends Log {
  render() {
    const {
      log: { id, level, args, unit, history, color, timestamps },
      orderReversed,
      expandedLog,
      snap,
      orientation,
      organization,
      hostFunctions,
      streamFunctions,
      view: { centerStagedId },
      logStats: { min, max, average },
      useStats,
    } = this.props

    /* -------------------------------------------------------------------------- */
    // get value

    // TODO robust on args that cannot be parsed
    let value = centerStagedId
      ? parseCenterStagedValueFromId(args, centerStagedId)[0]
      : args[0]
    // TODO should the default unit be px?
    if (assertNumber(value)) value = `${value}${unit || 'px'}`

    /* -------------------------------------------------------------------------- */

    const isHorizontal = orientation === _H
    const isAugmented = organization === _Aug

    const noteStyle =
      snap && !isHorizontal
        ? {
            writingMode: 'vertical-rl',
            padding: '0.5rem 0',
          }
        : {}

    const opacity = expandedLog
      ? 1
      : constrain(
          _rootStyles.opacityDefault -
            _config.logStreamHistoryRenderOpacityUnitDecrease * orderReversed,
          0.5,
          1
        )

    const shapeValue = useStats
      ? `${
          _rootStyles.maxLogWidthRem *
          map(pxTrim(value), min, max, _rootStyles.minLogWidthRatioToMax, 1)
        }rem`
      : value

    return (
      (expandedLog || orderReversed < history + 1) && (
        <div
          className={`hyper-log${orderReversed === 0 ? '' : ' log-in-history'}${
            expandedLog ? ' log-expand' : ' log-not-expand'
          } hyper-shape-log level-${level}`}
          style={{
            ...logBaseStyles(orderReversed, expandedLog),
            background:
              color === _DEF
                ? hexAndOpacityToRGBA(_rootStyles.darkGrey, opacity)
                : hexAndOpacityToRGBA(color, opacity),
            width: isHorizontal ? shapeValue : _config.shapeRectWidth,
            height: isHorizontal ? _config.shapeRectWidth : shapeValue,
          }}
          data-id={id}
        >
          <p className="shape-log-note" style={noteStyle}>
            <span
              className="shape-log-value"
              onClick={streamFunctions.toggleUseStats}
            >{`${useStats ? '[%] ' : ''}${
              useStats ? unitTrim(value) : value
            }`}</span>{' '}
            {isAugmented ? (
              <span
                className="log-body-timestamp shape-timestamp cursor-pointer font-fixed-width"
                onClick={() => {
                  hostFunctions.changeOrganization(_Time, id)
                }}
              >
                {/* <span className="font-fixed-width"> */}
                {Math.round(timestamps.at(-1).now)}
                {/* </span> */}
                <Arrow />
              </span>
            ) : // ) : (
            //   <p className="log-body-timestamp">
            //     <span>{Math.round(timestamp)}</span>
            //   </p>
            // )}
            null}
          </p>
          {/* <div className="hyper-log-body-content">
            <Formatter args={args} />
            <span>{unit ? `${unit}` : ''}</span>
          </div> */}
        </div>
      )
    )
  }
}
