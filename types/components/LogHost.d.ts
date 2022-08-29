export default class LogHost extends React.Component<any, any, any> {
  constructor(props: any)
  state: {
    logPaused: boolean
    logGroups: {}
    logTimeline: never[]
    organization: any
    timelineHighlightedLogId: null
    asts: {}
    registries: {}
    clearance: boolean
    filterArea: {
      left: string
      top: string
      right: string
      bottom: string
    }
    enableFilterArea: boolean
  }
  ref: React.RefObject<any>
  streamsHoldersRefs: {}
  windowResizeTimer: NodeJS.Timeout | null
  updateLogGroup(logGroupId: any, logGroup: any): void
  updateLog(logGroupId: any, logId: any, log: any): void
  _resizeHandler(): void
  _shortcutHandler(e: any): void
  hostFunctions: {
    togglePauseTheWholeLogSystem: () => void
    changeOrganization: (newOrganization: any, logId?: null) => void
    setTimelineLogOrderReversed: (groupId: any, reversed: any) => void
    updateSyncGraphics: (groupId: any) => void
    handleFilterArea: () => void
    handleFilterAreaChange: (newAreaData: any) => void
  }
  loggedCounter: number
  stackParser: StackParser
  componentDidMount(): void
  componentDidUpdate(prevProps: any, prevState: any): void
  componentWillUnmount(): void
  shouldComponentUpdate(nextProps: any, nextState: any): boolean
  _updateRegistries(
    asts: any,
    registries: any,
    logGroups: any,
    logTimeline: any
  ): void
  defineLogs(): void
  enableLogProcessing(): void
  incLoggedCounter(): void
  _getElementFromLogGroups(logGroups: any, groupElementId: any): any
  _getSnapElementFromGroups(logGroups: any, snapElementId: any): any
  _getSnapAnchorSideFromGroups(logGroups: any, snapElementId: any): any
  togglePauseTheWholeLogSystem(): void
  changeOrganization(newOrganization: any, logId?: null): void
  setTimelineLogOrderReversed(groupId: any, reversed: any): void
  handleFilterArea(): void
  handleFilterAreaChange(newAreaData: any): void
  renderAugmentedLogs(logGroups: any, registries: any): JSX.Element[]
  renderTimelineLogs(
    logGroups: any,
    logTimeline: any,
    logPaused: any,
    asts: any,
    registries: any
  ): false | JSX.Element
  updateSyncGraphics(groupId: any): void
  renderGraphicsElements(): JSX.Element
  render(): JSX.Element
}
import React from 'react'
import { StackParser } from '../methods/stackParser.js'
