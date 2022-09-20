async function main() {
  // for (let i = 0; i < 10; i++) {
  //   const array = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]
  //   const blindSpotData = {
  //     value: 45.3 + array[Math.floor(Math.random() * array.length)],
  //     // timestamp: 9936.599,
  //     // method: 'BlindSpot',
  //     raw: {
  //       0: {
  //         dist: 45.4,
  //         v: 1,
  //         closedEyeSide: 'left',
  //         crossX: 256,
  //         circleX: 867,
  //         ppi: 127.7,
  //         timestamp: 8199.199,
  //       },
  //       1: {
  //         dist: 45.2,
  //         v: 1,
  //         closedEyeSide: 'right',
  //         crossX: 2304,
  //         circleX: 1695.012,
  //         ppi: 127.7,
  //         timestamp: 9936.399,
  //       },
  //     },
  //   }
  //   //
  //   //
  //   //
  //   //
  //   //
  //   //
  //   //
  //   //
  //   //
  //   //
  //   //
  //   //
  //   //
  //   log(blindSpotData)
  //   await sleep(10)
  // }
}

main()

async function sleep() {
  return new Promise(resolve => setTimeout(resolve, 1000))
}
