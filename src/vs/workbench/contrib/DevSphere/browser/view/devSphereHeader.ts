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
		private readonly onShowChatsClicked: () => void
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

		// Add event listener for model change
		modelSelector.addEventListener('change', () => {
			const selectedModelId = modelSelector.value;
			this.devSphereService.setCurrentModel(selectedModelId);
			this.addModelChangeMessage(selectedModelId);
		});

		headerLeft.appendChild(modelSelector);
		this.headerElement.appendChild(headerLeft);

		// Right side of header with actions
		const headerActions = document.createElement('div');
		headerActions.className = 'dev-sphere-header-actions';

		// Browse chats button
		const browseButton = document.createElement('button');
		browseButton.className = 'dev-sphere-action-button dev-sphere-browse-chats-button';

		// Get chat count
		const chatCount = this.viewModel.allChats.length;
		const browseButtonHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>All Chats</span>
            ${chatCount > 0 ? `<span class="dev-sphere-chat-count">${chatCount}</span>` : ''}
        `;
		DOM.safeInnerHtml(browseButton, browseButtonHTML);
		browseButton.title = 'Browse and manage chats';
		browseButton.addEventListener('click', () => {
			this.onShowChatsClicked();
		});
		headerActions.appendChild(browseButton);

		// Clear chat button
		const clearButton = document.createElement('button');
		clearButton.className = 'dev-sphere-action-button';
		clearButton.textContent = 'Clear Chat';
		clearButton.title = 'Clear current chat';
		clearButton.addEventListener('click', () => {
			this.viewModel.clearMessages();
		});
		headerActions.appendChild(clearButton);

		this.headerElement.appendChild(headerActions);
	}

	/**
	 * Updates the header when chat count changes
	 */
	public updateChatCount(): void {
		const chatCount = this.viewModel.allChats.length;
		const chatCountElement = this.headerElement.querySelector('.dev-sphere-chat-count');

		// If we have a chat count element already
		if (chatCountElement) {
			if (chatCount > 0) {
				chatCountElement.textContent = String(chatCount);
			} else {
				// Remove the chat count element if there are no chats
				chatCountElement.remove();
			}
		} else if (chatCount > 0) {
			// If we don't have a chat count element but we need one
			const browseButton = this.headerElement.querySelector('.dev-sphere-browse-chats-button');
			if (browseButton) {
				const countSpan = document.createElement('span');
				countSpan.className = 'dev-sphere-chat-count';
				countSpan.textContent = String(chatCount);
				browseButton.appendChild(countSpan);
			}
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
