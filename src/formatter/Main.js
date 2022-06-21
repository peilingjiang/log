import React from 'react'
import PropTypes from 'prop-types'

import { assertTypeOfArg } from '../methods/utils.js'

export const Formatter = ({ args }) => {
  const formattedArgs = args.map(arg => {
    return formatArg(arg)
  })
  return <div className="hyper-log-formatted-content">{formattedArgs}</div>
}

const formatArg = arg => {
  const type = assertTypeOfArg(arg)
  switch (type) {
    case 'undefined':
      return (
        <span className="f-undefined" key="undefined">
          undefined
        </span>
      )
    case 'null':
      return (
        <span className="f-undefined" key="undefined-null">
          null
        </span>
      )
    case 'number':
      return (
        <span className="f-number" key={`number`}>
          {arg}
        </span>
      )
    case 'string':
      return <span className="f-string" key={`string`}>{`'${arg}'`}</span>
    default:
      return (
        <span className="f-unable-to-parse" key={`no-parse`}>
          {arg}
        </span>
      )
  }
}

Formatter.propTypes = {
  args: PropTypes.array,
}
