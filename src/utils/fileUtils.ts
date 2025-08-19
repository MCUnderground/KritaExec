import * as fs from 'fs';
import * as path from 'path';

export function copyRecursive(src: string, dest: string) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

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

export function replaceInFile(filePath: string, oldStr: string, newStr: string) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(new RegExp(oldStr, 'g'), newStr);
        fs.writeFileSync(filePath, content, 'utf8');
    } catch {
        // skip non-text files
    }
}
