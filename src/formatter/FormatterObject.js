import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'
// import { v4 as uuid } from 'uuid'

import { foldedObjectShowItemCount } from '../constants.js'
import { arrayFirst } from '../methods/utils.js'
import { isEmptyObject } from './utils.js'
import { ObjectKey, FoldedDisplay, FolderIcon } from './components.js'

const FormatterObject = ({ obj, inheritId, formatArg, minimal }) => {
  const [folded, setFolded] = useState(true)

  const toggleFold = () => {
    setFolded(!folded)
  }

  let content

  if (minimal) {
    if (!isEmptyObject(obj)) {
      content = (
        <>
          {'{'}
          {Object.keys(obj).length === 1 ? (
            <ObjectKey
              value={Object.keys(obj)[0]}
              inheritId={`${inheritId}-0`}
              bold={true}
            />
          ) : (
            <FoldedDisplay />
          )}
          {'}'}
        </>
      )
    } else content = '{}'
    return <div className="f-object f-object-minimal minimal">{content}</div>
  }

  const objKeys = Object.keys(obj)
  if (folded) {
    // folded
    const innerItems = []

    for (const keyInd in arrayFirst(objKeys, foldedObjectShowItemCount)) {
      const keyValue = objKeys[keyInd]
      innerItems.push(
        <ObjectKey
          key={`${inheritId}-${keyInd}-obj-key`}
          value={keyValue}
          inheritId={`${inheritId}-${keyInd}`}
          bold={false}
        />
      )
      innerItems.push(
        <span
          key={`${inheritId}-${keyInd}-col`}
          className="simple-inline-element"
        >
          :
        </span>
      )
      innerItems.push(
        formatArg(obj[objKeys[keyInd]], `${inheritId}-${keyInd}-val`, true)
      )

      if (keyInd < objKeys.length - 1)
        innerItems.push(
          <span
            key={`${inheritId}-${keyInd}-com`}
            className="simple-inline-element"
          >
            ,
          </span>
        )
    }
    content = (
      <>
        {!isEmptyObject(obj) && (
          <FolderIcon folded={folded} toggleFold={toggleFold} />
        )}
        <span className="obj-length info-dimmed">{`(${objKeys.length})`}</span>
        {'{'}
        {innerItems}
        {objKeys.length > foldedObjectShowItemCount ? <FoldedDisplay /> : null}
        {'}'}
      </>
    )
  } else {
    content = (
      <>
        <div className="simple-inline-element info-bold">
          <FolderIcon folded={folded} toggleFold={toggleFold} />
          {'{'}
        </div>

        <div className="unfolded-inner">
          {objKeys.map((objKey, i) => {
            return (
              <div key={`${inheritId}-${i}-in`} className="inner-item">
                <ObjectKey
                  key={`${inheritId}-${i}-obj-key`}
                  value={objKey}
                  inheritId={`${inheritId}-${i}`}
                  bold={true}
                />
                <span
                  key={`${inheritId}-${i}-col`}
                  className="simple-inline-element"
                >
                  :
                </span>
                {formatArg(obj[objKey], `${inheritId}-${i}-val`, false)}
              </div>
            )
          })}
        </div>

        <div className="simple-inline-element info-bold">{'}'}</div>
      </>
    )
  }

  return (
    <div
      className={`f-object ${folded ? 'f-object-folded' : 'f-object-unfolded'}`}
    >
      {content}
    </div>
  )
}

FormatterObject.propTypes = {
  obj: PropTypes.object.isRequired,
  inheritId: PropTypes.string.isRequired,
  formatArg: PropTypes.func.isRequired,
  minimal: PropTypes.bool.isRequired,
}

export default memo(FormatterObject, isEqual)
