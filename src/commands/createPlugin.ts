import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { copyRecursive, replaceInFile } from '../utils/fileUtils';

export function registerCreatePlugin(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('kritaexec.createPlugin', async () => {
        const pluginName = await vscode.window.showInputBox({
            prompt: "Enter plugin name",
            placeHolder: "MyPlugin",
            validateInput: val => /^[A-Za-z_][A-Za-z0-9_]*$/.test(val) ? null : "Plugin name must be a valid identifier."
        });
        if (!pluginName) return;

        let targetDir: string | undefined;
        const choice = await vscode.window.showQuickPick(['Workspace', 'Other folder'], {
            placeHolder: 'Where do you want to create the plugin?'
        });
        if (!choice) return;

        if (choice === 'Workspace') {
            const wsFolders = vscode.workspace.workspaceFolders;
            if (!wsFolders) {
                vscode.window.showErrorMessage("Open a workspace folder first.");
                return;
            }
            targetDir = path.join(wsFolders[0].uri.fsPath, pluginName);
        } else {
            const folderUri = await vscode.window.showOpenDialog({
                canSelectFolders: true,
                canSelectFiles: false,
                canSelectMany: false,
                openLabel: 'Select folder to create plugin in'
            });
            if (!folderUri?.length) return;
            targetDir = path.join(folderUri[0].fsPath, pluginName);
        }

        if (fs.existsSync(targetDir)) {
            vscode.window.showErrorMessage(`[ERROR] Target folder '${pluginName}' already exists.`);
            return;
        }

        const scriptDir = path.join(context.extensionPath, 'plugin-builder');
        const sourceDir = path.join(scriptDir, 'sample-plugin');
        if (!fs.existsSync(sourceDir)) {
            vscode.window.showErrorMessage(`[ERROR] sample-plugin not found at ${sourceDir}`);
            return;
        }

        copyRecursive(sourceDir, targetDir);

        const walk = (dir: string) => {
            for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
                const entryPath = path.join(dir, entry.name);
                if (entry.isDirectory()) walk(entryPath);
                else replaceInFile(entryPath, 'SamplePlugin', pluginName);
            }
        };
        walk(targetDir);

        const builderPath = path.join(scriptDir, 'builder.bat');
        if (fs.existsSync(builderPath)) fs.copyFileSync(builderPath, path.join(targetDir, 'builder.bat'));

        vscode.window.showInformationMessage(`Plugin '${pluginName}' created at ${targetDir}`);

        if (choice === 'Other folder') {
            const openChoice = await vscode.window.showQuickPick(['Yes', 'No'], {
                placeHolder: 'Open newly created plugin folder in VS Code?'
            });
            if (openChoice === 'Yes') {
                vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(targetDir), true);
            }
        }
    });

    context.subscriptions.push(disposable);
}
