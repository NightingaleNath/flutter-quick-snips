import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let showSnippets = vscode.commands.registerCommand(
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

  const codeActionProvider: vscode.CodeActionProvider = {
    provideCodeActions(
      document: vscode.TextDocument,
      range: vscode.Range | vscode.Selection,
      context: vscode.CodeActionContext,
      token: vscode.CancellationToken
    ): vscode.CodeAction[] | undefined {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const selection = editor.selection;

        // Get the word range under the cursor
        const wordRange = document.getWordRangeAtPosition(selection.active);
        const word = wordRange ? document.getText(wordRange) : "";

        if (wordRange && word) {
          // Find the full widget range
          const fullWidgetRange = findFullWidgetRange(document, wordRange);
          const fullWidgetText = document.getText(fullWidgetRange).trim();

          // Extract the widget name for the action title
          const widgetName = fullWidgetText.split("(")[0].trim();

          const actions: vscode.CodeAction[] = [
            createWrapAction(
              `Quick Snip: Wrap ${widgetName} with Consumer`,
              "flutter-quick-snips.wrapWithConsumer",
              fullWidgetRange,
              fullWidgetText
            ),
            createWrapAction(
              `Quick Snip: Wrap ${widgetName} with ValueListenableBuilder`,
              "flutter-quick-snips.wrapWithValueListenableBuilder",
              fullWidgetRange,
              fullWidgetText
            ),
            createWrapAction(
              `Quick Snip: Wrap ${widgetName} with Builder`,
              "flutter-quick-snips.wrapWithBuilder",
              fullWidgetRange,
              fullWidgetText
            ),
            createWrapAction(
              `Quick Snip: Wrap ${widgetName} with LayoutBuilder`,
              "flutter-quick-snips.wrapWithLayoutBuilder",
              fullWidgetRange,
              fullWidgetText
            ),
            createWrapAction(
              `Quick Snip: Wrap ${widgetName} with StreamBuilder`,
              "flutter-quick-snips.wrapWithStreamBuilder",
              fullWidgetRange,
              fullWidgetText
            ),
            createWrapAction(
              `Quick Snip: Wrap ${widgetName} with FutureBuilder`,
              "flutter-quick-snips.wrapWithFutureBuilder",
              fullWidgetRange,
              fullWidgetText
            ),
            createWrapAction(
              `Quick Snip: Wrap ${widgetName} with AnimatedBuilder`,
              "flutter-quick-snips.wrapWithAnimatedBuilder",
              fullWidgetRange,
              fullWidgetText
            ),
            createWrapAction(
              `Quick Snip: Wrap ${widgetName} with RepaintBoundary`,
              "flutter-quick-snips.wrapWithRepaintBoundary",
              fullWidgetRange,
              fullWidgetText
            ),
            createWrapAction(
              `Quick Snip: Wrap ${widgetName} with DefaultTextStyle`,
              "flutter-quick-snips.wrapWithDefaultTextStyle",
              fullWidgetRange,
              fullWidgetText
            ),
          ];

          return actions;
        }
      }

      return [];
    },
  };

  function createWrapAction(
    title: string,
    command: string,
    range: vscode.Range,
    widgetText: string
  ) {
    const action = new vscode.CodeAction(title, vscode.CodeActionKind.Refactor);
    action.command = {
      command: command,
      title: title,
      arguments: [range, widgetText],
    };
    return action;
  }

  function findFullWidgetRange(
    document: vscode.TextDocument,
    wordRange: vscode.Range
  ): vscode.Range {
    let startLine = wordRange.start.line;
    let lineText = document.lineAt(startLine).text;
    let openBrackets = 0;
    let closeBrackets = 0;

    // Find the start of the widget (look backward)
    while (startLine >= 0) {
      const bracketIndex = lineText.indexOf("(");
      if (bracketIndex !== -1) {
        const widgetNameIndex = lineText.lastIndexOf(" ", bracketIndex);
        const widgetName = lineText
          .substring(widgetNameIndex + 1, bracketIndex)
          .trim();

        if (widgetName) {
          // If the widget name was found, determine where the widget starts
          const widgetStart = new vscode.Position(
            startLine,
            widgetNameIndex + 1
          );
          openBrackets = (lineText.match(/\(/g) || []).length;

          // Now find the end of the widget by counting parentheses
          let endLine = startLine;
          while (openBrackets > closeBrackets && endLine < document.lineCount) {
            endLine++;
            if (endLine < document.lineCount) {
              lineText = document.lineAt(endLine).text;
              openBrackets += (lineText.match(/\(/g) || []).length;
              closeBrackets += (lineText.match(/\)/g) || []).length;
            }
          }

          const widgetEnd = new vscode.Position(
            endLine,
            lineText.lastIndexOf(")") + 1
          );
          return new vscode.Range(widgetStart, widgetEnd);
        }
      }
      startLine--;
      lineText = document.lineAt(startLine).text;
    }

    // If no widget is found, return the original range
    return wordRange;
  }

  let wrapWithConsumer = vscode.commands.registerCommand(
    "flutter-quick-snips.wrapWithConsumer",
    (range: vscode.Range, widgetText: string) => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        // Extract type from widgetText or set default type
        const typeMatch = widgetText.match(/<([^>]+)>/); // Match any generic type <Type>
        const type = typeMatch ? typeMatch[1].trim() : "Object?"; // Default to Object? if no type is found

        editor.edit((editBuilder) => {
          // Wrap the entire widget properly with type
          const newText = `Consumer<${type}>(\n  builder: (context, watch, child) {\n    return ${widgetText};\n  },\n)`;

          // Replace the selected range with the new text
          editBuilder.replace(range, newText);
        });

        vscode.window.showInformationMessage(`Wrapped widget with Consumer!`);
      }
    }
  );

  // Wrap with ValueListenableBuilder
  let wrapWithValueListenableBuilder = vscode.commands.registerCommand(
    "flutter-quick-snips.wrapWithValueListenableBuilder",
    (range: vscode.Range, widgetText: string) => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        // Extract valueListenable from the user (could be from selected text or user input)
        const valueListenable = "yourValueListenable"; // Replace this with a way to get the actual ValueListenable

        editor.edit((editBuilder) => {
          const newText = `ValueListenableBuilder<Object?>(\n  valueListenable: ${valueListenable},\n  builder: (context, value, child) {\n    return ${widgetText};\n  },\n)`;

          // Replace the selected range with the new text
          editBuilder.replace(range, newText);
        });

        vscode.window.showInformationMessage(
          `Wrapped widget with ValueListenableBuilder!`
        );
      }
    }
  );

  // Wrap with Builder
  let wrapWithBuilder = vscode.commands.registerCommand(
    "flutter-quick-snips.wrapWithBuilder",
    (range: vscode.Range, widgetText: string) => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        editor.edit((editBuilder) => {
          const newText = `Builder(\n  builder: (context) {\n    return ${widgetText};\n  },\n)`;

          // Replace the selected range with the new text
          editBuilder.replace(range, newText);
        });

        vscode.window.showInformationMessage(`Wrapped widget with Builder!`);
      }
    }
  );

  // Wrap with LayoutBuilder
  let wrapWithLayoutBuilder = vscode.commands.registerCommand(
    "flutter-quick-snips.wrapWithLayoutBuilder",
    (range: vscode.Range, widgetText: string) => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        editor.edit((editBuilder) => {
          const newText = `LayoutBuilder(\n  builder: (context, constraints) {\n    return ${widgetText};\n  },\n)`;

          // Replace the selected range with the new text
          editBuilder.replace(range, newText);
        });

        vscode.window.showInformationMessage(
          `Wrapped widget with LayoutBuilder!`
        );
      }
    }
  );

  // Wrap with StreamBuilder
  let wrapWithStreamBuilder = vscode.commands.registerCommand(
    "flutter-quick-snips.wrapWithStreamBuilder",
    (range: vscode.Range, widgetText: string) => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        // Extract stream from the user (could be from selected text or user input)
        const stream = "yourStream"; // Replace this with a way to get the actual Stream

        editor.edit((editBuilder) => {
          const newText = `StreamBuilder<Object?>(\n  stream: ${stream},\n  builder: (context, snapshot) {\n    return ${widgetText};\n  },\n)`;

          // Replace the selected range with the new text
          editBuilder.replace(range, newText);
        });

        vscode.window.showInformationMessage(
          `Wrapped widget with StreamBuilder!`
        );
      }
    }
  );

  // Wrap with FutureBuilder
  let wrapWithFutureBuilder = vscode.commands.registerCommand(
    "flutter-quick-snips.wrapWithFutureBuilder",
    (range: vscode.Range, widgetText: string) => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        // Extract future from the user (could be from selected text or user input)
        const future = "yourFuture"; // Replace this with a way to get the actual Future

        editor.edit((editBuilder) => {
          const newText = `FutureBuilder<Object?>(\n  future: ${future},\n  builder: (context, snapshot) {\n    return ${widgetText};\n  },\n)`;

          // Replace the selected range with the new text
          editBuilder.replace(range, newText);
        });

        vscode.window.showInformationMessage(
          `Wrapped widget with FutureBuilder!`
        );
      }
    }
  );

  // Wrap with AnimatedBuilder
  let wrapWithAnimatedBuilder = vscode.commands.registerCommand(
    "flutter-quick-snips.wrapWithAnimatedBuilder",
    (range: vscode.Range, widgetText: string) => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        // Extract animation from the user (could be from selected text or user input)
        const animation = "yourAnimation"; // Replace this with a way to get the actual Animation

        editor.edit((editBuilder) => {
          const newText = `AnimatedBuilder(\n  animation: ${animation},\n  builder: (context, child) {\n    return ${widgetText};\n  },\n)`;

          // Replace the selected range with the new text
          editBuilder.replace(range, newText);
        });

        vscode.window.showInformationMessage(
          `Wrapped widget with AnimatedBuilder!`
        );
      }
    }
  );

  // Wrap with RepaintBoundary
  let wrapWithRepaintBoundary = vscode.commands.registerCommand(
    "flutter-quick-snips.wrapWithRepaintBoundary",
    (range: vscode.Range, widgetText: string) => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        editor.edit((editBuilder) => {
          const newText = `RepaintBoundary(\n  child: ${widgetText},\n)`;

          // Replace the selected range with the new text
          editBuilder.replace(range, newText);
        });

        vscode.window.showInformationMessage(
          `Wrapped widget with RepaintBoundary!`
        );
      }
    }
  );

  // Wrap with DefaultTextStyle
  let wrapWithDefaultTextStyle = vscode.commands.registerCommand(
    "flutter-quick-snips.wrapWithDefaultTextStyle",
    (range: vscode.Range, widgetText: string) => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        // Extract style from the user (could be from selected text or user input)
        const style = "yourStyle"; // Replace this with a way to get the actual TextStyle

        editor.edit((editBuilder) => {
          const newText = `DefaultTextStyle(\n  style: ${style},\n  child: ${widgetText},\n)`;

          // Replace the selected range with the new text
          editBuilder.replace(range, newText);
        });

        vscode.window.showInformationMessage(
          `Wrapped widget with DefaultTextStyle!`
        );
      }
    }
  );

  let generateFlutterFolderStructure = vscode.commands.registerCommand(
    "flutter-quick-snips.useCodeLyticalStructure",
    async () => {
      const folderStructure = [
        "app/routes",
        "app/theme",
        "mixins",
        "services/local",
        "services/network",
        "utils",
        "controllers",
        "models",
        "ui/screens",
        "ui/widgets",
      ];

      // Get the 'lib' folder in the current workspace
      const libFolder =
        vscode.workspace.workspaceFolders?.[0].uri.fsPath + "/lib";

      if (libFolder) {
        const folderPromises = folderStructure.map(async (folder) => {
          const folderPath = vscode.Uri.file(`${libFolder}/${folder}`);

          // Create the folder directly (without .gitkeep)
          try {
            await vscode.workspace.fs.createDirectory(folderPath);
          } catch (error) {
            vscode.window.showErrorMessage(
              `Failed to create folder ${folder}: ${error}`
            );
          }

          return folderPath;
        });

        // After creating all folders, create necessary files
        const localFolder = vscode.Uri.file(`${libFolder}/services/local`);

        // Define file paths
        const pushNotificationFilePath = vscode.Uri.file(
          `${localFolder.fsPath}/push_notification_service.dart`
        );
        const sharedPreferencesFilePath = vscode.Uri.file(
          `${localFolder.fsPath}/shared_preferences_service.dart`
        );
        const mixinFilePath = vscode.Uri.file(
          `${libFolder}/mixins/app_base_mixin.dart`
        );

        // Define file content
        const mixinFileContent = Buffer.from(
          "// Base Mixin for the app\n\nmixin AppBaseMixin {\n  // Add your common methods or properties here\n}"
        );
        const pushNotificationContent = Buffer.from(
          "// Service for handling push notifications\n\nclass PushNotificationService {\n  // Implement your methods here\n}"
        );
        const sharedPreferencesContent = Buffer.from(
          "// Service for handling shared preferences\n\nclass SharedPreferencesService {\n  // Implement your methods here\n}"
        );

        try {
          await Promise.all(folderPromises);

          // Create the files
          await Promise.all([
            vscode.workspace.fs.writeFile(mixinFilePath, mixinFileContent),
            vscode.workspace.fs.writeFile(
              pushNotificationFilePath,
              pushNotificationContent
            ),
            vscode.workspace.fs.writeFile(
              sharedPreferencesFilePath,
              sharedPreferencesContent
            ),
          ]);

          vscode.window.showInformationMessage(
            "Flutter folder structure and files created successfully!"
          );
        } catch (error) {
          const errorMessage =
            (error as Error).message || "An unknown error occurred.";
          vscode.window.showErrorMessage(
            "Failed to create folder structure or files: " + errorMessage
          );
        }
      } else {
        vscode.window.showWarningMessage(
          "Couldn't find the 'lib' folder in the workspace. Make sure you have a 'lib' folder."
        );
      }
    }
  );

  context.subscriptions.push(
    showSnippets,
    wrapWithConsumer,
    wrapWithValueListenableBuilder,
    wrapWithBuilder,
    wrapWithLayoutBuilder,
    wrapWithStreamBuilder,
    wrapWithFutureBuilder,
    wrapWithAnimatedBuilder,
    wrapWithRepaintBoundary,
    wrapWithDefaultTextStyle,
    generateFlutterFolderStructure
  );

  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider("dart", codeActionProvider)
  );
}

export function deactivate() {}
