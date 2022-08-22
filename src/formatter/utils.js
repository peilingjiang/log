import React from 'react'

import { minimalStringShowLength } from '../constants.js'

export const wrapString = s => {
  return s.length <= minimalStringShowLength ? (
    s
  ) : (
    <>
      <span className="f-string">{`${s.slice(
        0,
        minimalStringShowLength
      )}`}</span>
      <span className="f-folded-display">...</span>
    </>
  )
}

export const isEmptyArray = arr => {
  return arr.length === 0
}

export const isEmptyObject = obj => {
  for (const key in obj) {
    return false
  }
  return true
}

export const getObjectKeys = obj => {
  const keys = []
  for (const key in obj) {
    keys.push(key)
  }
  return keys
}

export const objectFromKeys = (originalObj, keys) => {
  const obj = {}
  keys.forEach(key => {
    obj[key] = originalObj[key]
  })
  return obj
}
