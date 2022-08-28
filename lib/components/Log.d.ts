export default class Log extends React.Component<any, any, any> {
    static get propTypes(): {
        groupId: PropTypes.Validator<string>;
        log: PropTypes.Validator<Required<PropTypes.InferProps<{
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
        orderReversed: PropTypes.Validator<number>;
        expandedLog: PropTypes.Validator<boolean>;
        snap: PropTypes.Validator<boolean>;
        orientation: PropTypes.Requireable<string>;
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
        logStats: PropTypes.Validator<object>;
        useStats: PropTypes.Validator<boolean>;
        registries: PropTypes.Validator<object>;
        showRegistries: PropTypes.Validator<boolean>;
    };
    constructor(props: any);
    constructor(props: any, context: any);
    shouldComponentUpdate(nextProps: any): boolean;
    render(): JSX.Element | undefined;
}
export function logBaseStyles(orderReversed: any, expanded: any): {
    zIndex: number;
};
import React from "react";
import PropTypes from "prop-types";
