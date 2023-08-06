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
            log('trackDistance done').id('sys-msg-dist').name('distance')
          },
          callbackTrack: data => {
            log(data).id('distance').name('distance track')
          },
        },
        {
          name: 'trackGaze',
          options: {
            showVideo: false,
          },
          callbackOnCalibrationEnd: () => {
            log('gaze calibration done').id('sys-msg-gaze').name('gaze')
          },
          callbackTrack: data => {
            log(data).id('gaze').name('gaze track')
          },
        },
      ],
      '#tracking-example',
      {
        i18n: false,
      },
      () => {
        log('all panel tasks done').id('sys-msg-gaze')
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
                log('paused').id('sys-msg')
              }}
            >
              Pause Tracking
            </button>
            <button
              className="control-button"
              id="resume-button"
              onClick={() => {
                RemoteCalibrator.resumeDistance()
                log('resumed').id('sys-msg')
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
