/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * @file DevSphere Service Implementation
 *
 * This module implements the core service layer for the DevSphere extension,
 * providing a unified API for all AI model integrations. It:
 *
 * 1. Manages API connections to multiple AI providers (OpenAI, Anthropic, etc.)
 * 2. Handles API key storage and retrieval securely
 * 3. Implements CORS error handling strategies
 * 4. Manages chat persistence (load/save/create)
 * 5. Provides model selection and management
 *
 * The service layer acts as a bridge between the UI and the AI providers,
 * abstracting away the implementation details of each provider and providing
 * a consistent interface for the UI to interact with.
 */

import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { ISecretStorageService } from '../../../../platform/secrets/common/secrets.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { DevSphereErrorHandler } from './devSphereErrorHandler.js';
import { DEFAULT_MAX_TOKENS } from './models/modelData.js';
import { Chat, ModelInfoWithProvider, ModelProviderType, ModelWithProvider, OpenAIModel } from './models/types.js';
import { ApiKeyService } from './services/apiKeyService.js';
import { ChatService } from './services/chatService.js';
import { IDevSphereService } from './services/devSphereServiceInterface.js';
import { ModelService } from './services/modelService.js';
import { CorsHandlerService } from './services/corsHandlerService.js';
import { ApiProviderFactory } from './services/apiProviders/apiProviderFactory.js';

/**
 * Main service implementation for DevSphere.
 *
 * This class implements the IDevSphereService interface and coordinates
 * all the subsystems needed to provide a complete AI assistant experience.
 * It manages model selection, API key handling, chat persistence, and
 * communication with AI providers.
 */
export class DevSphereService implements IDevSphereService {
	/**
	 * Service for model management (selection, retrieval, etc.)
	 */
	private readonly modelService: ModelService;

	/**
	 * Service for securely storing and retrieving API keys
	 */
	private readonly apiKeyService: ApiKeyService;

	/**
	 * Service for chat persistence (save, load, delete)
	 */
	private readonly chatService: ChatService;

	/**
	 * Service for CORS error handling
	 */
	private readonly corsHandler: CorsHandlerService;

	/**
	 * Service for API provider factory
	 */
	private readonly apiProviderFactory: ApiProviderFactory;

	/**
	 * Creates a new instance of the DevSphere service.
	 * Initializes all subsystems and dependencies.
	 *
	 * @param secretStorageService - VS Code's secret storage for API keys
	 * @param quickInputService - VS Code's input service for user prompts
	 * @param notificationService - VS Code's notification service for user feedback
	 * @param storageService - VS Code's storage service for persistent data
	 */
	constructor(
		@ISecretStorageService secretStorageService: ISecretStorageService,
		@IQuickInputService quickInputService: IQuickInputService,
		@INotificationService notificationService: INotificationService,
		@IStorageService storageService: IStorageService
	) {
		this.corsHandler = new CorsHandlerService();
		this.apiKeyService = new ApiKeyService(secretStorageService, quickInputService, notificationService);
		this.modelService = new ModelService(storageService, this.apiKeyService);
		this.chatService = new ChatService(storageService, notificationService);
		this.apiProviderFactory = new ApiProviderFactory(this.corsHandler);
	}

	// #region Model Management

	/**
	 * Gets a list of all available models across all providers.
	 *
	 * @returns An array of all available models
	 */
	public getAvailableModels(): OpenAIModel[] {
		return this.modelService.getAvailableModels();
	}

	/**
	 * Gets the currently selected model.
	 *
	 * @returns The currently selected model
	 */
	public getCurrentModel(): OpenAIModel {
		return this.modelService.getCurrentModel();
	}

	/**
	 * Sets the current model by ID.
	 *
	 * @param modelId - The ID of the model to set as current
	 */
	public setCurrentModel(modelId: string): void {
		this.modelService.setCurrentModel(modelId);
	}

