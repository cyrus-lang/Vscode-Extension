const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
    context.subscriptions.push(
        vscode.tasks.registerTaskProvider('cyrus', {
            provideTasks() {
                const workspaceFolders = vscode.workspace.workspaceFolders;
                const tasks = [];
                const activeEditor = vscode.window.activeTextEditor;
                const activeFile = activeEditor ? activeEditor.document.fileName : undefined;

                // Project build task (uses Project.toml if present)
                const projectTask = new vscode.Task(
                    { type: 'cyrus', task: 'build-project' },
                    vscode.TaskScope.Workspace,
                    'Cyrus: Build Project (Project.toml)',
                    'cyrus',
                    new vscode.ShellExecution('cyrus build --profile=debug --sanitize=address -g --optimize=o0')
                );
                projectTask.group = vscode.TaskGroup.Build;
                projectTask.isDefault = true;
                tasks.push(projectTask);

                // Current file build task
                const shellCmd = activeFile 
                    ? `cyrus build "${activeFile}" --profile=debug --sanitize=address -g --optimize=o0`
                    : `cyrus build --profile=debug --sanitize=address -g --optimize=o0`;

                const fileTask = new vscode.Task(
                    { type: 'cyrus', task: 'build-file' },
                    vscode.TaskScope.Workspace,
                    'Cyrus: Build Current File',
                    'cyrus',
                    new vscode.ShellExecution(shellCmd)
                );
                fileTask.group = vscode.TaskGroup.Build;
                tasks.push(fileTask);

                return tasks;
            },
            resolveTask(task) {
                return task;
            }
        })
    );
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
