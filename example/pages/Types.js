import React, { Component } from 'react'

export default class Types extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log('Start logging...')
    log(undefined)
    log([[]])
    log(1, 'log', [1, 'log'], [1, 'log', ['log']])
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
    log(true)

    log({
      value: {
        viewingDistanceCm: 43.9,
        nearPointCm: { x: null, y: null },
        latencyMs: 144,
      },
      timestamp: 29491.39999985695,
      method: 'FaceMesh',
    })
  }

  render() {
    return <div className="types-example"></div>
  }
}
