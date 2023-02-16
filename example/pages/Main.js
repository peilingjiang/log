import React, { Component } from 'react'

import { testMultipleFiles } from './MainSub.js'
import './synced.js'

export default class Types extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    // console.log('Start logging...')

    log(undefined, null)

    log(['a', ['b', ['c', ['d', ['e']]]]])

    const mySet = new Set([1, 2, 3, 4, 5])
    log(mySet)

    log(
      1,
      'log',
      [1, 'log'],
      [
        1,
        'log',
        [
          "My name is James. What's your name? How are you feeling today?",
          true,
          234,
        ],
      ]
    )

    testAnotherTopLevelDeclaration()

    testMultipleFiles()

    for (let i = 0; i < 2; i++) {
      log(this)
      for (let j = 0; j < 2; j++) {
        log('nested loop', j)
      }
    }

    for (let i = 0; i < 20; i++)
      log(Math.round(Math.random() * 200))
        .element(document.getElementById('home-link'))
        .warn()
    for (let i = 0; i < 20; i++)
      log(Math.round(Math.random() * 200))
        .element(document.getElementById('home-link'))
        .error()
  }

  render() {
    return (
      <div
        className="types-example"
        style={{
          padding: '1rem',
        }}
      >
        Logging out many different things...
      </div>
    )
  }
}

// const main = () => {
//   const helloWorld = 'Hello World!'
//   log(1998, helloWorld, undefined)
//   for (let i = 0; i < 1; i++) {
//     log(Math.random())
//     for (let j = 0; j < 2; j++) {
//       log(new Date().getFullYear())
//     }
//   }
//   other(this)
// }

// const other = that => {
//   log(performance.now())
//   setTimeout(() => {
//     log(that)
//   })
// }

// main()

function testAnotherTopLevelDeclaration() {
  log("I'm from another top level declaration!")

  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      const data = {
        value: {
          viewingDistanceCm: 500 * Math.random(),
          nearPointCm: { x: Math.random(), y: Math.random() },
          latencyMs: 100,
        },
        timestamp: performance.now(),
        method: 'Random',
      }
      log(data).element(document.getElementById('home-link'))
    }, Math.random() * 1000)
  }
}
