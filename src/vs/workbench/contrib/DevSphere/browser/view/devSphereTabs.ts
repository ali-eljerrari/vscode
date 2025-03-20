/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * @file DevSphere Chat Tabs Component
 *
 * This module implements the tab switching interface for managing multiple
 * DevSphere chat conversations. It displays a horizontal scrollable row of tabs,
 * each representing a recent chat conversation, allowing quick switching between
 * them.
 *
 * Features:
 * - Displays up to 5 most recent chats as tabs
 * - Provides a "New Chat" tab to create a new conversation
 * - Allows closing tabs with confirmation
 * - Supports horizontal scrolling with scroll indicators
 * - Highlights the currently active chat
 */

import { DevSphereViewModel } from '../devSphereViewModel.js';
import { IQuickInputService } from '../../../../../platform/quickinput/common/quickInput.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';

/**
 * Tab bar component for switching between recent chat conversations.
 * Displays recent chats as tabs and provides navigation between them.
 */
export class DevSphereTabs extends Disposable {
	/** The container element for the tabs */
	private tabsContainer: HTMLDivElement;

	/** Flag to track if scroll listener has been added */
	private _tabsScrollListenerAdded = false;

	/**
	 * Creates a new instance of the DevSphere tabs component.
	 *
	 * @param container - Parent DOM element to append the tabs component to
	 * @param viewModel - ViewModel instance for chat state management
	 * @param quickInputService - Service for displaying confirmation dialogs
	 * @param onTabChange - Callback function to invoke when a tab is changed
	 */
	constructor(
		container: HTMLElement,
		private readonly viewModel: DevSphereViewModel,
		private readonly quickInputService: IQuickInputService,
		private readonly onTabChange: () => void
	) {
		super();

		// Create the tabs container
		this.tabsContainer = document.createElement('div');
		this.tabsContainer.classList.add('dev-sphere-tabs-container');
		container.appendChild(this.tabsContainer);

		// Initialize tabs
		this.updateChatTabs();
	}

	/**
	 * Updates the tabbed interface for chat switching.
	 *
	 * This method:
	 * 1. Clears existing tabs
	 * 2. Creates tabs for the 5 most recent chats
	 * 3. Adds a "New Chat" tab
	 * 4. Sets up scroll handling
	 *
	 * It's called whenever the set of available chats changes or
	 * when the current chat selection changes.
	 */
	public updateChatTabs(): void {
		if (!this.tabsContainer) {
			return;
		}

		// Clear existing tabs
		while (this.tabsContainer.firstChild) {
			this.tabsContainer.removeChild(this.tabsContainer.firstChild);
		}

		// Get recent chats (limit to 5 for tabs)
		const recentChats = [...this.viewModel.allChats]
			.sort((a, b) => b.lastModified - a.lastModified)
			.slice(0, 5);

		// Create a tab for each recent chat
		recentChats.forEach(chat => {
			const tabElement = document.createElement('div');
			tabElement.classList.add('dev-sphere-tab');

			// Add selected class if this is the current chat
			if (chat.id === this.viewModel?.currentChat?.id) {
				tabElement.classList.add('dev-sphere-tab-active');
			}

			// Create tab title
			const tabTitle = document.createElement('div');
			tabTitle.classList.add('dev-sphere-tab-title');
			tabTitle.textContent = chat.title;
			tabElement.appendChild(tabTitle);

			// Create close button
			const closeButton = document.createElement('div');
			closeButton.classList.add('dev-sphere-tab-close');
			// Use textContent instead of innerHTML for the close symbol
			closeButton.textContent = '✕';
			closeButton.title = 'Close chat';
			tabElement.appendChild(closeButton);

			// Add to tabs container
			this.tabsContainer?.appendChild(tabElement);

			// Add event listeners
			tabElement.addEventListener('click', (e) => {
				if (e.target !== closeButton) {
					this.viewModel.loadChat(chat.id);
					this.onTabChange();
				}
			});

			closeButton.addEventListener('click', async (e) => {
				e.stopPropagation(); // Prevent triggering tabElement click

				// Confirm deletion
				const result = await this.quickInputService.pick(
					[{ label: 'Cancel' }, { label: 'Close' }],
					{
						placeHolder: `Close chat "${chat.title}"?`
					}
				);

				if (result && result.label === 'Close') {
					await this.viewModel.deleteChat(chat.id);
				}
			});
		});

		// Add new chat tab button
		const newChatTab = document.createElement('div');
		newChatTab.classList.add('dev-sphere-new-chat-tab');
		newChatTab.title = 'Start a new chat';

		// Add plus icon
		const newChatIcon = document.createElement('span');
		newChatIcon.classList.add('dev-sphere-new-chat-tab-icon');
		newChatIcon.textContent = '+';
		newChatTab.appendChild(newChatIcon);

		// Add label
		const newChatLabel = document.createElement('span');
		newChatLabel.textContent = 'New Chat';
		newChatTab.appendChild(newChatLabel);

		newChatTab.addEventListener('click', async () => {
			// Create a new chat if we have a current chat with user messages
			const currentChat = this.viewModel.currentChat;
			const hasUserMessages = currentChat?.messages.some(msg => msg.role === 'user');

			// Force new chat if we have user messages in current chat, otherwise reuse empty chats
			await this.viewModel.createNewChat(hasUserMessages);
			this.onTabChange();
		});

		this.tabsContainer.appendChild(newChatTab);

		// Add scroll event listener to tabs container
		this.setupTabsScrollHandler();
	}

	/**
	 * Sets up scroll handling for the tabs container.
	 *
	 * This adds a scroll event listener to the tabs container if not already added
	 * and updates the initial scroll state classes.
	 */
	private setupTabsScrollHandler(): void {
		if (!this.tabsContainer) {
			return;
		}

		// Handle initial scroll state
		this.updateTabsScrollState();

		// Add scroll event listener if not already added
		if (!this._tabsScrollListenerAdded) {
			this.tabsContainer.addEventListener('scroll', () => {
				this.updateTabsScrollState();
			});
			this._tabsScrollListenerAdded = true;
		}
	}

	/**
	 * Updates the tabs container scroll state classes.
	 *
	 * Adds appropriate CSS classes based on the scroll position:
	 * - 'scroll-start': Scrolled to the beginning
	 * - 'scroll-middle': Scrolled somewhere in the middle
	 * - 'scroll-end': Scrolled to the end
	 *
	 * These classes are used for styling scroll indicators.
	 */
	private updateTabsScrollState(): void {
		if (!this.tabsContainer) {
			return;
		}

		const { scrollLeft, scrollWidth, clientWidth } = this.tabsContainer;

		// Remove all scroll state classes
		this.tabsContainer.classList.remove('scroll-start', 'scroll-middle', 'scroll-end');

		// Determine scroll position
		if (scrollWidth <= clientWidth) {
			// No scroll needed - content fits
			return;
		}

		const atStart = scrollLeft < 10;
		const atEnd = scrollLeft + clientWidth >= scrollWidth - 10;

		if (atStart) {
			this.tabsContainer.classList.add('scroll-start');
		} else if (atEnd) {
			this.tabsContainer.classList.add('scroll-end');
		} else {
			this.tabsContainer.classList.add('scroll-middle');
		}
	}
}
