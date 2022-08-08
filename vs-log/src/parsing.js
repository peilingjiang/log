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
          parseCodeFile(doc)
          totalParsed++
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
    return
  }

  console.log(`parsing                | ${document.fileName}`)
  const result = parse(document.getText(), {
    sourceType: 'unambiguous',
    plugins: ['typescript', 'jsx', 'classProperties', 'objectRestSpread'],
  })

  parsingCache[document.fileName] = {
    text: document.getText(),
    result: result,
  }
}
