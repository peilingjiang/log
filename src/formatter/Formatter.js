import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'

import FormatterArray from './FormatterArray.js'
import FormatterObject from './FormatterObject.js'
import {
  assertElement,
  assertTypeOfArg,
  parseCenterStagedValueFromId,
  removeLogId,
} from '../methods/utils.js'
import { wrapString } from './utils.js'
import { logViewInterface } from '../constants.js'
import {
  FormatterBoolean,
  FormatterNumber,
  FormatterString,
} from './baseObjectTypes.js'
import { assertInteractionEvent } from '../methods/specialHubUtils.js'
import FormatterInteractionEvent from './FormatterInteractionEvent.js'
import FormatterElement from './FormatterElement.js'

export class Formatter extends Component {
  static get propTypes() {
    return {
      args: PropTypes.array.isRequired,
      groupId: PropTypes.string.isRequired,
      logId: PropTypes.string.isRequired,
      view: logViewInterface.isRequired,
      streamFunctions: PropTypes.object.isRequired,
      choosingCenterStaged: PropTypes.bool.isRequired,
      highlightChanged: PropTypes.bool.isRequired,
      ////
      registries: PropTypes.object.isRequired,
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

  render() {
    const {
      args,
      groupId,
      logId,
      view,
      streamFunctions,
      choosingCenterStaged,
      highlightChanged,
      registries,
    } = this.props

    let formattedArgs

    // ! center staged
    if (view.centerStagedId.length) {
      const [argsForFormatter, idForFormatter] = parseCenterStagedValueFromId(
        args,
        view.centerStagedId
      )

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
        choosingCenterStaged,
        highlightChanged
      )
    } else {
      // ! normal
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
          choosingCenterStaged,
          highlightChanged
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

export const formatArg = (
  arg,
  groupId,
  inheritId,
  idViews,
  streamFunctions,
  minimal = false,
  choosing = false,
  highlightChanged = false
) => {
  const type = assertTypeOfArg(arg)
  // for highlightChanged
  const standardInheritId = highlightChanged
    ? removeLogId(inheritId)
    : inheritId

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
        <FormatterNumber
          key={`${standardInheritId}[num]`}
          // key={`${inheritId}[num]`}
          arg={arg}
          inheritId={inheritId}
          choosing={choosing}
          highlightChanged={highlightChanged}
          minimal={minimal}
        />
      )
    case 'string':
      return (
        <FormatterString
          key={`${standardInheritId}[str]`}
          arg={arg}
          inheritId={inheritId}
          choosing={choosing}
          highlightChanged={highlightChanged}
          minimal={minimal}
        />
      )

    case 'boolean':
      return (
        <FormatterBoolean
          key={`${standardInheritId}[bool]`}
          arg={arg}
          inheritId={inheritId}
          choosing={choosing}
          highlightChanged={highlightChanged}
          minimal={minimal}
        />
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
          key={`${standardInheritId}[arr]`}
          arr={arg}
          groupId={groupId}
          inheritId={inheritId}
          idViews={idViews}
          streamFunctions={streamFunctions}
          formatArg={formatArg}
          minimal={minimal}
          choosing={choosing}
          highlightChanged={highlightChanged}
        />
      )

    case 'object':
      if (assertElement(arg))
        return (
          <FormatterElement
            key={`${standardInheritId}[ele]`}
            element={arg}
            groupId={groupId}
            inheritId={inheritId}
            idViews={idViews}
            streamFunctions={streamFunctions}
            formatArg={formatArg}
            minimal={minimal}
            choosing={choosing}
            highlightChanged={highlightChanged}
          />
        )
      if (assertInteractionEvent(arg))
        return (
          <FormatterInteractionEvent
            key={`${standardInheritId}[event]`}
            event={arg}
            groupId={groupId}
            inheritId={inheritId}
            idViews={idViews}
            streamFunctions={streamFunctions}
            formatArg={formatArg}
            minimal={minimal}
            choosing={choosing}
            highlightChanged={highlightChanged}
          />
        )

      return (
        <FormatterObject
          key={`${standardInheritId}[obj]`}
          obj={arg}
          groupId={groupId}
          inheritId={inheritId}
          idViews={idViews}
          streamFunctions={streamFunctions}
          formatArg={formatArg}
          minimal={minimal}
          choosing={choosing}
          highlightChanged={highlightChanged}
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
