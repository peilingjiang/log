import React from 'react'

import Log, { logBaseStyles } from './Log.js'
import { _Aug, _config, _DEF, _H, _rootStyles, _V } from '../constants.js'
import { assertNumber, hexAndOpacityToRGBA } from '../methods/utils.js'
// import { Formatter } from '../formatter/Main.js'

import Arrow from '../icons/arrow.svg'

export default class ShapeLog extends Log {
  render() {
    const {
      log: { args, unit, history, color, timestamps },
      orderReversed,
      expandedLog,
      snap,
      orientation,
      organization,
      hostFunctions,
    } = this.props

    /* -------------------------------------------------------------------------- */
    // get value

    let value = args[0]
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
            <span>{value}</span>{' '}
            {isAugmented ? (
              <span
                className="log-body-timestamp shape-timestamp cursor-pointer"
                onClick={() => {
                  hostFunctions.changeOrganization('timeline')
                }}
              >
                <span>{Math.round(timestamps.at(-1).now)}</span>
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
