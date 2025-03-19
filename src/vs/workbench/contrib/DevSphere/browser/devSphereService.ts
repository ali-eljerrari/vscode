/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ISecretStorageService } from '../../../../platform/secrets/common/secrets.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

export interface IDevSphereService {
	getOpenAIAPIKey(): Promise<string | undefined>;
	updateAPIKey(): Promise<void>;
	fetchAIResponse(prompt: string): Promise<string>;
}

export const IDevSphereService = createDecorator<IDevSphereService>('devSphereService');

export class DevSphereService implements IDevSphereService {
	private readonly OPENAI_API_KEY_SECRET_KEY = 'openai.api.key';
	private readonly API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
	private readonly MODEL = 'gpt-4o-mini';
	private readonly MAX_TOKENS = 500;

	constructor(
		@ISecretStorageService private readonly secretStorageService: ISecretStorageService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@INotificationService private readonly notificationService: INotificationService
	) { }

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
					model: this.MODEL,
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
