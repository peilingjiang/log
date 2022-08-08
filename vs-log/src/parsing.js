import { workspace } from 'vscode'
import { parse } from '@babel/parser'

import { io } from './server'
import { configurations } from './global'

// import { isValidDocument } from './utils'
import { parsingCache } from './global'
import { isExcludedFile } from './utils'

export const parseAllCodeFiles = async () => {
  let totalParsed = 0

  for (const includingFileGlob of configurations.includes) {
    const files = await workspace.findFiles(
      includingFileGlob,
      configurations.excludes[0]
    )

    for (const file of files) {
      if (!isExcludedFile(file.path, configurations.excludes)) {
        const doc = await workspace.openTextDocument(file)
        if (doc) {
          totalParsed += parseCodeFile(doc)
        }
      }
    }
  }

  console.log(`parsing                | finished parsing ${totalParsed} files`)

  io.emit('ast', parsingCache)

  // workspace.textDocuments.forEach(document => {
  //   if (!isValidDocument(document.languageId())) return
  //   parseCodeFile(document)
  // })
}

export const parseCodeFile = document => {
  if (
    parsingCache[document.fileName] &&
    document.getText() === parsingCache[document.fileName].text
  ) {
    return 0
  }

  console.log(`parsing                | ${document.fileName}`)

  try {
    const result = parse(document.getText(), {
      sourceType: 'unambiguous',
      plugins: ['typescript', 'jsx', 'classProperties', 'objectRestSpread'],
      errorRecovery: true,
    })

    parsingCache[document.fileName] = {
      text: document.getText(),
      result: result,
    }

    return 1
  } catch (e) {
    console.error(`parsing                | error parsing ${document.fileName}`)
    return 0
  }
}
