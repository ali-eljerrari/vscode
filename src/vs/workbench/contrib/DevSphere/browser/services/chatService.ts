/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { STORAGE_KEYS } from '../models/modelData.js';
import { Chat, ModelCapabilities, ModelProviderType, ModelWithProvider } from '../models/types.js';

/**
 * Service for managing chat operations and persistence.
 * This service handles all aspects of chat management including:
 * - Chat creation and initialization
 * - Chat storage and retrieval
 * - Chat deletion
 * - Model capability detection
 *
 * The service ensures that chats are:
 * - Persisted securely using VS Code's storage system
 * - Properly associated with their models
 * - Maintained with appropriate metadata
 * - Handled with proper error management
 */
export class ChatService {
	constructor(
		private readonly storageService: IStorageService,
		private readonly notificationService: INotificationService,
	) { }

	/**
	 * Creates a new chat with default settings.
	 * This method initializes a new chat with:
	 * - Unique ID generation
	 * - Default title based on model
	 * - Empty messages array
	 * - Current timestamp
	 * - Model information
	 * - Model capabilities
	 *
	 * @param modelId - The ID of the model to use
	 * @param providerType - The type of AI provider
	 * @param providerName - Display name of the provider
	 * @param modelName - Display name of the model
	 * @returns A new Chat object with default settings
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
	 * Saves a chat to storage.
	 * This method handles:
	 * - Updating last modified timestamp
	 * - Ensuring provider information is set
	 * - Merging with existing chats
	 * - Persistent storage
	 *
	 * @param chat - The chat to save
	 * @param modelFinder - Function to find model information
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
	 * Loads a specific chat by ID.
	 * This method retrieves a single chat from storage based on its ID.
	 *
	 * @param chatId - The ID of the chat to load
	 * @returns Promise resolving to the chat or undefined if not found
	 */
	public async loadChat(chatId: string): Promise<Chat | undefined> {
		const chats = await this.getAllChats();
		return chats.find(chat => chat.id === chatId);
	}

	/**
	 * Gets all saved chats.
	 * This method retrieves all chats from storage and handles:
	 * - JSON parsing
	 * - Error handling
	 * - Empty state handling
	 *
	 * @returns Promise resolving to an array of all saved chats
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
	 * Deletes a chat by ID.
	 * This method removes a specific chat from storage and updates
	 * the stored chat list accordingly.
	 *
	 * @param chatId - The ID of the chat to delete
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
	 * Determines the capabilities of a model based on its ID and provider.
	 * This method analyzes the model ID and provider to determine:
	 * - Image processing capabilities
	 * - Code handling capabilities
	 * - Thinking process capabilities
	 * - Function calling capabilities
	 *
	 * @param modelId - The ID of the model
	 * @param providerType - The type of AI provider
	 * @returns Object describing the model's capabilities
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
