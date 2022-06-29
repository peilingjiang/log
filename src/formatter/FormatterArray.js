import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'
// import { v4 as uuid } from 'uuid'

import { FoldedDisplay, FolderIcon } from './components.js'
import { foldedArrayShowItemCount } from '../constants.js'
import { arrayFirst } from '../methods/utils.js'
import { isEmptyArray } from './utils.js'

const FormatterArray = ({ arr, inheritId, formatArg, minimal }) => {
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
            formatArg(arr[0], `${inheritId}-arr-min`, true)
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
        {!isEmptyArray(arr) && (
          <FolderIcon folded={folded} toggleFold={toggleFold} />
        )}
        <span className="arr-length info-dimmed">{`(${arr.length})`}</span>
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
        <div className="simple-inline-element info-bold">
          <FolderIcon folded={folded} toggleFold={toggleFold} />
          {'['}
        </div>

        <div className="unfolded-inner">
          {arr.map((arg, i) => {
            return (
              <div key={`${inheritId}-${i}-in`} className="inner-item">
                <div className="simple-inline-element inner-item-ind info-dimmed">
                  {i}
                </div>
                {formatArg(arg, `${inheritId}-${i}`, false)}
              </div>
            )
          })}
        </div>

        <div className="simple-inline-element info-bold">{']'}</div>
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

export default memo(FormatterArray, isEqual)
