import { _B, _config, _L, _R, _T } from './constants.js'

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
  stackFrame: StackFrame | undefined
}

interface SnapOptions {
  snap: boolean | undefined
  snapElement: HTMLElement | undefined
  snapAnchorSide: string | undefined
  snapAnchorPercent: number | undefined
}

export interface Timestamp {
  now: number
}

export class HyperLog {
  private args: any[]
  readonly timestamp: Timestamp
  readonly rawError: Error
  readonly requests: RequestOptions

  constructor(args: any[], timestamp: Timestamp, error: Error) {
    this.args = args
    this.timestamp = timestamp
    this.rawError = error

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
      stackFrame: undefined,
    }

    // call addLog
    // addLogFunction(this.requests)

    return this
  }

  warn() {
    this.requests.level = 'warn'
    return this
  }

  error() {
    this.requests.level = 'error'
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

  /* -------------------------------------------------------------------------- */
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
    ) as SnapOptions

    if (options.snapElement) this.requests.snap = options
    return this
  }

  snapTo(
    position: 'x' | 'y' | 'top' | 'left' | 'right' | 'bottom' = 'right',
    element: HTMLElement | string | undefined = undefined
  ) {
    // no element to snap to
    if (typeof element === 'undefined' && !this.requests.element) return this
    else if (!this.requests.element) this.e(element!)
    if (!this.requests.element) return this

    this.shape(true)

    const getSnapOptions = (anchorSide: string): SnapOptions => {
      return {
        snap: true,
        snapElement: this.requests.element,
        snapAnchorSide: anchorSide,
        snapAnchorPercent: 0.5,
      }
    }

    switch (position) {
      case 'x':
        this.requests.name = 'x'
        return this.snap(getSnapOptions(_L))

      case 'y':
        this.requests.name = 'y'
        return this.snap(getSnapOptions(_T))

      case 'top':
        this.requests.name = 'top'
        return this.snap(getSnapOptions(_T))

      case 'left':
        this.requests.name = 'left'
        return this.snap(getSnapOptions(_L))

      case 'right':
        this.requests.name = 'right'
        return this.snap(getSnapOptions(_R))

      case 'bottom':
        this.requests.name = 'bottom'
        return this.snap(getSnapOptions(_B))

      default:
        return this
    }
  }
  /* -------------------------------------------------------------------------- */

  shape(shape: boolean = true) {
    this.requests.format = shape ? 'shape' : 'text'
    return this
  }

  stackFrame(frame: StackFrame) {
    this.requests.stackFrame = frame
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
