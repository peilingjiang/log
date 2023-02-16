import React, { Component, createRef } from 'react'

import '../css/pages/SmartPix.scss'

// import Moon from '../media/moon.jpg'
import Cat from '../media/cat.png'

export default class SmartPix extends Component {
  constructor(props) {
    super(props)

    this.state = {
      catX: 200,
      catY: 65,
      cat2X: 400,
      cat2Y: 200,
    }

    this.catRef = createRef()
    this.cat2Ref = createRef()

    this.handleMouseDown = this.handleMouseDown.bind(this)
  }

  componentDidMount() {
    this.catRef.current.addEventListener('mousedown', this.handleMouseDown)
    // this.cat2Ref.current.addEventListener('mousedown', this.handleMouseDown)
  }

  componentWillUnmount() {
    this.catRef.current.removeEventListener('mousedown', this.handleMouseDown)
    // this.cat2Ref.current.removeEventListener('mousedown', this.handleMouseDown)
  }

  moveCat() {
    const a = 'a'
    log(a)
    // move the cat following the sin wave
    const steps = 48
    const eachStepX = 12
    let step = 1
    const originalX = this.state.catX
    const originalY = this.state.catY
    const _ = setInterval(() => {
      const newCatX = originalX + step * eachStepX
      const newCatY =
        originalY + Math.sin((step * eachStepX) / Math.PI / 30) * 32
      this.setState({ catX: newCatX, catY: newCatY }, () => {
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
      })
      const el = this.catRef.current
      //
      //
      log(el.getBoundingClientRect()).element(this.catRef.current)

      step += 1

      if (step > steps) {
        clearInterval(_)
      }
    }, 20)
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
          [`${targetName}Y`]: startPos.top,
        },
        () => {
          // log(this.state[`${targetName}X`])
          //   .element(e.target)
          //   .id(targetName)
          //   .name('offsetX')
          //   .unit('px')
          //
          const el = this.catRef.current

          //
          log(el.getBoundingClientRect()).element(e.target).id(targetName)
          // log(targetName)
          //
          //
          //
          //
          // log(e).element(e.target)
          // .snapTo('x', targetName === 'cat' ? '#little-cat' : '#little-cat-2')
          // .name('clientX')
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
    const a = 1
    const b = Math.round(Math.random() * 100)
    log(Math.random()).name('code')
    log(this).name('code')
    log(a + b).name('code')
    return (
      <div className="px-example">
        <div className="playground">
          <button
            onClick={this.moveCat.bind(this)}
            style={{
              position: 'absolute',
              top: '10rem',
              padding: '1rem',
            }}
          >
            move
          </button>
          {/* <img className="moon" src={Moon} alt="Big Moon" /> */}
          <img
            ref={this.catRef}
            style={{
              position: 'absolute',
              left: `${this.state.catX}px`,
              top: `${this.state.catY}px`,
              transform: 'scaleX(-1)',
            }}
            className="little-cat"
            id="little-cat"
            src={Cat}
            alt="Little Cat"
            data-name="cat"
          />
          {/* <img
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
          /> */}
        </div>
      </div>
    )
  }
}
