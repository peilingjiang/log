import React from 'react'
import PropTypes from 'prop-types'

export const Formatter = ({ args }) => {
  return <div className="hyper-log-formatted-content">{args.join(' ')}</div>
}

Formatter.propTypes = {
  args: PropTypes.array,
}
