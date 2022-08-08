import vscode, { commands, window, workspace } from 'vscode'
import { parse } from '@babel/parser'
import { io } from './server'

// import { isValidDocument } from './utils'
import { parsingCache } from './global'

export const parseAllCodeFiles = () => {
  workspace.findFiles('**/*.{js,ts}', '**/node_modules/**').then(files => {
    files.forEach(file => {
      // get doc from file
      workspace.openTextDocument(file).then(doc => {
        if (doc) parseCodeFile(doc)
      })
    })
  })
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

  io.emit('ast', parsingCache)
}
