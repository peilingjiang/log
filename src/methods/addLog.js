import isEqual from 'react-fast-compare'
import tinycolor from 'tinycolor2'
import { v4 as uuid } from 'uuid'
import { v5 as uuidv5 } from 'uuid'

import {
  boundingDefault,
  logViewDefault,
  _config,
  _DEF,
  _H,
  _rootStyles,
} from '../constants.js'

import { g } from '../global.ts'
import { preprocessASTsToGetRegistries } from './ast.js'
import { sanitizeFormat, sanitizeLevel } from './sanitize.js'
import { defaultBoundingAlignmentFromSnapSide } from './snap.js'
import { checkForSpecialIdentifiers } from './specialHubUtils.js'
import {
  areArgsEqual,
  assertElement,
  assertExistence,
  assertNumber,
  cloneLogGroups,
  cloneLogTimeline,
  deepCopyArrayOfLogs,
  diffObjects,
  getObjectIds,
  getTimestamp,
  idFromString,
  stringifyDOMElement,
} from './utils.js'

export const newLog = (
  args,
  element,
  level,
  groupId,
  timestamp,
  parsedStack,
  hereThereColor,
  requests
) => {
  // assertArguments([
  //   {
  //     value: args,
  //     assertion: assertArray,
  //   },
  //   {
  //     value: groupId,
  //     assertion: assertString,
  //   },
  //   {
  //     value: timestamp,
  //     assertion: assertObject,
  //     // shape: ['now', 'date'],
  //     shape: ['now'],
  //   },
  // ])

  return {
    id: uuid(),
    groupId: groupId,
    element: element,
    level: level,
    args: [...args],
    timestamps: [timestamp],
    stack: parsedStack,
    count: 1,
    ////
    // customization
    color: requests.color || (args.length === 0 ? hereThereColor : _DEF),
    unit: requests.unit || '',
    history: assertNumber(requests.history)
      ? requests.history
      : _config.logStreamHistoryRenderDepth - 1,
    ////
    specialIdentifier: checkForSpecialIdentifiers(args),
  }
}

/* -------------------------------------------------------------------------- */
/*
   ________   _______   _______   ______   ________  ________ 
  /        \_/       \_/       \//      \ /        \/        \
 /         /         /         //       //         /       __/
/         /         /         /        //         /       / / 
\___/____/\________/\________/\________/\________/\________/  
*/

