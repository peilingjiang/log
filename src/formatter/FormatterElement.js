import React from 'react'
import PropTypes from 'prop-types'

import { FormatterString } from './baseObjectTypes.js'
import { idViewsInterface } from '../constants.js'

const FormatterElement = props => {
  const { element, inheritId, choosing } = props
  const { tagName, tagId, tagClass } = _getTagName(element.outerHTML)

  const highlightElement = () => {
    element?.classList?.add('hyper-highlight')
  }

  const deHighlightElement = () => {
    element?.classList?.remove('hyper-highlight')
  }

  return (
    <div
      className={`f-element${choosing ? ' hyper-choosing' : ''}`}
      data-key={`${inheritId}[ele]`}
      onMouseOver={highlightElement}
      onMouseLeave={deHighlightElement}
    >
      <span className="element-label">E</span>
      <ElementDisplay
        elementProps={props}
        element={element}
        tagName={tagName}
        tagId={tagId}
        tagClass={tagClass}
      />
    </div>
  )
}

FormatterElement.propTypes = {
  element: PropTypes.object.isRequired,
  groupId: PropTypes.string.isRequired,
  inheritId: PropTypes.string.isRequired,
  idViews: idViewsInterface.isRequired,
  streamFunctions: PropTypes.object.isRequired,
  formatArg: PropTypes.func.isRequired,
  minimal: PropTypes.bool.isRequired,
  choosing: PropTypes.bool.isRequired,
  highlightChanged: PropTypes.bool.isRequired,
}

const ElementDisplay = ({
  elementProps,
  element,
  tagName,
  tagId,
  tagClass,
}) => {
  return (
    <p className="element-content">
      <span className="element-text">{`<${
        tagName.length ? tagName : 'unknown'
      }`}</span>
      {tagId.length && (
        <span className="element-text-field">
          <span className="element-text-label">id</span>
          <FormatterString
            key={`${elementProps.inheritId}-id[str]`}
            arg={tagId}
            inheritId={`${elementProps.inheritId}-id`}
            choosing={elementProps.choosing}
            highlightChanged={elementProps.highlightChanged}
            minimal={elementProps.minimal}
          />
        </span>
      )}
      <span className="element-text">{`>`}</span>
    </p>
  )
}

ElementDisplay.propTypes = {
  elementProps: PropTypes.object.isRequired,
  element: PropTypes.object.isRequired,
  tagName: PropTypes.string.isRequired,
  tagId: PropTypes.string.isRequired,
  tagClass: PropTypes.string.isRequired,
}

/* -------------------------------------------------------------------------- */

const _getTagName = outerHTML => {
  let firstTag = outerHTML.match(/<(\w+)\s+\w+.*?>/g)
  if (!firstTag) return { tagName: '', tagId: '', tagClass: '' }

  firstTag = firstTag[0]

  const tagName = firstTag.match(/<(\w+)\s+\w+.*?>/)[1]

  const classes = firstTag.match(/class=["'](.*?)["']/g)
  const className = classes
    ? classes[0].replace(/class=["']/, '').replace(/["']/, '')
    : ''
  const ids = firstTag.match(/id=["'](.*?)["']/g)
  const id = ids ? ids[0].replace(/id=["']/, '').replace(/["']/, '') : ''

  // return `<${tagName}${id ? ` id="${id}"` : ''}${
  //   className ? ` class="${className}"` : ''
  // } />`
  return {
    tagName: tagName,
    tagId: id,
    tagClass: className,
  }
}

/* -------------------------------------------------------------------------- */

export default FormatterElement
