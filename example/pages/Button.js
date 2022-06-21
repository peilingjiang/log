import React, { Component } from 'react'

import '../css/pages/Button.scss'

export default class Button extends Component {
  constructor(props) {
    super(props)

    this.state = {
      text: '',
      submitClickedTimes: 0,
      clearClickedTimes: 0,
    }
  }

  render() {
    return (
      <div className="button-example">
        <textarea
          id="text-input"
          value={this.state.text}
          placeholder="Write something to submit..."
          onChange={e => {
            this.setState({
              text: e.target.value,
            })
            e.target.log(e.target.value)
          }}
        />
        <button
          id="submit-button"
          onClick={e => {
            this.setState(
              {
                submitClickedTimes: this.state.submitClickedTimes + 1,
              },
              () => {
                log(this.state.submitClickedTimes)
                  .name('submit')
                  .color('#c999ff')
              }
            )
          }}
        >
          Submit
        </button>
        <button
          id="clear-button"
          onClick={e => {
            this.setState(
              {
                text: '',
                clearClickedTimes: this.state.clearClickedTimes + 1,
              },
              () => e.target.log(this.state.clearClickedTimes).name('clear')
            )
          }}
        >
          Clear
        </button>
      </div>
    )
  }
}