export const addLog = (
  logHost,
  stackParser,
  args,
  timestamp,
  error,
  requests = {},
  element = null
) => {
  // ! do not do anything when paused
  if (logHost.state.logPaused) return

  // Traditional
  if (g.preserveConsole) window.console.log(...args)

  // HyperLog
  stackParser.push(args, error, parsedStack => {
    // add log to logHost
    logHost.setState(prevState => {
      // ! Access requests in setState only
      const newState = {
        ...prevState,
        logGroups: cloneLogGroups(prevState.logGroups),
      }

      const prevIds = getObjectIds(prevState.logGroups)

      // ! element
      if (!element) {
        if (requests.element && assertElement(requests.element))
          element = requests.element
      }

      // ! groupId
      const groupId =
        requests.id ||
        idFromString(
          `${parsedStack.file}:${parsedStack.line}:${parsedStack.char}`
        )
      // ! groupElementId
      const groupElementId = idFromString(stringifyDOMElement(element))

      // ! color from location in CODE
      const idFromLocation = uuidv5(
        `${parsedStack.file}?line=${parsedStack.line}&char=${parsedStack.char}`,
        uuidv5.URL
      )
      let hereThereColor = tinycolor(idFromLocation.slice(0, 6))
        .lighten(20)
        .toHexString()

      if (hereThereColor === '#ffffff')
        hereThereColor = tinycolor(idFromLocation.slice(0, 6))
          .lighten(10)
          .toHexString()
      // if to use this color
      // const isHereThereLog = args.length === 0

      // ! color for error/warning
      if (requests.level === 'error') {
        requests.color = _rootStyles.errorRedXLight
      } else if (requests.level === 'warn') {
        requests.color = _rootStyles.warnYellowXLight
      }

      // ! level, format, etc.
      const newLogLevel = sanitizeLevel(requests.level)
      const newLogFormat = sanitizeFormat(requests.format)

      // ! first log of its group
      // can't find id among current groups
      if (prevIds.length === 0 || !prevIds.includes(groupId))
        newState.logGroups[groupId] = {
          name: requests.name || `${parsedStack.file}:${parsedStack.line}`,
          ////
          logs: [],
          level: newLogLevel,
          ////
          groupId: groupId,
          groupElementId: groupElementId,
          element: element,
          ////
          format: newLogFormat,
          ////
          orientation: _H,
          snap: false,
          snapElement: null,
          snapElementId: null,
          snapAnchorSide: 'right',
          // snapTargetSide: 'right',
          snapAnchorPercent: 0.5,
          ////
          bounding: boundingDefault,
          followType: assertExistence(element) ? 'stick' : 'independent', // TODO remove?
          ////
          groupColor:
            // requests.color || (isHereThereLog ? hereThereColor : randomColor()),
            requests.color || hereThereColor,
          ////
          paused: false,
          deleted: false,
          ////
          view: logViewDefault,
          timelineLogOrderReversed: 0,
          ////
          syncGraphics: 0,
          ////
          // customization
        }
      else if (prevIds.includes(groupId)) {
        // ! logStream paused or deleted
        if (
          prevState.logGroups[groupId].paused ||
          prevState.logGroups[groupId].deleted
        )
          return prevState
      }

      // ! color the element
      // only when the log stream is not paused or deleted
      if (newLogLevel === 'error') {
        element?.classList.remove('log-error-element')
        setTimeout(() => {
          element?.classList.add('log-error-element')
        }, 5)
      } else if (newLogLevel === 'warn') {
        element?.classList.remove('log-warn-element')
        setTimeout(() => {
          element?.classList.add('log-warn-element')
        }, 5)
      }

      // ! snap
      if (requests.snap && requests.snap.snapElement) {
        const thisGroup = newState.logGroups[groupId]

        thisGroup.snap = true

        thisGroup.snapAnchorSide =
          requests.snap.snapAnchorSide || thisGroup.snapAnchorSide
        // thisGroup.snapTargetSide =
        //   requests.snap.snapTargetSide || thisGroup.snapTargetSide
        thisGroup.snapAnchorPercent = assertNumber(
          requests.snap.snapAnchorPercent
        )
          ? requests.snap.snapAnchorPercent
          : thisGroup.snapAnchorPercent

        thisGroup.snapElement = requests.snap.snapElement
        thisGroup.snapElementId = idFromString(
          stringifyDOMElement(thisGroup.snapElement) +
            ' ' +
            thisGroup.snapAnchorSide
        )

        const snapBounding = defaultBoundingAlignmentFromSnapSide(
          thisGroup.snapAnchorSide
        )

        thisGroup.bounding = {
          ...thisGroup.bounding,
          left: '0px',
          top: '0px',
          horizontalAlign: snapBounding.horizontalAlign,
          verticalAlign: snapBounding.verticalAlign,
        }

        thisGroup.orientation = snapBounding.orientation
      }

      // check if got exactly the same as the last log
      // if so, just increment count
      const logs = newState.logGroups[groupId].logs

      // create a new log, may not to use it in the end
      const aFreshNewLog = newLog(
        args,
        element,
        newLogLevel,
        groupId,
        timestamp,
        parsedStack,
        hereThereColor,
        requests
      )

      if (logs.length) {
        const lastLog = logs[logs.length - 1]

        if (
          areArgsEqual(lastLog.args, args) &&
          isEqual(
            {
              level: lastLog.level,
              element: lastLog.element,
              stack: lastLog.stack,
              color: lastLog.color,
            },
            {
              level: aFreshNewLog.level,
              element: aFreshNewLog.element,
              stack: aFreshNewLog.stack,
              color: aFreshNewLog.color,
            }
          )
        ) {
          const returnedState = {
            ...newState,
            logGroups: {
              ...cloneLogGroups(newState.logGroups),
              [groupId]: {
                ...newState.logGroups[groupId],
                logs: [
                  ...deepCopyArrayOfLogs(logs).slice(0, logs.length - 1),
                  {
                    ...lastLog,
                    timestamps: [...lastLog.timestamps, timestamp],
                    count: lastLog.count + 1,
                  },
                ],
              },
            },
            logTimeline: [
              ...cloneLogTimeline(prevState.logTimeline),
              {
                timestamp: timestamp,
                groupId: groupId,
                logInd: logs.length - 1,
                timestampInd: lastLog.timestamps.length,
              },
            ],
          }

          // ! update ast registries
          _updateRegistries(logHost, returnedState)

          return returnedState
        }
      }

      /* -------------------------------------------------------------------------- */
      // ! actually add a log here
      /* -------------------------------------------------------------------------- */

      const returnedState = {
        ...newState,
        logGroups: {
          ...cloneLogGroups(newState.logGroups),
          [groupId]: {
            ...newState.logGroups[groupId],
            logs: [...deepCopyArrayOfLogs(logs), aFreshNewLog],
          },
        },
        logTimeline: [
          ...cloneLogTimeline(prevState.logTimeline),
          {
            timestamp: timestamp,
            groupId: groupId,
            logInd: logs.length,
            timestampInd: 0,
          },
        ],
      }

      // ! update ast registries
      _updateRegistries(logHost, returnedState)

      return returnedState
    })
  })
}

const _updateRegistries = (logHost, returnedState) => {
  const newRegistries = preprocessASTsToGetRegistries(
    returnedState.logGroups,
    returnedState.logTimeline,
    returnedState.asts,
    returnedState.registries
  )
  if (
    Object.keys(newRegistries).length > 0 &&
    !isEqual(newRegistries, returnedState.registries)
  )
    returnedState.registries = newRegistries
}
