/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { IQuickInputService } from '../../../../../platform/quickinput/common/quickInput.js';
import { ISecretStorageService } from '../../../../../platform/secrets/common/secrets.js';
import { IStorageService } from '../../../../../platform/storage/common/storage.js';
import { Chat, ModelInfoWithProvider, ModelProviderType, ModelWithProvider, OpenAIModel } from '../models/types.js';
import { ApiKeyService } from '../services/apiKeyService.js';
import { ApiProviderFactory } from '../services/apiProviders/apiProviderFactory.js';
import { ChatService } from '../services/chatService.js';
import { CorsHandlerService } from '../services/corsHandlerService.js';
import { IDevSphereService } from '../services/devSphereServiceInterface.js';
import { ModelService } from '../services/modelService.js';
import { DevSphereErrorHandler } from '../devSphereErrorHandler.js';

/**
 * Main service implementation for DevSphere.
 * This service orchestrates all DevSphere functionality by coordinating between:
 * - Model management (ModelService)
 * - API key management (ApiKeyService)
 * - Chat management (ChatService)
 * - CORS handling (CorsHandlerService)
 * - API provider management (ApiProviderFactory)
 *
 * The service provides a unified interface for:
 * - Managing AI models and providers
 * - Handling API keys securely
 * - Managing chat sessions
 * - Processing AI responses
 * - Error handling and recovery
 *
 * Key features:
 * - Provider-agnostic API interactions
 * - Secure key storage
 * - CORS issue handling
 * - Comprehensive error management
 * - Chat persistence
 */
export class DevSphereService implements IDevSphereService {
	// Service dependencies
	private readonly modelService: ModelService;
	private readonly apiKeyService: ApiKeyService;
	private readonly chatService: ChatService;
	private readonly corsHandler: CorsHandlerService;
	private readonly apiProviderFactory: ApiProviderFactory;

	constructor(
		@ISecretStorageService secretStorageService: ISecretStorageService,
		@IQuickInputService quickInputService: IQuickInputService,
		@INotificationService notificationService: INotificationService,
		@IStorageService storageService: IStorageService
	) {
		// Initialize service components
		this.corsHandler = new CorsHandlerService();
		this.apiProviderFactory = new ApiProviderFactory(this.corsHandler);
		this.apiKeyService = new ApiKeyService(secretStorageService, quickInputService, notificationService);
		this.modelService = new ModelService(storageService, this.apiKeyService);
		this.chatService = new ChatService(storageService, notificationService);
	}

	/**
	 * Gets all available models across all providers.
	 * @returns Array of available OpenAI models
	 */
	public getAvailableModels(): OpenAIModel[] {
		return this.modelService.getAvailableModels();
	}

	/**
	 * Gets the currently selected model.
	 * @returns The current OpenAI model configuration
	 */
	public getCurrentModel(): OpenAIModel {
		return this.modelService.getCurrentModel();
	}

	/**
	 * Sets the current model by ID.
	 * @param modelId - The ID of the model to set as current
	 */
	public setCurrentModel(modelId: string): void {
		this.modelService.setCurrentModel(modelId);
	}

	/**
	 * Gets the ID of the current model.
	 * @returns The current model ID
	 */
	public getCurrentModelId(): string {
		return this.modelService.getCurrentModelId();
	}

	/**
	 * Gets the type of the current model.
	 * @returns The current model type
	 */
	public getCurrentModelType(): string {
		return this.modelService.getCurrentModelType();
	}

	/**
	 * Gets the name of the current model.
	 * @returns The current model name
	 */
	public getCurrentModelName(): string {
		return this.modelService.getCurrentModelName();
	}

	/**
	 * Gets the name of the current provider.
	 * @returns The current provider name
	 */
	public getCurrentProviderName(): string {
		return this.modelService.getCurrentProviderName();
	}

	/**
	 * Gets available models for a specific provider.
	 * @param providerType - The type of provider to get models for
	 * @returns Array of model information for the specified provider
	 */
	public getAvailableModelsByProvider(providerType: ModelProviderType): ModelInfoWithProvider[] {
		return this.modelService.getAvailableModelsByProvider(providerType);
	}

	/**
	 * Gets model information by ID.
	 * @param modelId - The ID of the model to get information for
	 * @returns Model information or null if not found
	 */
	public getModelInfoById(modelId: string): ModelWithProvider | null {
		return this.modelService.getModelInfoById(modelId);
	}

	/**
	 * Gets the provider name from provider type.
	 * @param providerType - The type of provider
	 * @returns The display name of the provider
	 */
	public getProviderNameFromType(providerType: ModelProviderType): string {
		return this.modelService.getProviderNameFromType(providerType);
	}

