import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import tinycolor from 'tinycolor2'
// import StackFrame from 'stackframe'
// import StackTraceGPS from 'stacktrace-gps'

import { stackInterface, _DEF, _rootStyles } from '../constants.js'

export const HereThere = ({ stack, color }) => {
  const thisRef = useRef()

  // useEffect(() => {
  //   const stackFrame = new StackFrame({
  //     fileName: stack.path,
  //     lineNumber: stack.line,
  //     columnNumber: stack.char,
  //   })

  //   const gps = new StackTraceGPS()
  //   gps.pinpoint(stackFrame).then(results => {
  //     console.log(results)
  //   })
  //   gps.getMappedLocation(stackFrame).then(results => {
  //     console.log(results)
  //   })
  //   gps.findFunctionName(stackFrame).then(results => {
  //     console.log(results)
  //   })
  // }, [stack.file, stack.line, stack.char])

  const darkenedColor =
    color !== _DEF
      ? tinycolor(color).darken(30).toString()
      : _rootStyles.darkGrey

  const spanStyle = {
    backgroundColor:
      color !== _DEF
        ? tinycolor(color).darken(25).toString()
        : _rootStyles.grey,
  }

  return (
    <div ref={e => (thisRef.current = e)} className="hyper-here-there">
      {/* {stack.method} */}
      <p
        className="here-here animation-bounce-in"
        style={{
          color: darkenedColor || _DEF.color,
        }}
      >
        Here!
      </p>

      <p className="here-details">
        <b style={spanStyle}>{stack.method}</b>
        {/* <span style={spanStyle}>
          {stack.file}:{stack.line}
        </span> */}
      </p>
    </div>
  )
}

HereThere.propTypes = {
  stack: stackInterface.isRequired,
  color: PropTypes.string.isRequired,
}
