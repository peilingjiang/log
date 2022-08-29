export const GraphicsHost: React.MemoExoticComponent<{
  ({ logGroups, registries }: { logGroups: any; registries: any }): JSX.Element
  propTypes: {
    logGroups: PropTypes.Validator<object>
    registries: PropTypes.Validator<object>
  }
}>
export class Graphics extends React.Component<any, any, any> {
  static get propTypes(): {
    args: PropTypes.Validator<any[]>
    id: PropTypes.Validator<string>
    stack: PropTypes.Validator<object>
    centerStagedId: PropTypes.Validator<string>
    groupId: PropTypes.Validator<string>
    groupColor: PropTypes.Validator<string>
    registries: PropTypes.Validator<object>
    currentGraphics: PropTypes.Validator<boolean>
    orderReversed: PropTypes.Validator<number>
    showMeasures: PropTypes.Validator<any[]>
    setShowMeasures: PropTypes.Validator<(...args: any[]) => any>
  }
  constructor(props: any)
  constructor(props: any, context: any)
  shouldComponentUpdate(nextProps: any): boolean
  render(): JSX.Element | null
}
export function sizeStylesFromKeyWord(
  keyWord: any,
  size: any
):
  | {
      width: any
      height: any
    }
  | {
      width?: undefined
      height?: undefined
    }
export function offsetStylesFromKeyWord(
  keyWord: any,
  position: any
):
  | {
      position: string
      top: any
      left: any
    }
  | {
      position?: undefined
      top?: undefined
      left?: undefined
    }
import PropTypes from 'prop-types'
import React from 'react'
