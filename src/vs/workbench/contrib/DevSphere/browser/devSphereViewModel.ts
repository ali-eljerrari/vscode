/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDevSphereService, Chat, Message } from './devSphereService.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';

export class DevSphereViewModel extends Disposable {
	private _currentChat: Chat;
	private _loadingMessageId: string | null = null;
	private _isLoading = false;
	private _allChats: Chat[] = [];

	private readonly _onMessagesChanged = this._register(new Emitter<Message[]>());
	readonly onMessagesChanged: Event<Message[]> = this._onMessagesChanged.event;

	private readonly _onChatsChanged = this._register(new Emitter<Chat[]>());
	readonly onChatsChanged: Event<Chat[]> = this._onChatsChanged.event;

	private readonly _onCurrentChatChanged = this._register(new Emitter<Chat>());
	readonly onCurrentChatChanged: Event<Chat> = this._onCurrentChatChanged.event;

	private readonly _onLoadingStateChanged = this._register(new Emitter<boolean>());
	readonly onLoadingStateChanged: Event<boolean> = this._onLoadingStateChanged.event;

	constructor(
		@IDevSphereService private readonly devSphereService: IDevSphereService,
		@INotificationService private readonly notificationService: INotificationService
	) {
		super();
		// Create a new chat by default
		this._currentChat = this.devSphereService.createNewChat();

		// Load saved chats
		this.loadChats();
	}

	private async loadChats(): Promise<void> {
		this._allChats = await this.devSphereService.getAllChats();
		this._onChatsChanged.fire(this._allChats);

		// If there are existing chats, load the most recent one
		if (this._allChats.length > 0) {
			// Sort by last modified time (newest first)
			const sortedChats = [...this._allChats].sort((a, b) => b.lastModified - a.lastModified);
			await this.switchToChat(sortedChats[0].id);
		}
	}

	public get messageList(): Message[] {
		return this._currentChat.messages;
	}

	public get currentChat(): Chat {
		return this._currentChat;
	}

	public get allChats(): Chat[] {
		return this._allChats;
	}

	public get isLoading(): boolean {
		return this._isLoading;
	}

	public async createNewChat(): Promise<void> {
		// Save current chat first
		await this.saveCurrentChat();

		// Create a new chat
		this._currentChat = this.devSphereService.createNewChat();
		this._onCurrentChatChanged.fire(this._currentChat);
		this._onMessagesChanged.fire(this._currentChat.messages);

		// Add to the list of chats
		this._allChats.push(this._currentChat);
		this._onChatsChanged.fire(this._allChats);

		// Save to persistent storage
		await this.devSphereService.saveChat(this._currentChat);
	}

	public async switchToChat(chatId: string): Promise<void> {
		// Save current chat
		await this.saveCurrentChat();

		// Load the requested chat
		const chat = await this.devSphereService.loadChat(chatId);
		if (chat) {
			this._currentChat = chat;
			this._onCurrentChatChanged.fire(this._currentChat);
			this._onMessagesChanged.fire(this._currentChat.messages);
		} else {
			this.notificationService.error(`Failed to load chat: Chat with ID ${chatId} not found`);
		}
	}

	public async deleteChat(chatId: string): Promise<void> {
		await this.devSphereService.deleteChat(chatId);

		// Update local cache
		this._allChats = this._allChats.filter(chat => chat.id !== chatId);
		this._onChatsChanged.fire(this._allChats);

		// If we deleted the current chat, create a new one
		if (this._currentChat.id === chatId) {
			this._currentChat = this.devSphereService.createNewChat();
			this._onCurrentChatChanged.fire(this._currentChat);
			this._onMessagesChanged.fire(this._currentChat.messages);
		}
	}

	public async renameChat(chatId: string, newTitle: string): Promise<void> {
		const chatIndex = this._allChats.findIndex(chat => chat.id === chatId);
		if (chatIndex >= 0) {
			this._allChats[chatIndex].title = newTitle;

			// If renaming current chat, update it
			if (this._currentChat.id === chatId) {
				this._currentChat.title = newTitle;
				this._onCurrentChatChanged.fire(this._currentChat);
			}

			this._onChatsChanged.fire(this._allChats);

			// Save to storage
			await this.devSphereService.saveChat(this._allChats[chatIndex]);
		}
	}

