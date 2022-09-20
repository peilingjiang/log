import React, { Component } from 'react'

import './synced.js'

export default class Types extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {}

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
//   const helloWorld = 'Hello, World!'
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
