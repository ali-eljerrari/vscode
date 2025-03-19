/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IViewPaneOptions, ViewPane } from '../../../browser/parts/views/viewPane.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IDevSphereService } from './devSphereService.js';
import { DevSphereViewModel, Message } from './devSphereViewModel.js';
import { MarkdownFormatter } from './devSphereMarkdownFormatter.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';

export class DevSphereView extends ViewPane {
	static readonly ID = 'devSphereView';

	private container: HTMLElement | undefined;
	private messagesContainer: HTMLElement | undefined;
	private inputElement: HTMLInputElement | undefined;
	private modelSelector: HTMLSelectElement | undefined;
	private viewModel: DevSphereViewModel;

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
		@IDevSphereService private readonly devSphereService: IDevSphereService,
		@INotificationService private readonly notificationService: INotificationService
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);

		// Create the view model
		this.viewModel = new DevSphereViewModel(this.devSphereService, this.notificationService);
		this._register(this.viewModel);
		this._register(this.viewModel.onMessagesChanged(this.onMessagesChanged.bind(this)));
		this._register(this.viewModel.onLoadingStateChanged(isLoading => {
			if (this.inputElement) {
				this.inputElement.disabled = isLoading;
			}
			const button = this.container?.querySelector('button');
			if (button) {
				button.disabled = isLoading;
			}

			// Also disable model selector during loading
			if (this.modelSelector) {
				this.modelSelector.disabled = isLoading;
			}
		}));
	}

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);
		this.container = container;

		// Add CSS class to the container
		container.classList.add('dev-sphere-container');

		// Create a messages container
		this.messagesContainer = document.createElement('div');
		this.messagesContainer.classList.add('dev-sphere-messages');
		container.appendChild(this.messagesContainer);

		// Create the model selector at the top
		this.createModelSelector(container);

		// Create the input section at the bottom
		this.createInputSection(container);

		// Set focus after a short delay to ensure the DOM is ready
		setTimeout(() => this.focusInput(), 100);
	}

	/**
	 * Creates the model selector dropdown UI
	 */
	private createModelSelector(container: HTMLElement): void {
		const modelSelectorContainer = document.createElement('div');
		modelSelectorContainer.classList.add('dev-sphere-model-selector');

		// Create the label
		const label = document.createElement('label');
		label.textContent = 'Model:';
		label.htmlFor = 'dev-sphere-model-select';
		modelSelectorContainer.appendChild(label);

		// Create the dropdown
		const modelSelect = document.createElement('select');
		modelSelect.id = 'dev-sphere-model-select';
		modelSelect.classList.add('dev-sphere-model-select');

		// Store reference for later use
		this.modelSelector = modelSelect;

		// Populate options
		const availableModels = this.devSphereService.getAvailableModels();
		const currentModel = this.devSphereService.getCurrentModel();

		availableModels.forEach(model => {
			const option = document.createElement('option');
			option.value = model.id;
			option.textContent = model.name;
			option.title = model.description; // Add tooltip

			// Set selected if this is the current model
			if (model.id === currentModel.id) {
				option.selected = true;
			}

			if (this.modelSelector) {
				this.modelSelector.appendChild(option);
			}
		});

		// Add change event handler
		modelSelect.addEventListener('change', () => {
			const selectedModelId = modelSelect.value;
			if (selectedModelId) {
				this.devSphereService.setCurrentModel(selectedModelId);
				// Add a system message to indicate the model change
				this.addModelChangeMessage(selectedModelId);
			}
		});

		modelSelectorContainer.appendChild(modelSelect);
		container.appendChild(modelSelectorContainer);
	}

	/**
	 * Adds a system message indicating the model has been changed
	 */
	private addModelChangeMessage(modelId: string): void {
		const model = this.devSphereService.getAvailableModels().find(m => m.id === modelId);
		if (model) {
			this.viewModel.addSystemMessage(`Model changed to **${model.name}** (${model.description})`);
		}
	}

	private createInputSection(container: HTMLElement): void {
		// Create a section for the input controls
		const section = document.createElement('div');
		section.classList.add('dev-sphere-section');

		// Create text input
		const input = document.createElement('input');
		input.type = 'text';
		input.placeholder = 'Enter your text here';
		this.inputElement = input;
		section.appendChild(input);

		// Create submit button
		const button = document.createElement('button');
		button.textContent = 'Submit';
		section.appendChild(button);

		// Add event listener for button click
		button.addEventListener('click', () => {
			const text = input.value.trim();
			if (text) {
				this.viewModel.sendMessage(text);
				input.value = '';
				// Ensure input regains focus after sending a message
				setTimeout(() => input.focus(), 50);
			}
		});

		// Add event listener for Enter key
		input.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				const text = input.value.trim();
				if (text) {
					this.viewModel.sendMessage(text);
					input.value = '';
					// Ensure input regains focus after sending a message
					setTimeout(() => input.focus(), 50);
				}
			}
		});

		container.appendChild(section);
	}

	private onMessagesChanged(messages: Message[]): void {
		if (!this.messagesContainer) {
			return;
		}

		// Clear existing messages
		while (this.messagesContainer.firstChild) {
			this.messagesContainer.removeChild(this.messagesContainer.firstChild);
		}

		// Render all messages
		messages.forEach(message => {
			this.renderMessage(message);
		});

		// Scroll to bottom
		this.scrollToBottom();

		// Ensure input field gets focus after messages are rendered
		if (!this.viewModel.isLoading) {
			setTimeout(() => this.focusInput(), 100);
		}
	}

	private renderMessage(message: Message): void {
		if (!this.messagesContainer) {
			return;
		}

		if (message.role === 'loading') {
			// Render loading message
			const loadingMessage = document.createElement('div');
			loadingMessage.classList.add('dev-sphere-text', 'dev-sphere-text-loading');
			loadingMessage.textContent = message.content;
			this.messagesContainer.appendChild(loadingMessage);
			return;
		}

		// Create message container
		const messageElement = document.createElement('div');
		messageElement.classList.add('dev-sphere-text', `dev-sphere-text-${message.role}`);

		// Create header with role label
		const headerDiv = document.createElement('div');
		headerDiv.classList.add('dev-sphere-message-header');

		const roleLabel = document.createElement('span');
		roleLabel.classList.add(`dev-sphere-${message.role}-label`);

		// Set role label text based on message role
		if (message.role === 'user') {
			roleLabel.textContent = 'You';
		} else if (message.role === 'system') {
			roleLabel.textContent = 'System';
		} else {
			roleLabel.textContent = 'Assistant';
		}

		headerDiv.appendChild(roleLabel);

		messageElement.appendChild(headerDiv);

		// Create content container
		const contentDiv = document.createElement('div');
		contentDiv.classList.add('dev-sphere-message-content');

		// Format and append content
		MarkdownFormatter.appendFormattedContent(contentDiv, message.content);

		// Add content to the main container
		messageElement.appendChild(contentDiv);
		this.messagesContainer.appendChild(messageElement);
	}

	private scrollToBottom(): void {
		if (this.messagesContainer) {
			this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
		}
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

	// Method to explicitly set or update the API key
	public async updateAPIKey(): Promise<void> {
		await this.devSphereService.updateAPIKey();
	}

	// Method to clear all messages
	public clearChat(): void {
		this.viewModel.clearMessages();
	}
}
