/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IViewPaneOptions, ViewPane } from '../../../browser/parts/views/viewPane.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IDevSphereService, Message } from './devSphereService.js';
import { DevSphereViewModel } from './devSphereViewModel.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import * as DOM from '../../../../base/browser/dom.js';

export class DevSphereView extends ViewPane {
	static readonly ID = 'devSphereView';

	private container: HTMLElement | undefined;
	private messagesContainer: HTMLElement | undefined;
	private inputElement: HTMLTextAreaElement | undefined;
	private viewModel: DevSphereViewModel;
	private chatListContainer: HTMLDivElement | undefined;
	private tabsContainer: HTMLDivElement | undefined;
	private chatSelectorDialog: HTMLDivElement | undefined;
	private dialogOverlay: HTMLDivElement | undefined;
	private _tabsScrollListenerAdded = false;

	constructor(
		options: IViewPaneOptions,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IOpenerService openerService: IOpenerService,
		@IThemeService themeService: IThemeService,
		@IHoverService hoverService: IHoverService,
		@IDevSphereService private readonly devSphereService: IDevSphereService,
		@INotificationService private readonly notificationService: INotificationService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);

		// Create the view model
		this.viewModel = new DevSphereViewModel(this.devSphereService, this.notificationService);
		this._register(this.viewModel);

		this._register(this.viewModel.onMessagesChanged(() => {
			this.updateMessages();
		}));

		this._register(this.viewModel.onLoadingStateChanged((isLoading) => {
			this.updateLoadingState(isLoading);
		}));

		// Register event listeners for chat management
		this._register(this.viewModel.onChatsChanged(() => {
			this.updateChatTabs();
			this.updateChatSelectorList();
		}));

