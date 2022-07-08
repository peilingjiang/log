import React, { useRef } from 'react'
import PropTypes from 'prop-types'
// import StackFrame from 'stackframe'
// import StackTraceGPS from 'stacktrace-gps'

import { stackInterface, _DEF } from '../constants.js'

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
  return (
    <div ref={e => (thisRef.current = e)} className="hyper-here-there">
      {stack.method}
      <p>
        <span>{stack.file}</span>
        <span>{stack.line}</span>
      </p>
    </div>
  )
}

HereThere.propTypes = {
  stack: stackInterface.isRequired,
  color: PropTypes.string.isRequired,
}
