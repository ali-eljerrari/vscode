/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * @file DevSphere Chat Selector Component
 *
 * This module implements a modal dialog for selecting from saved chat conversations.
 * It provides a searchable interface for finding and switching between existing chats,
 * as well as managing them (like deletion).
 *
 * Key features:
 * - Modal overlay dialog that appears above the main interface
 * - Searchable list of all saved chat conversations
 * - Visual indication of the currently active chat
 * - Delete functionality for removing unwanted chats
 * - Empty state handling when no chats exist
 */

import { DevSphereViewModel } from '../devSphereViewModel.js';
import { IQuickInputService } from '../../../../../platform/quickinput/common/quickInput.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import * as DOM from '../../../../../base/browser/dom.js';

/**
 * Chat selector component that provides a modal dialog for selecting
 * and managing saved chat conversations.
 */
export class DevSphereChatSelector extends Disposable {
	/** Modal overlay container */
	private dialogOverlay: HTMLDivElement;

	/** Container for the list of chat items */
	private chatListContainer: HTMLDivElement;

	/**
	 * Creates a new instance of the DevSphere chat selector component.
	 *
	 * @param container - Parent DOM element to append the dialog overlay to
	 * @param viewModel - ViewModel instance for accessing chat data and operations
	 * @param quickInputService - Service for displaying confirmation dialogs
	 * @param onChatSelected - Callback function to invoke when a chat is selected
	 */
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

		// Create header
		const header = document.createElement('div');
		header.classList.add('dev-sphere-chat-selector-header');

		const closeButton = document.createElement('div');
		closeButton.classList.add('dev-sphere-chat-selector-close');
		// Use textContent instead of innerHTML
		closeButton.textContent = '✕';
		closeButton.addEventListener('click', () => {
			this.hideChatSelector();
		});
		header.appendChild(closeButton);


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


		// Create chat list container
		this.chatListContainer = document.createElement('div');
		this.chatListContainer.classList.add('dev-sphere-chat-selector-list');

		// Add event listener to close dialog when clicking outside
		this.dialogOverlay.addEventListener('click', () => {
			this.hideChatSelector();
		});

		// Initialize chat list
		this.updateChatSelectorList();
	}

	/**
	 * Shows the chat selector dialog.
	 * Makes the overlay visible and focuses the search input for immediate typing.
	 */
	public showChatSelector(): void {
		this.dialogOverlay.classList.add('show');

		// Focus search input
		const searchInput = this.chatListContainer.querySelector('input');
		if (searchInput) {
			searchInput.focus();
		}
	}

	/**
	 * Hides the chat selector dialog.
	 * Removes the visible class from the overlay to hide it.
	 */
	public hideChatSelector(): void {
		this.dialogOverlay.classList.remove('show');
	}

	/**
	 * Filters the chat list based on search input.
	 * Shows or hides chat items based on whether their titles match the search term.
	 *
	 * @param searchTerm - The text to filter chats against
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
	 * Updates the chat selector list with current chats from the view model.
	 * Clears and rebuilds the entire list, showing the most recent chats first.
	 * Displays an empty state message if no chats are available.
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
					this.viewModel.loadChat(chat.id);
					this.hideChatSelector();
					this.onChatSelected();
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
