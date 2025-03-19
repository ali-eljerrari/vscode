/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IViewsRegistry, ViewContainerLocation, IViewContainersRegistry, Extensions as ViewContainerExtensions, IViewDescriptorService } from '../../../common/views.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { localize } from '../../../../nls.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkbenchContribution, IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from '../../../common/contributions.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { registerAction2, Action2 } from '../../../../platform/actions/common/actions.js';
import { ServicesAccessor, IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ViewPaneContainer } from '../../../browser/parts/views/viewPaneContainer.js';
import { ViewPane, IViewPaneOptions } from '../../../browser/parts/views/viewPane.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { ISecretStorageService } from '../../../../platform/secrets/common/secrets.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';

// Import CSS
import './media/myPanel.css';

// Define your panel view class
class MyPanelView extends ViewPane {
	static readonly ID = 'myPanelView';
	private container: HTMLElement | undefined;
	private messagesContainerSelector: HTMLElement | undefined;
	private inputElement: HTMLInputElement | undefined;
	private readonly OPENAI_API_KEY_SECRET_KEY = 'openai.api.key';

	constructor(
		options: IViewPaneOptions,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IOpenerService openerService: IOpenerService,
		@IThemeService themeService: IThemeService,
		@IHoverService hoverService: IHoverService,
		@ISecretStorageService private readonly secretStorageService: ISecretStorageService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@INotificationService private readonly notificationService: INotificationService,
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);
	}

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);
		this.container = container;

		// Add CSS class to the container
		container.classList.add('my-panel-container');

		// Create a messages container
		const messagesContainer = document.createElement('div');
		messagesContainer.classList.add('my-panel-messages');
		container.appendChild(messagesContainer);

		// Set the reference AFTER we've created and appended the element
		this.messagesContainerSelector = messagesContainer;

		// Create and append multiple messages to demonstrate scrolling
		const messages: { sender: string; text: string }[] = [];

		// Add each message as a separate element with sender class
		messages.forEach(message => {
			const messageElement = document.createElement('div');
			messageElement.classList.add('my-panel-text');
			messageElement.classList.add(`my-panel-text-${message.sender}`);

			// Create and append content securely using DOM manipulation
			this.appendFormattedContent(messageElement, message.text);

			messagesContainer.appendChild(messageElement);
		});

		// Create the input section at the bottom
		this.createInputSection(container);

		// Set focus after a short delay to ensure the DOM is ready
		setTimeout(() => this.focusInput(), 100);
	}

	private createInputSection(container: HTMLElement): void {
		// Create a section with a title
		const section = document.createElement('div');
		section.classList.add('my-panel-section');

		const input = document.createElement('input');
		input.type = 'text';
		input.placeholder = 'Enter your text here';

		// Store reference to the input element
		this.inputElement = input;

		section.appendChild(input);

		const button = document.createElement('button');
		button.textContent = 'Submit';
		section.appendChild(button);

		// Add event listener for button click
		button.addEventListener('click', () => {
			const text = input.value.trim();
			if (text) {
				this.updateText(text);
				this.fetchApiResponse(text);
				input.value = '';
				input.focus();
			}
		});

		// Add event listener for Enter key
		input.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				const text = input.value.trim();
				if (text) {
					this.updateText(text);
					this.fetchApiResponse(text);
					input.value = '';
				}
			}
		});

		container.appendChild(section);
	}

	// Method to focus the input
	private focusInput(): void {
		if (this.inputElement) {
			this.inputElement.focus();
		}
	}

	// Override the setVisible method to focus the input when the view becomes visible
	override setVisible(visible: boolean): void {
		super.setVisible(visible);
		if (visible) {
			// Focus the input when the view becomes visible
			setTimeout(() => this.focusInput(), 100);
		}
	}

	private async appendAIResponse(response: string): Promise<void> {
		// Create a container for the API response
		const apiResponseContainer = document.createElement('div');
		apiResponseContainer.classList.add('my-panel-text', 'my-panel-text-assistant');

		// Create a header with assistant icon/avatar
		const headerDiv = document.createElement('div');
		headerDiv.classList.add('my-panel-message-header');

		const assistantLabel = document.createElement('span');
		assistantLabel.classList.add('my-panel-assistant-label');
		assistantLabel.textContent = 'Assistant';
		headerDiv.appendChild(assistantLabel);

		apiResponseContainer.appendChild(headerDiv);

		// Create content container
		const contentDiv = document.createElement('div');
		contentDiv.classList.add('my-panel-message-content');

		// Create and append the formatted content to the content container
		this.appendFormattedContent(contentDiv, response);

		// Add content to the main container
		apiResponseContainer.appendChild(contentDiv);

		// Append to the messages container and scroll to bottom
		if (this.messagesContainerSelector) {
			this.messagesContainerSelector.appendChild(apiResponseContainer);
			this.scrollToBottom();
		}
	}

	private scrollToBottom(): void {
		if (this.messagesContainerSelector) {
			this.messagesContainerSelector.scrollTop = this.messagesContainerSelector.scrollHeight;
		}
	}

	private async fetchApiResponse(text: string): Promise<void> {
		console.log('Sending text to OpenAI API:', text);
		try {
			// disable input and button
			const input = this.container?.querySelector('input');
			const button = this.container?.querySelector('button');
			if (input) {
				input.disabled = true;
			}
			if (button) {
				button.disabled = true;
			}

			// Append a loading message
			const loadingMessage = document.createElement('div');
			loadingMessage.classList.add('my-panel-text', 'my-panel-text-loading');
			loadingMessage.textContent = 'Loading response...';
			this.messagesContainerSelector?.appendChild(loadingMessage);
			this.scrollToBottom();

			// OpenAI API call
			const apiKey = await this.getOpenAIAPIKey();
			if (!apiKey) {
				this.notificationService.error('No API key available. Please set your OpenAI API key first.');
				return;
			}

			const response = await fetch('https://api.openai.com/v1/chat/completions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + apiKey
				},
				body: JSON.stringify({
					model: 'gpt-4o-mini',
					messages: [
						{
							role: 'user',
							content: text
						}
					],
					max_tokens: 500
				})
			});

			// Remove the loading message
			if (this.messagesContainerSelector && loadingMessage.parentNode === this.messagesContainerSelector) {
				this.messagesContainerSelector.removeChild(loadingMessage);
			}

			if (!response.ok) {
				const errorData = await response.json().catch(() => null);
				console.error('OpenAI API error:', errorData);
				this.appendAIResponse(`**Error**: ${response.status} - ${response.statusText}\n\n${errorData ? JSON.stringify(errorData, null, 2) : 'No additional error information'}`);
			} else {
				const data = await response.json();
				console.log('OpenAI API response:', data);

				if (data.choices && data.choices.length > 0) {
					const responseContent = data.choices[0].message.content;
					this.appendAIResponse(responseContent);
				} else {
					this.appendAIResponse('**Error**: Unable to parse response from API.');
				}
			}

			// enable input and button
			if (input) {
				input.disabled = false;
				input.focus();
			}
			if (button) {
				button.disabled = false;
			}
		} catch (error) {
			console.error('Error fetching API response:', error);
			this.appendAIResponse(`**Error**: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);

			// Make sure to re-enable input and button in case of error
			const input = this.container?.querySelector('input');
			const button = this.container?.querySelector('button');
			if (input) {
				input.disabled = false;
				input.focus();
			}
			if (button) {
				button.disabled = false;
			}
		}
	}

	// Get OpenAI API key from secure storage or prompt user to input it
	private async getOpenAIAPIKey(): Promise<string | undefined> {
		// Try to get the key from secret storage
		let key = await this.secretStorageService.get(this.OPENAI_API_KEY_SECRET_KEY);

		// If the key doesn't exist in storage, prompt the user to enter it
		if (!key) {
			key = await this.promptForAPIKey();
		}

		return key;
	}

	// Prompt the user to enter their API key
	private async promptForAPIKey(): Promise<string | undefined> {
		const result = await this.quickInputService.input({
			title: 'Enter your OpenAI API Key',
			placeHolder: 'sk-...',
			password: true,
			ignoreFocusLost: true,
			validateInput: async (value: string) => {
				if (!value || !value.trim().startsWith('sk-')) {
					return 'Please enter a valid OpenAI API key starting with "sk-"';
				}
				return null;
			}
		});

		if (result) {
			// Store the API key in the secret storage
			await this.secretStorageService.set(this.OPENAI_API_KEY_SECRET_KEY, result);
			this.notificationService.info('API key saved securely.');
			return result;
		}

		return undefined;
	}

	// Method to explicitly set or update the API key
	public async updateAPIKey(): Promise<void> {
		const newKey = await this.promptForAPIKey();
		if (newKey) {
			this.notificationService.info('API key updated successfully.');
		}
	}

	// Simple method to process markdown-like formatting using DOM manipulation
	private appendFormattedContent(container: HTMLElement, text: string): void {
		// Split by code blocks first
		const parts = text.split(/```([^`]+)```/);

		for (let i = 0; i < parts.length; i++) {
			if (i % 2 === 1) {
				// This is a code block
				const pre = document.createElement('pre');
				pre.textContent = parts[i];
				container.appendChild(pre);
			} else if (parts[i]) {
				// Process the non-code block content

				// Split by line breaks
				const lines = parts[i].split('\n');

				for (let j = 0; j < lines.length; j++) {
					// Process line content (bold and inline code)
					const line = lines[j];
					const segments = this.processLineSegments(line);

					// Add the processed segments
					for (const segment of segments) {
						container.appendChild(segment);
					}

					// Add a line break if not the last line
					if (j < lines.length - 1) {
						container.appendChild(document.createElement('br'));
					}
				}
			}
		}
	}

	// Process line segments for bold and inline code
	private processLineSegments(line: string): Node[] {
		const segments: Node[] = [];

		// Split by inline code
		const codeParts = line.split(/`([^`]+)`/);

		for (let i = 0; i < codeParts.length; i++) {
			if (i % 2 === 1) {
				// This is inline code
				const code = document.createElement('code');
				code.textContent = codeParts[i];
				segments.push(code);
			} else if (codeParts[i]) {
				// Process bold text
				const boldParts = codeParts[i].split(/\*\*([^*]+)\*\*/);

				for (let j = 0; j < boldParts.length; j++) {
					if (j % 2 === 1) {
						// This is bold text
						const strong = document.createElement('strong');
						strong.textContent = boldParts[j];
						segments.push(strong);
					} else if (boldParts[j]) {
						// Regular text
						const text = document.createTextNode(boldParts[j]);
						segments.push(text);
					}
				}
			}
		}

		return segments;
	}

	// Method to update text content dynamically
	public updateText(text: string): void {
		if (!this.messagesContainerSelector) {
			return;
		}

		// Create a new message element
		const messageElement = document.createElement('div');
		messageElement.classList.add('my-panel-text', 'my-panel-text-user');

		// Create a header with user icon/avatar
		const headerDiv = document.createElement('div');
		headerDiv.classList.add('my-panel-message-header');

		const userLabel = document.createElement('span');
		userLabel.classList.add('my-panel-user-label');
		userLabel.textContent = 'You';
		headerDiv.appendChild(userLabel);

		messageElement.appendChild(headerDiv);

		// Create content container
		const contentDiv = document.createElement('div');
		contentDiv.classList.add('my-panel-message-content');

		// Create and append content securely using DOM manipulation
		this.appendFormattedContent(contentDiv, text);

		// Add content to the main container
		messageElement.appendChild(contentDiv);

		// Append the message and scroll to bottom
		this.messagesContainerSelector.appendChild(messageElement);
		this.scrollToBottom();
	}
}

// Register the view container
const MY_PANEL_CONTAINER_ID = 'myPanel';
const MY_PANEL_CONTAINER = Registry.as<IViewContainersRegistry>(ViewContainerExtensions.ViewContainersRegistry).registerViewContainer({
	id: MY_PANEL_CONTAINER_ID,
	title: { value: localize('myPanel', "My Panel"), original: 'My Panel' },
	icon: Codicon.window,
	ctorDescriptor: new SyncDescriptor(ViewPaneContainer, [MY_PANEL_CONTAINER_ID, { mergeViewWithContainerWhenSingleView: true }]),
	storageId: MY_PANEL_CONTAINER_ID,
}, ViewContainerLocation.AuxiliaryBar);

// Register the view
Registry.as<IViewsRegistry>(ViewContainerExtensions.ViewsRegistry).registerViews([{
	id: 'myPanelView',
	name: { value: localize('myPanelView', "My Panel View"), original: 'My Panel View' },
	ctorDescriptor: new SyncDescriptor(MyPanelView),
	canToggleVisibility: true,
	canMoveView: true,
}], MY_PANEL_CONTAINER);

// Register a command to show the panel
registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.showMyPanel',
			title: { value: localize('showMyPanel', "Show My Panel"), original: 'Show My Panel' },
			category: Categories.View,
			f1: true
		});
	}

	run(accessor: ServicesAccessor): void {
		const viewsService = accessor.get(IViewsService);
		const viewDescriptorService = accessor.get(IViewDescriptorService);
		const viewDescriptor = viewDescriptorService.getViewDescriptorById('myPanelView');

		if (viewDescriptor) {
			// First ensure the view container is visible
			viewsService.openViewContainer(MY_PANEL_CONTAINER_ID, true);

			// Then focus the specific view
			viewsService.openView(viewDescriptor.id, true);
		}
	}
});

// Register a command to update the API key
registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.updateOpenAIAPIKey',
			title: { value: localize('updateOpenAIAPIKey', "Update OpenAI API Key"), original: 'Update OpenAI API Key' },
			category: Categories.View,
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const viewsService = accessor.get(IViewsService);
		const view = viewsService.getActiveViewWithId('myPanelView') as MyPanelView | undefined;

		if (view) {
			await view.updateAPIKey();
		} else {
			const instantiationService = accessor.get(IInstantiationService);
			const notificationService = accessor.get(INotificationService);

			// If the view is not active, we need to get access to secretStorageService differently
			const secretStorageService = accessor.get(ISecretStorageService);
			const quickInputService = accessor.get(IQuickInputService);

			const result = await quickInputService.input({
				title: 'Enter your OpenAI API Key',
				placeHolder: 'sk-...',
				password: true,
				ignoreFocusLost: true,
				validateInput: async (value: string) => {
					if (!value || !value.trim().startsWith('sk-')) {
						return 'Please enter a valid OpenAI API key starting with "sk-"';
					}
					return null;
				}
			});

			if (result) {
				await secretStorageService.set('openai.api.key', result);
				notificationService.info('API key saved securely.');
			}
		}
	}
});

// Register your contribution
class MyPanelContribution implements IWorkbenchContribution {
	constructor(@IInstantiationService instantiationService: IInstantiationService) {
		// Initialize your panel
	}
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(
	MyPanelContribution,
	LifecyclePhase.Restored
);
