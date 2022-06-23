import { _R } from './constants.js'

export class HyperLog {
  constructor(component, addLogFunction) {
    this.component = component
    this.requests = {}

    addLogFunction(this.requests)

    return this
  }

  processRequests(groupId, groupElementId, thisLogId) {
    this.groupId = groupId
    this.groupElementId = groupElementId
    this.logId = thisLogId

    // while (this.requests.length) {
    //   const request = this.requests.shift()
    //   // process this request
    //   this[`_${request.type}`](...request.values)
    // }
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

  options(options = {}) {
    return this
  }

  /* -------------------------------------------------------------------------- */

  _name(name = '') {
    if (this.groupId)
      this.component.updateLogGroup(this.groupId, {
        ...this.component.state.logGroups[this.groupId],
        name,
      })
  }

  _color(color = 'default') {
    if (this.groupId && this.logId) {
      this.component.updateLog(this.groupId, this.logId, { color })
    }
  }

  _unit(unit = '') {
    if (this.groupId && this.logId) {
      this.component.updateLog(this.groupId, this.logId, { unit })
    }
  }

  _options(options = {}) {}
}
