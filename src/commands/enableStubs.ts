import * as vscode from 'vscode';
import { patchSettingsWithKritaStubs } from '../utils/patchSettings';

export function registerEnableStubs(context: vscode.ExtensionContext, stubPath: string) {
    const disposable = vscode.commands.registerCommand('kritaexec.enableKritaStubs', () => {
        const wsFolders = vscode.workspace.workspaceFolders;
        if (!wsFolders) {
            vscode.window.showErrorMessage('Open a workspace folder first.');
            return;
        }
        patchSettingsWithKritaStubs(wsFolders[0].uri.fsPath, stubPath);
    });

    context.subscriptions.push(disposable);

    const watcher = vscode.workspace.onDidOpenTextDocument(doc => {
        if (doc.languageId === 'python' && vscode.workspace.workspaceFolders?.length) {
            patchSettingsWithKritaStubs(vscode.workspace.workspaceFolders[0].uri.fsPath, stubPath);
        }
    });

    context.subscriptions.push(watcher);
}
