/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { ModelCapabilityType, ModelProviderType, OpenAIModel } from './devSphereModels.js';
import { CAPABILITY_KEYWORDS, OPENAI_MODELS } from './devSphereModelConstants.js';

/**
 * Manages available models and model selection
 */
export class ModelManager {
	private readonly MODEL_STORAGE_KEY = 'openai.model.id';

	// Current model state
	private currentModel: OpenAIModel = OPENAI_MODELS[0];
	private currentModelId: string = 'gpt-4o-mini'; // Default model ID
	private currentModelType: ModelProviderType = 'ChatgptModels'; // Default model type

	constructor(
		private readonly storageService: IStorageService
	) {
		// Initialize by loading saved model preference
		this.loadSavedModel();
	}

	/**
	 * Loads the previously selected model from storage
	 */
	private loadSavedModel(): void {
		// Try to get the saved model ID from storage service
		const savedModelId = this.storageService.get(this.MODEL_STORAGE_KEY, StorageScope.PROFILE);
		if (savedModelId) {
			// Find the model with the saved ID across all provider models
			for (const model of OPENAI_MODELS) {
				// Check ChatGPT models
				const chatgptMatch = model.ChatgptModels.models.find((m: { id: string }) => m.id === savedModelId);
				if (chatgptMatch) {
					this.currentModel = model;
					this.currentModelId = savedModelId;
					this.currentModelType = 'ChatgptModels';
					return;
				}

				// Check Anthropic models
				const anthropicMatch = model.AnthropicModels.models.find((m: { id: string }) => m.id === savedModelId);
				if (anthropicMatch) {
					this.currentModel = model;
					this.currentModelId = savedModelId;
					this.currentModelType = 'AnthropicModels';
					return;
				}

				// Check Google models
				const googleMatch = model.GoogleModels.models.find((m: { id: string }) => m.id === savedModelId);
				if (googleMatch) {
					this.currentModel = model;
					this.currentModelId = savedModelId;
					this.currentModelType = 'GoogleModels';
					return;
				}
			}
		}
	}

	/**
	 * Gets all available model definitions
	 */
	public getAvailableModels(): OpenAIModel[] {
		return OPENAI_MODELS;
	}

	/**
	 * Gets the current selected model
	 */
	public getCurrentModel(): OpenAIModel {
		return this.currentModel;
	}

	/**
	 * Gets the current model ID
	 */
	public getCurrentModelId(): string {
		return this.currentModelId;
	}

	/**
	 * Gets the current model type (provider)
	 */
	public getCurrentModelType(): ModelProviderType {
		return this.currentModelType;
	}

	/**
	 * Gets the display name for the current model
	 */
	public getCurrentModelName(): string {
		const models = this.currentModel[this.currentModelType].models;
		const model = models.find((m: { id: string }) => m.id === this.currentModelId);
		return model ? model.name : this.currentModelId;
	}

	/**
	 * Gets the provider name for the current model
	 */
	public getCurrentProviderName(): string {
		return this.getProviderNameFromType(this.currentModelType);
	}

	/**
	 * Gets the friendly name for a provider type
	 */
	public getProviderNameFromType(providerType: ModelProviderType): string {
		switch (providerType) {
			case 'ChatgptModels':
				return 'OpenAI';
			case 'AnthropicModels':
				return 'Anthropic';
			case 'GoogleModels':
				return 'Google';
			default:
				return 'AI';
		}
	}

	/**
	 * Gets models available for a specific provider
	 */
	public getAvailableModelsByProvider(providerType: ModelProviderType): { id: string; name: string; description: string; provider: string }[] {
		// Get all models for a specific provider from all model definitions
		const modelsForProvider: { id: string; name: string; description: string; provider: string }[] = [];

		// Get provider name for the type
		const providerName = this.getProviderNameFromType(providerType);

		for (const model of OPENAI_MODELS) {
			if (model[providerType] && model[providerType].models) {
				// Add the provider name to each model
				const modelsWithProvider = model[providerType].models.map((m: { id: string; name: string; description: string }) => ({
					...m,
					provider: providerName
				}));
				modelsForProvider.push(...modelsWithProvider);
			}
		}

		return modelsForProvider;
	}

