/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ISecretStorageService } from '../../../../platform/secrets/common/secrets.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { DevSphereError, DevSphereErrorCategory } from './devSphereErrorHandler.js';

// Import model interfaces
import { Chat, ModelCapabilityType, ModelProviderType, OpenAIModel } from './models/devSphereModels.js';

// Import modules
import { KeyManager } from './utils/keyManager.js';
import { ChatManager } from './chat/chatManager.js';
import { ModelManager } from './models/modelManager.js';
import { ApiProviderFactory } from './api/apiProviders.js';

// Interface for the DevSphere service
export interface IDevSphereService {
	getOpenAIAPIKey(): Promise<string | undefined>;
	updateAPIKey(): Promise<void>;
	fetchAIResponse(prompt: string): Promise<string>;

	// Model management
	getAvailableModels(): OpenAIModel[];
	getCurrentModel(): OpenAIModel;
	setCurrentModel(modelId: string): void;

	// Model info and provider switching
	getCurrentModelId(): string;
	getCurrentModelType(): string;
	getCurrentModelName(): string;
	getCurrentProviderName(): string;
	getAvailableModelsByProvider(providerType: ModelProviderType): { id: string; name: string; description: string; provider: string }[];
	findModelsByCapability(capability: ModelCapabilityType): { id: string; name: string; description: string; provider: string }[];

	// Helper methods
	getModelInfoById(modelId: string): { provider: ModelProviderType; info: { id: string; name: string; description: string } } | null;
	getProviderNameFromType(providerType: ModelProviderType): string;

	// Chat persistence
	saveChat(chat: Chat): Promise<void>;
	loadChat(chatId: string): Promise<Chat | undefined>;
	getAllChats(): Promise<Chat[]>;
	deleteChat(chatId: string): Promise<void>;
	createNewChat(): Chat;
}

export const IDevSphereService = createDecorator<IDevSphereService>('devSphereService');

export class DevSphereService implements IDevSphereService {
	private keyManager: KeyManager;
	private chatManager: ChatManager;
	private modelManager: ModelManager;

	constructor(
		@ISecretStorageService secretStorageService: ISecretStorageService,
		@IQuickInputService quickInputService: IQuickInputService,
		@INotificationService private readonly notificationService: INotificationService,
		@IStorageService storageService: IStorageService
	) {
		this.keyManager = new KeyManager(secretStorageService, quickInputService, notificationService);
		this.chatManager = new ChatManager(storageService, notificationService);
		this.modelManager = new ModelManager(storageService);
	}

	/**
	 * Gets the current API key
	 */
	public async getOpenAIAPIKey(): Promise<string | undefined> {
		return await this.keyManager.getApiKey(this.modelManager.getCurrentModelType());
	}

	/**
	 * Updates the API key
	 */
	public async updateAPIKey(): Promise<void> {
		await this.keyManager.updateApiKey(this.modelManager.getCurrentModelType());
	}

	/**
	 * Fetches a response from the AI
	 */
	public async fetchAIResponse(prompt: string): Promise<string> {
		const modelId = this.modelManager.getCurrentModelId();
		const modelType = this.modelManager.getCurrentModelType();
		const providerName = this.modelManager.getCurrentProviderName();

		// Get the appropriate API provider
		const apiProvider = ApiProviderFactory.createProvider(modelType);

		// Get the API key
		const apiKey = await this.getOpenAIAPIKey();
		if (!apiKey) {
			this.notificationService.info(`No ${providerName} API key found. Please enter your API key.`);

			// Prompt for API key
			const newKey = await this.keyManager.getApiKey(modelType);

			// If user still doesn't provide a key, return error message
			if (!newKey) {
				const errorMessage = `**Error:** No ${providerName} API key provided.

You need to set up an API key to use ${providerName} models.`;

				const error: DevSphereError = {
					category: DevSphereErrorCategory.API_KEY,
					message: errorMessage,
					provider: providerName,
					modelId: modelId,
					retryable: true,
					actionLabel: `Add ${providerName} API Key`
				};

				throw error;
			}

			// If key was provided, retry with the new key
			return await apiProvider.sendRequest(prompt, modelId, newKey, providerName);
		}

		// Send the request to the provider
		return await apiProvider.sendRequest(prompt, modelId, apiKey, providerName);
	}

	// Model management methods - delegate to ModelManager
	public getAvailableModels(): OpenAIModel[] {
		return this.modelManager.getAvailableModels();
	}

	public getCurrentModel(): OpenAIModel {
		return this.modelManager.getCurrentModel();
	}

	public setCurrentModel(modelId: string): void {
		this.modelManager.setCurrentModel(modelId);
	}

	public getCurrentModelId(): string {
		return this.modelManager.getCurrentModelId();
	}

	public getCurrentModelType(): string {
		return this.modelManager.getCurrentModelType();
	}

	public getCurrentModelName(): string {
		return this.modelManager.getCurrentModelName();
	}

	public getCurrentProviderName(): string {
		return this.modelManager.getCurrentProviderName();
	}

	public getAvailableModelsByProvider(providerType: ModelProviderType): { id: string; name: string; description: string; provider: string }[] {
		return this.modelManager.getAvailableModelsByProvider(providerType);
	}

	public findModelsByCapability(capability: ModelCapabilityType): { id: string; name: string; description: string; provider: string }[] {
		return this.modelManager.findModelsByCapability(capability);
	}

	public getModelInfoById(modelId: string): { provider: ModelProviderType; info: { id: string; name: string; description: string } } | null {
		return this.modelManager.getModelInfoById(modelId);
	}

	public getProviderNameFromType(providerType: ModelProviderType): string {
		return this.modelManager.getProviderNameFromType(providerType);
	}

	// Chat management methods - delegate to ChatManager
	public async saveChat(chat: Chat): Promise<void> {
		// If the chat doesn't have a provider field, add it
		if (!chat.provider) {
			// Find the provider for the model ID
			const modelInfo = this.getModelInfoById(chat.modelId);
			if (modelInfo) {
				chat.provider = modelInfo.provider;
			} else {
				// Default to current provider if model can't be found
				chat.provider = this.modelManager.getCurrentModelType();
			}
		}

		await this.chatManager.saveChat(chat);
	}

	public async loadChat(chatId: string): Promise<Chat | undefined> {
		return await this.chatManager.loadChat(chatId);
	}

	public async getAllChats(): Promise<Chat[]> {
		return await this.chatManager.getAllChats();
	}

	public async deleteChat(chatId: string): Promise<void> {
		await this.chatManager.deleteChat(chatId);
	}

	public createNewChat(): Chat {
		const modelId = this.getCurrentModelId();
		const modelType = this.getCurrentModelType() as ModelProviderType;
		const modelName = this.getCurrentModelName();
		const providerName = this.getCurrentProviderName();

		return this.chatManager.createNewChat(modelId, modelType, modelName, providerName);
	}
}
