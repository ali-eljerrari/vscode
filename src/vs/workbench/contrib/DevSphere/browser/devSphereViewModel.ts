/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * @file DevSphere View Model
 *
 * This module implements the core view model for DevSphere, which serves as the
 * central state management system for the UI. It:
 *
 * 1. Manages chat conversations and messages
 * 2. Handles communication with the AI service
 * 3. Manages loading states and error handling
 * 4. Provides events for UI components to react to state changes
 * 5. Orchestrates chat persistence (loading/saving/creating)
 *
 * The view model acts as a mediator between the UI components and the underlying
 * service layer, abstracting away the complexities of data management.
 */

import { IDisposable } from '../../../../base/common/lifecycle.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { Chat, Message } from './models/types.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IDevSphereService } from './services/devSphereServiceInterface.js';

/**
 * View model for the DevSphere chat interface.
 * Manages the state and business logic for the DevSphere UI components.
 * Provides an API for UI components to interact with the chat functionality
 * and receive updates about state changes.
 */
export class DevSphereViewModel implements IDisposable {
	// Message and chat management
	/** Current active chat conversation */
	private _currentChat: Chat | null = null;

	/** Messages in the current chat */
	private _messages: Message[] = [];

	/** All saved chat conversations */
	private _allChats: Chat[] = [];

	/** Whether a message is currently being processed */
	private _isLoading: boolean = false;

	/** Whether an error has occurred */
	private _hasError: boolean = false;

	/** Last error message, if any */
	private _lastError: string | null = null;

	// Events
	/** Emitter for when messages are added, removed, or updated */
	private readonly _onMessagesChanged = new Emitter<void>();

	/** Emitter for when the list of chats changes */
	private readonly _onChatsChanged = new Emitter<void>();

	/** Emitter for when the current chat is switched */
	private readonly _onCurrentChatChanged = new Emitter<void>();

	/** Emitter for when loading state changes */
	private readonly _onLoadingStateChanged = new Emitter<boolean>();

	/** Emitter for when error state changes */
	private readonly _onErrorStateChanged = new Emitter<string | null>();

	// Event accessors
	/** Event fired when messages are added, removed, or updated */
	public readonly onMessagesChanged: Event<void> = this._onMessagesChanged.event;

	/** Event fired when the list of chats changes */
	public readonly onChatsChanged: Event<void> = this._onChatsChanged.event;

	/** Event fired when the current chat is switched */
	public readonly onCurrentChatChanged: Event<void> = this._onCurrentChatChanged.event;

	/** Event fired when loading state changes */
	public readonly onLoadingStateChanged: Event<boolean> = this._onLoadingStateChanged.event;

	/** Event fired when error state changes */
	public readonly onErrorStateChanged: Event<string | null> = this._onErrorStateChanged.event;

	/**
	 * Creates a new instance of the DevSphere view model.
	 *
	 * @param devSphereService - The service for interacting with AI providers
	 * @param notificationService - The service for displaying notifications to the user
	 */
	constructor(
		private readonly devSphereService: IDevSphereService,
		private readonly notificationService: INotificationService
	) {
		// Initialize with a default chat
		// this.createNewChat();

		// Load saved chats
		this.loadChats();
	}

	/**
	 * Gets the current list of messages.
	 * @returns An array of all messages in the current chat
	 */
	public get messageList(): Message[] {
		return this._messages;
	}

	/**
	 * Gets all available chat conversations.
	 * @returns An array of all chat conversations
	 */
	public get allChats(): Chat[] {
		return this._allChats;
	}

	/**
	 * Gets the current active chat.
	 * @returns The currently active chat or null if no chat is active
	 */
	public get currentChat(): Chat | null {
		return this._currentChat;
	}

	/**
	 * Gets whether a request is currently being processed.
	 * @returns True if a message is being sent or processed, false otherwise
	 */
	public get isLoading(): boolean {
		return this._isLoading;
	}

	/**
	 * Gets whether an error has occurred.
	 * @returns True if an error has occurred, false otherwise
	 */
	public get hasError(): boolean {
		return this._hasError;
	}

