export default class LogStreamName extends React.Component<any, any, any> {
    static get propTypes(): {
        name: PropTypes.Validator<string>;
        level: PropTypes.Validator<string>;
        logGroupElement: PropTypes.Requireable<HTMLElement>;
        logGroupId: PropTypes.Validator<string>;
        paused: PropTypes.Validator<boolean>;
        orientation: PropTypes.Validator<string>;
        alignment: PropTypes.Validator<string>;
        canSnap: PropTypes.Validator<boolean>;
        snap: PropTypes.Validator<boolean>;
        streamGrabbing: PropTypes.Validator<boolean>;
        handleDragAround: PropTypes.Validator<(...args: any[]) => any>;
        handlePositionReset: PropTypes.Validator<(...args: any[]) => any>;
        centerStagedId: PropTypes.Validator<string>;
        menuFunctions: PropTypes.Validator<object>;
    };
    constructor(props: any);
    ref: React.RefObject<any>;
    handleMouseDown(e: any): void;
    handleDbClick(e: any): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    shouldComponentUpdate(nextProps: any): boolean;
    render(): JSX.Element;
}
import React from "react";
import PropTypes from "prop-types";
