/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DevSphereViewModel } from '../devSphereViewModel.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { IQuickInputService } from '../../../../../platform/quickinput/common/quickInput.js';
import { Chat } from '../devSphereService.js';
import * as DOM from '../../../../../base/browser/dom.js';

export class DevSphereHistory extends Disposable {
	private container: HTMLDivElement;
	private historyList: HTMLDivElement;
	private searchInput: HTMLInputElement;

	constructor(
		parentContainer: HTMLElement,
		private readonly viewModel: DevSphereViewModel,
		private readonly quickInputService: IQuickInputService,
		private readonly onChatSelected: () => void
	) {
		super();

		// Create history container
		this.container = document.createElement('div');
		this.container.className = 'dev-sphere-history-container';
		parentContainer.appendChild(this.container);

		// Create search box
		const searchContainer = document.createElement('div');
		searchContainer.classList.add('dev-sphere-history-search');

		this.searchInput = document.createElement('input');
		this.searchInput.type = 'text';
		this.searchInput.placeholder = 'Search chat history...';
		this.searchInput.addEventListener('input', () => {
			this.filterChatList(this.searchInput.value);
		});
		searchContainer.appendChild(this.searchInput);

		this.container.appendChild(searchContainer);

		// Create history list
		this.historyList = document.createElement('div');
		this.historyList.className = 'dev-sphere-history-list';
		this.container.appendChild(this.historyList);

		// Initial render
		this.updateHistoryList();
	}

	/**
	 * Updates the history list with all chats
	 */
	public updateHistoryList(): void {
		// Clear existing history items
		while (this.historyList.firstChild) {
			this.historyList.removeChild(this.historyList.firstChild);
		}

		// Get all chats and sort by most recent first
		const chats = [...this.viewModel.allChats].sort((a, b) => b.lastModified - a.lastModified);

		if (chats.length === 0) {
			this.renderEmptyState();
			return;
		}

		// Create an item for each chat
		chats.forEach(chat => {
			const chatItem = this.createChatHistoryItem(chat);
			this.historyList.appendChild(chatItem);
		});
	}

	/**
	 * Creates a single chat history item
	 */
	private createChatHistoryItem(chat: Chat): HTMLDivElement {
		const historyItem = document.createElement('div');
		historyItem.classList.add('dev-sphere-history-item');

		// Add selected class if this is the current chat
		if (chat.id === this.viewModel?.currentChat?.id) {
			historyItem.classList.add('dev-sphere-history-item-selected');
		}

		// Add date
		const dateElement = document.createElement('div');
		dateElement.classList.add('dev-sphere-history-date');
		const date = new Date(chat.lastModified);
		dateElement.textContent = date.toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
		historyItem.appendChild(dateElement);

		// Chat title
		const titleElement = document.createElement('div');
		titleElement.classList.add('dev-sphere-history-title');
		titleElement.textContent = chat.title;
		historyItem.appendChild(titleElement);

		// Message count and model
		const metaElement = document.createElement('div');
		metaElement.classList.add('dev-sphere-history-meta');

		const count = chat.messages.length;
		const model = chat.modelId.split('-')[0].toUpperCase(); // Simplified model display

		metaElement.textContent = `${count} message${count !== 1 ? 's' : ''} · ${model}`;
		historyItem.appendChild(metaElement);

		// Action buttons container
		const actionButtons = document.createElement('div');
		actionButtons.classList.add('dev-sphere-history-actions');

		// Open button
		const openButton = document.createElement('button');
		openButton.classList.add('dev-sphere-history-action-button');
		openButton.title = 'Open chat';
		const openButtonHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
        `;
		DOM.safeInnerHtml(openButton, openButtonHTML);
		actionButtons.appendChild(openButton);

		// Delete button
		const deleteButton = document.createElement('button');
		deleteButton.classList.add('dev-sphere-history-action-button');
		deleteButton.title = 'Delete chat';
		const deleteButtonHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
        `;
		DOM.safeInnerHtml(deleteButton, deleteButtonHTML);
		actionButtons.appendChild(deleteButton);

		historyItem.appendChild(actionButtons);

		// Add event listeners
		historyItem.addEventListener('click', (e) => {
			const target = e.target as Node;
			// Only handle clicks on the item itself or title, not buttons
			if (e.target === historyItem || e.target === titleElement ||
				(historyItem.contains(target) && !actionButtons.contains(target))) {
				this.viewModel.switchToChat(chat.id);
				this.onChatSelected();
			}
		});

		// Open chat
		openButton.addEventListener('click', (e) => {
			e.stopPropagation();
			this.viewModel.switchToChat(chat.id);
			this.onChatSelected();
		});

		// Delete chat
		deleteButton.addEventListener('click', async (e) => {
			e.stopPropagation();

			// Confirm deletion
			const result = await this.quickInputService.pick(
				[{ label: 'Cancel' }, { label: 'Delete' }],
				{
					placeHolder: `Delete chat "${chat.title}"?`
				}
			);

			if (result && result.label === 'Delete') {
				await this.viewModel.deleteChat(chat.id);
				this.updateHistoryList();
			}
		});

		return historyItem;
	}

	/**
	 * Filters the history list based on search input
	 */
	private filterChatList(searchTerm: string): void {
		const historyItems = this.historyList.querySelectorAll('.dev-sphere-history-item');
		if (!historyItems) {
			return;
		}

		const term = searchTerm.toLowerCase();

		historyItems.forEach(item => {
			const title = item.querySelector('.dev-sphere-history-title')?.textContent?.toLowerCase() || '';
			if (title.includes(term)) {
				if (DOM.isHTMLElement(item)) {
					item.style.display = 'flex';
				}
			} else {
				if (DOM.isHTMLElement(item)) {
					item.style.display = 'none';
				}
			}
		});
	}

	/**
	 * Renders empty state when no chats exist
	 */
	private renderEmptyState(): void {
		const emptyState = document.createElement('div');
		emptyState.className = 'dev-sphere-history-empty';

		const emptyStateHTML = `
            <div class="dev-sphere-history-empty-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
            </div>
            <div class="dev-sphere-history-empty-title">No chat history</div>
            <div class="dev-sphere-history-empty-subtitle">Start a new conversation to begin building your chat history</div>
        `;
		DOM.safeInnerHtml(emptyState, emptyStateHTML);

		this.historyList.appendChild(emptyState);
	}

	/**
	 * Sets the visibility of the history view
	 */
	public setVisible(visible: boolean): void {
		this.container.style.display = visible ? 'flex' : 'none';

		if (visible) {
			// Update the list when shown
			this.updateHistoryList();
			// Focus the search input
			setTimeout(() => this.searchInput.focus(), 50);
		}
	}
}
