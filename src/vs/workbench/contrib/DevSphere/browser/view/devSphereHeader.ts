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
	private chatActionsButton: HTMLButtonElement | undefined;

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

		// Chat actions dropdown button
		this.chatActionsButton = document.createElement('button');
		this.chatActionsButton.className = 'dev-sphere-action-button dev-sphere-chat-actions-button';
		this.chatActionsButton.title = 'Chat options';
		const actionsButtonHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
            </svg>
        `;
		DOM.safeInnerHtml(this.chatActionsButton, actionsButtonHTML);
		this.chatActionsButton.addEventListener('click', (e) => {
			// Show dropdown menu for chat actions
			this.showChatActionsMenu(e);
		});
		headerActions.appendChild(this.chatActionsButton);


		this.headerElement.appendChild(headerActions);
	}

	/**
	 * Shows a dropdown menu for chat actions
	 */
	private showChatActionsMenu(event: MouseEvent): void {
		// Create dropdown menu if it doesn't exist
		const mainWindow = DOM.getWindow(this.container);
		let dropdownMenu = mainWindow.document.querySelector('.dev-sphere-chat-actions-dropdown') as HTMLElement;

		// If the menu already exists, toggle it
		if (dropdownMenu) {
			dropdownMenu.remove();
			return;
		}

		// Create the dropdown menu
		dropdownMenu = mainWindow.document.createElement('div');
		dropdownMenu.className = 'dev-sphere-chat-actions-dropdown';

		this.addDropdownMenuItem(dropdownMenu, 'Clear Chat', () => {
			this.viewModel.clearMessages();
		}, 'trash');

		this.addDropdownMenuItem(dropdownMenu, 'Rename Chat', async () => {
			// This would be implemented later
			// Would prompt for a new name and rename current chat
		}, 'edit');

		this.addDropdownMenuItem(dropdownMenu, 'Export Chat', () => {
			// This would be implemented later
			// Would export chat to a file
		}, 'download');

		// Position the dropdown menu
		const buttonRect = this.chatActionsButton?.getBoundingClientRect();
		if (buttonRect) {
			dropdownMenu.style.top = `${buttonRect.bottom + 5}px`;
			dropdownMenu.style.right = '10px';
		}

		// Add the dropdown to the body
		mainWindow.document.body.appendChild(dropdownMenu);

		// Add event listener to close the dropdown when clicking outside
		mainWindow.document.addEventListener('click', (e) => {
			if (!dropdownMenu.contains(e.target as Node) &&
				e.target !== this.chatActionsButton) {
				dropdownMenu.remove();
			}
		}, { once: true });
	}

	/**
	 * Adds a menu item to the dropdown
	 */
	private addDropdownMenuItem(
		dropdown: HTMLElement,
		label: string,
		onClick: () => void,
		icon: string
	): void {
		const item = document.createElement('div');
		item.className = 'dev-sphere-dropdown-item';

		let iconSvg = '';
		switch (icon) {
			case 'plus':
				iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="12" y1="5" x2="12" y2="19"></line>
					<line x1="5" y1="12" x2="19" y2="12"></line>
				</svg>`;
				break;
			case 'trash':
				iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="3 6 5 6 21 6"></polyline>
					<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
				</svg>`;
				break;
			case 'edit':
				iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M12 20h9"></path>
					<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
				</svg>`;
				break;
			case 'download':
				iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
					<polyline points="7 10 12 15 17 10"></polyline>
					<line x1="12" y1="15" x2="12" y2="3"></line>
				</svg>`;
				break;
		}

		const html = `
			<span class="dev-sphere-dropdown-item-icon">${iconSvg}</span>
			<span class="dev-sphere-dropdown-item-label">${label}</span>
		`;

		// Use DOM.safeInnerHtml to set content
		DOM.safeInnerHtml(item, html);

		item.addEventListener('click', () => {
			onClick();
			// Remove the dropdown after clicking
			const mainWindow = DOM.getWindow(dropdown);
			const menu = mainWindow.document.querySelector('.dev-sphere-chat-actions-dropdown');
			if (menu) {
				menu.remove();
			}
		});

		dropdown.appendChild(item);
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