	/**
	 * Gets the ID of the currently selected model.
	 *
	 * @returns The ID of the current model
	 */
	public getCurrentModelId(): string {
		return this.modelService.getCurrentModelId();
	}

	/**
	 * Gets the type of the currently selected model.
	 *
	 * @returns The type of the current model (e.g., 'OpenAI', 'Anthropic')
	 */
	public getCurrentModelType(): string {
		return this.modelService.getCurrentModelType();
	}

	/**
	 * Gets the display name of the currently selected model.
	 *
	 * @returns The display name of the current model
	 */
	public getCurrentModelName(): string {
		return this.modelService.getCurrentModelName();
	}

	/**
	 * Gets the display name of the provider for the current model.
	 *
	 * @returns The display name of the current provider
	 */
	public getCurrentProviderName(): string {
		return this.modelService.getCurrentProviderName();
	}

	/**
	 * Gets all available models for a specific provider.
	 *
	 * @param providerType - The type of provider to get models for
	 * @returns An array of models from the specified provider
	 */
	public getAvailableModelsByProvider(providerType: ModelProviderType): ModelInfoWithProvider[] {
		return this.modelService.getAvailableModelsByProvider(providerType);
	}

	/**
	 * Gets model information by ID.
	 *
	 * @param modelId - The ID of the model to get information for
	 * @returns The model information or null if not found
	 */
	public getModelInfoById(modelId: string): ModelWithProvider | null {
		return this.modelService.getModelInfoById(modelId);
	}

	/**
	 * Gets the display name of a provider from its type.
	 *
	 * @param providerType - The type of provider
	 * @returns The display name of the provider
	 */
	public getProviderNameFromType(providerType: ModelProviderType): string {
		return this.modelService.getProviderNameFromType(providerType);
	}

	/**
	 * Finds models that excel at a particular capability.
	 *
	 * @param capability - The capability to find models for
	 * @returns An array of models that excel at the specified capability
	 */
	public findModelsByCapability(capability: 'coding' | 'reasoning' | 'speed' | 'cost-effective'): ModelInfoWithProvider[] {
		return this.modelService.findModelsByCapability(capability);
	}

	// #endregion

	// #region Chat Management

	/**
	 * Saves a chat conversation to storage.
	 *
	 * @param chat - The chat to save
	 * @returns A promise that resolves when the chat is saved
	 */
	public async saveChat(chat: Chat): Promise<void> {
		await this.chatService.saveChat(chat, (modelId) => this.getModelInfoById(modelId));
	}

	/**
	 * Loads a chat conversation from storage by ID.
	 *
	 * @param chatId - The ID of the chat to load
	 * @returns A promise that resolves with the loaded chat or undefined if not found
	 */
	public async loadChat(chatId: string): Promise<Chat | undefined> {
		return this.chatService.loadChat(chatId);
	}

	/**
	 * Gets all saved chat conversations.
	 *
	 * @returns A promise that resolves with an array of all saved chats
	 */
	public async getAllChats(): Promise<Chat[]> {
		return this.chatService.getAllChats();
	}

	/**
	 * Deletes a chat conversation from storage by ID.
	 *
	 * @param chatId - The ID of the chat to delete
	 * @returns A promise that resolves when the chat is deleted
	 */
	public async deleteChat(chatId: string): Promise<void> {
		await this.chatService.deleteChat(chatId);
	}

	/**
	 * Creates a new empty chat conversation.
	 *
	 * @returns The newly created chat
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
	 *
	 * @returns A promise that resolves with the API key or undefined if not found
	 */
	public async getProviderAPIKey(): Promise<string | undefined> {
		const currentModelType = this.modelService.getCurrentModelType() as ModelProviderType;
		return this.apiKeyService.getApiKey(currentModelType);
	}

	/**
	 * Updates the API key for the current provider.
	 *
	 * @returns A promise that resolves when the API key is updated
	 */
	public async updateAPIKey(): Promise<void> {
		const currentModelType = this.modelService.getCurrentModelType() as ModelProviderType;
		const providerName = this.getProviderNameFromType(currentModelType);
		await this.apiKeyService.promptForAPIKey(currentModelType, providerName);
	}

