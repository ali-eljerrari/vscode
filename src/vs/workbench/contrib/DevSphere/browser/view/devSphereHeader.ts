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
		DOM.safeInnerHtml(this.chatActionsButton, 'Options <span class="dev-sphere-dropdown-caret">▾</span>');
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

		// Create a dropdown container to position the dropdown properly
		const dropdownContainer = mainWindow.document.createElement('div');
		dropdownContainer.style.position = 'relative';
		dropdownContainer.appendChild(dropdownMenu);

		// Append the dropdown container to the action button's parent
		if (this.chatActionsButton) {
			this.chatActionsButton.parentElement?.appendChild(dropdownContainer);
		}

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

		let iconText = '';
		switch (icon) {
			case 'plus':
				iconText = '+';
				break;
			case 'trash':
				iconText = '🗑️';
				break;
			case 'edit':
				iconText = '✏️';
				break;
			case 'download':
				iconText = '⬇️';
				break;
			default:
				iconText = '•';
		}

		const html = `
			<span class="dev-sphere-dropdown-item-icon">${iconText}</span>
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
