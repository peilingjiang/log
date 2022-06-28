import React from 'react'
import PropTypes from 'prop-types'

import Expand from '../icons/folded-s.svg'
import Fold from '../icons/unfolded-s.svg'

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
