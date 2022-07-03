import React, { memo } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'
// import { v4 as uuid } from 'uuid'

import { FoldedDisplay, FolderIcon } from './components.js'
import { foldedArrayShowItemCount, idViewsInterface } from '../constants.js'
import {
  arrayFirst,
  matchLocInObjectByRemovingLogId,
} from '../methods/utils.js'
import { isEmptyArray } from './utils.js'

const FormatterArray = ({
  arr,
  groupId,
  inheritId,
  idViews,
  streamFunctions,
  formatArg,
  minimal,
  choosing,
}) => {
  const folded = !matchLocInObjectByRemovingLogId(
    idViews.unfoldedIds,
    inheritId
  )

  let content

  if (minimal) {
    if (arr.length)
      content = (
        <>
          {'['}
          {arr.length === 1 ? (
            formatArg(
              arr[0],
              groupId,
              `${inheritId}[arr*min]`,
              idViews,
              streamFunctions,
              true,
              choosing
            )
          ) : (
            <FoldedDisplay />
          )}
          {']'}
        </>
      )
    else content = '[]'
    return (
      <div
        className={`f-array f-array-minimal minimal${
          choosing ? ' hyper-choosing' : ''
        }`}
        data-key={`${inheritId}[arr]`}
      >
        {content}
      </div>
    )
  }

  if (folded) {
    // folded
    const innerItems = []
    for (let i in arrayFirst(arr, foldedArrayShowItemCount)) {
      innerItems.push(
        formatArg(
          arr[i],
          groupId,
          `${inheritId}-${i}`,
          idViews,
          streamFunctions,
          true,
          choosing
        )
      )
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
          <FolderIcon
            folded={folded}
            groupId={groupId}
            id={inheritId}
            setUnfoldedIds={streamFunctions.setUnfoldedIds}
          />
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
          <FolderIcon
            folded={folded}
            groupId={groupId}
            id={inheritId}
            setUnfoldedIds={streamFunctions.setUnfoldedIds}
          />
          {'['}
        </div>

        <div className="unfolded-inner">
          {arr.map((arg, i) => {
            return (
              <div key={`${inheritId}-${i}-in`} className="inner-item">
                <div className="simple-inline-element inner-item-ind info-dimmed">
                  {i}
                </div>
                {formatArg(
                  arg,
                  groupId,
                  `${inheritId}-${i}`,
                  idViews,
                  streamFunctions,
                  false,
                  choosing
                )}
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
      className={`f-array ${folded ? 'f-array-folded' : 'f-array-unfolded'}${
        choosing ? ' hyper-choosing' : ''
      }`}
      data-key={`${inheritId}[arr]`}
    >
      {content}
    </div>
  )
}

FormatterArray.propTypes = {
  arr: PropTypes.array.isRequired,
  groupId: PropTypes.string.isRequired,
  inheritId: PropTypes.string.isRequired,
  idViews: idViewsInterface.isRequired,
  streamFunctions: PropTypes.object.isRequired,
  formatArg: PropTypes.func.isRequired,
  minimal: PropTypes.bool.isRequired,
  choosing: PropTypes.bool.isRequired,
}

export default memo(FormatterArray, isEqual)
