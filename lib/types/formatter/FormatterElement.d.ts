export default FormatterElement;
declare function FormatterElement(props: any): JSX.Element;
declare namespace FormatterElement {
    namespace propTypes {
        const element: PropTypes.Validator<object>;
        const groupId: PropTypes.Validator<string>;
        const inheritId: PropTypes.Validator<string>;
        const idViews: PropTypes.Validator<Required<PropTypes.InferProps<{
            centerStagedId: PropTypes.Validator<string>;
            unfoldedIds: PropTypes.Validator<(string | null | undefined)[]>;
            highlightedIds: PropTypes.Validator<(string | null | undefined)[]>;
        }>>>;
        const streamFunctions: PropTypes.Validator<object>;
        const formatArg: PropTypes.Validator<(...args: any[]) => any>;
        const minimal: PropTypes.Validator<boolean>;
        const choosing: PropTypes.Validator<boolean>;
        const highlightChanged: PropTypes.Validator<boolean>;
    }
}
import PropTypes from "prop-types";
