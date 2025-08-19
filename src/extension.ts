import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

function patchSettingsWithKritaStubs(wsRoot: string, stubPath: string) {
    const settingsPath = path.join(wsRoot, '.vscode', 'settings.json');
    let settings: any = {};
    if (fs.existsSync(settingsPath)) {
        try {
            settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        } catch {
            vscode.window.showErrorMessage('Could not parse existing settings.json');
            return;
        }
    }

    const existing: string[] = settings['python.analysis.extraPaths'] || [];
    if (!existing.includes(stubPath)) {
        existing.push(stubPath);
        settings['python.analysis.extraPaths'] = existing;
        fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 4));
        vscode.window.showInformationMessage(
            'Krita stubs enabled for this workspace. Start writing.'
        );
    }
}

export function activate(context: vscode.ExtensionContext) {
    const stubPath = path.join(context.extensionPath, 'krita-lang');

    // Manual command
    const manual = vscode.commands.registerCommand(
        'kritaexec.enableKritaStubs',
        () => {
            const wsFolders = vscode.workspace.workspaceFolders;
            if (!wsFolders) {
                vscode.window.showErrorMessage('Open a workspace folder first.');
                return;
            }
            patchSettingsWithKritaStubs(wsFolders[0].uri.fsPath, stubPath);
        }
    );

    // Auto‑enable when a Python file is opened
    const watcher = vscode.workspace.onDidOpenTextDocument(doc => {
        if (doc.languageId === 'python' && vscode.workspace.workspaceFolders?.length) {
            patchSettingsWithKritaStubs(vscode.workspace.workspaceFolders[0].uri.fsPath, stubPath);
        }
    });

    context.subscriptions.push(manual, watcher);
}

export function deactivate() {}
