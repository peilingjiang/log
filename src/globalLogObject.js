import { copyObject } from './methods/utils.js'

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
      this[request.type](...request.values)
    }
  }

  name(name = '') {
    if (this.groupId) {
      this.component.updateLogGroup(this.groupId, {
        ...this.component.state.logGroups[this.groupId],
        name,
      })
    } else {
      this.requests.push({
        type: 'name',
        values: [name],
      })
    }
    return this
  }
}
