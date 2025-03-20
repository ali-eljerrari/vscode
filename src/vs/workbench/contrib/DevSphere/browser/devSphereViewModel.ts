/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../../base/common/lifecycle.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { Chat, Message } from './models/types.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IDevSphereService } from './services/devSphereServiceInterface.js';
/**
 * View model for the DevSphere chat interface
 */
export class DevSphereViewModel implements IDisposable {
	// Message and chat management
	private _currentChat: Chat | null = null;
	private _messages: Message[] = [];
	private _allChats: Chat[] = [];
	private _isLoading: boolean = false;
	private _hasError: boolean = false;
	private _lastError: string | null = null;

	// Events
	private readonly _onMessagesChanged = new Emitter<void>();
	private readonly _onChatsChanged = new Emitter<void>();
	private readonly _onCurrentChatChanged = new Emitter<void>();
	private readonly _onLoadingStateChanged = new Emitter<boolean>();
	private readonly _onErrorStateChanged = new Emitter<string | null>();

	// Event accessors
	public readonly onMessagesChanged: Event<void> = this._onMessagesChanged.event;
	public readonly onChatsChanged: Event<void> = this._onChatsChanged.event;
	public readonly onCurrentChatChanged: Event<void> = this._onCurrentChatChanged.event;
	public readonly onLoadingStateChanged: Event<boolean> = this._onLoadingStateChanged.event;
	public readonly onErrorStateChanged: Event<string | null> = this._onErrorStateChanged.event;

	constructor(
		private readonly devSphereService: IDevSphereService,
		private readonly notificationService: INotificationService
	) {
		// Initialize with a default chat
		this.createNewChat();

		// Load saved chats
		this.loadChats();
	}

	/**
	 * Get current messages
	 */
	public get messageList(): Message[] {
		return this._messages;
	}

	/**
	 * Get all chats
	 */
	public get allChats(): Chat[] {
		return this._allChats;
	}

	/**
	 * Get current chat
	 */
	public get currentChat(): Chat | null {
		return this._currentChat;
	}

	/**
	 * Get loading state
	 */
	public get isLoading(): boolean {
		return this._isLoading;
	}

	/**
	 * Get error state
	 */
	public get hasError(): boolean {
		return this._hasError;
	}

	/**
	 * Get last error message
	 */
	public get lastError(): string | null {
		return this._lastError;
	}

	/**
	 * Set loading state
	 */
	private setLoading(isLoading: boolean): void {
		if (this._isLoading !== isLoading) {
			this._isLoading = isLoading;
			this._onLoadingStateChanged.fire(isLoading);
		}
	}

	/**
	 * Set error state
	 */
	private setError(error: string | null): void {
		this._hasError = !!error;
		this._lastError = error;
		this._onErrorStateChanged.fire(error);
	}

	/**
	 * Load all chats from storage
	 */
	public async loadChats(): Promise<void> {
		try {
			const chats = await this.devSphereService.getAllChats();
			this._allChats = chats.sort((a, b) => b.lastModified - a.lastModified); // Sort newest first
			this._onChatsChanged.fire();
		} catch (error) {
			console.error('Error loading chats', error);
			this.notificationService.error('Failed to load chat history.');
		}
	}

	/**
	 * Add user message and get AI response
	 */
	public async sendMessage(content: string): Promise<void> {
		if (!content.trim() || this._isLoading) {
			return;
		}

		try {
			// Reset error state
			this.setError(null);

			// Create current chat if needed
			if (!this._currentChat) {
				this.createNewChat();
			}

			// Create user message
			const userMessage: Message = {
				id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
				role: 'user',
				content,
				timestamp: Date.now()
			};

			// Add user message
			this._messages.push(userMessage);
			this._onMessagesChanged.fire();

			// Create loading message
			const loadingMessage: Message = {
				id: `loading-${Date.now()}`,
				role: 'loading',
				content: 'Generating response...',
				timestamp: Date.now()
			};

			// Add loading message
			this._messages.push(loadingMessage);
			this._onMessagesChanged.fire();

			// Set loading state
			this.setLoading(true);

			// Save chat with user message
			if (this._currentChat) {
				this._currentChat.messages = this._messages.filter(m => m.role !== 'loading');
				await this.devSphereService.saveChat(this._currentChat);
				this._onChatsChanged.fire();
			}

			// Get AI response
			const response = await this.devSphereService.fetchAIResponse(content);

			// Remove loading message
			this._messages = this._messages.filter(m => m.role !== 'loading');

			// Check if response is an error message (starts with "**Error")
			const isErrorResponse = response.startsWith('**Error');

			// Create assistant message
			const assistantMessage: Message = {
				id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
				role: isErrorResponse ? 'system' : 'assistant',
				content: response,
				timestamp: Date.now()
			};

			// Add assistant message
			this._messages.push(assistantMessage);
			this._onMessagesChanged.fire();

			// Set error state if this was an error
			if (isErrorResponse) {
				this.setError(response);
			}

			// Save chat with AI response
			if (this._currentChat) {
				this._currentChat.messages = this._messages;
				await this.devSphereService.saveChat(this._currentChat);
				this._onChatsChanged.fire();
			}
		} catch (error) {
			// Handle unexpected errors
			console.error('Error sending message', error);

			// Remove loading message
			this._messages = this._messages.filter(m => m.role !== 'loading');

			// Process the error
			let errorMessage = 'An unexpected error occurred while sending your message.';
			if (error instanceof Error) {
				errorMessage = error.message;
			}

			// Add error as system message
			const errorSystemMessage: Message = {
				id: `error-${Date.now()}`,
				role: 'system',
				content: `**Error**: ${errorMessage}`,
				timestamp: Date.now()
			};

			this._messages.push(errorSystemMessage);
			this._onMessagesChanged.fire();

			// Set error state
			this.setError(errorMessage);

			// Save chat with error message
			if (this._currentChat) {
				this._currentChat.messages = this._messages;
				await this.devSphereService.saveChat(this._currentChat);
				this._onChatsChanged.fire();
			}
		} finally {
			// Reset loading state
			this.setLoading(false);
		}
	}

