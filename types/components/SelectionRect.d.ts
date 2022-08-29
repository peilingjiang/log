export function SelectionRect({
  filterArea,
  handleTimelineSetArea,
}: {
  filterArea: any
  handleTimelineSetArea: any
}): JSX.Element
export namespace SelectionRect {
  namespace propTypes {
    const filterArea: PropTypes.Validator<object>
    const handleTimelineSetArea: PropTypes.Validator<(...args: any[]) => any>
  }
}
import PropTypes from 'prop-types'
