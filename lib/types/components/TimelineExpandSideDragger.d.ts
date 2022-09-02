export default class TimelineExpandSideDragger extends React.Component<any, any, any> {
    static get propTypes(): {
        expandLevels: PropTypes.Validator<object>;
        timelineOffsetBudget: PropTypes.Validator<number>;
        setTimelineOffsetBudget: PropTypes.Validator<(...args: any[]) => any>;
    };
    constructor(props: any);
    state: {
        active: boolean;
    };
    handleMouseDown(e: any): void;
    handleClick(e: any): void;
    getTargetBudget(): number;
    render(): JSX.Element;
}
import React from "react";
import PropTypes from "prop-types";
