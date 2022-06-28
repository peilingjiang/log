import React from 'react'

import { minimalStringShowLength } from '../constants.js'
import { FoldedDisplay } from './FoldedDisplay.js'

export const wrapString = s => {
  return s.length <= minimalStringShowLength ? (
    s
  ) : (
    <>
      <span className="f-string">{`${s.slice(
        0,
        minimalStringShowLength
      )}`}</span>
      <FoldedDisplay />
    </>
  )
}
