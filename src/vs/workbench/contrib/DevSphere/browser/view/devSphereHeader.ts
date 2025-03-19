/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DevSphereViewModel } from '../devSphereViewModel.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import * as DOM from '../../../../../base/browser/dom.js';
import { IDevSphereService } from '../devSphereService.js';

interface IDropdownMenuItem {
	id: string;
	label: string;
	icon: string;
	onClick: () => void;
	separator?: boolean;
}

class DevSphereDropdownMenu extends Disposable {
	private element: HTMLElement;
	private isVisible = false;

	constructor(
		private readonly container: HTMLElement,
		private readonly anchor: HTMLElement,
		private readonly items: IDropdownMenuItem[]
	) {
		super();
		this.element = this.createDropdownElement();
		this.registerListeners();
	}

	private createDropdownElement(): HTMLElement {
		const mainWindow = DOM.getWindow(this.container);
		const dropdown = mainWindow.document.createElement('div');
		dropdown.className = 'dev-sphere-chat-actions-dropdown';
		dropdown.style.opacity = '0';
		dropdown.style.transform = 'translateY(-10px)';
		dropdown.style.transition = 'opacity 150ms ease-in-out, transform 150ms ease-in-out';

		this.items.forEach((item, index) => {
			if (item.separator && index > 0) {
				const separator = mainWindow.document.createElement('div');
				separator.className = 'dev-sphere-dropdown-separator';
				dropdown.appendChild(separator);
			}

			const menuItem = this.createMenuItem(item);
			dropdown.appendChild(menuItem);
		});

		return dropdown;
	}

	private createMenuItem(item: IDropdownMenuItem): HTMLElement {
		const menuItem = document.createElement('div');
		menuItem.className = 'dev-sphere-dropdown-item';
		menuItem.setAttribute('role', 'menuitem');
		menuItem.setAttribute('data-id', item.id);

		const iconSvg = this.getIconSvg(item.icon);
		const html = `
			<span class="dev-sphere-dropdown-item-icon">${iconSvg}</span>
			<span class="dev-sphere-dropdown-item-label">${item.label}</span>
		`;

		DOM.safeInnerHtml(menuItem, html);
		menuItem.addEventListener('click', () => {
			item.onClick();
			this.hide();
		});

		return menuItem;
	}

	private getIconSvg(icon: string): string {
		const icons = {
			trash: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<polyline points="3 6 5 6 21 6"></polyline>
				<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
			</svg>`,
			edit: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M12 20h9"></path>
				<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
			</svg>`,
			download: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
				<polyline points="7 10 12 15 17 10"></polyline>
				<line x1="12" y1="15" x2="12" y2="3"></line>
			</svg>`,
			plus: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<line x1="12" y1="5" x2="12" y2="19"></line>
				<line x1="5" y1="12" x2="19" y2="12"></line>
			</svg>`
		};

		return icons[icon] || '';
	}

	private registerListeners(): void {
		const mainWindow = DOM.getWindow(this.container);

		// Close on outside click
		this._register(DOM.addDisposableListener(mainWindow.document, 'click', (e: MouseEvent) => {
			if (!this.element.contains(e.target as Node) &&
				!this.anchor.contains(e.target as Node)) {
				this.hide();
			}
		}));

		// Close on Escape key
		this._register(DOM.addDisposableListener(mainWindow.document, 'keydown', (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				this.hide();
			}
		}));
	}

	public toggle(): void {
		this.isVisible ? this.hide() : this.show();
	}

	private show(): void {
		if (this.isVisible) return;

		const mainWindow = DOM.getWindow(this.container);
		const buttonRect = this.anchor.getBoundingClientRect();

		this.element.style.top = `${buttonRect.bottom + 5}px`;
		this.element.style.right = '10px';

		mainWindow.document.body.appendChild(this.element);

		// Trigger animation
		requestAnimationFrame(() => {
			this.element.style.opacity = '1';
			this.element.style.transform = 'translateY(0)';
		});

		this.isVisible = true;
	}

	private hide(): void {
		if (!this.isVisible) return;

		this.element.style.opacity = '0';
		this.element.style.transform = 'translateY(-10px)';

		setTimeout(() => {
			this.element.remove();
		}, 150);

		this.isVisible = false;
	}

	public dispose(): void {
		this.element.remove();
		super.dispose();
	}
}

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
		const dropdownItems: IDropdownMenuItem[] = [
			{
				id: 'clear',
				label: 'Clear Chat',
				icon: 'trash',
				onClick: () => this.viewModel.clearMessages()
			},
			{
				id: 'rename',
				label: 'Rename Chat',
				icon: 'edit',
				onClick: async () => {
					// To be implemented
				},
				separator: true
			},
			{
				id: 'export',
				label: 'Export Chat',
				icon: 'download',
				onClick: () => {
					// To be implemented
				}
			}
		];

		const dropdown = new DevSphereDropdownMenu(
			this.container,
			this.chatActionsButton!,
			dropdownItems
		);

		dropdown.toggle();
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