	/**
	 * Gets the last error message.
	 * @returns The last error message or null if no error has occurred
	 */
	public get lastError(): string | null {
		return this._lastError;
	}

	/**
	 * Sets the loading state and notifies listeners.
	 * Used to indicate when a message is being processed.
	 *
	 * @param isLoading - Whether a request is currently in progress
	 */
	private setLoading(isLoading: boolean): void {
		if (this._isLoading !== isLoading) {
			this._isLoading = isLoading;
			this._onLoadingStateChanged.fire(isLoading);
		}
	}

	/**
	 * Sets the error state and notifies listeners.
	 *
	 * @param error - The error message or null to clear the error
	 */
	private setError(error: string | null): void {
		this._hasError = !!error;
		this._lastError = error;
		this._onErrorStateChanged.fire(error);
	}

	/**
	 * Loads all saved chats from storage.
	 * Retrieves chats from the service and updates the local state.
	 */
	public async loadChats(): Promise<void> {
		try {
			const chats = await this.devSphereService.getAllChats();
			this._allChats = chats;
			this._onChatsChanged.fire();

			if (chats.length > 0) {
				// Load the first chat
				await this.loadChat(chats[0]?.id ?? '');
			} else {
				// Create a new chat
				await this.createNewChat();
			}
		} catch (error) {
			this.notificationService.error(`Failed to load chats: ${error instanceof Error ? error.message : String(error)}`);
		}
	}

