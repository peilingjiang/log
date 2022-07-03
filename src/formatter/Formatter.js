import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'

import FormatterArray from './FormatterArray.js'
import FormatterObject from './FormatterObject.js'
import { assertTypeOfArg } from '../methods/utils.js'
import { wrapString } from './utils.js'
import { logViewInterface } from '../constants.js'

export class Formatter extends Component {
  static get propTypes() {
    return {
      args: PropTypes.array.isRequired,
      groupId: PropTypes.string.isRequired,
      logId: PropTypes.string.isRequired,
      view: logViewInterface.isRequired,
      streamFunctions: PropTypes.object.isRequired,
    }
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps, this.props)
  }

  render() {
    const { groupId, logId, view, streamFunctions } = this.props
    const formattedArgs = this.props.args.map((arg, i) => {
      return formatArg(
        arg,
        groupId,
        `(${logId}-)${i}`,
        {
          centerStagedId: view.centerStagedId,
          unfoldedIds: view.unfoldedIds,
          highlightedIds: view.highlightedIds,
        },
        streamFunctions,
        false
      )
      // return (
      //   <>
      //     {formatArg(arg, `${logId}-${i}`, false)}
      //     {i < this.props.args.length - 1 ? ',' : null}
      //   </>
      // )
    })
    return <div className="hyper-log-formatted-content">{formattedArgs}</div>
  }
}

const formatArg = (
  arg,
  groupId,
  inheritId,
  idViews,
  streamFunctions,
  minimal = false
) => {
  const type = assertTypeOfArg(arg)
  switch (type) {
    case 'undefined':
      return (
        <span className="f-undefined" key={`${inheritId}-und`}>
          undefined
        </span>
      )
    case 'null':
      return (
        <span className="f-undefined" key={`${inheritId}-null`}>
          null
        </span>
      )
    case 'number':
      return (
        <span className="f-number" key={`${inheritId}-${arg}`}>
          {arg}
        </span>
      )
    case 'string':
      if (minimal) {
        return (
          <span
            className="f-string f-string-minimal minimal"
            key={`${inheritId}-str`}
          >
            {wrapString(arg)}
          </span>
        )
      }
      return (
        <span className="f-string" key={`${inheritId}-str`}>{`${arg}`}</span>
      )

    case 'boolean':
      return (
        <span className="f-boolean" key={`${inheritId}-bool`}>
          {arg ? 'true' : 'false'}
        </span>
      )

    case 'function':
      return (
        <p className="f-function" key={`${inheritId}-func`}>
          <span className="function-label">F</span>
          <span className="function-name">
            {arg.name ? arg.name : 'anonymous'}
          </span>
        </p>
      )

    case 'array':
      return (
        <FormatterArray
          key={`${inheritId}-arr`}
          arr={arg}
          groupId={groupId}
          inheritId={inheritId}
          idViews={idViews}
          streamFunctions={streamFunctions}
          formatArg={formatArg}
          minimal={minimal}
        />
      )

    case 'object':
      return (
        <FormatterObject
          key={`${inheritId}-obj`}
          obj={arg}
          groupId={groupId}
          inheritId={inheritId}
          idViews={idViews}
          streamFunctions={streamFunctions}
          formatArg={formatArg}
          minimal={minimal}
        />
      )

    default:
      return (
        <span className="f-unable-to-parse" key={inheritId}>
          {JSON.stringify(arg)}
        </span>
      )
  }
}
