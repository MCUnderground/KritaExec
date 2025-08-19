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

function replaceInFile(filePath: string, oldStr: string, newStr: string) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(new RegExp(oldStr, 'g'), newStr);
        fs.writeFileSync(filePath, content, 'utf8');
    } catch {
        // skip non-text files
    }
}

function copyRecursive(src: string, dest: string) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

async function buildPlugin(pluginName: string, context: vscode.ExtensionContext) {
    const wsFolders = vscode.workspace.workspaceFolders;
    if (!wsFolders) {
        vscode.window.showErrorMessage("Open a workspace folder first.");
        return;
    }

    const wsRoot = wsFolders[0].uri.fsPath;
    const scriptDir = path.join(context.extensionPath, 'plugin-builder');
    const sourceDir = path.join(scriptDir, 'sample-plugin');
    const targetDir = path.join(wsRoot, pluginName);

    if (!fs.existsSync(sourceDir)) {
        vscode.window.showErrorMessage(`[ERROR] sample-plugin not found at ${sourceDir}`);
        return;
    }

    if (fs.existsSync(targetDir)) {
        vscode.window.showErrorMessage(`[ERROR] Target folder '${pluginName}' already exists.`);
        return;
    }

    copyRecursive(sourceDir, targetDir);

    // Replace "SamplePlugin" placeholder
    const walk = (dir: string) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const entryPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                walk(entryPath);
            } else {
                replaceInFile(entryPath, 'SamplePlugin', pluginName);
            }
        }
    };
    walk(targetDir);

    // Drop builder.bat into new plugin folder
    const builderPath = path.join(scriptDir, 'builder.bat');
    if (fs.existsSync(builderPath)) {
        fs.copyFileSync(builderPath, path.join(targetDir, 'builder.bat'));
    }

    vscode.window.showInformationMessage(`Plugin '${pluginName}' created at ${targetDir}`);
}

export function activate(context: vscode.ExtensionContext) {
    const stubPath = path.join(context.extensionPath, 'krita-lang');

    const disposable = vscode.commands.registerCommand('kritaexec.createPlugin', async () => {
        const pluginName = await vscode.window.showInputBox({
            prompt: "Enter plugin name",
            placeHolder: "MyPlugin",
            validateInput: (val) => {
                if (!val.match(/^[A-Za-z_][A-Za-z0-9_]*$/)) {
                    return "Plugin name must be a valid identifier.";
                }
                return null;
            }
        });

        if (!pluginName) return;
        buildPlugin(pluginName, context);
    });

    context.subscriptions.push(disposable);

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
