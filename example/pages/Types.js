import React, { Component } from 'react'

export default class Types extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log('Start logging...')

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

    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        log({
          value: {
            viewingDistanceCm: 40 * Math.random(),
            nearPointCm: { x: Math.random(), y: Math.random() },
            nearPointCm2: { x: Math.random(), y: Math.random() },
            nearPointCm3: { x: Math.random(), y: Math.random() },
            nearPointCm4: { x: Math.random(), y: Math.random() },
            latencyMs: 100,
          },
          timestamp: performance.now(),
          method: 'Random',
        })
      }, Math.random() * 1000)
    }

    log(true)

    for (let i = 0; i < 2; i++) log(this)
  }

  render() {
    return <div className="types-example"></div>
  }
}