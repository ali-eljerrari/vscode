/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DevSphereViewModel } from '../devSphereViewModel.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import * as DOM from '../../../../../base/browser/dom.js';
import { Message } from '../models/types.js';

export class DevSphereMessages extends Disposable {
	private messagesContainer: HTMLElement;
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

		// Check for scrollable code blocks
		this.updateCodeBlocksScrollState();

		// If previously at bottom, scroll to bottom again
		if (wasScrolledToBottom) {
			this.scrollToBottom();
		}

		// Update scrollable class
		this.updateScrollableClass();
	}

	/**
	 * Updates the scrollable state of code blocks
	 */
	private updateCodeBlocksScrollState(): void {
		// Find all pre elements
		const preElements = this.messagesContainer.querySelectorAll('pre');

		// Check each pre element
		preElements.forEach(pre => {
			// Add code-wrap class to enable word wrapping
			pre.classList.add('code-wrap');

			// Set appropriate max-height to avoid excessive vertical growth
			const codeContent = pre.querySelector('code');
			if (codeContent) {
				const lineCount = codeContent.querySelectorAll('span').length;
				// Limit very tall code blocks (more than 20 lines)
				if (lineCount > 20) {
					pre.classList.add('scrollable-y');
				}
			}

			// Check only for vertical scrollability
			if (pre.scrollHeight > pre.clientHeight) {
				pre.classList.add('scrollable-y');
			} else {
				pre.classList.remove('scrollable-y');
			}
		});
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
					// Check if it's an error message
					if (message.content.startsWith('**Error')) {
						roleLabel = 'Error';
						messageElement.classList.add('dev-sphere-message-error');
					} else {
						roleLabel = 'System';
					}
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

		// Add retry button for error messages
		if (message.role === 'system' && message.content.startsWith('**Error')) {
			// Create a try again button for error messages
			const retryButton = document.createElement('button');
			retryButton.className = 'dev-sphere-retry-button';
			DOM.safeInnerHtml(retryButton, '<span>Retry</span>');
			retryButton.addEventListener('click', () => {
				// Call the retry method on the view model
				this.viewModel.retryLastMessage();
			});

			content.appendChild(retryButton);
		}

		// Use renderMarkdown to get the content
		const htmlContent = `
			<div class="dev-sphere-message-content-container">
				<div class="dev-sphere-message-role">
					${message.role === 'user' ? 'You' : message.role === 'system' ? 'System' : 'AI Assistant'}
				</div>
				<div class="dev-sphere-message-text">
					${this.renderMarkdown(message.content)}
				</div>
			</div>
		`;

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

		// Also apply appropriate scrollable classes to code blocks
		this.updateCodeBlocksScrollState();
	}

	// Simple markdown renderer - would be replaced with a proper markdown formatting module
	private renderMarkdown(text: string): string {
		// A more advanced placeholder implementation with code block handling
		let formattedText = text.replace(/\n/g, '<br/>');

		// Process code blocks with triple backticks
		formattedText = formattedText.replace(/```(.*?)<br\/>(.*?)<br\/>```/gs, (match, language, codeContent) => {
			// Split the code into lines
			const lines = codeContent.split('<br/>');
			let codeWithLines = '';

			// Wrap each line with a span to enable line numbering via CSS
			lines.forEach((line: string) => {
				// Escape HTML to prevent rendering issues
				const escapedLine = this.escapeHTML(line);
				codeWithLines += `<span>${escapedLine}</span>\n`;
			});

			// Determine language class if specified
			const langClass = language ? ` class="language-${language.trim()}"` : '';

			// Create unique ID for this code block
			const blockId = `code-block-${Math.random().toString(36).substring(2, 9)}`;

			// Ensure copy functionality is initialized only once
			if (!this.hasCopyHandlersAdded) {
				this.initializeCopyFunctionality();
			}

			// Return the formatted code block with copy button and language indicator
			return `<pre id="${blockId}"><code${langClass}>${codeWithLines}</code></pre>`;
		});

		return formattedText;
	}

	// Track if we've added the event handlers
	private hasCopyHandlersAdded: boolean = false;

	/**
	 * Initialize copy button functionality using DOM events instead of script injection
	 */
	private initializeCopyFunctionality(): void {
		// Use event delegation for efficiency
		this.messagesContainer.addEventListener('click', (e) => {
			const target = e.target as HTMLElement;

			// Find the clicked button or its ancestor
			const copyButton = target.closest('.dev-sphere-copy-button') as HTMLButtonElement | null;

			if (copyButton) {
				e.preventDefault();
				e.stopPropagation();

				// Get content from data attribute
				const content = copyButton.getAttribute('data-code-content') || '';

				// Copy to clipboard
				navigator.clipboard.writeText(content).then(() => {
					// Show copied state
					copyButton.classList.add('copied');

					// Store original SVG
					const originalSvg = copyButton.innerHTML;

					// Show checkmark
					DOM.safeInnerHtml(copyButton, '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>');

					// Reset after 2 seconds
					setTimeout(() => {
						copyButton.classList.remove('copied');
						DOM.safeInnerHtml(copyButton, originalSvg);
					}, 2000);
				}).catch(() => {
					// Handle errors silently
				});
			}
		});

		// Add scrollability detection for code blocks
		this.messagesContainer.addEventListener('DOMNodeInserted', (e) => {
			if (DOM.isHTMLElement(e.target)) {
				// Check for pre elements
				const preElements = e.target.tagName === 'PRE' ? [e.target] :
					Array.from(e.target.querySelectorAll('pre'));

				if (preElements.length > 0) {
					// Use setTimeout to wait for content to render properly
					setTimeout(() => {
						preElements.forEach(pre => {
							// Add word-wrap class to enable wrapping on x-axis instead of scrolling
							pre.classList.add('code-wrap');

							// Set appropriate max-height to avoid excessive vertical growth
							const codeContent = pre.querySelector('code');
							if (codeContent) {
								const lineCount = codeContent.querySelectorAll('span').length;
								// Limit very tall code blocks (more than 20 lines)
								if (lineCount > 20) {
									pre.classList.add('scrollable-y');
								}
							}

							// Check for vertical overflow
							if (pre.scrollHeight > pre.clientHeight) {
								pre.classList.add('scrollable-y');
							}
						});
					}, 100);
				}
			}
		});

		this.hasCopyHandlersAdded = true;
	}

	/**
	 * Helper to escape HTML special characters
	 */
	private escapeHTML(text: string): string {
		return text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}
}
