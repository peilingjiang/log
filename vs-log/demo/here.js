import React from 'react'

export const Here = () => {
  setLog({
    useSourceMaps: true,
  })

  for (let i = 0; i < 3; i++) {
    log()
  }

  log().color('#00d1ff')
  log()

  const test = () => {
    log()
  }

  test()

  return <></>
}
