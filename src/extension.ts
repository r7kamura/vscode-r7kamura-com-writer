import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('r7kamura-com-writer.create', () => {
    if (!vscode.workspace || !vscode.workspace.workspaceFolders) {
      return vscode.window.showErrorMessage('Please open a project folder first');
    }

    const workspacePath = vscode.workspace.workspaceFolders[0].uri.toString().split(':')[1];

		vscode.window.showInputBox({
      title: 'name-in-url',
    }).then((name) => {
      vscode.window.showInputBox({
        title: 'Title',
      }).then((title) => {
        const date = new Date();
        const yyyy = date.getFullYear();
        const mm = `0${date.getMonth() + 1}`.slice(-2);
        const dd = `0${date.getDate()}`.slice(-2);
        const filePath = path.join(workspacePath, 'articles', `${yyyy}-${mm}-${dd}-${name}.md`);
        const content = `---\ntitle: ${title}\n---\n\n`;
        fs.writeFile(filePath, content, (error) => {
          if (error) {
            return vscode.window.showErrorMessage(`Failed to create ${filePath}`);
          }
          vscode.window.showInformationMessage(`Created ${filePath}`);

          const vscodeUri = vscode.Uri.file(filePath);
          vscode.workspace.openTextDocument(vscodeUri).then(vscodeTextDocument => {
            vscode.window.showTextDocument(vscodeTextDocument).then(editor => {
              const position = new vscode.Position(5, 1);
              editor.selections = [new vscode.Selection(position, position)];
              editor.revealRange(new vscode.Range(position, position));
            });
          })
        });
      });
    });
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
