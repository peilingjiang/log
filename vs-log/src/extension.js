// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import vscode, { commands, window, workspace } from 'vscode'

import { doLogHighLight, removeHighLight } from './decorations'
import { parsingCache } from './global'
import { parseAllCodeFiles } from './parsing'
import { io, server } from './server'

let statusBarLabel

/**
 * @param {vscode.ExtensionContext} context
 */
export function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('VS Log                 | activated')

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

  // ! decorate the current document
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
    ////
    // parseAllCodeFiles()
  })

  // ! parse on saving the file
  workspace.onDidSaveTextDocument(() => {
    console.log('VS Code                | file saving')
    parseAllCodeFiles()
  })

  // ! status bar
  // add a label to the status bar
  statusBarLabel = window.createStatusBarItem(vscode.StatusBarAlignment.Right)
  statusBarLabel.text = 'HyperLog'
  statusBarLabel.show()

  // ! socket
  io.on('connection', socket => {
    console.log(`HyperLog connected    *| ${socket.id}`)

    if (Object.keys(parsingCache).length) socket.emit('ast', parsingCache)

    socket.on('disconnect', () => {
      console.log(`HyperLog disconnected *| ${socket.id}`)
    })
  })
  5
  server.listen(2022, () => {
    console.log(`VS Log Server         *| http://localhost:2022`)
  })

  // Parse all code files on opening the workspace
  parseAllCodeFiles()
  // highlight the current document
  doLogHighLight(window.activeTextEditor.document)
}

// this method is called when your extension is deactivated
export function deactivate() {
  // remove decorations
  removeHighLight()
  // remove label from status bar
  statusBarLabel.dispose()
  // close the server
  server.close(() => {
    console.log('http Server           *| closed')
  })
  io.close(() => {
    console.log('VS Log Server         *| closed')
  })
  console.log('VS Log                 | deactivated')
}
