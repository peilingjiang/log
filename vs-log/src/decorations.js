import vscode, { window } from 'vscode'

import { v5 as uuid } from 'uuid'
import tinycolor from 'tinycolor2'

import { isValidDocument } from './utils'

export const decorations = []

export const getDecoration = (
  filename,
  lineNumber,
  charIndex,
  color = null,
  forIndentation = false
) => {
  // ! uuid from filename, lineNumber, charIndex
  const idFromLocation = uuid(
    `${filename}?line=${lineNumber + 1}&char=${charIndex}`,
    uuid.URL
  )
  const hereThereColor = color
    ? tinycolor(color)
    : tinycolor(idFromLocation.slice(0, 6)).lighten(10)

  return window.createTextEditorDecorationType({
    borderRadius: forIndentation ? '0' : '5px',
    borderWidth: '0 2px 0 0',
    borderStyle: 'solid',
    borderColor: hereThereColor.toString(),
    color: hereThereColor.isLight() ? '#333333' : '#ffffff',
    backgroundColor: forIndentation
      ? hereThereColor.setAlpha(0.25).toHex8String()
      : hereThereColor.setAlpha(0.9).toHexString(),
    overviewRulerColor: forIndentation
      ? undefined
      : hereThereColor.toHexString(),
    overviewRulerLane: forIndentation
      ? undefined
      : vscode.OverviewRulerLane.Left,
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

  const regEverything = /\blog\(/g
  const regEx = /\blog\(\)/g
  const regExForCustomColor = /log\(\)[\s\S]*\.color\(['|"](.+?)['|"]\)/gm
  const regExSpaceIndentation = /^[ ]+(?=log)/g

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

    while ((match = regEverything.exec(lineText)) !== null) {
      const useCustomizedColor = match.index in reservedForCustomizedColor
      const reservedSettings = useCustomizedColor
        ? reservedForCustomizedColor[match.index]
        : null

      let pureLogMatch
      while ((pureLogMatch = regEx.exec(lineText)) !== null) {
        const thisDecorationType = getDecoration(
          document.fileName.split('/').pop(),
          i,
          pureLogMatch.index,
          useCustomizedColor ? reservedSettings.color : null
        )
        decorations.push(thisDecorationType)

        const start = useCustomizedColor
          ? reservedSettings.start
          : line.range.start.translate(0, pureLogMatch.index)
        const end = useCustomizedColor
          ? reservedSettings.end
          : line.range.start.translate(
              0,
              pureLogMatch.index + pureLogMatch[0].length
            )

        window.activeTextEditor.setDecorations(thisDecorationType, [
          {
            range: new vscode.Range(start, end),
            hoverMessage: 'HyperLog Here!',
          },
        ])
      }

      let indentationMatch
      while (
        (indentationMatch = regExSpaceIndentation.exec(lineText)) !== null
      ) {
        const indentationDec = getDecoration(
          document.fileName.split('/').pop(),
          i,
          match.index,
          useCustomizedColor ? reservedSettings.color : null,
          true
        )
        decorations.push(indentationDec)

        window.activeTextEditor.setDecorations(indentationDec, [
          {
            range: new vscode.Range(
              line.range.start.translate(0, indentationMatch.index),
              line.range.start.translate(
                0,
                indentationMatch.index + indentationMatch[0].length
              )
            ),
          },
        ])
      }
    }
  }

  // window.activeTextEditor.setDecorations(getDecoration(), toDecorateItems)
}
