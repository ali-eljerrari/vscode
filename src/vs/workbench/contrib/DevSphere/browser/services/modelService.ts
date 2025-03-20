/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { DEFAULT_MODEL_ID, DEFAULT_MODEL_PROVIDER, OPENAI_MODELS, STORAGE_KEYS } from '../models/modelData.js';
import { ModelInfo, ModelInfoWithProvider, ModelProviderType, ModelWithProvider, OpenAIModel } from '../models/types.js';

/**
 * Service for managing models
 */
export class ModelService {
	// Current model state
	/**
	 * The current model
	 *
	 * @type {OpenAIModel}
	 */
	private currentModel: OpenAIModel;
	/**
	 * The current model ID
	 *
	 * @type {string}
	 */
	private currentModelId: string = DEFAULT_MODEL_ID;
	/**
	 * The current model type
	 *
	 * @type {ModelProviderType}
	 */
	private currentModelType: ModelProviderType = DEFAULT_MODEL_PROVIDER;

	constructor(
		private readonly storageService: IStorageService
	) {
		this.currentModel = OPENAI_MODELS[0];

		// Initialize by loading saved model preference
		this.loadSavedModel();
	}

	/**
	 * Gets all available models
	 */
	public getAvailableModels(): OpenAIModel[] {
		return OPENAI_MODELS;
	}

	/**
	 * Gets the current model
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
	 * Gets the current model type
	 */
	public getCurrentModelType(): ModelProviderType {
		return this.currentModelType;
	}

	/**
	 * Gets the name of the current model
	 */
	public getCurrentModelName(): string {
		const models = this.currentModel[this.currentModelType].models;
		const model = models.find(m => m.id === this.currentModelId);
		return model ? model.name : this.currentModelId;
	}

	/**
	 * Gets the endpoint for the current model
	 */
	public getCurrentEndpoint(): string {
		return this.currentModel[this.currentModelType].endPoint;
	}

	/**
	 * Sets the current model by ID
	 */
	public setCurrentModel(modelId: string): void {
		// Find the model with the given ID across all provider models
		for (const model of OPENAI_MODELS) {
			// Check ChatGPT models
			const chatgptMatch = model.ChatgptModels.models.find(m => m.id === modelId);
			if (chatgptMatch) {
				this.currentModel = model;
				this.currentModelId = modelId;
				this.currentModelType = 'ChatgptModels';
				this.saveModelPreference();
				return;
			}

			// Check Anthropic models
			const anthropicMatch = model.AnthropicModels.models.find(m => m.id === modelId);
			if (anthropicMatch) {
				this.currentModel = model;
				this.currentModelId = modelId;
				this.currentModelType = 'AnthropicModels';
				this.saveModelPreference();
				return;
			}

			// Check Google models
			const googleMatch = model.GoogleModels.models.find(m => m.id === modelId);
			if (googleMatch) {
				this.currentModel = model;
				this.currentModelId = modelId;
				this.currentModelType = 'GoogleModels';
				this.saveModelPreference();
				return;
			}
		}
	}

	/**
	 * Gets the human-readable name for a provider type
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
	 * Gets the current provider name
	 */
	public getCurrentProviderName(): string {
		return this.getProviderNameFromType(this.currentModelType);
	}

	/**
	 * Gets all available models for a specific provider
	 */
	public getAvailableModelsByProvider(providerType: ModelProviderType): ModelInfoWithProvider[] {
		// Get all models for a specific provider from all model definitions
		const modelsForProvider: ModelInfoWithProvider[] = [];

		// Get provider name for the type
		const providerName = this.getProviderNameFromType(providerType);

		for (const model of OPENAI_MODELS) {
			if (model[providerType] && model[providerType].models) {
				// Add the provider name to each model
				const modelsWithProvider = model[providerType].models.map(m => ({
					...m,
					provider: providerName
				}));
				modelsForProvider.push(...modelsWithProvider);
			}
		}

		return modelsForProvider;
	}

	/**
	 * Gets model information for a specific model ID
	 */
	public getModelInfoById(modelId: string): ModelWithProvider | null {
		for (const model of OPENAI_MODELS) {
			// Check ChatGPT models
			const chatgptMatch = model.ChatgptModels.models.find(m => m.id === modelId);
			if (chatgptMatch) {
				return { provider: 'ChatgptModels', info: chatgptMatch };
			}

			// Check Anthropic models
			const anthropicMatch = model.AnthropicModels.models.find(m => m.id === modelId);
			if (anthropicMatch) {
				return { provider: 'AnthropicModels', info: anthropicMatch };
			}

			// Check Google models
			const googleMatch = model.GoogleModels.models.find(m => m.id === modelId);
			if (googleMatch) {
				return { provider: 'GoogleModels', info: googleMatch };
			}
		}

		return null;
	}

	/**
	 * Finds models with specific capabilities
	 */
	public findModelsByCapability(capability: 'coding' | 'reasoning' | 'speed' | 'cost-effective'): ModelInfoWithProvider[] {
		const result: ModelInfoWithProvider[] = [];

		// Define keywords to search for in model names and descriptions
		const keywordMap: Record<string, string[]> = {
			'coding': ['code', 'programming', 'developer'],
			'reasoning': ['reasoning', 'think', 'thinking', 'smart'],
			'speed': ['fast', 'speed', 'quick', 'haiku', 'flash', 'turbo'],
			'cost-effective': ['cheap', 'affordable', 'cost', 'mini']
		};

		const keywords = keywordMap[capability];

		// Search all models across all providers
		for (const model of OPENAI_MODELS) {
			// OpenAI models
			this.findModelsMatchingKeywords(model.ChatgptModels.models, keywords, 'OpenAI', result);

			// Anthropic models
			this.findModelsMatchingKeywords(model.AnthropicModels.models, keywords, 'Anthropic', result);

			// Google models
			this.findModelsMatchingKeywords(model.GoogleModels.models, keywords, 'Google', result);
		}

		return result;
	}

	/**
	 * Helper to find models matching specific keywords
	 */
	private findModelsMatchingKeywords(
		models: ModelInfo[],
		keywords: string[],
		providerName: string,
		result: ModelInfoWithProvider[]
	): void {
		for (const m of models) {
			const nameAndDesc = (m.name + ' ' + m.description).toLowerCase();
			if (keywords.some(keyword => nameAndDesc.includes(keyword.toLowerCase()))) {
				result.push({
					...m,
					provider: providerName
				});
			}
		}
	}

	/**
	 * Loads the saved model preference
	 */
	private loadSavedModel(): void {
		// Try to get the saved model ID from storage service
		const savedModelId = this.storageService.get(STORAGE_KEYS.MODEL_ID, StorageScope.PROFILE);
		if (savedModelId) {
			this.setCurrentModel(savedModelId);
		}
	}

	/**
	 * Saves the current model preference
	 */
	private saveModelPreference(): void {
		this.storageService.store(
			STORAGE_KEYS.MODEL_ID,
			this.currentModelId,
			StorageScope.APPLICATION,
			StorageTarget.MACHINE
		);
	}
}
