import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('my-custom-extension.getSelectedText', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const selection = editor.selection;
			const text = editor.document.getText(selection);
			const fileName = path.basename(editor.document.fileName);

			const panel = vscode.window.createWebviewPanel(
				'selectedText',
				'Selected Text Viewer',
				vscode.ViewColumn.One,
				{
					enableScripts: true,
					localResourceRoots: [context.extensionUri]
				}
			);

			panel.webview.html = getWebviewContent(text, fileName);

			panel.webview.onDidReceiveMessage(
				message => {
					if (message.command === 'copy') {
						vscode.env.clipboard.writeText(text);
						vscode.window.showInformationMessage('Text copied to clipboard!');
					}
				},
				undefined,
				context.subscriptions
			);

			panel.reveal(vscode.ViewColumn.One);
		} else {
			vscode.window.showInformationMessage('No active editor');
		}
	});

	context.subscriptions.push(disposable);
}

function getWebviewContent(text: string, fileName: string) {
	const lines = text.split('\n');
	const lineNumbers = lines.map((_, index) => index + 1).join('\n');

	const escapedText = text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');

	return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<style>
			body {
				padding: 20px;
				margin: 0;
				font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
				background-color: #1e1e1e;
				color: #d4d4d4;
				height: 100vh;
				box-sizing: border-box;
			}
			.container {
				max-width: 800px;
				margin: 0 auto;
			}
			.code-window {
				background: #2d2d2d;
				border-radius: 8px;
				overflow: hidden;
				margin-bottom: 20px;
				box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
			}
			.titlebar {
				background: #3c3c3c;
				padding: 8px 12px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1px solid #404040;
			}
			.window-controls {
				display: flex;
				gap: 8px;
				order: 2;
			}
			.control-button {
				width: 12px;
				height: 12px;
				border-radius: 50%;
				position: relative;
				transition: opacity 0.2s;
			}
			.control-button::before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				border-radius: 50%;
				box-shadow: inset 0 1px 1px rgba(255,255,255,0.1);
			}
			.control-button:hover {
				opacity: 0.8;
			}
			.close {
				background: #ff5f56;
				box-shadow: 0 0 0 1px #e0443e;
			}
			.minimize {
				background: #ffbd2e;
				box-shadow: 0 0 0 1px #dea123;
			}
			.maximize {
				background: #27c93f;
				box-shadow: 0 0 0 1px #1aab29;
			}
			.title {
				color: #999;
				font-size: 13px;
				font-family: 'SF Mono', 'Consolas', 'Monaco', 'Menlo', monospace;
				order: 1;
			}
			.code-content {
				font-family: 'SF Mono', 'Consolas', 'Monaco', 'Menlo', monospace;
				font-size: 14px;
				line-height: 1.5;
				white-space: pre-wrap;
				background: #1e1e1e;
				padding: 16px;
				border: 1px solid #404040;
				display: flex;
				gap: 16px;
			}
			.line-numbers {
				color: #666;
				user-select: none;
				text-align: right;
				min-width: 40px;
			}
			.code-text {
				flex: 1;
				white-space: pre;
			}
			.copy-button {
				background: #0e639c;
				color: white;
				border: none;
				padding: 8px 16px;
				border-radius: 4px;
				cursor: pointer;
				font-size: 13px;
				transition: background 0.2s;
				margin-right: 8px;
			}
			.copy-button:hover {
				background: #1177bb;
			}
			.download-button {
				background: #2ea043;
				color: white;
				border: none;
				padding: 8px 16px;
				border-radius: 4px;
				cursor: pointer;
				font-size: 13px;
				transition: background 0.2s;
			}
			.download-button:hover {
				background: #3cb371;
			}
			.button-container {
				display: flex;
				gap: 8px;
			}
		</style>
		<script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
	</head>
	<body>
		<div class="container">
			<div class="code-window">
				<div class="titlebar">
					<div class="window-controls">
						<div class="control-button close"></div>
						<div class="control-button minimize"></div>
						<div class="control-button maximize"></div>
					</div>
					<div class="title">${fileName}</div>
				</div>
				<div class="code-content">
					<div class="line-numbers">${lineNumbers}</div>
					<div class="code-text">${escapedText}</div>
				</div>
			</div>
			<div class="button-container">
				<button class="copy-button" onclick="copyText()">Copy to Clipboard</button>
				<button class="download-button" onclick="downloadAsPNG()">Download as PNG</button>
			</div>
		</div>
		<script>
			const vscode = acquireVsCodeApi();
			function copyText() {
				vscode.postMessage({
					command: 'copy'
				});
			}
			async function downloadAsPNG() {
				const codeWindow = document.querySelector('.code-window');
				try {
					const canvas = await html2canvas(codeWindow, {
						backgroundColor: '#2d2d2d',
						scale: 2,
						logging: false
					});
					const link = document.createElement('a');
					link.download = '${fileName.replace(/\.[^/.]+$/, '')}_code.png';
					link.href = canvas.toDataURL('image/png');
					link.click();
				} catch (error) {
					vscode.postMessage({
						command: 'error',
						text: 'Failed to generate PNG'
					});
				}
			}
		</script>
	</body>
	</html>`;
}

export function deactivate() { }
