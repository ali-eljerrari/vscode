/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ISecretStorageService } from '../../../../platform/secrets/common/secrets.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';

// Define available OpenAI models
export interface OpenAIModel {
	id: string;
	name: string;
	description: string;
}

export const OPENAI_MODELS: OpenAIModel[] = [
	// Low cost models
	{ id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: '$ - Cheapest option for basic tasks' },
	{ id: 'gpt-4o-mini', name: 'GPT-4o mini', description: '$$ - Affordable small model with good capabilities' },
	{ id: 'o1-mini', name: 'o1-mini', description: '$$ - Affordable reasoning model' },

	// Mid-range models
	{ id: 'o3-mini', name: 'o3-mini', description: '$$$ - Mid-range reasoning model' },
	{ id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: '$$$ - Mid-range versatile model' },
	{ id: 'gpt-4o', name: 'GPT-4o', description: '$$$ - High-quality versatile model' },

	// Premium models
	{ id: 'gpt-4', name: 'GPT-4', description: '$$$$ - Premium model for complex tasks' },
	{ id: 'o1', name: 'o1', description: '$$$$ - Premium reasoning model' },
	{ id: 'gpt-4.5-preview', name: 'GPT-4.5 Preview', description: '$$$$$ - Most expensive, most capable GPT model' }
];

export interface IDevSphereService {
	getOpenAIAPIKey(): Promise<string | undefined>;
	updateAPIKey(): Promise<void>;
	fetchAIResponse(prompt: string): Promise<string>;

	// New methods for model management
	getAvailableModels(): OpenAIModel[];
	getCurrentModel(): OpenAIModel;
	setCurrentModel(modelId: string): void;
}

export const IDevSphereService = createDecorator<IDevSphereService>('devSphereService');

export class DevSphereService implements IDevSphereService {
	private readonly OPENAI_API_KEY_SECRET_KEY = 'openai.api.key';
	private readonly API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
	private readonly MODEL_STORAGE_KEY = 'openai.model.id';
	private readonly MAX_TOKENS = 500;

	// Current model, default to gpt-4o-mini
	private currentModel: OpenAIModel = OPENAI_MODELS[1];

	constructor(
		@ISecretStorageService private readonly secretStorageService: ISecretStorageService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@INotificationService private readonly notificationService: INotificationService,
		@IStorageService private readonly storageService: IStorageService
	) {
		// Initialize by loading saved model preference
		this.loadSavedModel();
	}

	private loadSavedModel(): void {
		// Try to get the saved model ID from storage service
		const savedModelId = this.storageService.get(this.MODEL_STORAGE_KEY, StorageScope.PROFILE);
		if (savedModelId) {
			const matchedModel = OPENAI_MODELS.find(model => model.id === savedModelId);
			if (matchedModel) {
				this.currentModel = matchedModel;
			}
		}
	}

	public getAvailableModels(): OpenAIModel[] {
		return OPENAI_MODELS;
	}

	public getCurrentModel(): OpenAIModel {
		return this.currentModel;
	}

	public setCurrentModel(modelId: string): void {
		const model = OPENAI_MODELS.find(m => m.id === modelId);
		if (model) {
			this.currentModel = model;
			// Save preference to storage service
			this.storageService.store(this.MODEL_STORAGE_KEY, modelId, StorageScope.PROFILE, StorageTarget.USER);
		}
	}

	public async getOpenAIAPIKey(): Promise<string | undefined> {
		// Try to get the key from secret storage
		let key = await this.secretStorageService.get(this.OPENAI_API_KEY_SECRET_KEY);

		// If the key doesn't exist in storage, prompt the user to enter it
		if (!key) {
			key = await this.promptForAPIKey();
		}

		return key;
	}

	public async updateAPIKey(): Promise<void> {
		const newKey = await this.promptForAPIKey();
		if (newKey) {
			this.notificationService.info('API key updated successfully.');
		}
	}

	private async promptForAPIKey(): Promise<string | undefined> {
		const result = await this.quickInputService.input({
			title: 'Enter your OpenAI API Key',
			placeHolder: 'sk-...',
			password: true,
			ignoreFocusLost: true,
			validateInput: async (value: string) => {
				if (!value || !value.trim().startsWith('sk-')) {
					return 'Please enter a valid OpenAI API key starting with "sk-"';
				}
				return null;
			}
		});

		if (result) {
			// Store the API key in the secret storage
			await this.secretStorageService.set(this.OPENAI_API_KEY_SECRET_KEY, result);
			this.notificationService.info('API key saved securely.');
			return result;
		}

		return undefined;
	}

	public async fetchAIResponse(prompt: string): Promise<string> {
		const apiKey = await this.getOpenAIAPIKey();
		if (!apiKey) {
			throw new Error('No API key available. Please set your OpenAI API key first.');
		}

		try {
			const response = await fetch(this.API_ENDPOINT, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${apiKey}`
				},
				body: JSON.stringify({
					model: this.currentModel.id,
					messages: [
						{
							role: 'user',
							content: prompt
						}
					],
					max_tokens: this.MAX_TOKENS
				})
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => null);
				const errorMessage = `Error: ${response.status} - ${response.statusText}
                    ${errorData ? JSON.stringify(errorData, null, 2) : 'No additional error information'}`;
				throw new Error(errorMessage);
			}

			const data = await response.json();
			if (data.choices && data.choices.length > 0) {
				return data.choices[0].message.content;
			} else {
				throw new Error('Unable to parse response from API.');
			}
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
			throw new Error('Unknown error occurred while fetching AI response');
		}
	}
}