	/**
	 * Sets the current model by ID
	 */
	public setCurrentModel(modelId: string): void {
		// Find the model with the given ID across all provider models
		for (const model of OPENAI_MODELS) {
			// Check ChatGPT models
			const chatgptMatch = model.ChatgptModels.models.find((m: { id: string }) => m.id === modelId);
			if (chatgptMatch) {
				this.currentModel = model;
				this.currentModelId = modelId;
				this.currentModelType = 'ChatgptModels';
				this.storageService.store(this.MODEL_STORAGE_KEY, modelId, StorageScope.PROFILE, StorageTarget.USER);
				return;
			}

			// Check Anthropic models
			const anthropicMatch = model.AnthropicModels.models.find((m: { id: string }) => m.id === modelId);
			if (anthropicMatch) {
				this.currentModel = model;
				this.currentModelId = modelId;
				this.currentModelType = 'AnthropicModels';
				this.storageService.store(this.MODEL_STORAGE_KEY, modelId, StorageScope.PROFILE, StorageTarget.USER);
				return;
			}

			// Check Google models
			const googleMatch = model.GoogleModels.models.find((m: { id: string }) => m.id === modelId);
			if (googleMatch) {
				this.currentModel = model;
				this.currentModelId = modelId;
				this.currentModelType = 'GoogleModels';
				this.storageService.store(this.MODEL_STORAGE_KEY, modelId, StorageScope.PROFILE, StorageTarget.USER);
				return;
			}
		}
	}

	/**
	 * Gets the current API endpoint based on model type
	 */
	public getCurrentEndpoint(): string {
		return this.currentModel[this.currentModelType].endPoint;
	}

	/**
	 * Gets information about a specific model by ID
	 */
	public getModelInfoById(modelId: string): { provider: ModelProviderType; info: { id: string; name: string; description: string } } | null {
		for (const model of OPENAI_MODELS) {
			// Check ChatGPT models
			const chatgptMatch = model.ChatgptModels.models.find((m: { id: string }) => m.id === modelId);
			if (chatgptMatch) {
				return { provider: 'ChatgptModels', info: chatgptMatch };
			}

			// Check Anthropic models
			const anthropicMatch = model.AnthropicModels.models.find((m: { id: string }) => m.id === modelId);
			if (anthropicMatch) {
				return { provider: 'AnthropicModels', info: anthropicMatch };
			}

			// Check Google models
			const googleMatch = model.GoogleModels.models.find((m: { id: string }) => m.id === modelId);
			if (googleMatch) {
				return { provider: 'GoogleModels', info: googleMatch };
			}
		}

		return null;
	}

	/**
	 * Finds models matching a specific capability
	 */
	public findModelsByCapability(capability: ModelCapabilityType): { id: string; name: string; description: string; provider: string }[] {
		const result: { id: string; name: string; description: string; provider: string }[] = [];

		// Get keywords for the requested capability
		const keywords = CAPABILITY_KEYWORDS[capability];
		if (!keywords) {
			return [];
		}

		// Search all models across all providers
		for (const model of OPENAI_MODELS) {
			// OpenAI models
			for (const m of model.ChatgptModels.models) {
				const nameAndDesc = (m.name + ' ' + m.description).toLowerCase();
				if (keywords.some((keyword: string) => nameAndDesc.includes(keyword.toLowerCase()))) {
					result.push({
						...m,
						provider: 'OpenAI'
					});
				}
			}

			// Anthropic models
			for (const m of model.AnthropicModels.models) {
				const nameAndDesc = (m.name + ' ' + m.description).toLowerCase();
				if (keywords.some((keyword: string) => nameAndDesc.includes(keyword.toLowerCase()))) {
					result.push({
						...m,
						provider: 'Anthropic'
					});
				}
			}

			// Google models
			for (const m of model.GoogleModels.models) {
				const nameAndDesc = (m.name + ' ' + m.description).toLowerCase();
				if (keywords.some((keyword: string) => nameAndDesc.includes(keyword.toLowerCase()))) {
					result.push({
						...m,
						provider: 'Google'
					});
				}
			}
		}

		return result;
	}
}
