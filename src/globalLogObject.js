export class HyperLog {
  constructor(component, addLogFunction) {
    this.component = component
    this.requests = []

    addLogFunction(this.processRequests.bind(this))

    return this
  }

  processRequests(groupId, groupElementId) {
    this.groupId = groupId
    this.groupElementId = groupElementId

    while (this.requests.length) {
      const request = this.requests.shift()
      // process this request
      this[`_${request.type}`](...request.values)
    }
  }

  name(name = '') {
    this.requests.push({
      type: 'name',
      values: [name],
    })

    return this
  }

  color(color = 'default') {
    this.requests.push({
      type: 'color',
      values: [color],
    })

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
    if (this.groupId) {
      const logGroup = this.component.state.logGroups[this.groupId]
      const logs = logGroup.logs

      for (const log of logs) {
        this.component.updateLog(this.groupId, log.id, {
          ...log,
          color,
        })
      }
    }
  }

  _options(options = {}) {}
}