		this._register(this.viewModel.onCurrentChatChanged(() => {
			this.updateChatTabs();
			this.updateChatSelectorList();
		}));
	}

	protected override renderBody(container: HTMLElement): void {
		this.container = container;

		// Add CSS class to the container
		container.classList.add('dev-sphere-container');

		// Create the tabs container
		this.tabsContainer = document.createElement('div');
		this.tabsContainer.classList.add('dev-sphere-tabs-container');
		container.appendChild(this.tabsContainer);

		// Create the main content area
		const mainContent = document.createElement('div');
		mainContent.classList.add('dev-sphere-main-content');
		container.appendChild(mainContent);

		// Add header and messages container to main content
		const header = this.createHeaderSection();
		mainContent.appendChild(header);

		this.messagesContainer = document.createElement('div');
		this.messagesContainer.className = 'dev-sphere-messages';
		mainContent.appendChild(this.messagesContainer);

		// Add scroll-to-bottom button
		this.addScrollToBottomButton(mainContent);

		const inputSection = this.createInputSection();
		mainContent.appendChild(inputSection);

		// Create the chat selector dialog
		this.createChatSelectorDialog();

		// Add keyboard shortcuts
		this.addKeyboardShortcuts();

		// Add resize observer to handle scrollable class
		this.addResizeObserver();

		// Update initial messages and chat tabs
		this.updateMessages();
		this.updateChatTabs();
	}

	/**
	 * Add keyboard shortcuts for common actions
	 */
	private addKeyboardShortcuts(): void {
		// Listen for keyboard shortcuts on the container
		this.container?.addEventListener('keydown', (e) => {
			// Ctrl/Cmd+N for new chat
			if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
				e.preventDefault();
				this.viewModel.createNewChat();
			}

			// Ctrl/Cmd+O to open chat selector
			if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
				e.preventDefault();
				this.showChatSelector();
			}

			// Escape to close dialogs
			if (e.key === 'Escape') {
				this.hideChatSelector();
			}
		});
	}

	/**
	 * Creates the tabbed interface for chat switching
	 */
	private updateChatTabs(): void {
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
					this.viewModel.switchToChat(chat.id);
					this.focusInput();
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
			await this.viewModel.createNewChat();
			this.focusInput();
		});

		this.tabsContainer.appendChild(newChatTab);

		// Add scroll event listener to tabs container
		this.setupTabsScrollHandler();
	}

	/**
	 * Sets up scroll handling for the tabs container
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
	 * Updates the tabs container scroll state classes
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

	/**
	 * Creates the chat selector dialog
	 */
	private createChatSelectorDialog(): void {
		// Create dialog overlay
		this.dialogOverlay = document.createElement('div');
		this.dialogOverlay.classList.add('dev-sphere-dialog-overlay');
		this.container?.appendChild(this.dialogOverlay);

		// Create chat selector dialog
		this.chatSelectorDialog = document.createElement('div');
		this.chatSelectorDialog.classList.add('dev-sphere-chat-selector');
		this.container?.appendChild(this.chatSelectorDialog);

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
	private showChatSelector(): void {
		this.chatSelectorDialog?.classList.add('show');
		this.dialogOverlay?.classList.add('show');

		// Focus search input
		const searchInput = this.chatSelectorDialog?.querySelector('input');
		if (searchInput) {
			searchInput.focus();
		}
	}

	/**
	 * Hides the chat selector dialog
	 */
	private hideChatSelector(): void {
		this.chatSelectorDialog?.classList.remove('show');
		this.dialogOverlay?.classList.remove('show');
	}

	/**
	 * Filters the chat list based on search input
	 */
	private filterChatList(searchTerm: string): void {
		const chatItems = this.chatListContainer?.querySelectorAll('.dev-sphere-chat-item');
		if (!chatItems) {
			return;
		}

		const term = searchTerm.toLowerCase();

		chatItems.forEach(item => {
			const title = item.querySelector('.dev-sphere-chat-title')?.textContent?.toLowerCase() || '';
			if (title.includes(term)) {
				(item as HTMLElement).style.display = 'flex';
			} else {
				(item as HTMLElement).style.display = 'none';
			}
		});
	}

	/**
	 * Updates the chat selector list
	 */
	private updateChatSelectorList(): void {
		if (!this.chatListContainer) {
			return;
		}

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
			this.chatListContainer?.appendChild(chatItem);

			// Add event listeners
			chatItem.addEventListener('click', (e) => {
				const target = e.target as Node;
				// Only handle clicks on the item itself or the title, not on action buttons
				if (e.target === chatItem || e.target === chatTitle || (chatItem.contains(target) && !actionButtons.contains(target))) {
					this.viewModel.switchToChat(chat.id);
					this.hideChatSelector();
					this.focusInput();
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

	private createHeaderSection(): HTMLElement {
		const header = document.createElement('div');
		header.className = 'dev-sphere-header';

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
		header.appendChild(headerLeft);

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
			this.showChatSelector();
		});
		headerActions.appendChild(browseButton);

		// Clear chat button
		const clearButton = document.createElement('button');
		clearButton.className = 'dev-sphere-action-button';
		clearButton.textContent = 'Clear Chat';
		clearButton.title = 'Clear current chat';
		clearButton.addEventListener('click', () => {
			this.viewModel.clearMessages();
			this.focusInput();
		});
		headerActions.appendChild(clearButton);

		header.appendChild(headerActions);

		return header;
	}

	/**
	 * Adds a system message indicating the model has been changed
	 */
	public addModelChangeMessage(modelId: string): void {
		const model = this.devSphereService.getAvailableModels().find(m => m.id === modelId);
		if (model) {
			this.viewModel.addSystemMessage(`Model changed to **${model.name}** (${model.description})`);
		}
	}

	private createInputSection(): HTMLElement {
		const inputSection = document.createElement('div');
		inputSection.className = 'dev-sphere-input-section';

		// Create a container for the input and button for better styling
		const inputContainer = document.createElement('div');
		inputContainer.className = 'dev-sphere-input-container';
		inputSection.appendChild(inputContainer);

		// Create the input text field
		this.inputElement = document.createElement('textarea');
		this.inputElement.className = 'dev-sphere-input';
		this.inputElement.placeholder = 'Ask a question or type / for commands...';
		this.inputElement.rows = 1;
		this.inputElement.spellcheck = false;

		// Add event listener for Enter key
		this.inputElement.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault();
				this.sendMessage();
			}
		});

		// Auto-resize input as content grows
		this.inputElement.addEventListener('input', () => {
			this.inputElement!.style.height = 'auto';
			this.inputElement!.style.height = `${Math.min(this.inputElement!.scrollHeight, 200)}px`;
		});

		inputContainer.appendChild(this.inputElement);

		// Create the submit button
		const submitButton = document.createElement('button');
		submitButton.className = 'dev-sphere-submit-button';
		submitButton.textContent = 'Send';
		submitButton.title = 'Send message (Enter)';

		// Add event listener for button click
		submitButton.addEventListener('click', () => {
			this.sendMessage();
		});

		inputContainer.appendChild(submitButton);

		return inputSection;
	}

	private isScrolledToBottom(): boolean {
		if (!this.messagesContainer) {
			return true;
		}

		const scrollPosition = this.messagesContainer.scrollTop + this.messagesContainer.clientHeight;
		const scrollHeight = this.messagesContainer.scrollHeight;

		// Consider "scrolled to bottom" if within 50px of actual bottom
		return scrollHeight - scrollPosition < 50;
	}

	private renderMessage(message: Message, showHeader: boolean): HTMLElement {
		const messageElement = document.createElement('div');
		messageElement.className = `dev-sphere-message dev-sphere-message-${message.role}`;

		if (showHeader) {
			// Add the role header (only for the first message in a group)
			const header = document.createElement('div');
			header.className = 'dev-sphere-message-header';

			let roleLabel = '';
			switch (message.role) {
				case 'user':
					roleLabel = 'You';
					break;
				case 'assistant':
					roleLabel = 'AI Assistant';
					break;
				case 'system':
					roleLabel = 'System';
					break;
				default:
					roleLabel = message.role.charAt(0).toUpperCase() + message.role.slice(1);
			}

			const badge = document.createElement('span');
			badge.className = 'dev-sphere-message-role-badge';
			badge.textContent = roleLabel;
			header.appendChild(badge);

			messageElement.appendChild(header);
		}

		// Message content with Markdown formatting
		const content = document.createElement('div');
		content.className = 'dev-sphere-message-content';

		// Use renderMarkdown to get the content
		const htmlContent = this.renderMarkdown(message.content);
		DOM.safeInnerHtml(content, htmlContent);

		messageElement.appendChild(content);

		return messageElement;
	}

	// Update renderMarkdown method for simplicity
	private renderMarkdown(text: string): string {
		// A simple placeholder implementation
		return text.replace(/\n/g, '<br/>');
	}

	private scrollToBottom(): void {
		if (this.messagesContainer) {
			this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;

			// Update scrollable class after scrolling
			this.updateScrollableClass();

			// Update scroll button visibility
			const scrollButton = this.container?.querySelector('.dev-sphere-scroll-button');
			if (DOM.isHTMLElement(scrollButton)) {
				this.updateScrollButtonVisibility(scrollButton);
			}
		}
	}

	// Method to focus the input
	private focusInput(): void {
		if (this.inputElement) {
			this.inputElement.focus();
		}
	}

	// Override the setVisible method to focus the input when the view becomes visible
	override setVisible(visible: boolean): void {
		super.setVisible(visible);
		if (visible) {
			// Focus the input when the view becomes visible
			setTimeout(() => this.focusInput(), 100);
		}
	}

	// Method to explicitly set or update the API key
	public async updateAPIKey(): Promise<void> {
		await this.devSphereService.updateAPIKey();
	}

	// Method to clear all messages
	public clearChat(): void {
		this.viewModel.clearMessages();
	}

	private updateLoadingState(isLoading: boolean): void {
		// Find the loading message if there is one
		const loadingElements = this.messagesContainer?.querySelectorAll('.dev-sphere-message-loading') || [];

		if (loadingElements.length > 0) {
			// If we're no longer loading, remove loading elements
			if (!isLoading) {
				loadingElements.forEach(element => {
					element.remove();
				});
			}
		}

		// Update input state based on loading
		const inputElement = this.container?.querySelector('.dev-sphere-input') as HTMLTextAreaElement | null;
		if (inputElement) {
			inputElement.disabled = isLoading;
		}

		const submitButton = this.container?.querySelector('.dev-sphere-submit-button') as HTMLButtonElement | null;
		if (submitButton) {
			submitButton.disabled = isLoading;
		}
	}

	private updateMessages(): void {
		if (!this.messagesContainer) {
			return;
		}

		// Remember if we were scrolled to the bottom
		const wasScrolledToBottom = this.isScrolledToBottom();

		// Clear existing messages safely
		DOM.safeInnerHtml(this.messagesContainer, '');

		// Check if we have messages
		if (this.viewModel.messageList.length === 0) {
			// Add custom empty state
			const emptyState = document.createElement('div');
			emptyState.className = 'dev-sphere-empty-state';

			const emptyStateHTML = `
				<div class="dev-sphere-empty-state-icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="10"></circle>
						<path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
						<line x1="9" y1="9" x2="9.01" y2="9"></line>
						<line x1="15" y1="9" x2="15.01" y2="9"></line>
					</svg>
				</div>
				<div class="dev-sphere-empty-state-title">Start a conversation with DevSphere</div>
				<div class="dev-sphere-empty-state-subtitle">Ask a question, get code explanations, or request assistance with your project</div>
				<div class="dev-sphere-empty-state-shortcuts">
					<div class="dev-sphere-shortcut"><span class="dev-sphere-shortcut-key">Ctrl+N</span> New Chat</div>
					<div class="dev-sphere-shortcut"><span class="dev-sphere-shortcut-key">Ctrl+O</span> Browse Chats</div>
				</div>
			`;
			DOM.safeInnerHtml(emptyState, emptyStateHTML);

			this.messagesContainer.appendChild(emptyState);

			// Remove scrollable class as we have no content
			this.messagesContainer.classList.remove('scrollable');
			return;
		}

		let lastMessageRole: string | null = null;
		let currentMessageGroup: HTMLElement | null = null;

		// Render each message
		this.viewModel.messageList.forEach(message => {
			// Handle loading messages specially
			if (message.role === 'loading') {
				const loadingElement = this.renderLoadingMessage(message);
				this.messagesContainer?.appendChild(loadingElement);
				return;
			}

			// Check if we need a new message group
			if (message.role !== lastMessageRole) {
				// Create a new message group
				currentMessageGroup = document.createElement('div');
				currentMessageGroup.className = `dev-sphere-message-group dev-sphere-message-group-${message.role}`;
				if (this.messagesContainer) {
					this.messagesContainer.appendChild(currentMessageGroup);
				}
				lastMessageRole = message.role;
			}

			// Render the message into the current group
			if (currentMessageGroup) {
				const messageElement = this.renderMessage(message, message.role !== lastMessageRole);
				currentMessageGroup.appendChild(messageElement);
			}
		});

		// If previously at bottom, scroll to bottom again
		if (wasScrolledToBottom) {
			this.scrollToBottom();
		}

		// Update scrollable class
		this.updateScrollableClass();

		// Focus the input if we're not loading
		if (!this.viewModel.isLoading) {
			this.focusInput();
		}
	}

	/**
	 * Updates the scrollable class based on content overflow
	 */
	private updateScrollableClass(): void {
		if (!this.messagesContainer) {
			return;
		}

		// Check if content is scrollable
		const isScrollable = this.messagesContainer.scrollHeight > this.messagesContainer.clientHeight;

		// Update class accordingly
		if (isScrollable) {
			this.messagesContainer.classList.add('scrollable');
		} else {
			this.messagesContainer.classList.remove('scrollable');
		}
	}

	// Update renderLoadingMessage method to handle TrustedHTML correctly
	private renderLoadingMessage(message: Message): HTMLElement {
		const element = document.createElement('div');
		element.className = 'dev-sphere-message dev-sphere-message-loading';

		const loadingIndicator = document.createElement('div');
		loadingIndicator.className = 'dev-sphere-loading-indicator';

		const dotsHtml = `
			<div class="dev-sphere-loading-dots">
				<div class="dev-sphere-loading-dot"></div>
				<div class="dev-sphere-loading-dot"></div>
				<div class="dev-sphere-loading-dot"></div>
			</div>
		`;
		DOM.safeInnerHtml(loadingIndicator, dotsHtml);

		element.appendChild(loadingIndicator);
		return element;
	}

	// Add the sendMessage method
	private sendMessage(): void {
		if (!this.inputElement) {
			return;
		}

		const text = this.inputElement.value.trim();
		if (text) {
			this.viewModel.sendMessage(text);
			this.inputElement.value = '';
			// Ensure input regains focus after sending a message
			setTimeout(() => this.focusInput(), 50);
		}
	}

	/**
	 * Adds a resize observer to update scrollable class when container dimensions change
	 */
	private addResizeObserver(): void {
		if (!this.messagesContainer) {
			return;
		}

		// Create a ResizeObserver instance
		const resizeObserver = new ResizeObserver(() => {
			this.updateScrollableClass();
		});

		// Start observing the messages container
		resizeObserver.observe(this.messagesContainer);

		// Clean up when view is disposed
		this._register({
			dispose: () => {
				resizeObserver.disconnect();
			}
		});
	}

	/**
	 * Adds a scroll-to-bottom button
	 */
	private addScrollToBottomButton(container: HTMLElement): void {
		// Create scroll-to-bottom button
		const scrollButton = document.createElement('button');
		scrollButton.className = 'dev-sphere-scroll-button';
		scrollButton.title = 'Scroll to bottom';

		const buttonHTML = `
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<polyline points="6 9 12 15 18 9"></polyline>
			</svg>
		`;
		DOM.safeInnerHtml(scrollButton, buttonHTML);

		container.appendChild(scrollButton);

		// Add click event
		scrollButton.addEventListener('click', () => {
			this.scrollToBottom();
		});

		// Add scroll event listener to messages container to show/hide button
		if (this.messagesContainer) {
			this.messagesContainer.addEventListener('scroll', () => {
				this.updateScrollButtonVisibility(scrollButton);
			});
		}
	}

	/**
	 * Updates scroll button visibility based on scroll position
	 */
	private updateScrollButtonVisibility(button: HTMLElement): void {
		if (!this.messagesContainer) {
			return;
		}

		// Show button if not at the bottom
		const scrollBottom = Math.abs(
			(this.messagesContainer.scrollHeight - this.messagesContainer.scrollTop) -
			this.messagesContainer.clientHeight
		);

		const isAtBottom = scrollBottom < 50; // Within 50px of bottom

		if (isAtBottom) {
			button.classList.remove('visible');
		} else {
			button.classList.add('visible');
		}
	}
}
