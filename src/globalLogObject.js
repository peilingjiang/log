import { _R } from './constants.js'
import { assertString } from './methods/utils.js'

export class HyperLog {
  constructor(component, args, addLogFunction) {
    this.component = component
    this.args = args
    this.requests = {}

    // call addLog
    addLogFunction(this.requests)

    return this
  }

  el(element = null) {
    if (assertString(element)) {
      console.log(element)
      element = document.querySelector(element)
      console.log(element)
    }
    this.requests.element = element
    return this
  }
  e(e = null) {
    return this.el(e)
  }
  ele(e = null) {
    return this.el(e)
  }
  element(e = null) {
    return this.el(e)
  }

  id(id) {
    this.requests.id = id
    return this
  }

  name(name = '') {
    this.requests.name = name
    return this
  }

  color(color = 'default') {
    this.requests.color = color
    return this
  }

  unit(unit = '') {
    this.requests.unit = unit
    return this
  }

  history(history = 2) {
    this.requests.history = history
    return this
  }

  snap(options = {}) {
    options = Object.assign(
      {
        // snap feature defaults
        snap: true,
        snapElement: null,
        snapAnchorSide: _R,
        snapAnchorPercent: 0.5, // TODO
      },
      options
    )

    if (options.snapElement) this.requests.snap = options
    return this
  }

  shape(shape = true) {
    this.requests.format = shape ? 'shape' : 'text'
    return this
  }

  /* -------------------------------------------------------------------------- */

  availableModules = ['offsets']

  module(tryUseModule = true) {
    this.requests.module =
      tryUseModule && this.availableModules.includes(this.args[0])
    return this
  }

  /* -------------------------------------------------------------------------- */

  // get lifeCycle() {
  //   return
  // }
}
