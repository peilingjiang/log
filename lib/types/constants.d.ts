export const stackInterface: PropTypes.Requireable<Required<PropTypes.InferProps<{
    line: PropTypes.Validator<number>;
    char: PropTypes.Validator<number>;
    method: PropTypes.Validator<string>;
    file: PropTypes.Validator<string>;
    path: PropTypes.Validator<string>;
    raw: PropTypes.Validator<object>;
}>>>;
export const boundingInterface: PropTypes.Requireable<Required<PropTypes.InferProps<{
    left: PropTypes.Requireable<string>;
    right: PropTypes.Requireable<string>;
    top: PropTypes.Requireable<string>;
    bottom: PropTypes.Requireable<string>;
    horizontalAlign: PropTypes.Requireable<string>;
    verticalAlign: PropTypes.Requireable<string>;
}>>>;
export namespace boundingDefault {
    const left: string;
    const right: string;
    const top: string;
    const bottom: string;
    const horizontalAlign: string;
    const verticalAlign: string;
}
export const idViewsInterface: PropTypes.Requireable<Required<PropTypes.InferProps<{
    centerStagedId: PropTypes.Validator<string>;
    unfoldedIds: PropTypes.Validator<(string | null | undefined)[]>;
    highlightedIds: PropTypes.Validator<(string | null | undefined)[]>;
}>>>;
export const logViewInterface: PropTypes.Requireable<Required<PropTypes.InferProps<{
    left: PropTypes.Validator<string>;
    top: PropTypes.Validator<string>;
    centerStagedId: PropTypes.Validator<string>;
    unfoldedIds: PropTypes.Validator<(string | null | undefined)[]>;
    highlightedIds: PropTypes.Validator<(string | null | undefined)[]>;
}>>>;
export namespace logViewDefault {
    const left_1: string;
    export { left_1 as left };
    const top_1: string;
    export { top_1 as top };
    export const centerStagedId: string;
    export const unfoldedIds: never[];
    export const highlightedIds: never[];
}
export const timestampItemInterface: PropTypes.Requireable<Required<PropTypes.InferProps<{
    now: PropTypes.Requireable<number>;
}>>>;
export const logInterface: PropTypes.Requireable<Required<PropTypes.InferProps<{
    id: PropTypes.Requireable<string>;
    groupId: PropTypes.Requireable<string>;
    element: PropTypes.Requireable<Element>;
    level: PropTypes.Validator<string>;
    args: PropTypes.Requireable<any[]>;
    timestamps: PropTypes.Validator<(Required<PropTypes.InferProps<{
        now: PropTypes.Requireable<number>;
    }>> | null | undefined)[]>;
    stack: PropTypes.Requireable<Required<PropTypes.InferProps<{
        line: PropTypes.Validator<number>;
        char: PropTypes.Validator<number>;
        method: PropTypes.Validator<string>;
        file: PropTypes.Validator<string>;
        path: PropTypes.Validator<string>;
        raw: PropTypes.Validator<object>;
    }>>>;
    count: PropTypes.Requireable<number>;
    color: PropTypes.Requireable<string>;
    unit: PropTypes.Requireable<string>;
    history: PropTypes.Requireable<number>;
    specialIdentifier: PropTypes.Validator<any[]>;
}>>>;
export const logGroupInterface: PropTypes.Requireable<Required<PropTypes.InferProps<{
    name: PropTypes.Requireable<string>;
    logs: PropTypes.Validator<(Required<PropTypes.InferProps<{
        id: PropTypes.Requireable<string>;
        groupId: PropTypes.Requireable<string>;
        element: PropTypes.Requireable<Element>;
        level: PropTypes.Validator<string>;
        args: PropTypes.Requireable<any[]>;
        timestamps: PropTypes.Validator<(Required<PropTypes.InferProps<{
            now: PropTypes.Requireable<number>;
        }>> | null | undefined)[]>;
        stack: PropTypes.Requireable<Required<PropTypes.InferProps<{
            line: PropTypes.Validator<number>;
            char: PropTypes.Validator<number>;
            method: PropTypes.Validator<string>;
            file: PropTypes.Validator<string>;
            path: PropTypes.Validator<string>;
            raw: PropTypes.Validator<object>;
        }>>>;
        count: PropTypes.Requireable<number>;
        color: PropTypes.Requireable<string>;
        unit: PropTypes.Requireable<string>;
        history: PropTypes.Requireable<number>;
        specialIdentifier: PropTypes.Validator<any[]>;
    }>> | null | undefined)[]>;
    level: PropTypes.Validator<string>;
    groupId: PropTypes.Validator<string>;
    element: PropTypes.Requireable<Element>;
    groupElementId: PropTypes.Validator<string>;
    format: PropTypes.Validator<string>;
    orientation: PropTypes.Validator<string>;
    snap: PropTypes.Validator<boolean>;
    snapElement: PropTypes.Requireable<NonNullable<string | number | Element | null | undefined>>;
    snapElementId: PropTypes.Requireable<string>;
    snapAnchorSide: PropTypes.Validator<string>;
    snapAnchorPercent: PropTypes.Validator<number>;
    bounding: PropTypes.Validator<Required<PropTypes.InferProps<{
        left: PropTypes.Requireable<string>;
        right: PropTypes.Requireable<string>;
        top: PropTypes.Requireable<string>;
        bottom: PropTypes.Requireable<string>;
        horizontalAlign: PropTypes.Requireable<string>;
        verticalAlign: PropTypes.Requireable<string>;
    }>>>;
    followType: PropTypes.Validator<string>;
    groupColor: PropTypes.Validator<string>;
    paused: PropTypes.Validator<boolean>;
    deleted: PropTypes.Validator<boolean>;
    view: PropTypes.Validator<Required<PropTypes.InferProps<{
        left: PropTypes.Validator<string>;
        top: PropTypes.Validator<string>;
        centerStagedId: PropTypes.Validator<string>;
        unfoldedIds: PropTypes.Validator<(string | null | undefined)[]>;
        highlightedIds: PropTypes.Validator<(string | null | undefined)[]>;
    }>>>;
    timelineLogOrderReversed: PropTypes.Validator<number>;
    syncGraphics: PropTypes.Validator<number>;
}>>>;
export namespace logStreamsHolderInterface {
    const element: PropTypes.Requireable<Element>;
    const elementId: PropTypes.Requireable<string>;
    const logGroups: PropTypes.Validator<any[]>;
    const updateLogGroup: PropTypes.Validator<(...args: any[]) => any>;
    const updateLog: PropTypes.Validator<(...args: any[]) => any>;
    const hostRef: PropTypes.Validator<object>;
    const snap: PropTypes.Validator<boolean>;
    const snapElement: PropTypes.Requireable<Element>;
    const snapElementId: PropTypes.Requireable<string>;
    const snapAnchorSide: PropTypes.Requireable<string>;
    const hostFunctions: PropTypes.Validator<object>;
    const registries: PropTypes.Validator<object>;
    const clearance: PropTypes.Validator<boolean>;
}
export const logTimelineItemInterface: PropTypes.Requireable<Required<PropTypes.InferProps<{
    timestamp: PropTypes.Validator<Required<PropTypes.InferProps<{
        now: PropTypes.Requireable<number>;
    }>>>;
    groupId: PropTypes.Validator<string>;
    logInd: PropTypes.Validator<number>;
    timestampInd: PropTypes.Validator<number>;
}>>>;
export const registryInterface: PropTypes.Requireable<Required<PropTypes.InferProps<{
    identifier: PropTypes.Validator<string>;
    rawCodeObject: PropTypes.Validator<object>;
    filePath: PropTypes.Validator<string>;
    stackPath: PropTypes.Validator<string>;
    stackFile: PropTypes.Validator<string>;
    stackLine: PropTypes.Validator<number>;
    stackChar: PropTypes.Validator<number>;
    depth: PropTypes.Validator<number>;
    depthStack: PropTypes.Validator<(string | null | undefined)[]>;
}>>>;
export const stackActualCallerDepth: 1;
export const stackFilePathCompareDepth: 2;
export const positionFindingWorstAllowed: 5;
export const switchPositionRegistrationDifferenceThresholdPx2: 10000;
export const minimalStringShowLength: 7;
export const foldedArrayShowItemCount: 3;
export const foldedObjectShowItemCount: 3;
export const expandedStreamDisableAutoScrollThresholdPx: 700;
export const timelineDisableAutoScrollThresholdPx: 200;
export const timelineSelectionAreaOffsetButterPx: 20;
export const timelineWaitConnectionTimeout: 5000;
export const timelineEachExpandLevelSliderWidthPx: 20;
export const timelineSideDraggerSnapThresholdPx: 20;
export namespace timelineSideDragLevelWidth {
    const indentationPx: number;
    const declarationPx: number;
    const filePx: number;
    const declarationSingleMaxPx: number;
}
export namespace timelineGroupWiseOffsetPx {
    const shared: number;
    const max: number;
    const min: number;
}
export const groupIdExtendingConnector: ":";
export const _L: "left";
export const _R: "right";
export const _T: "top";
export const _B: "bottom";
export const _C: "center";
export const _H: "horizontal";
export const _V: "vertical";
export const _DEF: "default";
export const _ID_INT: "__id__interaction__";
export namespace localStorageKeys {
    const DEFAULT: string;
}
export const validUnits: string[];
export const extraKeys: string[];
export const _Aug: "augmented";
export const _Time: "timeline";
export const pageElementsQuery: "body * :not(#root, .hyper-log-host, .hyper-log-streams-holder, .hyper-log-streams-holder *, #sudo-pointer-element, .leader-line, .leader-line *, .hyper-log-timeline, .hyper-log-timeline *, .hyper-selection-rect, .hyper-selection-rect *)";
export const logStreamGapToAnchorPx: 10;
export namespace _config {
    const logStreamHistoryRenderDepth: number;
    const logStreamHistoryRenderUnitOffsetPx: number;
    const logStreamHistoryRenderOpacityUnitDecrease: number;
    const shapeRectWidth: string;
    const snapThresholdPx: number;
    const attachLineLengthThresholdPx: number;
}
export namespace _rootStyles {
    const darkGrey: string;
    const grey: string;
    const lightGrey: string;
    const elegantRed: string;
    const brightOrange: string;
    const errorRedXLight: string;
    const errorRedLight: string;
    const errorRed: string;
    const errorRedDark: string;
    const warnYellowXLight: string;
    const warnYellowLight: string;
    const warnYellow: string;
    const warnYellowDark: string;
    const opacityDefault: number;
    const opacityMid: number;
    const opacityHigh: number;
    const opacityXh: number;
    const transitionFastMs: number;
    const transitionNormalMs: number;
    const transitionSlowMs: number;
    const transitionHighlightMs: number;
    const maxLogWidthRem: number;
    const minLogWidthRatioToMax: number;
}
export namespace _tinyColors {
    const lightGrey_1: any;
    export { lightGrey_1 as lightGrey };
}
export const graphicsHistoryLength: 200;
export const graphicsHistoryOpacityFadeRate: number;
export const measuresLineWidth: "0.125rem";
import PropTypes from "prop-types";
