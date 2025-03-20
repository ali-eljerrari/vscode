/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { IQuickInputService } from '../../../../../platform/quickinput/common/quickInput.js';
import { ISecretStorageService } from '../../../../../platform/secrets/common/secrets.js';
import { STORAGE_KEYS } from '../models/modelData.js';
import { ModelProviderType } from '../models/types.js';

/**
 * Service for managing API keys
 */
export class ApiKeyService {
	constructor(
		private readonly secretStorageService: ISecretStorageService,
		private readonly quickInputService: IQuickInputService,
		private readonly notificationService: INotificationService,
	) { }

	/**
	 * Retrieves the API key for the specified provider
	 */
	public async getApiKey(providerType: ModelProviderType): Promise<string | undefined> {
		const secretKey = this.getSecretKeyForProvider(providerType);
		return await this.secretStorageService.get(secretKey);
	}

	/**
	 * Prompts the user to enter an API key for the specified provider
	 */
	public async promptForAPIKey(
		modelType: ModelProviderType,
		providerName: string
	): Promise<string | undefined> {
		let keyPattern = '';
		let secretKey = '';

		switch (modelType) {
			case 'ChatgptModels':
				keyPattern = 'sk-';
				secretKey = STORAGE_KEYS.OPENAI_API_KEY;
				break;
			case 'AnthropicModels':
				keyPattern = 'sk-';  // Anthropic also uses sk- prefix
				secretKey = STORAGE_KEYS.ANTHROPIC_API_KEY;
				break;
			case 'GoogleModels':
				keyPattern = '';  // Google keys don't have a specific prefix
				secretKey = STORAGE_KEYS.GOOGLE_API_KEY;
				break;
		}

		const result = await this.quickInputService.input({
			title: `Enter your ${providerName} API Key`,
			placeHolder: keyPattern ? `${keyPattern}...` : 'Enter API key...',
			password: true,
			ignoreFocusLost: true,
			validateInput: async (value: string) => {
				if (!value || (keyPattern && !value.trim().startsWith(keyPattern))) {
					return `Please enter a valid ${providerName} API key${keyPattern ? ` starting with "${keyPattern}"` : ''}`;
				}
				return null;
			}
		});

		if (result) {
			// Store the API key in the secret storage
			await this.secretStorageService.set(secretKey, result);
			this.notificationService.info('API key saved securely.');
			return result;
		}

		return undefined;
	}

	/**
	 * Gets the secret storage key for the specified provider
	 */
	private getSecretKeyForProvider(providerType: ModelProviderType): string {
		switch (providerType) {
			case 'ChatgptModels':
				return STORAGE_KEYS.OPENAI_API_KEY;
			case 'AnthropicModels':
				return STORAGE_KEYS.ANTHROPIC_API_KEY;
			case 'GoogleModels':
				return STORAGE_KEYS.GOOGLE_API_KEY;
			default:
				return STORAGE_KEYS.OPENAI_API_KEY;
		}
	}

	/**
	 * Clears the API key for the specified provider
	 */
	public async clearApiKey(providerType: ModelProviderType): Promise<void> {
		const secretKey = this.getSecretKeyForProvider(providerType);
		await this.secretStorageService.delete(secretKey);
	}
}
