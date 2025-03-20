/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { IQuickInputService } from '../../../../../platform/quickinput/common/quickInput.js';
import { ISecretStorageService } from '../../../../../platform/secrets/common/secrets.js';
import { IStorageService } from '../../../../../platform/storage/common/storage.js';
import { DevSphereErrorHandler, DevSphereErrorCategory } from '../devSphereErrorHandler.js';
import { DEFAULT_MAX_TOKENS } from '../models/modelData.js';
import { Chat, DevSphereError, ModelInfoWithProvider, ModelProviderType, ModelWithProvider, OpenAIModel } from '../models/types.js';
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
	 * Prompts for an API key for a specific model type.
	 * @param modelType - The type of model to get the key for
	 * @returns The entered API key or undefined if cancelled
	 */
	private async promptForAPIKey(modelType: ModelProviderType): Promise<string | undefined> {
		const providerName = this.getProviderNameFromType(modelType);
		return this.apiKeyService.promptForAPIKey(modelType, providerName);
	}

	// #endregion

	// #region API Interaction

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
		// Get provider and model information
		const modelType = this.modelService.getCurrentModelType() as ModelProviderType;
		const providerName = this.getProviderNameFromType(modelType);
		const modelId = this.getCurrentModelId();

		// Check if we have an API key
		let apiKey = await this.getProviderAPIKey();

		// Prompt for API key if not found
		if (!apiKey) {
			this.notificationService.info(`No ${providerName} API key found. Please enter your API key.`);
			apiKey = await this.promptForAPIKey(modelType);

			// If user cancelled, early return
			if (!apiKey) {
				return `**${providerName} API Key Required**

To use ${providerName} models, you need to add your API key first. Please click the "Add API Key" button to continue.`;
			}

			this.notificationService.info(`${providerName} API key added successfully. Processing your request...`);
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
			).catch(async (error) => {
				// Special handling for Anthropic alternative endpoint
				if (modelType === 'AnthropicModels' && this.corsHandler.isCORSError(error)) {
					const anthropicProvider = this.apiProviderFactory.createProvider(modelType, modelId);
					if ('makeAlternativeRequest' in anthropicProvider) {
						// Try the alternative endpoint approach
						return (anthropicProvider as any).makeAlternativeRequest(
							this.modelService.getCurrentEndpoint(),
							apiKey,
							requestBody,
							controller.signal
						);
					}
				}
				throw error;
			});

			// Clear the timeout since we received a response
			clearTimeout(timeoutId);

			// Check for errors in the response
			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
				const statusCode = response.status;

				// Handle different error types
				if (statusCode === 401 || statusCode === 403 ||
					errorData.error?.code === 'invalid_api_key' ||
					errorData.error?.message?.toLowerCase().includes('api key') ||
					errorData.error?.message?.toLowerCase().includes('authentication')) {

					// Authentication error - prompt for a new key
					this.notificationService.info(`${providerName} API key is invalid or unauthorized. Please enter a new key.`);
					const newKey = await this.promptForAPIKey(modelType);

					// If user provided a new key, retry the request
					if (newKey) {
						return this.fetchAIResponse(prompt);
					}

					// Return a formatted authentication error
					const error: DevSphereError = {
						category: DevSphereErrorCategory.AUTHENTICATION,
						message: `**Invalid ${providerName} API Key**

The API request failed with an authentication error (${statusCode}). This typically happens when:
- The API key is incorrect or has been revoked
- The API key doesn't have permission for the selected model
- The API key has expired or reached its quota limit

Please update your API key to continue using ${providerName} models.`,
						provider: providerName,
						modelId: modelId,
						retryable: true,
						actionLabel: `Update ${providerName} API Key`,
						actionFn: async () => {
							await this.promptForAPIKey(modelType);
						}
					};

					return DevSphereErrorHandler.formatErrorAsSystemMessage(error);
				} else if (statusCode === 429) {
					// Rate limit error
					const error: DevSphereError = {
						category: DevSphereErrorCategory.API_RATE_LIMIT,
						message: `**Rate Limit Exceeded for ${providerName}**

The API request was rejected because you've reached the rate limit (${statusCode}). This typically happens when:
- You've sent too many requests in a short period of time
- You've exceeded your tier's usage quota or billing limits
- The service is experiencing high demand

Please wait a moment before trying again.`,
						provider: providerName,
						modelId: modelId,
						retryable: true
					};

					return DevSphereErrorHandler.formatErrorAsSystemMessage(error);
				} else {
					// Generic API error
					const errorMessage = errorData.error?.message || `API error (${statusCode})`;
					const error: DevSphereError = {
						category: DevSphereErrorCategory.API_RESPONSE,
						message: `**Error from ${providerName} API**

The API returned an error: ${errorMessage}`,
						provider: providerName,
						modelId: modelId,
						retryable: true
					};

					return DevSphereErrorHandler.formatErrorAsSystemMessage(error);
				}
			}

			// Process the successful response
			const data = await response.json();

			// Extract and return the content using the provider's extraction method
			return apiProvider.extractResponseContent(data);
		} catch (error) {
			// Handle unexpected errors, including CORS errors
			console.error('Error in fetchAIResponse:', error);

			// Check if this is a CORS error
			if (error instanceof Error && this.corsHandler.isCORSError(error)) {
				// Create a CORS error with a switch model action
				const corsError = this.corsHandler.createCORSErrorMessage(
					providerName,
					modelId,
					error.message || 'CORS error',
					() => {
						// Switch to OpenAI model
						this.setCurrentModel('gpt-4o-mini');
						this.notificationService.info(`Switched to OpenAI GPT-4o mini to avoid CORS issues.`);
					}
				);

				return DevSphereErrorHandler.formatErrorAsSystemMessage(corsError);
			}

			// Process other errors
			const processedError = DevSphereErrorHandler.processApiError(error, modelId, providerName);
			return DevSphereErrorHandler.formatErrorAsSystemMessage(processedError);
		}
	}

	// #endregion
}
