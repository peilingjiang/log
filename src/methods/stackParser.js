import isEqual from 'react-fast-compare'
import StackTrace from 'stacktrace-js'
import ErrorStackParser from 'error-stack-parser'

import { stackActualCallerDepth } from '../constants.js'
import { g } from '../global.ts'

export class StackParser {
  constructor() {
    this.queue = []
    this.cache = []
    this.parsing = false
  }

  push(args, error, callback) {
    this.queue.push({
      args,
      error,
      callback,
    })

    this.parse()
  }

  parse() {
    if (this.parsing) return

    this.parsing = true
    const [toParse, ...rest] = this.queue
    this.queue = rest

    if (toParse) {
      this.parseStack(toParse.args, toParse.error, toParse.callback)
    }
  }

  parseStack(args, error, callback) {
    const rawFrames = ErrorStackParser.parse(error)
    const preprocessStack = this._getActualFrame(rawFrames, error)

    if (!g.useSourceMaps) {
      // if no source map required, just return the preprocessed stack
      return this._endParsing(preprocessStack, callback, false)
    } else {
      // check all the cached parsed stacks to see if we can find the source map
      for (const cachedPreprocessStack of this.cache) {
        if (
          isEqual(ErrorStackParser.parse(cachedPreprocessStack.raw), rawFrames)
        ) {
          return this._endParsing(cachedPreprocessStack, callback, false)
        }
      }

      StackTrace.fromError(error, {
        offline: false,
      }).then(processedFrames => {
        const processedStack = this._getActualFrame(processedFrames, error)
        return this._endParsing(processedStack, callback, true)
      })
    }
  }

  _endParsing(processedStack, callback, cache = false) {
    if (cache) this.cache.push(processedStack)
    callback(processedStack)
    this.parsing = false
    return this.continueParing()
  }

  continueParing() {
    if (this.queue.length > 0) this.parse()
  }

  /* -------------------------------------------------------------------------- */

  _getActualFrame(frames, rawError) {
    const targetDepth = Math.min(stackActualCallerDepth, frames.length - 1)
    const actualStackFrame = frames[targetDepth]

    const result = {}

    result.line = actualStackFrame.lineNumber
    result.char = actualStackFrame.columnNumber
    result.method = actualStackFrame.functionName || 'anonymous'
    result.file = actualStackFrame.fileName.replace(/^.*[\\/]/, '')
    result.path = actualStackFrame.fileName
    result.raw = rawError

    return result
  }
}
