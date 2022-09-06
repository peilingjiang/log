import React from 'react'

const Here = () => {
  configLog({
    useSourceMaps: true,
  })

  for (let i = 0; i < 3; i++) {
    log()
  }

  log().color('#00d1ff')

  const test = () => {
    log()
  }

  test()

  return <></>
}

export default Here
