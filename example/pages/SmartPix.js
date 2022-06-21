import React, { Component, createRef } from 'react'

import '../css/pages/SmartPix.scss'

// import Moon from '../media/moon.jpg'
import Cat from '../media/cat.png'

export default class SmartPix extends Component {
  constructor(props) {
    super(props)

    this.state = {
      catX: 200,
      catY: 200,
    }

    this.catRef = createRef()

    this.handleMouseDown = this.handleMouseDown.bind(this)
  }

  componentDidMount() {
    this.catRef.current.addEventListener('mousedown', this.handleMouseDown)
  }

  componentWillUnmount() {
    this.catRef.current.removeEventListener('mousedown', this.handleMouseDown)
  }

  handleMouseDown(e) {
    e.preventDefault()

    const startPos = {
      x: e.clientX,
      y: e.clientY,
      left: this.state.catX,
      top: this.state.catY,
    }

    const handleMouseMove = e => {
      this.setState(
        {
          catX: startPos.left + e.clientX - startPos.x,
          catY: startPos.top + e.clientY - startPos.y,
        },
        () => {
          this.catRef.current
            .log(this.state.catX)
            .name('offsetX')
            .unit('px')
            .history(0)
        }
      )
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', function _() {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', _)
    })
  }

  render() {
    return (
      <div className="px-example">
        <div className="playground">
          {/* <img className="moon" src={Moon} alt="Big Moon" /> */}
          <img
            ref={this.catRef}
            style={{
              position: 'absolute',
              left: `${this.state.catX}px`,
              top: `${this.state.catY}px`,
            }}
            className="little-cat"
            id="little-cat"
            src={Cat}
            alt="Little Cat"
          />
        </div>
      </div>
    )
  }
}
