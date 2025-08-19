import * as vscode from 'vscode';
import { registerCreatePlugin } from './commands/createPlugin';
import { registerEnableStubs } from './commands/enableStubs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    const stubPath = path.join(context.extensionPath, 'krita-lang');

    registerCreatePlugin(context);
    registerEnableStubs(context, stubPath);
}

export function deactivate() {}
