export default class TimelineHolder extends React.Component<any, any, any> {
    static get propTypes(): {
        logPaused: PropTypes.Validator<boolean>;
        logGroups: PropTypes.Validator<object>;
        logTimeline: PropTypes.Validator<(Required<PropTypes.InferProps<{
            timestamp: PropTypes.Validator<Required<PropTypes.InferProps<{
                now: PropTypes.Requireable<number>;
            }>>>;
            groupId: PropTypes.Validator<string>;
            logInd: PropTypes.Validator<number>;
            timestampInd: PropTypes.Validator<number>;
        }>> | null | undefined)[]>;
        totalLogCount: PropTypes.Validator<number>;
        updateLogGroup: PropTypes.Validator<(...args: any[]) => any>;
        updateLog: PropTypes.Validator<(...args: any[]) => any>;
        hostRef: PropTypes.Validator<object>;
        hostFunctions: PropTypes.Validator<object>;
        asts: PropTypes.Validator<object>;
        registries: PropTypes.Validator<object>;
        clearance: PropTypes.Validator<boolean>;
        filterArea: PropTypes.Validator<object>;
        enableFilterArea: PropTypes.Validator<boolean>;
    };
    constructor(props: any);
    state: {
        folded: boolean;
        hovered: boolean;
        grabbing: boolean;
        right: string;
        pinnedGroupId: null;
        offsetBudget: number;
        filteredOutGroupIds: Set<any>;
    };
    ref: React.RefObject<any>;
    scrollWrapperRef: React.RefObject<any>;
    handleTimelineHover(newState?: boolean): void;
    handleStreamHover(): void;
    handleStreamDragAround(): void;
    handleTimelineDragAround(e: any): void;
    handleTimelinePositionReset(): void;
    handleTimelineFold(): void;
    setTimelineOffsetBudget(newBudget: any): void;
    filterGroupIdsFunctions: {
        add: (groupId: any) => void;
        remove: (groupId: any) => void;
    };
    componentDidUpdate(prevProps: any): void;
    componentWillUnmount(): void;
    getClearanceTransform(clearance: any, right: any): {
        opacity: number;
        transform: string;
    };
    addFilteredGroupId(groupId: any): void;
    removeFilteredGroupId(groupId: any): void;
    render(): JSX.Element;
}
import React from "react";
import PropTypes from "prop-types";
