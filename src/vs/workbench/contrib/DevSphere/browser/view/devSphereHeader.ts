/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DevSphereViewModel } from '../devSphereViewModel.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import * as DOM from '../../../../../base/browser/dom.js';
import { IDevSphereService } from '../devSphereService.js';

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

		// Add title
		const title = document.createElement('div');
		title.className = 'dev-sphere-header-title';
		title.textContent = 'DevSphere AI';
		headerLeft.appendChild(title);

		// Model selector container
		const modelSelectorContainer = document.createElement('div');
		modelSelectorContainer.className = 'dev-sphere-model-selector-container';

		// Model selector
		const modelSelector = document.createElement('select');
		modelSelector.className = 'dev-sphere-model-selector';

		// Get available models
		const availableModels = this.devSphereService.getAvailableModels();
		const currentModel = this.devSphereService.getCurrentModel();

		// Add options for each model
		availableModels.forEach(model => {
			const option = document.createElement('option');
			option.value = model.id;
			option.text = model.name;
			option.selected = model.id === currentModel.id;
			modelSelector.appendChild(option);
		});

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
			// Create a new chat
			this.viewModel.createNewChat();
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
		const model = this.devSphereService.getAvailableModels().find(m => m.id === modelId);
		if (model) {
			this.viewModel.addSystemMessage(`Model changed to **${model.name}** (${model.description})`);
		}
	}
}
