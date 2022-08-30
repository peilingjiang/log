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
  }

  componentDidMount() {
    this.catRef.current.addEventListener('mousedown', this.handleMouseDown)
    this.cat2Ref.current.addEventListener('mousedown', this.handleMouseDown)
  }

  componentWillUnmount() {
    this.catRef.current.removeEventListener('mousedown', this.handleMouseDown)
    this.cat2Ref.current.removeEventListener('mousedown', this.handleMouseDown)
  }

  handleMouseDown(e) {
    e.preventDefault()

    const targetName = e.target.dataset.name

    const startPos = {
      x: e.clientX,
      y: e.clientY,
      left: this.state[`${targetName}X`],
      top: this.state[`${targetName}Y`],
    }

    const handleMouseMove = e => {
      this.setState(
        {
          [`${targetName}X`]: startPos.left + e.clientX - startPos.x,
          [`${targetName}Y`]: startPos.top + e.clientY - startPos.y,
        },
        () => {
          log(this.state[`${targetName}X`])
            .e(e.target)
            .id(targetName)
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
