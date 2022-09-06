import React from 'react'

export const Here = () => {
  configLog({
    useSourceMaps: true,
  })

  for (let i = 0; i < 5; i++) {
    log()
  }

  log().color('#00d1ff')

  const test = () => {
    log()
  }

  test()

  return <></>
}
