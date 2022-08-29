export default class LogStreamMenu extends React.Component<any, any, any> {
  static propTypes: {
    groupId: PropTypes.Validator<string>
    logsCount: PropTypes.Validator<number>
    paused: PropTypes.Validator<boolean>
    format: PropTypes.Validator<string>
    orientation: PropTypes.Validator<string>
    alignment: PropTypes.Validator<string>
    streamState: PropTypes.Validator<object>
    menuFunctions: PropTypes.Validator<object>
    snap: PropTypes.Validator<boolean>
    useShape: PropTypes.Validator<boolean>
    useGraphics: PropTypes.Validator<boolean>
    syncGraphics: PropTypes.Validator<number>
    organization: PropTypes.Validator<string>
    allowingCenterStaged: PropTypes.Validator<boolean>
    choosingCenterStaged: PropTypes.Validator<boolean>
    centerStagedId: PropTypes.Validator<string>
    useTimeline: PropTypes.Validator<boolean>
  }
  constructor(props: any)
  constructor(props: any, context: any)
  componentDidMount(): void
  shouldComponentUpdate(nextProps: any): boolean
  render(): JSX.Element
}
import React from 'react'
import PropTypes from 'prop-types'
