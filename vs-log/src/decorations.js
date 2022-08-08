import vscode, { window } from 'vscode'

import { v5 as uuid } from 'uuid'
import tinycolor from 'tinycolor2'

import { isValidDocument } from './utils'

export const decorations = []

export const getDecoration = (
  filename,
  lineNumber,
  charIndex,
  color = null
) => {
  // console.log('getDecoration', lineNumber, charIndex)
  // ! uuid from filename, lineNumber, charIndex
  const idFromLocation = uuid(
    `${filename}?line=${lineNumber + 1}&char=${charIndex}`,
    uuid.URL
  )
  const hereThereColor = color
    ? tinycolor(color)
    : tinycolor(idFromLocation.slice(0, 6)).lighten(10)

  return window.createTextEditorDecorationType({
    borderRadius: '5px',
    color: hereThereColor.isLight() ? '#333333' : '#ffffff',
    backgroundColor: hereThereColor.toHexString(),
    overviewRulerColor: hereThereColor.toHexString(),
    overviewRulerLane: vscode.OverviewRulerLane.Left,
    // light: {
    // 	// this color will be used in light color themes
    // 	borderColor: 'darkblue',
    // },
    // dark: {
    // 	// this color will be used in dark color themes
    // 	borderColor: 'lightblue',
    // },
  })
}

export const removeHighLight = () => {
  // nuke all decorations
  decorations.forEach(decoration => {
    // window.activeTextEditor.setDecorations(decoration, [])
    decoration.dispose()
  })
  decorations.length = 0 // clear decorations
}

export const doLogHighLight = document => {
  if (!document || !isValidDocument(document.languageId)) {
    return
  }

  removeHighLight()

  // const text = document.getText()
  // const toDecorateItems = []

  let match
  const regEx = /\blog\(\)/g
  const regExForCustomColor = /log\(\)[\s\S]*\.color\(['|"](.+?)['|"]\)/gm

  for (let i = 0; i < document.lineCount; i++) {
    const line = document.lineAt(i)
    const lineText = line.text

    const reservedForCustomizedColor = {}

    while ((match = regExForCustomColor.exec(lineText)) !== null) {
      reservedForCustomizedColor[match.index] = {
        start: line.range.start.translate(0, match.index),
        end: line.range.start.translate(0, match.index + match[0].length),
        color: match[1],
      }
    }

    while ((match = regEx.exec(lineText)) !== null) {
      const useCustomizedColor = match.index in reservedForCustomizedColor
      const reservedSettings = useCustomizedColor
        ? reservedForCustomizedColor[match.index]
        : null

      const start = useCustomizedColor
        ? reservedSettings.start
        : line.range.start.translate(0, match.index)
      const end = useCustomizedColor
        ? reservedSettings.end
        : line.range.start.translate(0, match.index + match[0].length)
      // toDecorateItems.push({
      //   range: new vscode.Range(start, end),
      //   hoverMessage: 'HyperLog Here!',
      // })

      const thisDecorationType = getDecoration(
        document.fileName.split('/').pop(),
        i,
        match.index,
        useCustomizedColor ? reservedSettings.color : null
      )
      decorations.push(thisDecorationType)

      window.activeTextEditor.setDecorations(thisDecorationType, [
        {
          range: new vscode.Range(start, end),
          hoverMessage: 'HyperLog Here!',
        },
      ])
    }
  }

  // window.activeTextEditor.setDecorations(getDecoration(), toDecorateItems)
}
