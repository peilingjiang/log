import React from 'react'
import PropTypes from 'prop-types'

import { g } from '../global.ts'
import { _Aug, _Time } from '../constants.js'

const Shortcuts = ({ show }) => {
  const shortcuts = [
    {
      key: 'X',
      description: `${g.defaultOrganization === _Time ? _Aug : _Time} view`,
    },
    {
      key: 'A',
      description: 'area filter',
    },
    {
      key: 'C',
      description: 'hide / show',
    },
    {
      key: 'M',
      description: 'remove all',
    },
  ]
  return (
    <div className={`hyper-shortcuts${show ? ' show' : ''}`}>
      {shortcuts.map((shortcut, i) => {
        return (
          <div key={i} className="shortcut">
            <span className="shortcut-key">{shortcut.key}</span>
            <span className="shortcut-description">{shortcut.description}</span>
          </div>
        )
      })}
    </div>
  )
}

Shortcuts.propTypes = {
  show: PropTypes.bool.isRequired,
}

// ˙yπ´®Òø© HyperLog

export default Shortcuts
