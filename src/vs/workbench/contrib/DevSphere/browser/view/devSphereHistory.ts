/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * @file DevSphere History Component
 *
 * This module implements the history view for the DevSphere extension, providing
 * a searchable, organized list of past conversations. Key features include:
 *
 * 1. Time-based grouping (Today, Yesterday, Last 7 Days, Older)
 * 2. Search functionality for finding specific conversations
 * 3. Chat metadata display (message count, time, model used)
 * 4. Action buttons for opening or deleting chats
 * 5. Empty state handling for new users
 *
 * The history component appears when the user switches to the History tab in the
 * DevSphere panel and provides a convenient way to manage and access past interactions.
 */

import { DevSphereViewModel } from '../devSphereViewModel.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { IQuickInputService } from '../../../../../platform/quickinput/common/quickInput.js';
import { Chat } from '../models/types.js';
import * as DOM from '../../../../../base/browser/dom.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';

/**
 * History component for the DevSphere extension.
 * Manages a searchable view of past conversations with time-based grouping
 * and operations for managing chat history.
 */
export class DevSphereHistory extends Disposable {
	/** Main container for the history view */
	private container: HTMLDivElement;

	/** Container for the list of chat history items */
	private historyList: HTMLDivElement;

	/** Search input field for filtering chats */
	private searchInput: HTMLInputElement;

	/** Container for search input and related elements */
	private searchContainer: HTMLDivElement;

	/**
	 * Creates a new instance of the DevSphere history component.
	 *
	 * @param parentContainer - Parent DOM element to append the history component to
	 * @param viewModel - ViewModel instance for accessing chat data
	 * @param quickInputService - Service for displaying confirmation dialogs
	 * @param onChatSelected - Callback function to invoke when a chat is selected
	 */
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
		this.searchContainer = document.createElement('div');
		this.searchContainer.classList.add('dev-sphere-history-search');

		// Add search icon
		const searchIcon = document.createElement('div');
		searchIcon.classList.add('dev-sphere-history-search-icon');
		searchIcon.classList.add(...ThemeIcon.asClassNameArray(Codicon.search));
		this.searchContainer.appendChild(searchIcon);

		// Create search input
		this.searchInput = document.createElement('input');
		this.searchInput.type = 'text';
		this.searchInput.placeholder = 'Search chat history...';
		this.searchInput.classList.add('dev-sphere-history-search-input');
		this.searchInput.addEventListener('input', () => {
			this.filterChatList(this.searchInput.value);
			// Show/hide clear button based on input
			clearButton.style.display = this.searchInput.value.length > 0 ? 'flex' : 'none';
		});
		this.searchContainer.appendChild(this.searchInput);

		// Add clear button
		const clearButton = document.createElement('div');
		clearButton.classList.add('dev-sphere-history-search-clear');
		clearButton.title = 'Clear search';
		clearButton.classList.add(...ThemeIcon.asClassNameArray(Codicon.close));
		clearButton.style.display = 'none'; // Hide initially
		clearButton.addEventListener('click', () => {
			this.searchInput.value = '';
			this.filterChatList('');
			clearButton.style.display = 'none';
			this.searchInput.focus();
		});
		this.searchContainer.appendChild(clearButton);

		this.container.appendChild(this.searchContainer);

		// Create history header
		const historyHeader = document.createElement('div');
		historyHeader.classList.add('dev-sphere-history-header');
		historyHeader.textContent = 'Recent Conversations';
		this.container.appendChild(historyHeader);

		// Create history list
		this.historyList = document.createElement('div');
		this.historyList.className = 'dev-sphere-history-list';
		this.container.appendChild(this.historyList);

