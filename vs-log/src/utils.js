import minimatch from 'minimatch'

export const isValidDocument = languageId => {
  return languageId === 'javascript' || languageId === 'typescript'
}

export const isExcludedFile = (filePath, excludePatterns) => {
  if (!excludePatterns.length) return false

  for (const excludePattern of excludePatterns) {
    if (minimatch(filePath, excludePattern)) {
      return true
    }
  }
  return false
}
