import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'

import FormatterArray from './FormatterArray.js'
import FormatterObject from './FormatterObject.js'
import {
  assertNumber,
  assertTypeOfArg,
  removeArgsDescriptions,
} from '../methods/utils.js'
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
      choosingCenterStaged: PropTypes.bool.isRequired,
    }
  }

  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps, this.props)
  }

  handleClick(e) {
    if (
      !this.props.choosingCenterStaged ||
      !e.target.classList.contains('hyper-choosing')
    )
      return true

    e.stopPropagation()
    this.props.streamFunctions.setCenterStagedId(
      this.props.groupId,
      e.target.dataset.key
    )
  }

  parseCenterStagedValueFromId(args, id) {
    const sequentialGetters = removeArgsDescriptions(id).split('-')

    let progressId = ''
    for (const getterInd in sequentialGetters) {
      const getter = sequentialGetters[getterInd]
      const parsedGetter = assertNumber(getter) ? parseInt(getter) : getter
      // keep going only when args[parsedGetter] has a value,
      // or, if it's the last getter (the inner-most value could just be undefined)
      if (args[parsedGetter] || getterInd === sequentialGetters.length - 1) {
        args = args[parsedGetter]
        progressId += getter
      } else return [args, progressId]
    }

    return [args, id]
  }

  render() {
    const {
      args,
      groupId,
      logId,
      view,
      streamFunctions,
      choosingCenterStaged,
    } = this.props

    let formattedArgs
    if (view.centerStagedId.length) {
      const [argsForFormatter, idForFormatter] =
        this.parseCenterStagedValueFromId(args, view.centerStagedId)

      formattedArgs = formatArg(
        argsForFormatter,
        groupId,
        `(${logId}-)${idForFormatter}`,
        {
          centerStagedId: view.centerStagedId,
          unfoldedIds: view.unfoldedIds,
          highlightedIds: view.highlightedIds,
        },
        streamFunctions,
        false,
        choosingCenterStaged
      )
    } else {
      formattedArgs = args.map((arg, i) => {
        return formatArg(
          arg,
          groupId,
          `(${logId}-)${i}`, // !
          {
            centerStagedId: view.centerStagedId,
            unfoldedIds: view.unfoldedIds,
            highlightedIds: view.highlightedIds,
          },
          streamFunctions,
          false,
          choosingCenterStaged
        )
        // return (
        //   <>
        //     {formatArg(arg, `${logId}-${i}`, false)}
        //     {i < this.props.args.length - 1 ? ',' : null}
        //   </>
        // )
      })
    }

    return (
      <div className="hyper-log-formatted-content" onClick={this.handleClick}>
        {formattedArgs}
      </div>
    )
  }
}

const formatArg = (
  arg,
  groupId,
  inheritId,
  idViews,
  streamFunctions,
  minimal = false,
  choosing = false
) => {
  const type = assertTypeOfArg(arg)
  switch (type) {
    case 'undefined':
      return (
        <span
          className={`f-undefined${choosing ? ' hyper-choosing' : ''}`}
          key={`${inheritId}[und]`}
          data-key={`${inheritId}[und]`}
        >
          undefined
        </span>
      )
    case 'null':
      return (
        <span
          className={`f-undefined${choosing ? ' hyper-choosing' : ''}`}
          key={`${inheritId}[null]`}
          data-key={`${inheritId}[null]`}
        >
          null
        </span>
      )
    case 'number':
      return (
        <span
          className={`f-number${choosing ? ' hyper-choosing' : ''}`}
          key={`${inheritId}[num]`}
          data-key={`${inheritId}[num]`}
        >
          {arg}
        </span>
      )
    case 'string':
      if (minimal) {
        return (
          <span
            className={`f-string f-string-minimal minimal${
              choosing ? ' hyper-choosing' : ''
            }`}
            key={`${inheritId}[str]`}
            data-key={`${inheritId}[str]`}
          >
            {wrapString(arg)}
          </span>
        )
      }
      return (
        <span
          className={`f-string${choosing ? ' hyper-choosing' : ''}`}
          key={`${inheritId}[str]`}
          data-key={`${inheritId}[str]`}
        >{`${arg}`}</span>
      )

    case 'boolean':
      return (
        <span
          className={`f-boolean${choosing ? ' hyper-choosing' : ''}`}
          key={`${inheritId}[bool]`}
          data-key={`${inheritId}[bool]`}
        >
          {arg ? 'true' : 'false'}
        </span>
      )

    case 'function':
      return (
        <p
          className={`f-function${choosing ? ' hyper-choosing' : ''}`}
          key={`${inheritId}[func]`}
          data-key={`${inheritId}[func]`}
        >
          <span className="function-label">F</span>
          <span className="function-name">
            {arg.name ? arg.name : 'anonymous'}
          </span>
        </p>
      )

    case 'array':
      return (
        <FormatterArray
          key={`${inheritId}[arr]`}
          arr={arg}
          groupId={groupId}
          inheritId={inheritId}
          idViews={idViews}
          streamFunctions={streamFunctions}
          formatArg={formatArg}
          minimal={minimal}
          choosing={choosing}
        />
      )

    case 'object':
      return (
        <FormatterObject
          key={`${inheritId}[obj]`}
          obj={arg}
          groupId={groupId}
          inheritId={inheritId}
          idViews={idViews}
          streamFunctions={streamFunctions}
          formatArg={formatArg}
          minimal={minimal}
          choosing={choosing}
        />
      )

    default:
      return (
        <span
          className={`f-unable-to-parse${choosing ? ' hyper-choosing' : ''}`}
          key={`${inheritId}[unparsed]`}
          data-key={`${inheritId}[unparsed]`}
        >
          {JSON.stringify(arg)}
        </span>
      )
  }
}