	/**
	 * Finds models by specific capability.
	 * @param capability - The capability to search for
	 * @returns Array of models with the specified capability
	 */
	public findModelsByCapability(capability: 'coding' | 'reasoning' | 'speed' | 'cost-effective'): ModelInfoWithProvider[] {
		return this.modelService.findModelsByCapability(capability);
	}

	/**
	 * Saves a chat session.
	 * @param chat - The chat to save
	 */
	public async saveChat(chat: Chat): Promise<void> {
		await this.chatService.saveChat(chat, (modelId) => this.getModelInfoById(modelId));
	}

	/**
	 * Loads a chat session by ID.
	 * @param chatId - The ID of the chat to load
	 * @returns The loaded chat or undefined if not found
	 */
	public async loadChat(chatId: string): Promise<Chat | undefined> {
		return this.chatService.loadChat(chatId);
	}

	/**
	 * Gets all saved chat sessions.
	 * @returns Array of all saved chats
	 */
	public async getAllChats(): Promise<Chat[]> {
		return this.chatService.getAllChats();
	}

	/**
	 * Deletes a chat session by ID.
	 * @param chatId - The ID of the chat to delete
	 */
	public async deleteChat(chatId: string): Promise<void> {
		await this.chatService.deleteChat(chatId);
	}

	/**
	 * Creates a new chat session.
	 * @returns A new chat with default settings
	 */
	public createNewChat(): Chat {
		const modelId = this.getCurrentModelId();
		const modelType = this.modelService.getCurrentModelType() as ModelProviderType;
		const providerName = this.getProviderNameFromType(modelType);
		const modelName = this.getCurrentModelName();

		return this.chatService.createNewChat(
			modelId,
			modelType,
			providerName,
			modelName
		);
	}

	/**
	 * Gets the API key for the current provider.
	 * @returns The current provider's API key or undefined if not set
	 */
	public async getProviderAPIKey(): Promise<string | undefined> {
		const currentModelType = this.modelService.getCurrentModelType() as ModelProviderType;
		return this.apiKeyService.getApiKey(currentModelType);
	}

	/**
	 * Updates the API key for the current provider.
	 */
	public async updateAPIKey(): Promise<void> {
		const currentModelType = this.modelService.getCurrentModelType() as ModelProviderType;
		const providerName = this.getProviderNameFromType(currentModelType);
		await this.apiKeyService.promptForAPIKey(currentModelType, providerName);
	}

	/**
	 * Updates the API key for a specific provider.
	 * @param providerType - The type of provider
	 * @param providerName - The display name of the provider
	 */
	public async updateAPIKeyForProvider(providerType: ModelProviderType, providerName: string): Promise<void> {
		await this.apiKeyService.promptForAPIKey(providerType, providerName);
	}

	/**
	 * Checks if an API key exists for a provider.
	 * @param providerType - The type of provider to check
	 * @returns True if an API key exists for the provider
	 */
	public async hasAPIKeyForProvider(providerType: ModelProviderType): Promise<boolean> {
		const apiKey = await this.apiKeyService.getApiKey(providerType);
		return !!apiKey;
	}

	/**
	 * Removes the API key for a specific provider.
	 * @param providerType - The type of provider to remove the key for
	 */
	public async removeAPIKeyForProvider(providerType: ModelProviderType): Promise<void> {
		await this.apiKeyService.clearApiKey(providerType);
	}

	/**
	 * Removes all API keys for all providers.
	 */
	public async removeAllAPIKeys(): Promise<void> {
		await this.apiKeyService.clearAllApiKeys();
	}

	/**
	 * Fetches a response from the AI model.
	 * This method handles:
	 * - API key validation and prompting
	 * - Request formatting
	 * - Response processing
	 * - Error handling
	 * - CORS issues
	 * - Rate limiting
	 * - Authentication errors
	 *
	 * @param prompt - The user's input text
	 * @returns Promise resolving to the AI's response
	 */
	public async fetchAIResponse(prompt: string): Promise<string> {
		const modelType = this.modelService.getCurrentModelType() as ModelProviderType;

		const modelId = this.modelService.getCurrentModelId();

		const providerName = this.modelService.getCurrentProviderName();

		const apiKey = await this.getProviderAPIKey();

		const apiProvider = this.apiProviderFactory.createProvider(modelType, modelId);

		if (!apiKey) {
			const processedError = DevSphereErrorHandler.processApiError('No API key found, please check your API key, or try again later', modelId, providerName);
			return DevSphereErrorHandler.formatErrorAsSystemMessage(processedError);
		}

		return this.modelService.fetchAI(prompt, modelId, providerName, apiKey, apiProvider);
	}
}
