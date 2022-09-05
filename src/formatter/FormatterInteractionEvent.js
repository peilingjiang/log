import React from 'react'
import PropTypes from 'prop-types'

import { extraKeys, idViewsInterface } from '../constants.js'
import FormatterObject from './FormatterObject.js'

const FormatterInteractionEvent = props => {
  const {
    event,
    groupId,
    inheritId,
    idViews,
    streamFunctions,
    formatArg,
    minimal,
    choosing,
    highlightChanged,
  } = props

  if (minimal) {
    return (
      <FormatterObject
        key={`${inheritId}[obj]`}
        obj={event}
        groupId={groupId}
        inheritId={inheritId}
        idViews={idViews}
        streamFunctions={streamFunctions}
        formatArg={formatArg}
        minimal={minimal}
        choosing={choosing}
        highlightChanged={highlightChanged}
      />
    )
  }

  return (
    <div
      // key={`${inheritId}[event]`}
      className={`f-event`}
      data-key={`${inheritId}[event]`}
    >
      <FormatterObject
        // key={`${inheritId}[obj]`}
        obj={event}
        groupId={groupId}
        inheritId={inheritId}
        idViews={idViews}
        streamFunctions={streamFunctions}
        formatArg={formatArg}
        minimal={minimal}
        choosing={choosing}
        highlightChanged={highlightChanged}
      />
      {getContainersForEvent(event, props)}
    </div>
  )
}

FormatterInteractionEvent.propTypes = {
  event: PropTypes.object.isRequired,
  groupId: PropTypes.string.isRequired,
  inheritId: PropTypes.string.isRequired,
  idViews: idViewsInterface.isRequired,
  streamFunctions: PropTypes.object.isRequired,
  formatArg: PropTypes.func.isRequired,
  minimal: PropTypes.bool.isRequired,
  choosing: PropTypes.bool.isRequired,
  highlightChanged: PropTypes.bool.isRequired,
}

/* -------------------------------------------------------------------------- */

const getContainersForEvent = (event, eventProps) => {
  const type = event.type
  const aggregatedEventType = aggregateEventTypes(type)

  const targetAndTimestamp = (
    <>
      <EventInfoItem
        name="target"
        value={event.target}
        valueLabel={'target'}
        eventProps={eventProps}
      />
      <EventInfoItem
        name="timeStamp"
        value={Math.round(event.timeStamp)}
        valueLabel={'timeStamp'}
        eventProps={eventProps}
      />
    </>
  )

  let extraInformation
  switch (aggregatedEventType) {
    case 'mouse':
      extraInformation = extraInformationForEvents(
        [
          'offsetX',
          'offsetY',
          'movementX',
          'movementY',
          'button',
          ...extraKeys,
          'which',
        ],
        event,
        eventProps
      )
      return (
        <div className="event-info-card mouse-event">
          <span className="event-label">{event.type}</span>
          <div className="container">
            <EventInfoItem
              name="clientX"
              value={event.clientX}
              valueLabel={'clientX'}
              eventProps={eventProps}
            />
            <EventInfoItem
              name="clientY"
              value={event.clientY}
              valueLabel={'clientY'}
              eventProps={eventProps}
            />
          </div>

          {extraInformation.length !== 0 ? (
            <div className="container">{extraInformation}</div>
          ) : null}

          {targetAndTimestamp}
        </div>
      )
    case 'keyboard':
      extraInformation = extraInformationForEvents(
        ['isComposing', 'repeat', ...extraKeys],
        event,
        eventProps
      )
      return (
        <div className="event-info-card keyboard-event">
          <span className="event-label">{event.type}</span>
          <div className="container">
            <EventInfoItem
              name="code"
              value={event.code}
              valueLabel={'code'}
              eventProps={eventProps}
            />
            <EventInfoItem
              name="key"
              value={event.key}
              valueLabel={'key'}
              eventProps={eventProps}
            />
            <EventInfoItem
              name="keyCode"
              value={event.keyCode}
              valueLabel={'keyCode'}
              eventProps={eventProps}
            />
          </div>

          {extraInformation.length !== 0 ? (
            <div className="container">{extraInformation}</div>
          ) : null}

          {targetAndTimestamp}
        </div>
      )
    case 'scroll':
      extraInformation = extraInformationForEvents(
        ['deltaZ', 'deltaMode', ...extraKeys],
        event,
        eventProps
      )
      return (
        <div className="event-info-card scroll-event">
          <span className="event-label">{event.type}</span>
          <div className="container">
            <EventInfoItem
              name="deltaX"
              value={event.deltaX}
              valueLabel={'deltaX'}
              eventProps={eventProps}
            />
            <EventInfoItem
              name="deltaY"
              value={event.deltaY}
              valueLabel={'deltaY'}
              eventProps={eventProps}
            />
          </div>

          {extraInformation.length !== 0 ? (
            <div className="container">{extraInformation}</div>
          ) : null}

          {targetAndTimestamp}
        </div>
      )
    case 'touch':
      return
    case 'pointer':
      return
    case 'focus':
      return (
        <div className="event-info-card scroll-event">
          <span className="event-label">{event.type}</span>
          {targetAndTimestamp}
        </div>
      )
    case 'input':
      return (
        <div className="event-info-card input-event">
          <span className="event-label">{event.type}</span>
          {(event.data || event.nativeEvent?.data) && (
            <div className="container">
              {event.data ? (
                <EventInfoItem
                  name="data"
                  value={event.data}
                  valueLabel={'data'}
                  eventProps={eventProps}
                />
              ) : event.nativeEvent?.data ? (
                <EventInfoItem
                  name="nativeEvent.data"
                  value={event.nativeEvent.data}
                  valueLabel={'nativeEvent-data'}
                  eventProps={eventProps}
                />
              ) : null}
            </div>
          )}

          {targetAndTimestamp}
        </div>
      )
  }
}

