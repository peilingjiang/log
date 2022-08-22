import React, { memo } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'
// import { v4 as uuid } from 'uuid'

import { foldedObjectShowItemCount, idViewsInterface } from '../constants.js'
import {
  arrayFirst,
  assertElement,
  matchLocInObjectByRemovingLogId,
  removeLogId,
} from '../methods/utils.js'
import { isEmptyObject, objectFromKeys, getObjectKeys } from './utils.js'
import { ObjectKey, FoldedDisplay, FolderIcon } from './components.js'
import { FormatterFoldedDisplay } from './baseObjectTypes.js'
import { assertInteractionEvent } from '../methods/specialHubUtils.js'

const FormatterObject = ({
  obj,
  groupId,
  inheritId,
  idViews,
  streamFunctions,
  formatArg,
  minimal,
  choosing,
  highlightChanged,
}) => {
  // check if unfolded
  const folded = !matchLocInObjectByRemovingLogId(
    idViews.unfoldedIds,
    inheritId
  )

  // for highlightChanged
  const standardInheritId = highlightChanged
    ? removeLogId(inheritId)
    : inheritId

  // const isElement = assertElement(obj)
  // const elementLabel = isElement ? (
  //   <span className="element-label">E</span>
  // ) : null

  const isEvent = assertInteractionEvent(obj)
  const eventLabel = isEvent ? (
    <span className="object-event-label">E</span>
  ) : null

  const foldedShowItemCountNotEvent = isEvent ? 0 : foldedObjectShowItemCount
  let content

  if (minimal) {
    if (!isEmptyObject(obj)) {
      const keys = getObjectKeys(obj)
      content = (
        <>
          {'{'}
          {keys.length === 1 ? (
            <ObjectKey
              value={keys[0]}
              inheritId={`${inheritId}[0]`}
              bold={true}
              choosing={choosing}
            />
          ) : (
            <FormatterFoldedDisplay
              arg={obj}
              inheritId={inheritId}
              choosing={choosing}
              highlightChanged={highlightChanged}
            />
          )}
          {'}'}
        </>
      )
    } else content = '{}'
    return (
      <div
        className={`f-object f-object-minimal minimal${
          choosing ? ' hyper-choosing' : ''
        }`}
        data-key={`${inheritId}[obj]`}
      >
        {eventLabel}
        {content}
      </div>
    )
  }

  // const objKeys = Object.keys(obj)
  const objKeys = getObjectKeys(obj)

  if (folded) {
    // folded
    const innerItems = []

    for (const keyInd in arrayFirst(objKeys, foldedShowItemCountNotEvent)) {
      const keyValue = objKeys[keyInd]
      innerItems.push(
        <ObjectKey
          key={`${standardInheritId}-${keyInd}[obj*key]`}
          value={keyValue}
          inheritId={`${inheritId}[${keyInd}]`}
          bold={false}
          choosing={choosing}
        />
      )
      innerItems.push(
        <span
          key={`${inheritId}-${keyInd}[col]`}
          className="simple-inline-element"
        >
          :
        </span>
      )
      innerItems.push(
        formatArg(
          obj[objKeys[keyInd]],
          groupId,
          `${inheritId}-${keyValue}[val]`,
          idViews,
          streamFunctions,
          true,
          choosing,
          highlightChanged
        )
      )

      if (keyInd < objKeys.length - 1)
        innerItems.push(
          <span
            key={`${inheritId}-${keyInd}[com]`}
            className="simple-inline-element"
          >
            ,
          </span>
        )
    }
    content = (
      <>
        {!isEmptyObject(obj) && (
          <FolderIcon
            folded={folded}
            groupId={groupId}
            id={inheritId}
            setUnfoldedIds={streamFunctions.setUnfoldedIds}
          />
        )}
        <span className="obj-length info-dimmed">{`(${objKeys.length})`}</span>
        {eventLabel}
        {'{'}
        {innerItems}
        {objKeys.length > foldedShowItemCountNotEvent ? (
          <FormatterFoldedDisplay
            arg={objectFromKeys(
              obj,
              objKeys.slice(foldedShowItemCountNotEvent)
            )}
            inheritId={inheritId}
            choosing={choosing}
            highlightChanged={highlightChanged}
          />
        ) : null}
        {'}'}
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
          {eventLabel}
          {'{'}
        </div>

        <div className="unfolded-inner">
          {objKeys.map((objKey, i) => {
            return (
              <div key={`${standardInheritId}-${i}[in]`} className="inner-item">
                <ObjectKey
                  key={`${standardInheritId}-${i}[obj*key]`}
                  value={objKey}
                  inheritId={`${inheritId}[${i}]`}
                  bold={true}
                  choosing={choosing}
                />
                <span
                  key={`${inheritId}-${i}[col]`}
                  className="simple-inline-element"
                >
                  :
                </span>
                {formatArg(
                  obj[objKey],
                  groupId,
                  `${inheritId}-${objKey}[val]`,
                  idViews,
                  streamFunctions,
                  false,
                  choosing,
                  highlightChanged
                )}
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
      className={`f-object ${folded ? 'f-object-folded' : 'f-object-unfolded'}${
        choosing ? ' hyper-choosing' : ''
      }`}
      data-key={`${inheritId}[obj]`}
    >
      {content}
    </div>
  )
}

FormatterObject.propTypes = {
  obj: PropTypes.object.isRequired,
  groupId: PropTypes.string.isRequired,
  inheritId: PropTypes.string.isRequired,
  idViews: idViewsInterface.isRequired,
  streamFunctions: PropTypes.object.isRequired,
  formatArg: PropTypes.func.isRequired,
  minimal: PropTypes.bool.isRequired,
  choosing: PropTypes.bool.isRequired,
  highlightChanged: PropTypes.bool.isRequired,
}

export default memo(FormatterObject, isEqual)
