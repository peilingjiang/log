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

  componentDidMount() {
    setLog({
      useSourceMaps: true,
    })
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
            log(e.target.value).e(e.target)
          }}
        />
        {/* -------------------------------------------------------------------------- */}
        <button
          id="submit-button"
          onClick={e => {
            this.setState(
              {
                submitClickedTimes: this.state.submitClickedTimes + 1,
              },
              () => {
                // log()

                // log(this.state.submitClickedTimes)
                //   .name('submit')
                //   .color('#c999ff')

                log(this.state.submitClickedTimes)
                  // .el(e.target)
                  .name('submit')
                  .color('#c999ff')
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
                log(this.state.clearClickedTimes).name('clear').e(e.target)
                ////
                // log().el(e.target)
              }
            )
          }}
        >
          Clear
        </button>
      </div>
    )
  }
}
