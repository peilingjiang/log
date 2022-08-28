declare const _default: React.MemoExoticComponent<{
    ({ arr, groupId, inheritId, idViews, streamFunctions, formatArg, minimal, choosing, highlightChanged, }: {
        arr: any;
        groupId: any;
        inheritId: any;
        idViews: any;
        streamFunctions: any;
        formatArg: any;
        minimal: any;
        choosing: any;
        highlightChanged: any;
    }): JSX.Element;
    propTypes: {
        arr: PropTypes.Validator<any[]>;
        groupId: PropTypes.Validator<string>;
        inheritId: PropTypes.Validator<string>;
        idViews: PropTypes.Validator<Required<PropTypes.InferProps<{
            centerStagedId: PropTypes.Validator<string>;
            unfoldedIds: PropTypes.Validator<(string | null | undefined)[]>;
            highlightedIds: PropTypes.Validator<(string | null | undefined)[]>;
        }>>>;
        streamFunctions: PropTypes.Validator<object>;
        formatArg: PropTypes.Validator<(...args: any[]) => any>;
        minimal: PropTypes.Validator<boolean>;
        choosing: PropTypes.Validator<boolean>;
        highlightChanged: PropTypes.Validator<boolean>;
    };
}>;
export default _default;
import PropTypes from "prop-types";
import React from "react";
