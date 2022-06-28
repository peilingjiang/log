import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { v4 as uuid } from 'uuid'

import { FolderIcon } from './FolderIcon.js'
import { foldedArrayShowItemCount } from '../constants.js'
import { arrayFirst } from '../methods/utils.js'
import { FoldedDisplay } from './FoldedDisplay.js'

export const FormatterArray = ({ arr, inheritId, formatArg, minimal }) => {
  const [folded, setFolded] = useState(true)

  const toggleFold = () => {
    setFolded(!folded)
  }

  let content

  if (minimal) {
    if (arr.length)
      content = (
        <>
          {'['}
          {arr.length === 1 ? (
            formatArg(arr[0], `${inheritId}-min`, true)
          ) : (
            <FoldedDisplay />
          )}
          {']'}
        </>
      )
    else content = '[]'
    return <div className="f-array f-array-minimal minimal">{content}</div>
  }

  if (folded) {
    // folded
    const innerItems = []
    for (let i in arrayFirst(arr, foldedArrayShowItemCount)) {
      innerItems.push(formatArg(arr[i], `${inheritId}-${i}`, true))
      if (i < arr.length - 1)
        innerItems.push(
          <span key={`${inheritId}-${i}-com`} className="simple-inline-element">
            ,
          </span>
        )
    }
    content = (
      <>
        <FolderIcon folded={folded} toggleFold={toggleFold} />
        <span className="arr-length dimmed-info">{`(${arr.length})`}</span>
        {'['}
        {innerItems}
        {arr.length > foldedArrayShowItemCount ? <FoldedDisplay /> : null}
        {']'}
      </>
    )
  } else {
    // unfolded
    content = (
      <>
        <div className="simple-inline-element bold-info">
          <FolderIcon folded={folded} toggleFold={toggleFold} />
          {'['}
        </div>

        <div className="unfolded-inner">
          {arr.map((arg, i) => {
            return (
              <div key={`${inheritId}-${i}-in`} className="inner-item">
                <div className="simple-inline-element inner-item-ind dimmed-info">
                  {i}
                </div>
                {formatArg(arg, `${inheritId}-${i}`, false)}
              </div>
            )
          })}
        </div>

        <div className="simple-inline-element bold-info">{']'}</div>
      </>
    )
  }

  return (
    <div
      className={`f-array ${folded ? 'f-array-folded' : 'f-array-unfolded'}`}
    >
      {content}
    </div>
  )
}

FormatterArray.propTypes = {
  arr: PropTypes.array.isRequired,
  inheritId: PropTypes.string.isRequired,
  formatArg: PropTypes.func.isRequired,
  minimal: PropTypes.bool.isRequired,
}
