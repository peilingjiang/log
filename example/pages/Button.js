import React, { Component, createRef } from 'react'

import '../css/pages/Button.scss'

export default class Button extends Component {
  constructor(props) {
    super(props)

    this.state = {
      text: '',
      submitClickedTimes: 0,
      clearClickedTimes: 0,
    }

    this.submitRef = createRef()
  }

  render() {
    return (
      <div className="button-example">
        {/* -------------------------------------------------------------------------- */}
        <textarea
          id="text-input"
          value={this.state.text}
          placeholder="Write something to submit..."
          onChange={e => {
            this.setState({
              text: e.target.value,
            })

            // log(e.target.value).element(e.target).error()
            //
            log(e).name('markings')
          }}
        />
        {/* -------------------------------------------------------------------------- */}
        <button
          ref={this.submitRef}
          id="submit-button"
          onClick={clickEvent => {
            this.setState(
              {
                submitClickedTimes: this.state.submitClickedTimes + 1,
              },
              () => {
                // log()
                // log(this.state.submitClickedTimes)
                //   .name('submit')
                //   .color('#c999ff')

                ////
                log(clickEvent).element(clickEvent.target).name('clicked')
                // .color('#c999ff')
                // .id('buttons')
              }
            )
          }}
        >
          Submit
        </button>
        {/* -------------------------------------------------------------------------- */}
        <button
          id="clear-button"
          onClick={e => {
            this.setState(
              {
                text: '',
                clearClickedTimes: this.state.clearClickedTimes + 1,
              },
              () => {
                /////
                log(e).name('clear').element(e.target).id('buttons')
                ////
                // log().el(e.target)
              }
            )
          }}
        >
          Clear
        </button>
        {/* -------------------------------------------------------------------------- */}
      </div>
    )
  }
}
