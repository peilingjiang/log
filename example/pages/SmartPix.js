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
      cat2X: 400,
      cat2Y: 400,
    }

    this.catRef = createRef()
    this.cat2Ref = createRef()

    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseDown2 = this.handleMouseDown2.bind(this)
  }

  componentDidMount() {
    this.catRef.current.addEventListener('mousedown', this.handleMouseDown)
    this.cat2Ref.current.addEventListener('mousedown', this.handleMouseDown2)
  }

  componentWillUnmount() {
    this.catRef.current.removeEventListener('mousedown', this.handleMouseDown)
    this.cat2Ref.current.removeEventListener('mousedown', this.handleMouseDown2)
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
            .shape()
        }
      )
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', function _() {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', _)
    })
  }

  handleMouseDown2(e) {
    e.preventDefault()

    const startPos = {
      x: e.clientX,
      y: e.clientY,
      left: this.state.cat2X,
      top: this.state.cat2Y,
    }

    const handleMouseMove = e => {
      this.setState(
        {
          cat2X: startPos.left + e.clientX - startPos.x,
          cat2Y: startPos.top + e.clientY - startPos.y,
        },
        () => {
          this.cat2Ref.current
            .log(this.state.cat2X)
            .name('offsetX')
            .unit('px')
            .history(0)
            .shape()
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
            data-name="cat"
          />
          <img
            ref={this.cat2Ref}
            style={{
              filter: 'saturate(0)',
              position: 'absolute',
              left: `${this.state.cat2X}px`,
              top: `${this.state.cat2Y}px`,
            }}
            className="little-cat"
            id="little-cat-2"
            src={Cat}
            alt="Little Cat"
            data-name="cat2"
          />
        </div>
      </div>
    )
  }
}
