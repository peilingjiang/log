// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')
const { commands, window, workspace } = vscode

const { v5 } = require('uuid')
const uuid = v5
const tinycolor = require('tinycolor2')

let statusBarLabel
const decorations = []

const isValidDocument = languageId => {
  return languageId === 'javascript' || languageId === 'typescript'
}

const getDecoration = (filename, lineNumber, charIndex, color = null) => {
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

const removeHighLight = () => {
  // nuke all decorations
  decorations.forEach(decoration => {
    // window.activeTextEditor.setDecorations(decoration, [])
    decoration.dispose()
  })
  decorations.length = 0 // clear decorations
}

const doLogHighLight = document => {
  if (!document || !isValidDocument(document.languageId)) {
    return
  }

  removeHighLight()

  // const text = document.getText()
  // const toDecorateItems = []

  let match
  const regEx = /log\(\)/g
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

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "vs-log" is now active!')

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = commands.registerCommand('vs-log.helloWorld', function () {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    console.log('Hello World from vs-log')
    window.showInformationMessage('Hello World from VS Log!')
  })
  context.subscriptions.push(disposable)

  /* -------------------------------------------------------------------------- */

  window.onDidChangeActiveTextEditor(editor => {
    if (editor) {
      doLogHighLight(editor.document)
    }
  })

  workspace.onDidChangeTextDocument(e => {
    doLogHighLight(e.document)
  })

  workspace.onDidOpenTextDocument(e => {
    doLogHighLight(e.document)
  })

  doLogHighLight(window.activeTextEditor.document)

  // add a label to the status bar
  statusBarLabel = window.createStatusBarItem(vscode.StatusBarAlignment.Right)
  statusBarLabel.text = 'HyperLog'
  statusBarLabel.show()
}

// this method is called when your extension is deactivated
function deactivate() {
  removeHighLight()

  statusBarLabel.dispose()
}

module.exports = {
  activate,
  deactivate,
}
