import React, { Component } from 'react'

import { testMultipleFiles } from './TypesSub.js'

export default class Types extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    // console.log('Start logging...')

    log(undefined, null)

    log(['a', ['b', ['c', ['d', ['e']]]]])

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

    testMultipleFiles()

    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        log({
          value: {
            viewingDistanceCm: 500 * Math.random(),
            nearPointCm: { x: Math.random(), y: Math.random() },
            latencyMs: 100,
          },
          timestamp: performance.now(),
          method: 'Random',
        }).e(document.getElementById('home-link'))
      }, Math.random() * 1000)
    }

    for (let i = 0; i < 2; i++) log(this)

    for (let i = 0; i < 20; i++)
      log(Math.round(Math.random() * 200)).e(
        document.getElementById('home-link')
      )
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
