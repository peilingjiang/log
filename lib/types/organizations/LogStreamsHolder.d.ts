export default class LogStreamsHolder extends React.Component<any, any, any> {
    static get propTypes(): {
        element: import("prop-types").Requireable<Element>;
        elementId: import("prop-types").Requireable<string>;
        logGroups: import("prop-types").Validator<any[]>;
        updateLogGroup: import("prop-types").Validator<(...args: any[]) => any>;
        updateLog: import("prop-types").Validator<(...args: any[]) => any>;
        hostRef: import("prop-types").Validator<object>;
        snap: import("prop-types").Validator<boolean>;
        snapElement: import("prop-types").Requireable<Element>;
        snapElementId: import("prop-types").Requireable<string>;
        snapAnchorSide: import("prop-types").Requireable<string>;
        hostFunctions: import("prop-types").Validator<object>;
        registries: import("prop-types").Validator<object>;
        clearance: import("prop-types").Validator<boolean>;
    };
    constructor(props: any);
    state: {
        hovered: boolean;
        grabbing: boolean;
        bounding: {
            left: string;
            right: string;
            top: string;
            bottom: string;
            verticalAlign: string;
            horizontalAlign: string;
            registration: undefined;
        };
    };
    ref: React.RefObject<any>;
    handleStreamHover(newState?: boolean): void;
    handleStreamDragAround(newState?: boolean): void;
    componentDidMount(): void;
    componentDidUpdate(): void;
    shouldComponentUpdate(nextProps: any, nextState: any): boolean;
    optimizePosition(): void;
    snapToPosition(): void;
    getClearanceTransform(clearance: any, bounding: any): {
        opacity: number;
        transform: string;
    };
    render(): JSX.Element;
}
import React from "react";
