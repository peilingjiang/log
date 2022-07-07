import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { highlightElement } from '../methods/highlight.js'
import { assertExistence } from '../methods/utils.js'
import { wrapString } from './utils.js'

class BaseObject extends PureComponent {
  static get propTypes() {
    return {
      arg: PropTypes.any.isRequired,
      inheritId: PropTypes.string.isRequired,
      choosing: PropTypes.bool.isRequired,
      highlightChanged: PropTypes.bool.isRequired,
    }
  }

  componentDidUpdate(prevProps) {
    const { highlightChanged, arg } = this.props
    if (
      highlightChanged &&
      assertExistence(prevProps.arg) &&
      prevProps.arg !== arg
    ) {
      highlightElement(this.ref, {
        style: 'background',
        animate: true,
        scrollIntoView: false,
        upFront: false,
      })
    }
  }
}

export class FormatterNumber extends BaseObject {
  render() {
    const { arg, inheritId, choosing } = this.props
    return (
      <span
        ref={e => (this.ref = e)}
        // key={`${inheritId}[num]`}
        className={`f-number${choosing ? ' hyper-choosing' : ''}`}
        data-key={`${inheritId}[num]`}
      >
        {arg}
      </span>
    )
  }
}

export class FormatterString extends BaseObject {
  render() {
    const { arg, inheritId, choosing, minimal } = this.props

    if (minimal) {
      return (
        <span
          ref={e => (this.ref = e)}
          // key={`${inheritId}[str]`}
          className={`f-string f-string-minimal minimal${
            choosing ? ' hyper-choosing' : ''
          }`}
          data-key={`${inheritId}[str]`}
        >
          {wrapString(arg)}
        </span>
      )
    }
    return (
      <span
        ref={e => (this.ref = e)}
        // key={`${inheritId}[str]`}
        className={`f-string${choosing ? ' hyper-choosing' : ''}`}
        data-key={`${inheritId}[str]`}
      >{`${arg}`}</span>
    )
  }
}

export class FormatterBoolean extends BaseObject {
  render() {
    const { arg, inheritId, choosing, minimal } = this.props
    return (
      <span
        ref={e => (this.ref = e)}
        // key={`${inheritId}[bool]`}
        className={`f-boolean${choosing ? ' hyper-choosing' : ''}`}
        data-key={`${inheritId}[bool]`}
      >
        {arg ? (minimal ? 't' : 'true') : minimal ? 'f' : 'false'}
      </span>
    )
  }
}

export class FormatterFoldedDisplay extends BaseObject {
  render() {
    return (
      <span ref={e => (this.ref = e)} className="f-folded-display">
        ...
      </span>
    )
  }
}
