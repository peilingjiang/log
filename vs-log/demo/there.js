import React from 'react'

export const There = () => {
  configLog({
    useSourceMaps: true,
  })

  const test = () => {
    log()
  }

  log().color('#00d1ff')

  test()

  return <></>
}

for (let i = 0; i < 3; i++) {
  log()
}
