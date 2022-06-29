import React, { memo } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'

import Expand from '../icons/folded-s.svg'
import Fold from '../icons/unfolded-s.svg'

const ObjectKeyMemo = ({ value, inheritId, bold }) => {
  return (
    <span
      // key={`${inheritId}-obj-key`}
      className={`f-object-key${bold ? ' info-bold' : ''}`}
    >
      {value}
    </span>
  )
}

ObjectKeyMemo.propTypes = {
  value: PropTypes.string.isRequired,
  inheritId: PropTypes.string.isRequired,
  bold: PropTypes.bool.isRequired,
}

export const ObjectKey = memo(ObjectKeyMemo, isEqual)

/* -------------------------------------------------------------------------- */
// ...

export const FoldedDisplay = () => {
  return <span className="f-folded-display">...</span>
}

/* -------------------------------------------------------------------------- */

export const FolderIcon = ({ folded, toggleFold }) => {
  return folded ? (
    <Expand className="cursor-pointer" onClick={toggleFold} />
  ) : (
    <Fold className="cursor-pointer" onClick={toggleFold} />
  )
}

FolderIcon.propTypes = {
  folded: PropTypes.bool,
  toggleFold: PropTypes.func,
}
