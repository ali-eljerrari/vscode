/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDevSphereService } from './devSphereService.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';

export interface Message {
	id: string;
	role: 'user' | 'assistant' | 'system' | 'loading';
	content: string;
	timestamp: number;
}

export class DevSphereViewModel extends Disposable {
	private messages: Message[] = [];
	private _isLoading = false;
	private loadingMessageId: string | null = null;

	private readonly _onMessagesChanged = this._register(new Emitter<Message[]>());
	readonly onMessagesChanged: Event<Message[]> = this._onMessagesChanged.event;

	private readonly _onLoadingStateChanged = this._register(new Emitter<boolean>());
	readonly onLoadingStateChanged: Event<boolean> = this._onLoadingStateChanged.event;

	constructor(
		@IDevSphereService private readonly devSphereService: IDevSphereService,
		@INotificationService private readonly notificationService: INotificationService
	) {
		super();
	}

	public get messageList(): Message[] {
		return this.messages;
	}

	public get isLoading(): boolean {
		return this._isLoading;
	}

	private setIsLoading(value: boolean): void {
		if (this._isLoading !== value) {
			this._isLoading = value;
			this._onLoadingStateChanged.fire(value);
		}
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

		this.messages.push(userMessage);
		this._onMessagesChanged.fire(this.messages);

		// Show loading message
		this.setIsLoading(true);
		const loadingMessage: Message = {
			id: `loading-${Date.now()}`,
			role: 'loading',
			content: 'Loading response...',
			timestamp: Date.now()
		};

		this.loadingMessageId = loadingMessage.id;
		this.messages.push(loadingMessage);
		this._onMessagesChanged.fire(this.messages);

		try {
			// Get response from API
			const responseContent = await this.devSphereService.fetchAIResponse(content);

			// Remove loading message
			this.messages = this.messages.filter(msg => msg.id !== this.loadingMessageId);

			// Add assistant message
			const assistantMessage: Message = {
				id: `assistant-${Date.now()}`,
				role: 'assistant',
				content: responseContent,
				timestamp: Date.now()
			};

			this.messages.push(assistantMessage);
		} catch (error) {
			// Remove loading message
			this.messages = this.messages.filter(msg => msg.id !== this.loadingMessageId);

			// Add error message
			const errorMessage: Message = {
				id: `assistant-${Date.now()}`,
				role: 'assistant',
				content: `**Error**: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
				timestamp: Date.now()
			};

			this.messages.push(errorMessage);
			this.notificationService.error(error instanceof Error ? error.message : 'Error fetching AI response');
		} finally {
			this.loadingMessageId = null;
			this.setIsLoading(false);
			this._onMessagesChanged.fire(this.messages);
		}
	}

	public clearMessages(): void {
		this.messages = [];
		this._onMessagesChanged.fire(this.messages);
	}
}