		// Initial render
		this.updateHistoryList();
	}

	/**
	 * Updates the history list with all chats.
	 * Clears and rebuilds the entire list, grouping chats by time periods
	 * (Today, Yesterday, Last 7 Days, Older).
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

		// Group chats by date
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);
		const lastWeek = new Date(today);
		lastWeek.setDate(lastWeek.getDate() - 7);

		const todayChats: Chat[] = [];
		const yesterdayChats: Chat[] = [];
		const lastWeekChats: Chat[] = [];
		const olderChats: Chat[] = [];

		chats.forEach(chat => {
			const chatDate = new Date(chat.lastModified);
			chatDate.setHours(0, 0, 0, 0);

			if (chatDate.getTime() === today.getTime()) {
				todayChats.push(chat);
			} else if (chatDate.getTime() === yesterday.getTime()) {
				yesterdayChats.push(chat);
			} else if (chatDate >= lastWeek) {
				lastWeekChats.push(chat);
			} else {
				olderChats.push(chat);
			}
		});

		// Create sections for each time period
		if (todayChats.length > 0) {
			this.createDateSection('Today', todayChats);
		}

		if (yesterdayChats.length > 0) {
			this.createDateSection('Yesterday', yesterdayChats);
		}

		if (lastWeekChats.length > 0) {
			this.createDateSection('Last 7 Days', lastWeekChats);
		}

		if (olderChats.length > 0) {
			this.createDateSection('Older', olderChats);
		}
	}

	/**
	 * Creates a date section with header and chat items.
	 * Groups chats under a common time-based header for better organization.
	 *
	 * @param title - The section title (e.g., "Today", "Yesterday")
	 * @param chats - Array of chat objects to include in this section
	 */
	private createDateSection(title: string, chats: Chat[]): void {
		// Create section container
		const sectionContainer = document.createElement('div');
		sectionContainer.classList.add('dev-sphere-history-section');

		// Add section header
		const sectionHeader = document.createElement('div');
		sectionHeader.classList.add('dev-sphere-history-section-header');
		sectionHeader.textContent = title;
		sectionContainer.appendChild(sectionHeader);

		// Add chat items
		const sectionItems = document.createElement('div');
		sectionItems.classList.add('dev-sphere-history-section-items');

		chats.forEach(chat => {
			const chatItem = this.createChatHistoryItem(chat);
			sectionItems.appendChild(chatItem);
		});

		sectionContainer.appendChild(sectionItems);
		this.historyList.appendChild(sectionContainer);
	}

	/**
	 * Creates a single chat history item.
	 * Builds a UI element representing a chat with title, metadata, and action buttons.
	 *
	 * @param chat - The chat object to create an item for
	 * @returns A DOM element representing the chat history item
	 */
	private createChatHistoryItem(chat: Chat): HTMLDivElement {
		const historyItem = document.createElement('div');
		historyItem.classList.add('dev-sphere-history-item');
		historyItem.setAttribute('data-chat-id', chat.id);

		// Add selected class if this is the current chat
		if (chat.id === this.viewModel?.currentChat?.id) {
			historyItem.classList.add('dev-sphere-history-item-selected');
		}

		// Add chat icon
		const chatIcon = document.createElement('div');
		chatIcon.classList.add('dev-sphere-history-item-icon');
		chatIcon.classList.add(...ThemeIcon.asClassNameArray(Codicon.commentDiscussion));
		historyItem.appendChild(chatIcon);

		// Create content container
		const contentContainer = document.createElement('div');
		contentContainer.classList.add('dev-sphere-history-item-content');

		// Chat title
		const titleElement = document.createElement('div');
		titleElement.classList.add('dev-sphere-history-title');
		titleElement.title = chat.title;
		titleElement.textContent = chat.title;
		contentContainer.appendChild(titleElement);

		// Message count, time and model
		const metaElement = document.createElement('div');
		metaElement.classList.add('dev-sphere-history-meta');

		const count = chat.messages.length;
		const model = chat.modelId ? chat.modelId.split('-')[0]?.toUpperCase() : 'AI'; // Simplified model display

		// Format time
		const date = new Date(chat.lastModified);
		const timeStr = date.toLocaleTimeString(undefined, {
			hour: '2-digit',
			minute: '2-digit'
		});

		metaElement.textContent = `${count} message${count !== 1 ? 's' : ''} · ${timeStr} · ${model}`;
		contentContainer.appendChild(metaElement);

		historyItem.appendChild(contentContainer);

		// Action buttons container
		const actionButtons = document.createElement('div');
		actionButtons.classList.add('dev-sphere-history-actions');

		// Open button
		const openButton = document.createElement('button');
		openButton.classList.add('dev-sphere-history-action-button');
		openButton.title = 'Open chat';
		openButton.classList.add(...ThemeIcon.asClassNameArray(Codicon.goToFile));
		actionButtons.appendChild(openButton);

		// Delete button
		const deleteButton = document.createElement('button');
		deleteButton.classList.add('dev-sphere-history-action-button');
		deleteButton.title = 'Delete chat';
		deleteButton.classList.add(...ThemeIcon.asClassNameArray(Codicon.trash));
		actionButtons.appendChild(deleteButton);

		historyItem.appendChild(actionButtons);

		// Add event listeners
		historyItem.addEventListener('click', (e) => {
			const target = e.target as Node;
			// Only handle clicks on the item itself or title, not buttons
			if (e.target === historyItem || e.target === titleElement ||
				(historyItem.contains(target) && !actionButtons.contains(target))) {
				this.viewModel.loadChat(chat.id);
				this.updateSelectedItemStyle(chat.id);
				this.onChatSelected();
			}
		});

		// Open chat
		openButton.addEventListener('click', (e) => {
			e.stopPropagation();
			this.viewModel.loadChat(chat.id);
			this.updateSelectedItemStyle(chat.id);
			this.onChatSelected();
		});

		// Delete chat
		deleteButton.addEventListener('click', async (e) => {
			e.stopPropagation();

			// Confirm deletion
			const result = await this.quickInputService.pick(
				[
					{ label: 'Delete', iconClass: ThemeIcon.asClassName(Codicon.trash) },
					{ label: 'Cancel', iconClass: ThemeIcon.asClassName(Codicon.close) }
				],
				{
					placeHolder: `Delete chat "${chat.title}"?`,
					canPickMany: false
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
	 * Updates the selected item style after switching chats.
	 * Ensures the correct visual highlighting of the currently active chat.
	 *
	 * @param selectedChatId - The ID of the newly selected chat
	 */
	private updateSelectedItemStyle(selectedChatId: string): void {
		const items = this.historyList.querySelectorAll('.dev-sphere-history-item');
		items.forEach(item => {
			if (DOM.isHTMLElement(item)) {
				const chatId = item.getAttribute('data-chat-id');
				if (chatId === selectedChatId) {
					item.classList.add('dev-sphere-history-item-selected');
				} else {
					item.classList.remove('dev-sphere-history-item-selected');
				}
			}
		});
	}

	/**
	 * Filters the history list based on search input.
	 * Shows or hides chat items based on whether their titles match the search term.
	 * Also handles section visibility and empty search results state.
	 *
	 * @param searchTerm - The text to filter chats against
	 */
	private filterChatList(searchTerm: string): void {
		const sections = this.historyList.querySelectorAll('.dev-sphere-history-section');
		if (!sections || sections.length === 0) {
			return;
		}

		const term = searchTerm.toLowerCase().trim();
		let totalVisibleItems = 0;

		// Process each section
		sections.forEach(section => {
			if (!DOM.isHTMLElement(section)) {
				return;
			}

			const items = section.querySelectorAll('.dev-sphere-history-item');
			let visibleItemsInSection = 0;

			// First, filter the items
			items.forEach(item => {
				if (!DOM.isHTMLElement(item)) {
					return;
				}

				const title = item.querySelector('.dev-sphere-history-title')?.textContent?.toLowerCase() || '';

				if (term === '' || title.includes(term)) {
					item.style.display = 'flex';
					visibleItemsInSection++;
					totalVisibleItems++;
				} else {
					item.style.display = 'none';
				}
			});

			// Then show/hide the section based on whether it has visible items
			const sectionHeader = section.querySelector('.dev-sphere-history-section-header');
			if (DOM.isHTMLElement(sectionHeader)) {
				sectionHeader.style.display = visibleItemsInSection > 0 ? 'block' : 'none';
			}

			section.style.display = visibleItemsInSection > 0 ? 'block' : 'none';
		});

		// Show no results message if needed
		let noResultsElement = this.historyList.querySelector('.dev-sphere-history-no-results');

		if (totalVisibleItems === 0 && term !== '') {
			if (!noResultsElement) {
				noResultsElement = document.createElement('div');
				noResultsElement.classList.add('dev-sphere-history-no-results');

				const noResultsHTML = `
					<div class="dev-sphere-history-no-results-icon">
						<i class="${ThemeIcon.asClassName(Codicon.searchStop)}"></i>
					</div>
					<div class="dev-sphere-history-no-results-text">No results found</div>
				`;
				DOM.safeInnerHtml(noResultsElement as HTMLElement, noResultsHTML);
				this.historyList.appendChild(noResultsElement);
			} else {
				(noResultsElement as HTMLElement).style.display = 'flex';
			}
		} else if (noResultsElement) {
			(noResultsElement as HTMLElement).style.display = 'none';
		}
	}

	/**
	 * Renders empty state when no chats exist.
	 * Creates a friendly UI when the user has no chat history yet,
	 * with guidance and a button to start a new conversation.
	 */
	private renderEmptyState(): void {
		const emptyState = document.createElement('div');
		emptyState.className = 'dev-sphere-history-empty';

		const emptyStateHTML = `
            <div class="dev-sphere-history-empty-icon">
                <i class="${ThemeIcon.asClassName(Codicon.comment)}"></i>
            </div>
            <div class="dev-sphere-history-empty-title">No conversations yet</div>
            <div class="dev-sphere-history-empty-subtitle">Start a new chat to begin building your history</div>
            <button class="dev-sphere-history-empty-button">
                <i class="${ThemeIcon.asClassName(Codicon.add)}"></i>
                New Conversation
            </button>
        `;
		DOM.safeInnerHtml(emptyState, emptyStateHTML);

		// Add event listener to the "New Conversation" button
		const newChatButton = emptyState.querySelector('.dev-sphere-history-empty-button');
		if (newChatButton) {
			newChatButton.addEventListener('click', async () => {
				// Create a new chat if we have a current chat with user messages
				await this.viewModel.createNewChat();
				this.onChatSelected();
			});
		}

		this.historyList.appendChild(emptyState);
	}

	/**
	 * Sets the visibility of the history view.
	 * Shows or hides the component and updates the list when becoming visible.
	 *
	 * @param visible - Whether the history component should be visible
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
