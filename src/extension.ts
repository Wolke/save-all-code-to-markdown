import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.saveAllCodeFilesToMarkdown', async () => {
        // Show a message to the user
        vscode.window.showInformationMessage('Saving all code files to a Markdown file...');

        // Define glob pattern to match code files
        const files = await vscode.workspace.findFiles('**/*.{js,html,css,ts,py,java,cpp,c,h}', '**/node_modules/**');

        // Initialize the Markdown content
        let markdownContent = '';

        // Read each file and append its content to the Markdown content
        for (const file of files) {
            const document = await vscode.workspace.openTextDocument(file);
            const fileName = path.basename(file.fsPath);
            const fileContent = document.getText();
            
            // Append file content in Markdown format
            markdownContent += `### ${fileName}\n\`\`\`${path.extname(file.fsPath).substring(1)}\n${fileContent}\n\`\`\`\n\n`;
        }

        // Define the path for the output Markdown file
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder found.');
            return;
        }

        const outputFilePath = path.join(workspaceFolders[0].uri.fsPath, 'all-code-files-content.md');

        // Write the Markdown content to the output file
        fs.writeFileSync(outputFilePath, markdownContent);

        // Show a message with the output file path
        vscode.window.showInformationMessage(`All code files have been saved to ${outputFilePath}`);
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
