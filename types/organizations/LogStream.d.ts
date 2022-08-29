export default class LogStream extends React.Component<any, any, any> {
  static get propTypes(): {
    logGroup: PropTypes.Validator<
      Required<
        PropTypes.InferProps<{
          name: PropTypes.Requireable<string>
          logs: PropTypes.Validator<
            (
              | Required<
                  PropTypes.InferProps<{
                    id: PropTypes.Requireable<string>
                    groupId: PropTypes.Requireable<string>
                    element: PropTypes.Requireable<Element>
                    level: PropTypes.Validator<string>
                    args: PropTypes.Requireable<any[]>
                    timestamps: PropTypes.Validator<
                      (
                        | Required<
                            PropTypes.InferProps<{
                              now: PropTypes.Requireable<number>
                            }>
                          >
                        | null
                        | undefined
                      )[]
                    >
                    stack: PropTypes.Requireable<
                      Required<
                        PropTypes.InferProps<{
                          line: PropTypes.Validator<number>
                          char: PropTypes.Validator<number>
                          method: PropTypes.Validator<string>
                          file: PropTypes.Validator<string>
                          path: PropTypes.Validator<string>
                          raw: PropTypes.Validator<object>
                        }>
                      >
                    >
                    count: PropTypes.Requireable<number>
                    color: PropTypes.Requireable<string>
                    unit: PropTypes.Requireable<string>
                    history: PropTypes.Requireable<number>
                    specialIdentifier: PropTypes.Validator<any[]>
                  }>
                >
              | null
              | undefined
            )[]
          >
          level: PropTypes.Validator<string>
          groupId: PropTypes.Validator<string>
          element: PropTypes.Requireable<Element>
          groupElementId: PropTypes.Validator<string>
          format: PropTypes.Validator<string>
          orientation: PropTypes.Validator<string>
          snap: PropTypes.Validator<boolean>
          snapElement: PropTypes.Requireable<
            NonNullable<string | number | Element | null | undefined>
          >
          snapElementId: PropTypes.Requireable<string>
          snapAnchorSide: PropTypes.Validator<string>
          snapAnchorPercent: PropTypes.Validator<number>
          bounding: PropTypes.Validator<
            Required<
              PropTypes.InferProps<{
                left: PropTypes.Requireable<string>
                right: PropTypes.Requireable<string>
                top: PropTypes.Requireable<string>
                bottom: PropTypes.Requireable<string>
                horizontalAlign: PropTypes.Requireable<string>
                verticalAlign: PropTypes.Requireable<string>
              }>
            >
          >
          followType: PropTypes.Validator<string>
          groupColor: PropTypes.Validator<string>
          paused: PropTypes.Validator<boolean>
          deleted: PropTypes.Validator<boolean>
          view: PropTypes.Validator<
            Required<
              PropTypes.InferProps<{
                left: PropTypes.Validator<string>
                top: PropTypes.Validator<string>
                centerStagedId: PropTypes.Validator<string>
                unfoldedIds: PropTypes.Validator<(string | null | undefined)[]>
                highlightedIds: PropTypes.Validator<
                  (string | null | undefined)[]
                >
              }>
            >
          >
          timelineLogOrderReversed: PropTypes.Validator<number>
          syncGraphics: PropTypes.Validator<number>
        }>
      >
    >
    log: PropTypes.Requireable<
      Required<
        PropTypes.InferProps<{
          id: PropTypes.Requireable<string>
          groupId: PropTypes.Requireable<string>
          element: PropTypes.Requireable<Element>
          level: PropTypes.Validator<string>
          args: PropTypes.Requireable<any[]>
          timestamps: PropTypes.Validator<
            (
              | Required<
                  PropTypes.InferProps<{
                    now: PropTypes.Requireable<number>
                  }>
                >
              | null
              | undefined
            )[]
          >
          stack: PropTypes.Requireable<
            Required<
              PropTypes.InferProps<{
                line: PropTypes.Validator<number>
                char: PropTypes.Validator<number>
                method: PropTypes.Validator<string>
                file: PropTypes.Validator<string>
                path: PropTypes.Validator<string>
                raw: PropTypes.Validator<object>
              }>
            >
          >
          count: PropTypes.Requireable<number>
          color: PropTypes.Requireable<string>
          unit: PropTypes.Requireable<string>
          history: PropTypes.Requireable<number>
          specialIdentifier: PropTypes.Validator<any[]>
        }>
      >
    >
    updateLogGroup: PropTypes.Validator<(...args: any[]) => any>
    updateLog: PropTypes.Validator<(...args: any[]) => any>
    hostRef: PropTypes.Validator<object>
    handleStreamHover: PropTypes.Validator<(...args: any[]) => any>
    handleStreamDragAround: PropTypes.Validator<(...args: any[]) => any>
    organization: PropTypes.Validator<string>
    hostFunctions: PropTypes.Validator<object>
    registries: PropTypes.Validator<object>
  }
  constructor(props: any)
  state: {
    expand: boolean
    hovered: boolean
    grabbing: boolean
    current: boolean
    choosingCenterStaged: boolean
    useTimeline: boolean
    useStats: boolean
  }
  inExternalOperation: boolean
  ref: React.RefObject<any>
  logsWrapperRef: React.RefObject<any>
  handleMouseEnter(): void
  handleMouseLeave(): void
  handleDragAround(e: any): void
  handlePositionReset(e: any): void
  menuFunctions: {
    toggleUseTimeline: () => void
    expandStream: () => void
    startRelink: (e: any, startMouse: any) => void
    pauseStream: () => void
    deleteStream: () => void
    shapeIt: (newFormat: any) => void
    helloGraphics: () => void
    startSnap: (e: any, canSnap: any) => void
    undoSnap: () => void
    toggleChoosingCenterStaged: () => void
    setCenterStagedId: (groupId: any, newCenterStagedId: any) => void
  }
  setTimelineLogOrderReversed(orderReversed: any): void
  streamFunctions: {
    setCenterStagedId: (groupId: any, newCenterStagedId: any) => void
    setUnfoldedIds: (groupId: any, idToToggle: any, toUnfold?: boolean) => void
    setHighlightedIds: (
      groupId: any,
      idToToggle: any,
      toHighlight?: boolean
    ) => void
    setScrollView: (groupId: any, left: any, top: any) => void
    toggleUseStats: () => void
  }
  componentDidMount(): void
  componentDidUpdate(prevProps: any, prevState: any): void
  shouldComponentUpdate(nextProps: any, nextState: any): boolean
  toggleUseTimeline(): void
  expandStream(): void
  startRelink(e: any, startMouse: any): void
  pauseStream(): void
  deleteStream(): void
  shapeIt(newFormat: any): void
  helloGraphics(): void
  startSnap(e: any, canSnap: any): void
  undoSnap(): void
  _unsnapState(logGroup: any): {
    snap: boolean
    snapElement: null
    snapAnchorSide: string
    bounding: any
    orientation: string
  }
  toggleChoosingCenterStaged(): void
  setCenterStagedId(groupId: any, newCenterStagedId: any): void
  setUnfoldedIds(groupId: any, idToToggle: any, toUnfold?: boolean): void
  setHighlightedIds(groupId: any, idToToggle: any, toHighlight?: boolean): void
  setScrollView(groupId: any, left: any, top: any): void
  toggleUseStats(): void
  _offsetFromAutoAttach(): number
  _allowingCenterStaged(): boolean
  render(): JSX.Element
}
import React from 'react'
import PropTypes from 'prop-types'
