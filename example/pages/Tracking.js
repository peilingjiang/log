import React, { Component } from 'react'
import RemoteCalibrator from 'remote-calibrator'

import '../css/pages/Tracking.scss'

export default class Tracking extends Component {
  constructor(props) {
    super(props)

    this.state = {
      calibrationDone: false,
    }
  }

  componentDidMount() {
    RemoteCalibrator.init()
    RemoteCalibrator.panel(
      [
        {
          name: 'trackDistance',
          options: {
            showVideo: false,
          },
          callbackStatic: () => {
            log('trackDistance done')
          },
          callbackTrack: data => {
            log(data)
          },
        },
      ],
      '#tracking-example',
      {
        i18n: false,
      },
      () => {
        log('all panel tasks done')
        RemoteCalibrator.removePanel()

        this.setState({
          calibrationDone: true,
        })
      }
    )
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
        {this.state.calibrationDone ? (
          <div className="control-buttons">
            <button
              className="control-button"
              id="pause-button"
              onClick={() => {
                RemoteCalibrator.pauseDistance()
                log('paused')
              }}
            >
              Pause Tracking
            </button>
            <button
              className="control-button"
              id="resume-button"
              onClick={() => {
                RemoteCalibrator.resumeDistance()
                log('resumed')
              }}
            >
              Resume Tracking
            </button>
          </div>
        ) : null}
      </div>
    )
  }
}
