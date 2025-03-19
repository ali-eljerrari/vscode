/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DevSphereViewModel } from '../devSphereViewModel.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import * as DOM from '../../../../../base/browser/dom.js';
import { Message } from '../devSphereService.js';

export class DevSphereMessages extends Disposable {
	private messagesContainer: HTMLElement;
	private scrollButton: HTMLButtonElement;
	private resizeObserver: ResizeObserver;

	constructor(
		private readonly container: HTMLElement,
		private readonly viewModel: DevSphereViewModel
	) {
		super();

		// Create messages container
		this.messagesContainer = document.createElement('div');
		this.messagesContainer.className = 'dev-sphere-messages';
		this.container.appendChild(this.messagesContainer);

		// Add scroll-to-bottom button
		this.scrollButton = this.createScrollToBottomButton();
		this.container.appendChild(this.scrollButton);

		// Add scroll event listener to messages container
		this.messagesContainer.addEventListener('scroll', () => {
			this.updateScrollButtonVisibility();
		});

		// Create resize observer to handle content changes
		this.resizeObserver = new ResizeObserver(() => {
			this.updateScrollableClass();
		});
		this.resizeObserver.observe(this.messagesContainer);

		// Register cleanup when disposed
		this._register({
			dispose: () => {
				this.resizeObserver.disconnect();
			}
		});
	}

	/**
	 * Updates the messages displayed in the container
	 */
	public updateMessages(): void {
		if (!this.messagesContainer) {
			return;
		}

		// Remember if we were scrolled to the bottom
		const wasScrolledToBottom = this.isScrolledToBottom();

		// Clear existing messages safely
		DOM.safeInnerHtml(this.messagesContainer, '');

		// Check if we have messages
		if (this.viewModel.messageList.length === 0) {
			this.renderEmptyState();
			return;
		}

		let lastMessageRole: string | null = null;
		let currentMessageGroup: HTMLElement | null = null;

		// Render each message
		this.viewModel.messageList.forEach(message => {
			// Handle loading messages specially
			if (message.role === 'loading') {
				const loadingElement = this.renderLoadingMessage(message);
				this.messagesContainer.appendChild(loadingElement);
				return;
			}

			// Check if we need a new message group
			if (message.role !== lastMessageRole) {
				// Create a new message group
				currentMessageGroup = document.createElement('div');
				currentMessageGroup.className = `dev-sphere-message-group dev-sphere-message-group-${message.role}`;
				this.messagesContainer.appendChild(currentMessageGroup);
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
	}

	/**
	 * Creates and returns the scroll-to-bottom button
	 */
	private createScrollToBottomButton(): HTMLButtonElement {
		const scrollButton = document.createElement('button');
		scrollButton.className = 'dev-sphere-scroll-button';
		scrollButton.title = 'Scroll to bottom';

		const buttonHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        `;
		DOM.safeInnerHtml(scrollButton, buttonHTML);

		// Add click event
		scrollButton.addEventListener('click', () => {
			this.scrollToBottom();
		});

		return scrollButton;
	}

	/**
	 * Renders the empty state when no messages exist
	 */
	private renderEmptyState(): void {
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
	}

	/**
	 * Renders a single message element
	 */
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

	/**
	 * Renders the loading message indicator
	 */
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

	/**
	 * Updates the loading state of messages
	 */
	public updateLoadingState(isLoading: boolean): void {
		// Find the loading message if there is one
		const loadingElements = this.messagesContainer.querySelectorAll('.dev-sphere-message-loading') || [];

		if (loadingElements.length > 0) {
			// If we're no longer loading, remove loading elements
			if (!isLoading) {
				loadingElements.forEach(element => {
					element.remove();
				});
			}
		}
	}

	/**
	 * Scrolls the messages container to the bottom
	 */
	private scrollToBottom(): void {
		this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
		this.updateScrollableClass();
		this.updateScrollButtonVisibility();
	}

	/**
	 * Checks if the messages container is scrolled to the bottom
	 */
	private isScrolledToBottom(): boolean {
		const scrollPosition = this.messagesContainer.scrollTop + this.messagesContainer.clientHeight;
		const scrollHeight = this.messagesContainer.scrollHeight;
		// Consider "scrolled to bottom" if within 50px of actual bottom
		return scrollHeight - scrollPosition < 50;
	}

	/**
	 * Updates the visibility of the scroll to bottom button
	 */
	private updateScrollButtonVisibility(): void {
		// Show button if not at the bottom
		const scrollBottom = Math.abs(
			(this.messagesContainer.scrollHeight - this.messagesContainer.scrollTop) -
			this.messagesContainer.clientHeight
		);

		const isAtBottom = scrollBottom < 50; // Within 50px of bottom

		if (isAtBottom) {
			this.scrollButton.classList.remove('visible');
		} else {
			this.scrollButton.classList.add('visible');
		}
	}

	/**
	 * Updates the scrollable class based on content overflow
	 */
	private updateScrollableClass(): void {
		// Check if content is scrollable
		const isScrollable = this.messagesContainer.scrollHeight > this.messagesContainer.clientHeight;

		// Update class accordingly
		if (isScrollable) {
			this.messagesContainer.classList.add('scrollable');
		} else {
			this.messagesContainer.classList.remove('scrollable');
		}
	}

	// Simple markdown renderer - would be replaced with a proper markdown formatting module
	private renderMarkdown(text: string): string {
		// A simple placeholder implementation
		return text.replace(/\n/g, '<br/>');
	}
}