const aggregateEventTypes = type => {
  if (
    [
      'click',
      'contextmenu',
      'dblclick',
      'mousedown',
      'mouseup',
      'mousemove',
    ].includes(type)
  ) {
    return 'mouse'
  } else if (['keydown', 'keyup', 'keypress'].includes(type)) {
    return 'keyboard'
  } else if (['scroll', 'wheel'].includes(type)) {
    return 'scroll'
  } else if (['touchstart', 'touchend', 'touchmove'].includes(type)) {
    return 'touch'
  } else if (['pointerdown', 'pointerup', 'pointermove'].includes(type)) {
    return 'pointer'
  } else if (['focus', 'blur'].includes(type)) {
    return 'focus'
  } else if (['change', 'input'].includes(type)) {
    return 'input'
  }
}

const extraInformationForEvents = (extraFields, event, eventProps) => {
  return extraFields
    .map(key => {
      if (event[key]) {
        return (
          <EventInfoItem
            key={key}
            name={key}
            value={event[key]}
            valueLabel={key}
            eventProps={eventProps}
          />
        )
      }
      return null
    })
    .filter(item => item !== null)
}

/* -------------------------------------------------------------------------- */

const EventInfoItem = ({ name, value, valueLabel, eventProps }) => {
  const {
    groupId,
    inheritId,
    idViews,
    streamFunctions,
    formatArg,
    minimal,
    choosing,
    highlightChanged,
  } = eventProps
  return (
    <div className="event-item">
      <span className="item-name">{name}</span>
      <div className="item-value">
        {formatArg(
          value,
          groupId,
          `${inheritId}-${valueLabel}[val]`,
          idViews,
          streamFunctions,
          minimal,
          choosing,
          highlightChanged
        )}
      </div>
    </div>
  )
}

EventInfoItem.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  valueLabel: PropTypes.string.isRequired,
  eventProps: PropTypes.object.isRequired,
}

/* -------------------------------------------------------------------------- */

export default FormatterInteractionEvent
