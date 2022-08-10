export const getLog = (logGroup, identifier) => {
  const { logInd, timestampInd } = identifier
  const log = logGroup.logs[logInd]
  return {
    ...log,
    count: 1,
    timestamps: [log.timestamps[timestampInd]],
  }
}
