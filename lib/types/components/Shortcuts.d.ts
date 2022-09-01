export default Shortcuts;
declare function Shortcuts({ show }: {
    show: any;
}): JSX.Element;
declare namespace Shortcuts {
    namespace propTypes {
        const show: PropTypes.Validator<boolean>;
    }
}
import PropTypes from "prop-types";
