import React, { Component } from 'react'
import isEqual from 'react-fast-compare'

import LogHeader from './components/LogHeader.js'
import LogBody from './components/LogBody.js'

import { logInterface } from './constants.js'

export default class Log extends Component {
  static get propTypes() {
    return {
      log: logInterface,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props)
  }

  render() {
    const { log } = this.props

    return (
      <div className={`hyper-log-block`}>
        <LogHeader log={log} />
        <LogBody log={log} />
      </div>
    )
  }
}
