import React, { memo } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'

import { preventEventWrapper } from '../methods/utils.js'

import Expand from '../icons/folded-s.svg'
import Fold from '../icons/unfolded-s.svg'

const ObjectKeyMemo = ({
  value,
  inheritId,
  bold,
  choosing,
  groupId,
  setCenterStagedId,
}) => {
  const thisKey = `${inheritId}-${value}[obj*key]`

  const handleClick = e => {
    if (!choosing) {
      preventEventWrapper(e, () => {
        setCenterStagedId(groupId, thisKey)
      })
    }
  }

  return (
    <span
      // key={`${inheritId}-obj-key`}
      data-key={thisKey}
      className={`f-object-key${bold ? ' info-bold' : ''}${
        choosing ? ' hyper-choosing' : ''
      }`}
      onDoubleClick={handleClick}
    >
      {value}
    </span>
  )
}

ObjectKeyMemo.propTypes = {
  value: PropTypes.string.isRequired,
  inheritId: PropTypes.string.isRequired,
  bold: PropTypes.bool.isRequired,
  choosing: PropTypes.bool.isRequired,
  groupId: PropTypes.string.isRequired,
  setCenterStagedId: PropTypes.func.isRequired,
}

export const ObjectKey = memo(ObjectKeyMemo, isEqual)

/* -------------------------------------------------------------------------- */
// ! ...

// export const FoldedDisplay = () => {
//   return <span className="f-folded-display">...</span>
// }

/* -------------------------------------------------------------------------- */

export const FolderIcon = ({ folded, groupId, id, setUnfoldedIds }) => {
  return folded ? (
    <Expand
      className="cursor-pointer"
      onClick={() => setUnfoldedIds(groupId, id, true)}
    />
  ) : (
    <Fold
      className="cursor-pointer"
      onClick={() => setUnfoldedIds(groupId, id, false)}
    />
  )
}

FolderIcon.propTypes = {
  folded: PropTypes.bool.isRequired,
  groupId: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  setUnfoldedIds: PropTypes.func.isRequired,
}
