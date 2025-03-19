/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DevSphereViewModel } from '../devSphereViewModel.js';
import { IQuickInputService } from '../../../../../platform/quickinput/common/quickInput.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import * as DOM from '../../../../../base/browser/dom.js';

export class DevSphereChatSelector extends Disposable {
	private chatSelectorDialog: HTMLDivElement;
	private dialogOverlay: HTMLDivElement;
	private chatListContainer: HTMLDivElement;

	constructor(
		private readonly container: HTMLElement,
		private readonly viewModel: DevSphereViewModel,
		private readonly quickInputService: IQuickInputService,
		private readonly onChatSelected: () => void
	) {
		super();

		// Create dialog overlay
		this.dialogOverlay = document.createElement('div');
		this.dialogOverlay.classList.add('dev-sphere-dialog-overlay');
		this.container.appendChild(this.dialogOverlay);

		// Create chat selector dialog
		this.chatSelectorDialog = document.createElement('div');
		this.chatSelectorDialog.classList.add('dev-sphere-chat-selector');
		this.container.appendChild(this.chatSelectorDialog);

		// Create header
		const header = document.createElement('div');
		header.classList.add('dev-sphere-chat-selector-header');

		const title = document.createElement('div');
		title.classList.add('dev-sphere-chat-selector-title');
		title.textContent = 'All Chats';
		header.appendChild(title);

		const closeButton = document.createElement('div');
		closeButton.classList.add('dev-sphere-chat-selector-close');
		// Use textContent instead of innerHTML
		closeButton.textContent = '✕';
		closeButton.addEventListener('click', () => {
			this.hideChatSelector();
		});
		header.appendChild(closeButton);

		this.chatSelectorDialog.appendChild(header);

		// Create search box
		const searchContainer = document.createElement('div');
		searchContainer.classList.add('dev-sphere-chat-selector-search');

		const searchInput = document.createElement('input');
		searchInput.type = 'text';
		searchInput.placeholder = 'Search chats...';
		searchInput.addEventListener('input', () => {
			this.filterChatList(searchInput.value);
		});
		searchContainer.appendChild(searchInput);

		this.chatSelectorDialog.appendChild(searchContainer);

		// Create chat list container
		this.chatListContainer = document.createElement('div');
		this.chatListContainer.classList.add('dev-sphere-chat-selector-list');
		this.chatSelectorDialog.appendChild(this.chatListContainer);

		// Add event listener to close dialog when clicking outside
		this.dialogOverlay.addEventListener('click', () => {
			this.hideChatSelector();
		});

		// Initialize chat list
		this.updateChatSelectorList();
	}

	/**
	 * Shows the chat selector dialog
	 */
	public showChatSelector(): void {
		this.chatSelectorDialog.classList.add('show');
		this.dialogOverlay.classList.add('show');

		// Focus search input
		const searchInput = this.chatSelectorDialog.querySelector('input');
		if (searchInput) {
			searchInput.focus();
		}
	}

	/**
	 * Hides the chat selector dialog
	 */
	public hideChatSelector(): void {
		this.chatSelectorDialog.classList.remove('show');
		this.dialogOverlay.classList.remove('show');
	}

	/**
	 * Filters the chat list based on search input
	 */
	private filterChatList(searchTerm: string): void {
		const chatItems = this.chatListContainer.querySelectorAll('.dev-sphere-chat-item');
		if (!chatItems) {
			return;
		}

		const term = searchTerm.toLowerCase();

		chatItems.forEach(item => {
			const title = item.querySelector('.dev-sphere-chat-title')?.textContent?.toLowerCase() || '';
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
	 * Updates the chat selector list
	 */
	public updateChatSelectorList(): void {
		// Clear existing chat list items
		while (this.chatListContainer.firstChild) {
			this.chatListContainer.removeChild(this.chatListContainer.firstChild);
		}

		// Get all chats and sort by most recent first
		const chats = [...this.viewModel.allChats].sort((a, b) => b.lastModified - a.lastModified);

		if (chats.length === 0) {
			const emptyText = document.createElement('div');
			emptyText.classList.add('dev-sphere-chat-list-empty');
			emptyText.textContent = 'No saved chats yet';
			this.chatListContainer.appendChild(emptyText);
			return;
		}

		// Create a list item for each chat
		chats.forEach(chat => {
			const chatItem = document.createElement('div');
			chatItem.classList.add('dev-sphere-chat-item');

			// Add selected class if this is the current chat
			if (chat.id === this.viewModel?.currentChat?.id) {
				chatItem.classList.add('dev-sphere-chat-item-selected');
			}

			// Create chat title
			const chatTitle = document.createElement('div');
			chatTitle.classList.add('dev-sphere-chat-title');
			chatTitle.textContent = chat.title;
			chatItem.appendChild(chatTitle);

			// Create action buttons container
			const actionButtons = document.createElement('div');
			actionButtons.classList.add('dev-sphere-chat-actions');

			// Rename button
			const renameButton = document.createElement('button');
			renameButton.classList.add('dev-sphere-chat-action-button');
			renameButton.title = 'Rename chat';
			const renameButtonHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
            `;
			DOM.safeInnerHtml(renameButton, renameButtonHTML);
			actionButtons.appendChild(renameButton);

			// Delete button
			const deleteButton = document.createElement('button');
			deleteButton.classList.add('dev-sphere-chat-action-button');
			deleteButton.title = 'Delete chat';
			const deleteButtonHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            `;
			DOM.safeInnerHtml(deleteButton, deleteButtonHTML);
			actionButtons.appendChild(deleteButton);

			chatItem.appendChild(actionButtons);

			// Add to chat list
			this.chatListContainer.appendChild(chatItem);

			// Add event listeners
			chatItem.addEventListener('click', (e) => {
				const target = e.target as Node;
				// Only handle clicks on the item itself or the title, not on action buttons
				if (e.target === chatItem || e.target === chatTitle || (chatItem.contains(target) && !actionButtons.contains(target))) {
					this.viewModel.switchToChat(chat.id);
					this.hideChatSelector();
					this.onChatSelected();
				}
			});

			// Rename chat
			renameButton.addEventListener('click', async (e) => {
				e.stopPropagation(); // Prevent triggering chatItem click

				// Prompt for new title
				const result = await this.quickInputService.input({
					title: 'Rename Chat',
					placeHolder: 'Enter new chat title',
					value: chat.title,
					validateInput: async (value: string) => {
						return value.trim() ? null : 'Title cannot be empty';
					}
				});

				if (result) {
					await this.viewModel.renameChat(chat.id, result);
				}
			});

			// Delete chat
			deleteButton.addEventListener('click', async (e) => {
				e.stopPropagation(); // Prevent triggering chatItem click

				// Confirm deletion
				const result = await this.quickInputService.pick(
					[{ label: 'Cancel' }, { label: 'Delete' }],
					{
						placeHolder: `Delete chat "${chat.title}"?`
					}
				);

				if (result && result.label === 'Delete') {
					await this.viewModel.deleteChat(chat.id);
				}
			});
		});
	}
}