	private async saveCurrentChat(): Promise<void> {
		// Don't save empty chats
		if (this._currentChat.messages.length === 0) {
			return;
		}

		// Update model ID in case it changed
		this._currentChat.modelId = this.devSphereService.getCurrentModel().id;

		await this.devSphereService.saveChat(this._currentChat);
	}

	private setIsLoading(value: boolean): void {
		if (this._isLoading !== value) {
			this._isLoading = value;
			this._onLoadingStateChanged.fire(value);

			// When loading is complete, emit an event to trigger focus
			if (value === false) {
				setTimeout(() => {
					// Give UI time to update before triggering a focus event
					this._onMessagesChanged.fire(this._currentChat.messages);
				}, 50);
			}
		}
	}

	/**
	 * Adds a system message to the chat
	 */
	public addSystemMessage(content: string): void {
		const systemMessage: Message = {
			id: `system-${Date.now()}`,
			role: 'system',
			content: content,
			timestamp: Date.now()
		};

		this._currentChat.messages.push(systemMessage);
		this._onMessagesChanged.fire(this._currentChat.messages);

		// Update chat title if it's the first message
		if (this._currentChat.title === 'New Chat' && this._currentChat.messages.length === 1) {
			this._currentChat.title = content.substring(0, 30) + (content.length > 30 ? '...' : '');
			this._onCurrentChatChanged.fire(this._currentChat);
			this._onChatsChanged.fire(this._allChats);
		}

		// Save the chat
		this.saveCurrentChat();
	}

	public async sendMessage(content: string): Promise<void> {
		if (!content.trim()) {
			return;
		}

		// Add user message
		const userMessage: Message = {
			id: `user-${Date.now()}`,
			role: 'user',
			content: content.trim(),
			timestamp: Date.now()
		};

		this._currentChat.messages.push(userMessage);
		this._onMessagesChanged.fire(this._currentChat.messages);

		// Update chat title if this is the first user message
		if (this._currentChat.title === 'New Chat') {
			this._currentChat.title = content.substring(0, 30) + (content.length > 30 ? '...' : '');
			this._onCurrentChatChanged.fire(this._currentChat);
			this._onChatsChanged.fire(this._allChats);
		}

		// Show loading message
		this.setIsLoading(true);
		const loadingMessage: Message = {
			id: `loading-${Date.now()}`,
			role: 'loading',
			content: 'Loading response...',
			timestamp: Date.now()
		};

		this._loadingMessageId = loadingMessage.id;
		this._currentChat.messages.push(loadingMessage);
		this._onMessagesChanged.fire(this._currentChat.messages);

		try {
			// Get response from API
			const responseContent = await this.devSphereService.fetchAIResponse(content);

			// Remove loading message
			this._currentChat.messages = this._currentChat.messages.filter(msg => msg.id !== this._loadingMessageId);

			// Add assistant message
			const assistantMessage: Message = {
				id: `assistant-${Date.now()}`,
				role: 'assistant',
				content: responseContent,
				timestamp: Date.now()
			};

			this._currentChat.messages.push(assistantMessage);

			// Save the chat
			await this.saveCurrentChat();
		} catch (error) {
			// Remove loading message
			this._currentChat.messages = this._currentChat.messages.filter(msg => msg.id !== this._loadingMessageId);

			// Add error message
			const errorMessage: Message = {
				id: `assistant-${Date.now()}`,
				role: 'assistant',
				content: `**Error**: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
				timestamp: Date.now()
			};

			this._currentChat.messages.push(errorMessage);
			this.notificationService.error(error instanceof Error ? error.message : 'Error fetching AI response');

			// Save the chat with the error
			await this.saveCurrentChat();
		} finally {
			this._loadingMessageId = null;
			this.setIsLoading(false);
			this._onMessagesChanged.fire(this._currentChat.messages);
		}
	}

	public clearMessages(): void {
		this._currentChat.messages = [];
		this._onMessagesChanged.fire(this._currentChat.messages);
	}
}
