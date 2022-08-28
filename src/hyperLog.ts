import { _config, _R } from './constants.js'

interface RequestOptions {
  level: string | undefined
  element: HTMLElement | undefined
  id: string | undefined
  name: string | undefined
  color: string | undefined
  unit: string | undefined
  history: number | undefined
  snap: SnapOptions | undefined
  format: string | undefined
}

interface SnapOptions {
  snap: boolean | undefined
  snapElement: HTMLElement | undefined
  snapAnchorSide: string | undefined
  snapAnchorPercent: number | undefined
}

export class HyperLog {
  private args: any[]
  readonly requests: RequestOptions

  constructor(args: any[]) {
    this.args = args
    this.requests = {
      level: undefined,
      element: undefined,
      id: undefined,
      name: undefined,
      color: undefined,
      unit: undefined,
      history: undefined,
      snap: undefined,
      format: undefined,
    }

    // call addLog
    // addLogFunction(this.requests)

    return this
  }

  level(level: string = 'log') {
    // log, error, warn
    this.requests.level = level
    return this
  }

  /* -------------------------------------------------------------------------- */
  e(element: HTMLElement | string) {
    if (typeof element === 'string')
      element = document.querySelector(element) as HTMLElement

    this.requests.element = element
    return this
  }

  // e(e: HTMLElement | string) {
  //   return this.el(e)
  // }

  // ele(e: HTMLElement | string) {
  //   return this.el(e)
  // }

  // element(e: HTMLElement | string) {
  //   return this.el(e)
  // }
  /* -------------------------------------------------------------------------- */

  id(id: string) {
    this.requests.id = String(id)
    return this
  }

  name(name: string = '') {
    this.requests.name = String(name)
    return this
  }

  color(color: string = 'default') {
    this.requests.color = color
    return this
  }

  unit(unit: string = '') {
    this.requests.unit = unit
    return this
  }

  history(history: number = 0) {
    this.requests.history =
      Math.max(Math.min(Math.round(Number(history)), 2), 0) ||
      _config.logStreamHistoryRenderDepth - 1
    return this
  }

  snap(
    options: SnapOptions = {
      snap: true,
      snapElement: undefined,
      snapAnchorSide: _R,
      snapAnchorPercent: 0.5,
    }
  ) {
    options = Object.assign(
      {
        // snap feature defaults
        snap: true,
        snapElement: undefined,
        snapAnchorSide: _R,
        snapAnchorPercent: 0.5, // TODO
      },
      options
    )

    if (options.snapElement) this.requests.snap = options
    return this
  }

  shape(shape: boolean = true) {
    this.requests.format = shape ? 'shape' : 'text'
    return this
  }

  /* -------------------------------------------------------------------------- */

  // availableModules = ['offsets']

  // module(tryUseModule = true) {
  //   this.requests.module =
  //     tryUseModule && this.availableModules.includes(this.args[0])
  //   return this
  // }

  /* -------------------------------------------------------------------------- */

  // get lifeCycle() {
  //   return
  // }
}
