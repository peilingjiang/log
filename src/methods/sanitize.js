export const sanitizeLevel = level => {
  if (['log', 'error', 'warn'].includes(level)) return level
  return 'log'
}

export const sanitizeFormat = format => {
  if (['text', 'shape'].includes(format)) return format
  return 'text'
}
