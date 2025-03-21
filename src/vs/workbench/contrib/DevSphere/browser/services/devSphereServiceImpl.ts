/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { IQuickInputService } from '../../../../../platform/quickinput/common/quickInput.js';
import { ISecretStorageService } from '../../../../../platform/secrets/common/secrets.js';
import { IStorageService } from '../../../../../platform/storage/common/storage.js';
import { DevSphereErrorHandler } from '../devSphereErrorHandler.js';
import { DEFAULT_MAX_TOKENS } from '../models/modelData.js';
import { Chat, ModelInfoWithProvider, ModelProviderType, ModelWithProvider, OpenAIModel } from '../models/types.js';
import { ApiKeyService } from './apiKeyService.js';
import { ApiProviderFactory } from './apiProviders/apiProviderFactory.js';
import { ChatService } from './chatService.js';
import { CorsHandlerService } from './corsHandlerService.js';
import { IDevSphereService } from './devSphereServiceInterface.js';
import { ModelService } from './modelService.js';

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
		@INotificationService private readonly notificationService: INotificationService,
		@IStorageService storageService: IStorageService
	) {
		// Initialize service components
		this.corsHandler = new CorsHandlerService();
		this.modelService = new ModelService(storageService);
		this.apiKeyService = new ApiKeyService(secretStorageService, quickInputService, notificationService);
		this.chatService = new ChatService(storageService, notificationService);
		this.apiProviderFactory = new ApiProviderFactory(this.corsHandler);
	}

	// #region Model Management

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

	// #endregion

	// #region Chat Management

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
		return this.chatService.createNewChat(
			this.getCurrentModelId(),
			this.modelService.getCurrentModelType() as ModelProviderType,
			this.getCurrentProviderName(),
			this.getCurrentModelName()
		);
	}

	// #endregion

	// #region API Key Management

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
		this.notificationService.info(`${this.getProviderNameFromType(providerType)} API key has been removed.`);
	}

	/**
	 * Removes all API keys for all providers.
	 */
	public async removeAllAPIKeys(): Promise<void> {
		// Clear API keys for all provider types
		const providerTypes: ModelProviderType[] = ['ChatgptModels', 'AnthropicModels', 'GoogleModels'];
		for (const providerType of providerTypes) {
			await this.apiKeyService.clearApiKey(providerType);
		}
		this.notificationService.info('All API keys have been removed.');
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
		const providerName = this.getProviderNameFromType(modelType);
		const modelId = this.getCurrentModelId();

		const apiKey = await this.getProviderAPIKey();

		if (!apiKey) {
			const processedError = DevSphereErrorHandler.processApiError('No API key found, please check your API key, or try again later', modelId, providerName);
			return DevSphereErrorHandler.formatErrorAsSystemMessage(processedError);
		}
		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 60000);

			const apiProvider = this.apiProviderFactory.createProvider(modelType, modelId);
			const requestBody = apiProvider.formatRequestBody(prompt, DEFAULT_MAX_TOKENS);

			const response = await apiProvider.makeRequest(
				this.modelService.getCurrentEndpoint(),
				apiKey,
				requestBody,
				controller.signal
			);

			clearTimeout(timeoutId);

			if (!response.ok) {
				const processedError = DevSphereErrorHandler.processApiError('API request failed, please check your API key, or try again later', modelId, providerName);
				return DevSphereErrorHandler.formatErrorAsSystemMessage(processedError);
			}

			const data = await response.json();
			return apiProvider.extractResponseContent(data);
		} catch (error) {
			console.error('Error in fetchAIResponse:', error);

			const processedError = DevSphereErrorHandler.processApiError(error, modelId, providerName);
			return DevSphereErrorHandler.formatErrorAsSystemMessage(processedError);
		}
	}
}
