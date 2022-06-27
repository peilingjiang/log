import React from 'react'

import Log, { logBaseStyles } from './Log.js'
import { _config, _DEF, _H, _rootStyles, _V } from '../constants.js'
import { assertNumber, hexAndOpacityToRGBA } from '../methods/utils.js'
// import { Formatter } from '../formatter/Main.js'

export default class ShapeLog extends Log {
  render() {
    const {
      log: { args, unit, history, color },
      orderReversed,
      expandedLog,
      snap,
      orientation,
    } = this.props

    /* -------------------------------------------------------------------------- */
    // get value

    let value = args[0]
    if (assertNumber(value)) value = `${value}${unit || 'px'}`

    /* -------------------------------------------------------------------------- */

    const isHorizontal = orientation === _H
    const noteStyle =
      snap && !isHorizontal
        ? {
            writingMode: 'vertical-rl',
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
            ...logBaseStyles(orderReversed, expandedLog),
            background:
              color === _DEF
                ? hexAndOpacityToRGBA(
                    _rootStyles.darkGrey,
                    _rootStyles.opacityDefault
                  )
                : hexAndOpacityToRGBA(color, _rootStyles.opacityDefault),
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
