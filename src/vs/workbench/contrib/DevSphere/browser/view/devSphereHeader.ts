/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DevSphereViewModel } from '../devSphereViewModel.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import * as DOM from '../../../../../base/browser/dom.js';
import { IDevSphereService } from '../services/devSphereServiceInterface.js';

export class DevSphereHeader extends Disposable {
	private headerElement: HTMLElement;

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
	 * Creates the header section with title, model selector, and action buttons
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

		// Create option groups for each provider
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
		newChatButton.addEventListener('click', () => {
			// Create a new chat (specify false to reuse empty chat if one exists)
			this.viewModel.createNewChat(false);
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
	 * Updates the header when chat count changes
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
	 * Adds a system message indicating the model has been changed
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
	 * Sets the visibility of the header element
	 */
	public setVisible(visible: boolean): void {
		this.headerElement.style.display = visible ? 'flex' : 'none';
	}
}