	/**
	 * Add a system message to the chat
	 */
	public addSystemMessage(content: string): void {
		const systemMessage: Message = {
			id: `system-${Date.now()}`,
			role: 'system',
			content,
			timestamp: Date.now()
		};

		this._messages.push(systemMessage);
		this._onMessagesChanged.fire();

		// Save chat with system message
		if (this._currentChat) {
			this._currentChat.messages = this._messages;
			this.devSphereService.saveChat(this._currentChat).catch(err => {
				console.error('Error saving chat after adding system message', err);
			});
		}
	}

	/**
	 * Checks if there's already an empty chat that can be reused
	 * @returns The empty chat if found, otherwise null
	 */
	public hasEmptyChat(): Chat | null {
		// First check for completely empty chats
		const emptyChat = this._allChats.find(chat => chat.messages.length === 0);
		if (emptyChat) {
			return emptyChat;
		}

		// Then check if current chat only has system messages (no user interaction yet)
		if (this._currentChat) {
			const onlySystemMessages = this._currentChat.messages.every(msg => msg.role === 'system');
			if (onlySystemMessages) {
				return this._currentChat;
			}
		}

		return null;
	}

	/**
	 * Create a new chat or reuse an empty one
	 * @param force If true, always creates a new chat even if an empty one exists
	 * @returns Promise that resolves when the chat is created and saved
	 */
	public async createNewChat(force: boolean = false): Promise<void> {
		// Check if there's an empty chat we can reuse
		const emptyChat = this.hasEmptyChat();

		if (!force && emptyChat) {
			// Reuse the empty chat
			this._currentChat = emptyChat;
			this._messages = emptyChat.messages || [];
			this._onCurrentChatChanged.fire();
			this._onMessagesChanged.fire();

			// Save the reused empty chat to ensure it's persisted properly
			try {
				await this.devSphereService.saveChat(emptyChat);
			} catch (err) {
				console.error('Error saving reused empty chat', err);
			}

			// Reset error state
			this.setError(null);
			return;
		}

		// Create a new chat
		const newChat = this.devSphereService.createNewChat();

		// Set as current chat
		this._currentChat = newChat;
		this._messages = [];
		this._onCurrentChatChanged.fire();
		this._onMessagesChanged.fire();

		// Add to all chats
		this._allChats.unshift(newChat);
		this._onChatsChanged.fire();

		// Save the new chat
		try {
			await this.devSphereService.saveChat(newChat);
		} catch (err) {
			console.error('Error saving new chat', err);
		}

		// Reset error state
		this.setError(null);
	}

	/**
	 * Clear all messages in the current chat
	 */
	public clearMessages(): void {
		this._messages = [];
		this._onMessagesChanged.fire();

		// Update current chat
		if (this._currentChat) {
			this._currentChat.messages = [];
			this.devSphereService.saveChat(this._currentChat).catch(err => {
				console.error('Error saving chat after clearing messages', err);
			});
		}

		// Reset error state
		this.setError(null);
	}

	/**
	 * Load a specific chat by ID
	 */
	public async loadChat(chatId: string): Promise<void> {
		try {
			const chat = await this.devSphereService.loadChat(chatId);
			if (chat) {
				this._currentChat = chat;
				this._messages = [...chat.messages];
				this._onCurrentChatChanged.fire();
				this._onMessagesChanged.fire();

				// Reset error state
				this.setError(null);
			}
		} catch (error) {
			console.error('Error loading chat', error);
			this.notificationService.error('Failed to load chat.');
		}
	}

	/**
	 * Delete a chat by ID
	 */
	public async deleteChat(chatId: string): Promise<void> {
		try {
			await this.devSphereService.deleteChat(chatId);

			// Remove from all chats
			this._allChats = this._allChats.filter(chat => chat.id !== chatId);
			this._onChatsChanged.fire();

			// If the deleted chat was the current chat, create a new one
			if (this._currentChat && this._currentChat.id === chatId) {
				this.createNewChat();
			}
		} catch (error) {
			console.error('Error deleting chat', error);
			this.notificationService.error('Failed to delete chat.');
		}
	}

	/**
	 * Retry the last failed message
	 */
	public async retryLastMessage(): Promise<void> {
		// If there are no messages or no last user message, do nothing
		if (!this._messages.length) {
			return;
		}

		// Find the last user message
		let lastUserMessageIndex = -1;
		for (let i = this._messages.length - 1; i >= 0; i--) {
			if (this._messages[i].role === 'user') {
				lastUserMessageIndex = i;
				break;
			}
		}

		if (lastUserMessageIndex === -1) {
			return;
		}

		// Get the user message content
		const userMessageContent = this._messages[lastUserMessageIndex].content;

		// Remove all messages after the last user message (including any error messages)
		this._messages = this._messages.slice(0, lastUserMessageIndex + 1);

		// Reset error state
		this.setError(null);

		// Set loading state
		this.setLoading(true);

		// Emit event to update UI
		this._onMessagesChanged.fire();

		// Re-send the last user message
		await this.sendMessage(userMessageContent);
	}

	/**
	 * Clean up resources
	 */
	public dispose(): void {
		this._onMessagesChanged.dispose();
		this._onChatsChanged.dispose();
		this._onCurrentChatChanged.dispose();
		this._onLoadingStateChanged.dispose();
		this._onErrorStateChanged.dispose();
	}
}
