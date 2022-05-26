import React, { Component } from 'react'

import { logInterface } from '../constants.js'

export default class LogHeader extends Component {
  static get propTypes() {
    return {
      log: logInterface,
    }
  }

  render() {
    return <div className="hyper-log-header"></div>
  }
}
