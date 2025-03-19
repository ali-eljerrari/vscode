/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ISecretStorageService } from '../../../../../platform/secrets/common/secrets.js';
import { IQuickInputService } from '../../../../../platform/quickinput/common/quickInput.js';
import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { ModelProviderType } from '../models/devSphereModels.js';

/**
 * Manages API keys for different AI model providers
 */
export class KeyManager {
	// API key storage keys for different providers
	private readonly OPENAI_API_KEY_SECRET_KEY = 'openai.api.key';
	private readonly ANTHROPIC_API_KEY_SECRET_KEY = 'anthropic.api.key';
	private readonly GOOGLE_API_KEY_SECRET_KEY = 'google.api.key';

	constructor(
		private readonly secretStorageService: ISecretStorageService,
		private readonly quickInputService: IQuickInputService,
		private readonly notificationService: INotificationService
	) { }

	/**
	 * Gets the current API key for the specified model provider
	 */
	public async getApiKey(modelType: ModelProviderType): Promise<string | undefined> {
		const keySecretKey = this.getSecretKeyForProvider(modelType);

		// Try to get the key from secret storage
		let key = await this.secretStorageService.get(keySecretKey);

		// If the key doesn't exist in storage, prompt the user to enter it
		if (!key) {
			key = await this.promptForAPIKey(modelType);
		}

		return key;
	}

	/**
	 * Updates the API key for the specified model provider
	 */
	public async updateApiKey(modelType: ModelProviderType): Promise<void> {
		const providerName = this.getProviderName(modelType);
		this.notificationService.info(`Please enter your ${providerName} API key.`);
		const newKey = await this.promptForAPIKey(modelType);
		if (newKey) {
			this.notificationService.info(`${providerName} API key updated successfully.`);
		}
	}

	/**
	 * Gets the provider name from the model type
	 */
	private getProviderName(modelType: ModelProviderType): string {
		switch (modelType) {
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
	 * Gets the secret key name for the provider
	 */
	private getSecretKeyForProvider(modelType: ModelProviderType): string {
		switch (modelType) {
			case 'ChatgptModels':
				return this.OPENAI_API_KEY_SECRET_KEY;
			case 'AnthropicModels':
				return this.ANTHROPIC_API_KEY_SECRET_KEY;
			case 'GoogleModels':
				return this.GOOGLE_API_KEY_SECRET_KEY;
			default:
				return this.OPENAI_API_KEY_SECRET_KEY; // Default to OpenAI
		}
	}

	/**
	 * Prompts the user to enter an API key
	 */
	private async promptForAPIKey(modelType: ModelProviderType): Promise<string | undefined> {
		const providerName = this.getProviderName(modelType);
		let keyPattern = '';
		const secretKey = this.getSecretKeyForProvider(modelType);

		switch (modelType) {
			case 'ChatgptModels':
				keyPattern = 'sk-';
				break;
			case 'AnthropicModels':
				keyPattern = 'sk-';  // Anthropic also uses sk- prefix
				break;
			case 'GoogleModels':
				keyPattern = '';  // Google keys don't have a specific prefix
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
}
