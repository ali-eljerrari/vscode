/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * @file DevSphere Header Component
 *
 * This module implements the header component for the DevSphere extension.
 * The header provides critical controls and information for the DevSphere
 * chat interface, including:
 *
 * 1. Model selection - Dropdown to select the AI model to use
 * 2. New Chat button - Creates a new conversation
 * 3. Clear Chat button - Clears the current conversation
 * 4. Chat count indicator - Shows the number of saved chats
 *
 * The header is positioned at the top of the DevSphere panel and is
 * only visible when in the Chat view.
 */

import { DevSphereViewModel } from '../devSphereViewModel.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import * as DOM from '../../../../../base/browser/dom.js';
import { IDevSphereService } from '../services/devSphereServiceInterface.js';

/**
 * Header component for the DevSphere panel.
 * Provides controls for model selection, chat creation, and clearing the current chat.
 * Acts as the main control panel for the DevSphere interface.
 */
export class DevSphereHeader extends Disposable {
	/** The main header container element */
	private headerElement: HTMLElement;

	/**
	 * Creates a new instance of the DevSphere header component.
	 *
	 * @param container - Parent DOM element to append the header to
	 * @param devSphereService - Service for accessing models and settings
	 * @param viewModel - ViewModel for interacting with chats and managing conversations
	 */
	constructor(
		private readonly container: HTMLElement,
		private readonly devSphereService: IDevSphereService,
		private readonly viewModel: DevSphereViewModel,
	) {
		super();

		// Create header section
		this.headerElement = document.createElement('div');
		this.headerElement.className = 'dev-sphere-header';
		this.container.appendChild(this.headerElement);

		// Create header content
		this.createHeaderContent();
	}

	/**
	 * Creates the header section with title, model selector, and action buttons.
	 * This method builds the entire header UI including the model selector dropdown
	 * and action buttons like "New Chat" and "Clear Chat".
	 *
	 * The model selector organizes available models by provider (OpenAI, Anthropic, Google)
	 * in option groups for better organization.
	 */
	private createHeaderContent(): void {
		// Left side of header with title and model selector
		const headerLeft = document.createElement('div');
		headerLeft.className = 'dev-sphere-header-left';

		// Model selector container
		const modelSelectorContainer = document.createElement('div');
		modelSelectorContainer.className = 'dev-sphere-model-selector-container';

		// Model selector
		const modelSelector = document.createElement('select');
		modelSelector.className = 'dev-sphere-model-selector';

		// Get current model ID
		const currentModelId = this.devSphereService.getCurrentModelId();

		// Get all models from all providers
		const openaiModels = this.devSphereService.getAvailableModelsByProvider('ChatgptModels');
		const anthropicModels = this.devSphereService.getAvailableModelsByProvider('AnthropicModels');
		const googleModels = this.devSphereService.getAvailableModelsByProvider('GoogleModels');

		/**
		 * Creates an option group for a set of models from a specific provider.
		 *
		 * @param label - The label for the option group (provider name)
		 * @param models - Array of model information objects
		 * @returns An HTML optgroup element with model options
		 */
		const createOptionGroup = (label: string, models: { id: string; name: string; description: string; provider: string }[]) => {
			const group = document.createElement('optgroup');
			group.label = label;

			for (const model of models) {
				const option = document.createElement('option');
				option.value = model.id;
				option.text = model.name;
				option.title = model.description;
				option.selected = model.id === currentModelId;
				group.appendChild(option);
			}

			return group;
		};

		// Add OpenAI models
		if (openaiModels.length > 0) {
			modelSelector.appendChild(createOptionGroup('OpenAI', openaiModels));
		}

		// Add Anthropic models
		if (anthropicModels.length > 0) {
			modelSelector.appendChild(createOptionGroup('Anthropic', anthropicModels));
		}

		// Add Google models
		if (googleModels.length > 0) {
			modelSelector.appendChild(createOptionGroup('Google', googleModels));
		}

		// Set up model selection change handler
		modelSelector.addEventListener('change', () => {
			const selectedModelId = modelSelector.value;
			this.devSphereService.setCurrentModel(selectedModelId);
			this.addModelChangeMessage(selectedModelId);
		});

		modelSelectorContainer.appendChild(modelSelector);
		headerLeft.appendChild(modelSelectorContainer);
		this.headerElement.appendChild(headerLeft);

		// Right side of header with actions
		const headerActions = document.createElement('div');
		headerActions.className = 'dev-sphere-header-actions';

		// New Chat button
		const newChatButton = document.createElement('button');
		newChatButton.className = 'dev-sphere-action-button dev-sphere-new-chat-button';
		newChatButton.title = 'New Chat';
		DOM.safeInnerHtml(newChatButton, '<span>New Chat</span>');
		newChatButton.addEventListener('click', async () => {
			// Create a new chat if we have a current chat with user messages
			await this.viewModel.createNewChat();
		});
		headerActions.appendChild(newChatButton);

		// Clear Chat button
		const clearChatButton = document.createElement('button');
		clearChatButton.className = 'dev-sphere-action-button dev-sphere-clear-chat-button';
		clearChatButton.title = 'Clear Chat';
		DOM.safeInnerHtml(clearChatButton, '<span>Clear</span>');
		clearChatButton.addEventListener('click', () => {
			this.viewModel.clearMessages();
		});
		headerActions.appendChild(clearChatButton);

		this.headerElement.appendChild(headerActions);
	}

	/**
	 * Updates the header when chat count changes.
	 * Manages the chat count indicator next to the New Chat button,
	 * creating or updating it as needed.
	 *
	 * The chat count badge is only shown when there are saved chats.
	 */
	public updateChatCount(): void {
		const chatCount = this.viewModel.allChats.length;
		const chatCountElement = this.headerElement.querySelector('.dev-sphere-chat-count');
		const newChatButton = this.headerElement.querySelector('.dev-sphere-new-chat-button');

		// If we have a chat count element already
		if (chatCountElement) {
			if (chatCount > 0) {
				chatCountElement.textContent = String(chatCount);
			} else {
				// Remove the chat count element if there are no chats
				chatCountElement.remove();
			}
		} else if (chatCount > 0 && newChatButton) {
			// If we don't have a chat count element but we need one
			const countSpan = document.createElement('span');
			countSpan.className = 'dev-sphere-chat-count';
			countSpan.textContent = String(chatCount);
			newChatButton.appendChild(countSpan);
		}
	}

	/**
	 * Adds a system message indicating the model has been changed.
	 * Creates a human-readable message showing the new model name and provider.
	 * This provides visual feedback to the user about the model change.
	 *
	 * @param modelId - The ID of the new model
	 */
	private addModelChangeMessage(modelId: string): void {
		const modelInfo = this.devSphereService.getModelInfoById(modelId);
		if (modelInfo) {
			const { info, provider } = modelInfo;
			const providerName = this.devSphereService.getProviderNameFromType(provider);
			this.viewModel.addSystemMessage(`Model changed to **${info.name}** (${providerName})`);
		}
	}

	/**
	 * Sets the visibility of the header element.
	 * Used to show or hide the header based on the current view.
	 * The header is typically only shown in the Chat view.
	 *
	 * @param visible - Whether the header should be visible
	 */
	public setVisible(visible: boolean): void {
		this.headerElement.style.display = visible ? 'flex' : 'none';
	}
}
