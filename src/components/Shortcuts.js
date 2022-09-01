import React from 'react'
import PropTypes from 'prop-types'

const Shortcuts = ({ show }) => {
  const shortcuts = [
    {
      key: 'A',
      description: 'area filter',
    },
    {
      key: 'C',
      description: 'hide',
    },
    {
      key: 'X',
      description: 'change view',
    },
    {
      key: 'M',
      description: 'delete all',
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