	/**
	 * Updates the API key for a specific provider.
	 *
	 * @param providerType - The type of provider to update the key for
	 * @param providerName - The display name of the provider
	 * @returns A promise that resolves when the API key is updated
	 */
	public async updateAPIKeyForProvider(providerType: ModelProviderType, providerName: string): Promise<void> {
		await this.apiKeyService.promptForAPIKey(providerType, providerName);
	}

	/**
	 * Checks if an API key exists for a specific provider.
	 *
	 * @param providerType - The type of provider to check
	 * @returns A promise that resolves with true if an API key exists, false otherwise
	 */
	public async hasAPIKeyForProvider(providerType: ModelProviderType): Promise<boolean> {
		const apiKey = await this.apiKeyService.getApiKey(providerType);
		return !!apiKey;
	}

	/**
	 * Removes the API key for a specific provider.
	 *
	 * @param providerType - The type of provider to remove the key for
	 * @returns A promise that resolves when the key is removed
	 */
	public async removeAPIKeyForProvider(providerType: ModelProviderType): Promise<void> {
		await this.apiKeyService.clearApiKey(providerType);
	}

	/**
	 * Removes all stored API keys from secure storage.
	 *
	 * @returns A promise that resolves when all keys are removed
	 */
	public async removeAllAPIKeys(): Promise<void> {
		await this.apiKeyService.clearAllApiKeys();
	}

	// #endregion

	// #region API Interaction

	/**
	 * Sends a prompt to the AI and receives a response.
	 * This is the main method for interacting with the AI.
	 *
	 * It handles:
	 * 1. API key validation and prompting
	 * 2. Request formatting for the selected model
	 * 3. Error handling, including CORS errors
	 * 4. Response parsing and formatting
	 *
	 * @param prompt - The user's prompt to send to the AI
	 * @returns A promise that resolves with the AI's response text
	 */
	public async fetchAIResponse(prompt: string): Promise<string> {
		// Get provider and model information
		const modelType = this.modelService.getCurrentModelType() as ModelProviderType;
		const providerName = this.getProviderNameFromType(modelType);
		const modelId = this.getCurrentModelId();

		// Check if we have an API key
		const apiKey = await this.getProviderAPIKey();

		// Prompt for API key if not found
		if (!apiKey) {
			const processedError = DevSphereErrorHandler.processApiError('No API key found, please check your API key, or try again later', modelId, providerName);
			return DevSphereErrorHandler.formatErrorAsSystemMessage(processedError);
		}

		try {
			// Set up the API request
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

			// Create the appropriate API provider for the current model
			const apiProvider = this.apiProviderFactory.createProvider(modelType, modelId);

			// Format the request body based on the provider
			const requestBody = apiProvider.formatRequestBody(prompt, DEFAULT_MAX_TOKENS);

			// Make the API request using the provider
			const response = await apiProvider.makeRequest(
				this.modelService.getCurrentEndpoint(),
				apiKey,
				requestBody,
				controller.signal
			);

			// Clear timeout since request completed
			clearTimeout(timeoutId);

			// Check response status
			if (!response.ok) {
				const processedError = DevSphereErrorHandler.processApiError('API request failed, please check your API key, or try again later', modelId, providerName);
				return DevSphereErrorHandler.formatErrorAsSystemMessage(processedError);
			}

			// Process the successful response
			const data = await response.json();

			// Extract and return the content using the provider's extraction method
			return apiProvider.extractResponseContent(data);
		} catch (error) {
			// Handle unexpected errors, including CORS errors
			console.error('Error in fetchAIResponse:', error);

			const message = error instanceof Error ? error.message : 'An unknown error occurred';

			// Process other errors
			const processedError = DevSphereErrorHandler.processApiError(message, modelId, providerName);
			return DevSphereErrorHandler.formatErrorAsSystemMessage(processedError);
		}
	}
}
