import React from 'react'

import { minimalStringShowLength } from '../constants.js'
import { FoldedDisplay } from './components.js'

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

export const isEmptyArray = arr => {
  return arr.length === 0
}

export const isEmptyObject = obj => {
  return Object.keys(obj).length === 0
}
