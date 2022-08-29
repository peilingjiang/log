export class Formatter extends React.Component<any, any, any> {
    static get propTypes(): {
        args: PropTypes.Validator<any[]>;
        groupId: PropTypes.Validator<string>;
        logId: PropTypes.Validator<string>;
        locationIdentifier: PropTypes.Validator<string>;
        view: PropTypes.Validator<Required<PropTypes.InferProps<{
            left: PropTypes.Validator<string>;
            top: PropTypes.Validator<string>;
            centerStagedId: PropTypes.Validator<string>;
            unfoldedIds: PropTypes.Validator<(string | null | undefined)[]>;
            highlightedIds: PropTypes.Validator<(string | null | undefined)[]>;
        }>>>;
        streamFunctions: PropTypes.Validator<object>;
        choosingCenterStaged: PropTypes.Validator<boolean>;
        highlightChanged: PropTypes.Validator<boolean>;
        registries: PropTypes.Validator<object>;
        showRegistries: PropTypes.Validator<boolean>;
        unit: PropTypes.Requireable<string>;
    };
    constructor(props: any);
    handleClick(e: any): true | undefined;
    shouldComponentUpdate(nextProps: any): boolean;
    render(): JSX.Element;
}
export function formatArg(arg: any, groupId: any, inheritId: any, idViews: any, streamFunctions: any, minimal?: boolean, choosing?: boolean, highlightChanged?: boolean): JSX.Element;
import React from "react";
import PropTypes from "prop-types";
