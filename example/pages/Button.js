import React, { Component } from 'react'

import '../css/pages/Button.scss'

export default class Button extends Component {
  constructor(props) {
    super(props)

    this.state = {
      text: '',
      submitButton: 0,
      clearButton: 0,
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
            e.target.log(e.target.value).name('textarea')
          }}
        />
        <button
          id="submit-button"
          onClick={e => {
            this.setState(
              {
                submitButton: this.state.submitButton + 1,
              },
              () => {
                log(this.state.submitButton).name('submit')
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
                clearButton: this.state.clearButton + 1,
              },
              () => e.target.log(this.state.clearButton).name('clear')
            )
          }}
        >
          Clear
        </button>
      </div>
    )
  }
}
