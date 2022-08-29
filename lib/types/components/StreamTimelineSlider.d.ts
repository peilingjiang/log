export function StreamTimelineSlider({ logsCount, timelineLogOrderReversed, setTimelineLogOrderReversed, currentLogTimestamp, isForShape, }: {
    logsCount: any;
    timelineLogOrderReversed: any;
    setTimelineLogOrderReversed: any;
    currentLogTimestamp: any;
    isForShape: any;
}): JSX.Element;
export namespace StreamTimelineSlider {
    namespace propTypes {
        const logsCount: PropTypes.Validator<number>;
        const timelineLogOrderReversed: PropTypes.Validator<number>;
        const setTimelineLogOrderReversed: PropTypes.Validator<(...args: any[]) => any>;
        const currentLogTimestamp: PropTypes.Validator<number>;
        const isForShape: PropTypes.Validator<boolean>;
    }
}
import PropTypes from "prop-types";
