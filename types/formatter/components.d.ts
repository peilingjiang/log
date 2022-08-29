export const ObjectKey: React.MemoExoticComponent<{
  ({
    value,
    inheritId,
    bold,
    choosing,
  }: {
    value: any
    inheritId: any
    bold: any
    choosing: any
  }): JSX.Element
  propTypes: {
    value: PropTypes.Validator<string>
    inheritId: PropTypes.Validator<string>
    bold: PropTypes.Validator<boolean>
    choosing: PropTypes.Validator<boolean>
  }
}>
export function FolderIcon({
  folded,
  groupId,
  id,
  setUnfoldedIds,
}: {
  folded: any
  groupId: any
  id: any
  setUnfoldedIds: any
}): JSX.Element
export namespace FolderIcon {
  namespace propTypes {
    const folded: PropTypes.Validator<boolean>
    const groupId: PropTypes.Validator<string>
    const id: PropTypes.Validator<string>
    const setUnfoldedIds: PropTypes.Validator<(...args: any[]) => any>
  }
}
import PropTypes from 'prop-types'
import React from 'react'
