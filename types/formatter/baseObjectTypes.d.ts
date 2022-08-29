export class FormatterNumber extends BaseObject {
  render(): JSX.Element
  ref: HTMLSpanElement | null | undefined
}
export class FormatterString extends BaseObject {
  render(): JSX.Element
  ref: HTMLSpanElement | null | undefined
}
export class FormatterBoolean extends BaseObject {
  render(): JSX.Element
  ref: HTMLSpanElement | null | undefined
}
export class FormatterFoldedDisplay extends BaseObject {
  render(): JSX.Element
  ref: HTMLSpanElement | null | undefined
}
declare class BaseObject extends React.PureComponent<any, any, any> {
  static get propTypes(): {
    arg: PropTypes.Validator<any>
    inheritId: PropTypes.Validator<string>
    choosing: PropTypes.Validator<boolean>
    highlightChanged: PropTypes.Validator<boolean>
  }
  constructor(props: any)
  constructor(props: any, context: any)
  componentDidUpdate(prevProps: any): void
}
import React from 'react'
import PropTypes from 'prop-types'
export {}
