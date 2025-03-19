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
	public addModelChangeMessage(modelId: string): void {
		const model = this.devSphereService.getAvailableModels().find(m => m.id === modelId);
		if (model) {
			this.viewModel.addSystemMessage(`Model changed to **${model.name}** (${model.description})`);
		}
	}

	private createInputSection(container: HTMLElement): void {
		// Create a section for the input controls
		const section = document.createElement('div');
		section.classList.add('dev-sphere-section');

		// Create a styled input container
		const inputContainer = document.createElement('div');
		inputContainer.classList.add('dev-sphere-input-container');

		// Create text input with improved placeholder
		const input = document.createElement('input');
		input.type = 'text';
		input.placeholder = 'Ask DevSphere...';
		input.spellcheck = false;
		this.inputElement = input;
		inputContainer.appendChild(input);

		// Add the input container to the section
		section.appendChild(inputContainer);

		// Create submit button with a modern look
		const button = document.createElement('button');

		// Add a small send icon SVG
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('viewBox', '0 0 16 16');
		svg.setAttribute('fill', 'none');
		svg.setAttribute('stroke', 'currentColor');
		svg.setAttribute('stroke-width', '2');
		svg.setAttribute('stroke-linecap', 'round');
		svg.setAttribute('stroke-linejoin', 'round');

		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path.setAttribute('d', 'M15 8l-12 7v-14l12 7z');
		svg.appendChild(path);

		button.appendChild(svg);
		button.appendChild(document.createTextNode('Send'));
		button.title = 'Send message';
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
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault(); // Prevent default to avoid newline
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

	private onMessagesChanged(): void {
		if (!this.messagesContainer) {
			return;
		}

		// Check if we're scrolled to the bottom before updating
		const wasScrolledToBottom = this.isScrolledToBottom();

		// Clear existing messages - use DOM methods instead of innerHTML
		while (this.messagesContainer.firstChild) {
			this.messagesContainer.removeChild(this.messagesContainer.firstChild);
		}

		// Get messages from the view model using the public getter
		const messages = this.viewModel.messageList;

		if (messages.length === 0) {
			// Show empty state when no messages
			const emptyState = document.createElement('div');
			emptyState.classList.add('dev-sphere-empty-state');

			const emptyIcon = document.createElement('div');
			emptyIcon.classList.add('dev-sphere-empty-icon');
			emptyState.appendChild(emptyIcon);

			const emptyTitle = document.createElement('h3');
			emptyTitle.textContent = 'How can I help you today?';
			emptyState.appendChild(emptyTitle);

			const emptyText = document.createElement('p');
			emptyText.textContent = 'Start a conversation with DevSphere AI to get assistance with your code, answer questions, or help with any tasks.';
			emptyState.appendChild(emptyText);

			this.messagesContainer.appendChild(emptyState);
		} else {
			// Render all messages
			messages.forEach((message: Message) => {
				this.renderMessage(message);
			});
		}

		// Scroll to bottom if we were already at the bottom
		if (wasScrolledToBottom || this.viewModel.isLoading) {
			this.scrollToBottom();
		}

		// Focus the input field after messages are rendered (if not loading)
		if (this.inputElement && !this.viewModel.isLoading) {
			this.inputElement.focus();
		}
	}

	private isScrolledToBottom(): boolean {
		if (!this.messagesContainer) {
			return true;
		}

		const scrollPosition = this.messagesContainer.scrollTop + this.messagesContainer.clientHeight;
		const scrollHeight = this.messagesContainer.scrollHeight;

		// Consider "scrolled to bottom" if within 50px of actual bottom
		return scrollHeight - scrollPosition < 50;
	}

	private renderMessage(message: Message): void {
		if (!this.messagesContainer) {
			return;
		}

		if (message.role === 'loading') {
			// Render loading message with animated dots
			const loadingMessage = document.createElement('div');
			loadingMessage.classList.add('dev-sphere-text', 'dev-sphere-text-loading');

			// Create loading text
			const loadingText = document.createTextNode('Generating response ');
			loadingMessage.appendChild(loadingText);

			// Create the animated dots
			const dotsContainer = document.createElement('div');
			dotsContainer.className = 'loading-dots';

			// Add three dots for animation
			for (let i = 0; i < 3; i++) {
				const dot = document.createElement('span');
				dot.className = 'dot';
				// Add staggered animation delay
				dot.style.animationDelay = `${i * 0.2}s`;
				dotsContainer.appendChild(dot);
			}

			loadingMessage.appendChild(dotsContainer);

			// Create message group for loading
			const messageGroup = document.createElement('div');
			messageGroup.classList.add('dev-sphere-message-group', 'dev-sphere-message-group-loading');
			messageGroup.appendChild(loadingMessage);

			this.messagesContainer.appendChild(messageGroup);
			return;
		}

		// For non-loading messages, check if we should create a new message group or append to existing
		let messageGroup: HTMLElement;
		const lastChild = this.messagesContainer.lastElementChild;

		// If last message type is different, create a new group
		if (!lastChild || !lastChild.classList.contains(`dev-sphere-message-group-${message.role}`)) {
			messageGroup = document.createElement('div');
			messageGroup.classList.add('dev-sphere-message-group', `dev-sphere-message-group-${message.role}`);
			this.messagesContainer.appendChild(messageGroup);
		} else {
			// Use the existing group
			messageGroup = lastChild as HTMLElement;
		}

		// Create message container
		const messageElement = document.createElement('div');
		messageElement.classList.add('dev-sphere-text', `dev-sphere-text-${message.role}`);

		// Create header with avatar and role info - only for first message in a group
		if (messageGroup.childElementCount === 0) {
			const headerDiv = document.createElement('div');
			headerDiv.classList.add('dev-sphere-message-header');

			// Create avatar
			const avatar = document.createElement('div');
			avatar.classList.add('dev-sphere-avatar', `dev-sphere-avatar-${message.role}`);

			// Set avatar text based on role
			if (message.role === 'user') {
				avatar.textContent = 'U';
			} else if (message.role === 'system') {
				avatar.textContent = 'S';
			} else {
				avatar.textContent = 'AI';
			}

			headerDiv.appendChild(avatar);

			// Create role info wrapper
			const roleWrapper = document.createElement('div');
			roleWrapper.classList.add('dev-sphere-role-wrapper');

			// Role name
			const roleName = document.createElement('div');
			roleName.classList.add('dev-sphere-role-name');

			// Set role label text based on message role
			if (message.role === 'user') {
				roleName.textContent = 'You';
			} else if (message.role === 'system') {
				roleName.textContent = 'System';
			} else {
				roleName.textContent = 'DevSphere AI';
			}

			roleWrapper.appendChild(roleName);

			// Role subtitle - model name for assistant
			if (message.role === 'assistant') {
				const currentModel = this.devSphereService.getCurrentModel();
				const subtitle = document.createElement('div');
				subtitle.classList.add('dev-sphere-role-subtitle');
				subtitle.textContent = currentModel.name;
				roleWrapper.appendChild(subtitle);
			}

			headerDiv.appendChild(roleWrapper);
			messageElement.appendChild(headerDiv);
		}

		// Create content container
		const contentDiv = document.createElement('div');
		contentDiv.classList.add('dev-sphere-message-content');

		// Format and append content
		MarkdownFormatter.appendFormattedContent(contentDiv, message.content);

		// Add content to the main container
		messageElement.appendChild(contentDiv);
		messageGroup.appendChild(messageElement);
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
