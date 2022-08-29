export default class LogBody extends React.Component<any, any, any> {
    static get propTypes(): {
        args: PropTypes.Validator<any[]>;
        groupId: PropTypes.Validator<string>;
        id: PropTypes.Validator<string>;
        count: PropTypes.Validator<number>;
        timestamp: PropTypes.Validator<number>;
        stack: PropTypes.Validator<object>;
        color: PropTypes.Validator<string>;
        unit: PropTypes.Requireable<string>;
        opacity: PropTypes.Validator<number>;
        orderReversed: PropTypes.Validator<number>;
        expandedLog: PropTypes.Validator<boolean>;
        hostFunctions: PropTypes.Validator<object>;
        streamFunctions: PropTypes.Validator<object>;
        organization: PropTypes.Validator<string>;
        view: PropTypes.Validator<Required<PropTypes.InferProps<{
            left: PropTypes.Validator<string>;
            top: PropTypes.Validator<string>;
            centerStagedId: PropTypes.Validator<string>;
            unfoldedIds: PropTypes.Validator<(string | null | undefined)[]>;
            highlightedIds: PropTypes.Validator<(string | null | undefined)[]>;
        }>>>;
        choosingCenterStaged: PropTypes.Validator<boolean>;
        highlightChanged: PropTypes.Validator<boolean>;
        registries: PropTypes.Validator<object>;
        showRegistries: PropTypes.Validator<boolean>;
    };
    constructor(props: any);
    bodyRef: React.RefObject<any>;
    componentDidMount(): void;
    shouldComponentUpdate(nextProps: any): boolean;
    componentDidUpdate(): void;
    handleScroll: (e: any) => void;
    syncScroll: () => void;
    render(): JSX.Element;
}
import React from "react";
import PropTypes from "prop-types";