	/**
	 * Sends a user message to the AI and handles the response.
	 * Adds the user message to the chat, sends it to the AI service,
	 * and adds the AI's response when received.
	 *
	 * @param content - The message content to send
	 */
	public async sendMessage(content: string): Promise<void> {
		// Don't allow sending messages while already processing one
		if (this._isLoading) {
			return;
		}

		// Don't allow empty messages
		if (!content.trim()) {
			return;
		}

		// Make sure we have a current chat
		if (!this._currentChat) {
			// await this.createNewChat();
		}

		try {
			// Set loading state
			this.setLoading(true);
			this.setError(null);

			// Add user message to chat
			const userMessage: Message = {
				id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
				role: 'user',
				content,
				timestamp: Date.now()
			};

			// Add message to local state
			this._messages.push(userMessage);
			this._onMessagesChanged.fire();

			// Update current chat with new message
			if (this._currentChat) {
				this._currentChat.messages = [...this._messages];
				this._currentChat.lastModified = Date.now();

				// Save chat with user message
				await this.devSphereService.saveChat(this._currentChat);
				this._onChatsChanged.fire();
			}

			// Add loading message
			const loadingMessage: Message = {
				id: `loading-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
				role: 'loading',
				content: 'Thinking...',
				timestamp: Date.now()
			};

			this._messages.push(loadingMessage);
			this._onMessagesChanged.fire();

			// Send message to API
			const response = await this.devSphereService.fetchAIResponse(content);

			// Remove loading message
			this._messages = this._messages.filter(msg => msg.role !== 'loading');

			// Add response message
			const responseMessage: Message = {
				id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
				role: 'assistant',
				content: response,
				timestamp: Date.now()
			};

			this._messages.push(responseMessage);
			this._onMessagesChanged.fire();

			// Update current chat with response
			if (this._currentChat) {
				this._currentChat.messages = [...this._messages];
				this._currentChat.lastModified = Date.now();

				// Generate a title if this is the first message exchange and no title exists
				if (this._currentChat.messages.length <= 3 && this._currentChat.title === 'New Chat') {
					// Use the first 30 chars of user message as title, or less if it's shorter
					const title = content.length > 30 ? content.substring(0, 30) + '...' : content;
					this._currentChat.title = title;
					this._onCurrentChatChanged.fire();
				}

				// Save chat with response
				await this.devSphereService.saveChat(this._currentChat);
				this._onChatsChanged.fire();
			}
		} catch (error) {
			// Handle errors
			console.error('Error sending message:', error);

			// Remove loading message
			this._messages = this._messages.filter(msg => msg.role !== 'loading');

			// Add error message
			const errorMessage = error instanceof Error ? error.message : String(error);
			this.setError(errorMessage);

			// Show notification
			this.notificationService.error(`Failed to get response: ${errorMessage}`);
		} finally {
			// Clear loading state
			this.setLoading(false);
		}
	}

	/**
	 * Adds a system message to the current chat.
	 * System messages provide information about the system state,
	 * like when the model is changed.
	 *
	 * @param content - The system message content
	 */
	public addSystemMessage(content: string): void {
		// Make sure we have a current chat
		if (!this._currentChat) {
			// this.createNewChat();
			return;
		}

		// Create system message
		const systemMessage: Message = {
			id: `system-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
			role: 'system',
			content,
			timestamp: Date.now()
		};

		// Add message to local state
		this._messages.push(systemMessage);
		this._onMessagesChanged.fire();

		// Update current chat with new message
		if (this._currentChat) {
			this._currentChat.messages = [...this._messages];
			this._currentChat.lastModified = Date.now();

			// Save chat with system message
			this.devSphereService.saveChat(this._currentChat).catch(error => {
				console.error('Failed to save chat with system message:', error);
			});
		}
	}

	/**
	 * Checks if there's an empty chat that can be reused.
	 * Helps prevent creating too many unused empty chats.
	 *
	 * @returns An empty chat if one exists, otherwise null
	 */
	public hasEmptyChat(): Chat | null {
		// Check if current chat is empty
		if (this._currentChat && this._currentChat.messages.length === 0) {
			return this._currentChat;
		}

		// Look for an empty chat in all chats
		for (const chat of this._allChats) {
			if (chat.messages.length === 0) {
				return chat;
			}
		}

		return null;
	}

	/**
	 * Creates a new chat and makes it the current chat.
	 * If there's already an empty chat (current or in history),
	 * it will use that instead of creating a new one.
	 */
	public async createNewChat(): Promise<void> {
		try {
			// If current chat is empty, just return - use current empty chat
			if (this._currentChat && this._currentChat.messages.length === 0) {
				return;
			}

			// Check if we have an empty chat in history
			const emptyChat = this._allChats.find(chat => chat.messages.length === 0);

			// If there's an empty chat in history, load it
			if (emptyChat) {
				// Use the existing empty chat
				this._currentChat = emptyChat;
				this._messages = [];

				// Fire events
				this._onCurrentChatChanged.fire();
				this._onMessagesChanged.fire();

				return;
			}

			// Only create a new chat if no empty chats exist
			const newChat = this.devSphereService.createNewChat();

			// Add to local state
			this._allChats.unshift(newChat);
			this._currentChat = newChat;
			this._messages = [];

			// Fire events
			this._onChatsChanged.fire();
			this._onCurrentChatChanged.fire();
			this._onMessagesChanged.fire();

			// Save the new chat
			await this.devSphereService.saveChat(newChat);
		} catch (error) {
			console.error('Failed to save new chat:', error);
			this.notificationService.error(`Failed to create new chat: ${error instanceof Error ? error.message : String(error)}`);
		}
	}

	/**
	 * Clears all messages in the current chat.
	 * Creates a new chat if no current chat exists.
	 */
	public clearMessages(): void {
		// If no current chat, create a new one
		if (!this._currentChat) {
			// this.createNewChat();
			return;
		}

		// Clear messages in current chat
		this._messages = [];
		this._onMessagesChanged.fire();

		// Update current chat
		if (this._currentChat) {
			this._currentChat.messages = [];
			this._currentChat.lastModified = Date.now();

			// Save chat with cleared messages
			this.devSphereService.saveChat(this._currentChat).catch(error => {
				console.error('Failed to save chat after clearing messages:', error);
			});
		}
	}

	/**
	 * Loads a specific chat by ID and makes it the current chat.
	 *
	 * @param chatId - The ID of the chat to load
	 */
	public async loadChat(chatId: string): Promise<void> {
		try {
			// Load chat from storage
			const chat = await this.devSphereService.loadChat(chatId);

			if (chat) {
				// Update local state
				this._currentChat = chat;
				this._messages = [...chat.messages];

				// Fire events
				this._onCurrentChatChanged.fire();
				this._onMessagesChanged.fire();
			} else {
				throw new Error(`Chat with ID ${chatId} not found`);
			}
		} catch (error) {
			console.error(`Failed to load chat ${chatId}:`, error);
			this.notificationService.error(`Failed to load chat: ${error instanceof Error ? error.message : String(error)}`);
		}
	}

	/**
	 * Deletes a chat by ID.
	 * If the deleted chat is the current chat, it will create a new chat.
	 *
	 * @param chatId - The ID of the chat to delete
	 */
	public async deleteChat(chatId: string): Promise<void> {
		try {
			// Delete chat from storage
			await this.devSphereService.deleteChat(chatId);

			// Update local state
			this._allChats = this._allChats.filter(chat => chat.id !== chatId);

			// If we deleted the current chat, create a new one
			if (this._currentChat && this._currentChat.id === chatId) {
				if (this._allChats.length > 0) {
					// Switch to the first available chat
					await this.loadChat(this._allChats[0]?.id ?? '');
				} else {
					// Create a new chat if no chats remain
					// await this.createNewChat();
				}
			}

			// Fire events
			this._onChatsChanged.fire();
		} catch (error) {
			console.error(`Failed to delete chat ${chatId}:`, error);
			this.notificationService.error(`Failed to delete chat: ${error instanceof Error ? error.message : String(error)}`);
		}
	}

	/**
	 * Retries the last user message.
	 * Useful when an error occurred during the previous attempt.
	 */
	public async retryLastMessage(): Promise<void> {
		// Don't allow retry while already processing
		if (this._isLoading) {
			return;
		}

		// Make sure we have a current chat
		if (!this._currentChat || this._messages.length === 0) {
			return;
		}

		// Find the last user message
		let lastUserMessage: Message | undefined;
		for (let i = this._messages.length - 1; i >= 0; i--) {
			if (this._messages[i]?.role === 'user') {
				lastUserMessage = this._messages[i];
				break;
			}
		}

		if (!lastUserMessage) {
			return; // No user message to retry
		}

		// Remove any assistant message after the last user message
		const userIndex = this._messages.indexOf(lastUserMessage);
		if (userIndex !== -1 && userIndex < this._messages.length - 1) {
			this._messages = this._messages.slice(0, userIndex + 1);
			this._onMessagesChanged.fire();
		}

		// Retry sending the message
		const content = lastUserMessage.content;
		try {
			// Set loading state
			this.setLoading(true);
			this.setError(null);

			// Add loading message
			const loadingMessage: Message = {
				id: `loading-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
				role: 'loading',
				content: 'Thinking...',
				timestamp: Date.now()
			};

			this._messages.push(loadingMessage);
			this._onMessagesChanged.fire();

			// Send message to API
			const response = await this.devSphereService.fetchAIResponse(content);

			// Remove loading message
			this._messages = this._messages.filter(msg => msg.role !== 'loading');

			// Add response message
			const responseMessage: Message = {
				id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
				role: 'assistant',
				content: response,
				timestamp: Date.now()
			};

			this._messages.push(responseMessage);
			this._onMessagesChanged.fire();

			// Update current chat with response
			if (this._currentChat) {
				this._currentChat.messages = [...this._messages];
				this._currentChat.lastModified = Date.now();

				// Save chat with response
				await this.devSphereService.saveChat(this._currentChat);
				this._onChatsChanged.fire();
			}
		} catch (error) {
			// Handle errors
			console.error('Error retrying message:', error);

			// Remove loading message
			this._messages = this._messages.filter(msg => msg.role !== 'loading');

			// Add error message
			const errorMessage = error instanceof Error ? error.message : String(error);
			this.setError(errorMessage);

			// Show notification
			this.notificationService.error(`Failed to get response: ${errorMessage}`);
		} finally {
			// Clear loading state
			this.setLoading(false);
		}
	}

	/**
	 * Disposes of resources used by the view model.
	 * Called when the component is being destroyed.
	 */
	public dispose(): void {
		// Dispose of all emitters
		this._onMessagesChanged.dispose();
		this._onChatsChanged.dispose();
		this._onCurrentChatChanged.dispose();
		this._onLoadingStateChanged.dispose();
		this._onErrorStateChanged.dispose();
	}
}
