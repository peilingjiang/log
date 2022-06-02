import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  logInterface,
  _config,
  _rootStyles,
  _tinyColors,
} from '../constants.js'
import { Formatter } from '../formatter/Main.js'
import { tinyColorToRGBStyleString } from '../methods/utils.js'

export default class LogBody extends Component {
  static get propTypes() {
    return {
      log: logInterface,
      orderReversed: PropTypes.number,
    }
  }

  render() {
    const {
      log: {
        args,
        stack: { file, line },
      },
      orderReversed,
    } = this.props

    return (
      <div
        className="hyper-log-body"
        style={
          {
            // background: `rgba(${tinyColorToRGBStyleString(
            //   _tinyColors.lightGrey
            // )}, ${
            //   _rootStyles.opacityDefault -
            //   _config.logStreamHistoryRenderOpacityUnitDecrease * orderReversed
            // })`,
          }
        }
      >
        <Formatter args={args} />
        {/* <p className="source-location">
          {file}:{line}
        </p> */}
      </div>
    )
  }
}
