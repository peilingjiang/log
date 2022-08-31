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
export class CenterStageNav extends React.PureComponent<any, any, any> {
    static get propTypes(): {
        centerStagedId: PropTypes.Validator<string>;
        logGroupId: PropTypes.Validator<string>;
        setCenterStagedId: PropTypes.Requireable<(...args: any[]) => any>;
        inTimeline: PropTypes.Validator<boolean>;
    };
    constructor(props: any);
    idRef: React.RefObject<any>;
    copyIconRef: React.RefObject<any>;
    render(): JSX.Element;
}
export function CenterStageNavItem({ centerStagedIdPart, ind, isLastPart, parsedIdParts, logGroupId, setCenterStagedId, }: {
    centerStagedIdPart: any;
    ind: any;
    isLastPart: any;
    parsedIdParts: any;
    logGroupId: any;
    setCenterStagedId: any;
}): JSX.Element;
export namespace CenterStageNavItem {
    namespace propTypes {
        const centerStagedIdPart: PropTypes.Validator<string>;
        const ind: PropTypes.Validator<number>;
        const isLastPart: PropTypes.Validator<boolean>;
        const parsedIdParts: PropTypes.Validator<any[]>;
        const logGroupId: PropTypes.Validator<string>;
        const setCenterStagedId: PropTypes.Validator<(...args: any[]) => any>;
    }
}
import React from "react";
import PropTypes from "prop-types";
