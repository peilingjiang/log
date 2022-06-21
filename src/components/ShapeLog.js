import React, { Component } from 'react'

import Log from '../Log.js'
import { _config, _DEF, _H, _rootStyles, _V } from '../constants.js'
import { assertNumber, hexAndOpacityToRGBA } from '../methods/utils.js'
import { Formatter } from '../formatter/Main.js'

export default class ShapeLog extends Log {
  render() {
    const {
      log: { args, unit, history, color },
      orderReversed,
      logsCount,
      expandedLog,
      snap,
      orientation,
    } = this.props

    const orderInHistoryDisplayStack =
      Math.min(logsCount, history + 1) - orderReversed - 1

    const historyRenderStyle = {
      zIndex: 100 + orderInHistoryDisplayStack,
      opacity: expandedLog
        ? undefined
        : `${
            _rootStyles.opacityDefault -
            _config.logStreamHistoryRenderOpacityUnitDecrease * orderReversed
          }`,
    }

    /* -------------------------------------------------------------------------- */
    // get value

    let value = args[0]
    if (assertNumber(value)) value = `${value}${unit || 'px'}`

    /* -------------------------------------------------------------------------- */

    const isHorizontal = orientation === _H
    const noteStyle =
      snap && !isHorizontal
        ? {
            transform: `rotate(90deg)`,
            // transformOrigin: 'left bottom',
            padding: '0.5rem 0',
          }
        : {}

    return (
      (expandedLog || orderReversed < history + 1) && (
        <div
          className={`hyper-log${orderReversed === 0 ? '' : ' log-in-history'}${
            expandedLog ? ' log-expand' : ' log-not-expand'
          } hyper-shape-log`}
          style={{
            ...historyRenderStyle,
            background:
              color === _DEF
                ? `${hexAndOpacityToRGBA('#666', _rootStyles.opacityDefault)}`
                : `${hexAndOpacityToRGBA(color, _rootStyles.opacityDefault)}`,
            width: isHorizontal ? value : _config.shapeRectWidth,
            height: isHorizontal ? _config.shapeRectWidth : value,
          }}
        >
          <p className="shape-log-note" style={noteStyle}>
            {value}
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
