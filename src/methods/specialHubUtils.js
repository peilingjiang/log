import { _ID_INT } from '../constants.js'
import { assertObject } from './utils.js'

export const checkForSpecialIdentifiers = args => {
  const identifiers = new Set()
  args.forEach(arg => {
    if (assertInteractionEvent(arg)) {
      identifiers.add(_ID_INT)
    }
  })

  return [...identifiers]
}

// ! interaction

export const assertInteractionEvent = arg => {
  return (
    assertObject(arg) && interactionEventTypes.includes(arg.constructor?.name)
  )
}

export const interactionEventTypes = [
  'MouseEvent',
  'KeyboardEvent',
  'TouchEvent',
  'WheelEvent',
  'PointerEvent',
  'AnimationEvent',
  'TransitionEvent',
  'UIEvent',
  'FocusEvent',
  'CompositionEvent',
  'ClipboardEvent',
  'DragEvent',
  'FullscreenErrorEvent',
  'FullscreenEvent',
  'GamepadEvent',
  'HashChangeEvent',
  'InputEvent',
  /* -------------------------------------------------------------------------- */
  'SyntheticEvent',
  'SyntheticBaseEvent',
]
