export function HereThere({ stack, color }: {
    stack: any;
    color: any;
}): JSX.Element;
export namespace HereThere {
    namespace propTypes {
        const stack: PropTypes.Validator<Required<PropTypes.InferProps<{
            line: PropTypes.Validator<number>;
            char: PropTypes.Validator<number>;
            method: PropTypes.Validator<string>;
            file: PropTypes.Validator<string>;
            path: PropTypes.Validator<string>;
            raw: PropTypes.Validator<object>;
        }>>>;
        const color: PropTypes.Validator<string>;
    }
}
import PropTypes from "prop-types";
