import React, { Component } from 'react'
import RemoteCalibrator from 'remote-calibrator'

// import '../css/pages/ViewDist.scss'

export default class ViewDist extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    RemoteCalibrator.init()
  }

  render() {
    return (
      <div
        className="tracking-example"
        id="tracking-example"
        style={{
          padding: '7rem 0',
        }}
      >
        <div className="control-buttons">
          <button
            className="control-button"
            id="measure-button"
            onClick={() => {
              RemoteCalibrator.measureDistance({}, data => {
                log(data)
              })
            }}
          >
            Measure Viewing Distance
          </button>
          {/* <button
            className="control-button"
            id="resume-button"
            onClick={() => {
              RemoteCalibrator.resumeDistance()
              log('resumed')
            }}
          >
            Resume Tracking
          </button> */}
        </div>
      </div>
    )
  }
}
