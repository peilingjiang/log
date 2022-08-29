import { HyperLog } from './hyperLog'

class LogProcessor {
  private queue: HyperLog[]
  private processFunction: ((hyperLog: HyperLog) => void) | undefined

  constructor() {
    this.queue = []
    this.processFunction = undefined
  }

  add(hyperLog: HyperLog) {
    this.queue.push(hyperLog)
    this.process()
  }

  process() {
    if (this.queue.length === 0 || this.processFunction === undefined) return
    this.processFunction(this.queue.shift()!)
    this.process()
  }

  setProcessFunction(processingFunction: (hyperLog: HyperLog) => void) {
    this.processFunction = processingFunction
  }
}

export const logProcessor = new LogProcessor()
