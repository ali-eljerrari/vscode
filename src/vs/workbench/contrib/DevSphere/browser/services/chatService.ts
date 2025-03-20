/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { STORAGE_KEYS } from '../models/modelData.js';
import { Chat, ModelCapabilities, ModelProviderType, ModelWithProvider } from '../models/types.js';

/**
 * Service for managing chat operations and persistence
 */
export class ChatService {
	constructor(
		private readonly storageService: IStorageService,
		private readonly notificationService: INotificationService,
	) { }

	/**
	 * Creates a new chat with default settings
	 */
	public createNewChat(
		modelId: string,
		providerType: ModelProviderType,
		providerName: string,
		modelName: string
	): Chat {
		// Determine model capabilities based on model ID and provider
		const modelCapabilities = this.getModelCapabilities(modelId, providerType);

		return {
			id: `chat-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
			title: `New ${providerName} ${modelName} Chat`,
			messages: [],
			lastModified: Date.now(),
			modelId: modelId,
			provider: providerType,
			modelCapabilities,
			tags: []
		};
	}

	/**
	 * Saves a chat to storage
	 */
	public async saveChat(chat: Chat, modelFinder: (modelId: string) => ModelWithProvider | null): Promise<void> {
		// Update last modified time
		chat.lastModified = Date.now();

		// If the chat doesn't have a provider field, add it
		if (!chat.provider) {
			// Find the provider for the model ID
			const modelInfo = modelFinder(chat.modelId);
			if (modelInfo) {
				chat.provider = modelInfo.provider;
			}
		}

		// Get existing chats
		const chats = await this.getAllChats();

		// Find and update the chat if it exists, otherwise add it
		const existingChatIndex = chats.findIndex(c => c.id === chat.id);
		if (existingChatIndex >= 0) {
			chats[existingChatIndex] = chat;
		} else {
			chats.push(chat);
		}

		// Save to storage
		await this.storageService.store(
			STORAGE_KEYS.CHATS,
			JSON.stringify(chats),
			StorageScope.PROFILE,
			StorageTarget.USER
		);
	}

	/**
	 * Loads a specific chat by ID
	 */
	public async loadChat(chatId: string): Promise<Chat | undefined> {
		const chats = await this.getAllChats();
		return chats.find(chat => chat.id === chatId);
	}

	/**
	 * Gets all saved chats
	 */
	public async getAllChats(): Promise<Chat[]> {
		const chatsJson = this.storageService.get(STORAGE_KEYS.CHATS, StorageScope.PROFILE);
		if (!chatsJson) {
			return [];
		}

		try {
			return JSON.parse(chatsJson);
		} catch (e) {
			this.notificationService.error('Failed to load chats: Invalid data format');
			return [];
		}
	}

	/**
	 * Deletes a chat by ID
	 */
	public async deleteChat(chatId: string): Promise<void> {
		const chats = await this.getAllChats();
		const filteredChats = chats.filter(chat => chat.id !== chatId);

		await this.storageService.store(
			STORAGE_KEYS.CHATS,
			JSON.stringify(filteredChats),
			StorageScope.PROFILE,
			StorageTarget.USER
		);
	}

	/**
	 * Determines the capabilities of a model based on its ID and provider
	 */
	private getModelCapabilities(modelId: string, providerType: ModelProviderType): ModelCapabilities {
		// Base capabilities - conservative defaults
		const capabilities: ModelCapabilities = {
			supportsImages: false,
			supportsCode: true,
			supportsThinking: false,
			supportsFunctionCalling: false
		};

		// Enhance based on provider
		switch (providerType) {
			case 'ChatgptModels':
				// Most OpenAI models support function calling
				capabilities.supportsFunctionCalling = true;

				// GPT-4 models support images
				if (modelId.includes('gpt-4')) {
					capabilities.supportsImages = true;
				}
				break;

			case 'AnthropicModels':
				// Claude models support images
				capabilities.supportsImages = true;
				break;

			case 'GoogleModels':
				// Gemini models with "thinking" in the name support thinking
				if (modelId.includes('thinking')) {
					capabilities.supportsThinking = true;
				}

				// Most Gemini models support images
				capabilities.supportsImages = true;
				break;
		}

		return capabilities;
	}
}
