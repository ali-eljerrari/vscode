/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ModelProviderType } from '../../models/types.js';
import { CorsHandlerService } from '../corsHandlerService.js';
import { AnthropicProvider } from './anthropicProvider.js';
import { GoogleProvider } from './googleProvider.js';
import { IAPIProvider } from './apiProviderInterface.js';
import { OpenAIProvider } from './openAIProvider.js';

/**
 * Factory class for creating API providers.
 * This factory implements the Factory pattern to create appropriate API providers
 * based on the model type. It handles:
 * - Provider instantiation
 * - CORS handler injection
 * - Provider type validation
 *
 * The factory supports three types of providers:
 * - OpenAI (ChatgptModels)
 * - Anthropic (AnthropicModels)
 * - Google (GoogleModels)
 */
export class ApiProviderFactory {
	constructor(private readonly corsHandler: CorsHandlerService) { }

	/**
	 * Creates the appropriate API provider based on the model type.
	 * This method implements the factory pattern to instantiate the correct
	 * provider implementation for the specified model type.
	 *
	 * @param modelType - The type of model provider to create
	 * @param modelId - The specific model ID to use
	 * @returns An instance of the appropriate API provider
	 * @throws Error if the model type is not supported
	 */
	createProvider(modelType: ModelProviderType, modelId: string): IAPIProvider {
		switch (modelType) {
			case 'ChatgptModels':
				return new OpenAIProvider(modelId);
			case 'AnthropicModels':
				return new AnthropicProvider(modelId, this.corsHandler);
			case 'GoogleModels':
				return new GoogleProvider(modelId, this.corsHandler);
			default:
				throw new Error(`Unsupported model type: ${modelType}`);
		}
	}
}
