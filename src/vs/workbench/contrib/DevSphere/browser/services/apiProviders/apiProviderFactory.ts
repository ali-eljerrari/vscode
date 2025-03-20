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
 * Factory for creating API providers
 */
export class ApiProviderFactory {
	constructor(private readonly corsHandler: CorsHandlerService) { }

	/**
	 * Creates the appropriate API provider based on the model type
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
