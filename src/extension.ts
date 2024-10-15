import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  // Registering the command to display a simple information message when the extension is activated
  let disposable = vscode.commands.registerCommand(
    "flutter-quick-snips.showSnippets",
    () => {
      vscode.window.showInformationMessage(
        "Flutter Quick Snips Widget Activated"
      );
      console.log(
        'Congratulations, your extension "Flutter Quick Snips" is now active!'
      );
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
