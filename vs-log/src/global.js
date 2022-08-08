import { workspace } from 'vscode'

const extensionConfigurations = workspace.getConfiguration('VS Log')
export const configurations = {
  includes: extensionConfigurations.get('includes').split(' '),
  excludes: extensionConfigurations.get('excludes').split(' '),
}

export const parsingCache = {}
