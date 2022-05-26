import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Log extends Component {
  static get propTypes() {
    return {
      log: PropTypes.shape({
        id: PropTypes.string,
        groupId: PropTypes.string,
        element: PropTypes.object,
        args: PropTypes.array,
        timestamp: PropTypes.shape({
          now: PropTypes.number,
          date: PropTypes.object,
        }),
        offset: PropTypes.shape({
          x: PropTypes.number,
          y: PropTypes.number,
        }),
      }),
      groupId: PropTypes.string,
    }
  }

  render() {
    const { log, groupId } = this.props

    return (
      <div className="hyper-log-block">
        <div className="hyper-log-header"></div>
        <div className="hyper-log-body"></div>
      </div>
    )
  }
}
