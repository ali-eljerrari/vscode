/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ISecretStorageService } from '../../../../platform/secrets/common/secrets.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { DevSphereError, DevSphereErrorCategory, DevSphereErrorHandler } from './devSphereErrorHandler.js';

// Define available OpenAI models
export interface OpenAIModel {
	ChatgptModels: {
		models: {
			id: string;
			name: string;
			description: string;
		}[];
		endPoint: string;
	};
	AnthropicModels: {
		models: {
			id: string;
			name: string;
			description: string;
		}[];
		endPoint: string;
	};
	GoogleModels: {
		models: {
			id: string;
			name: string;
			description: string;
		}[];
		endPoint: string;
	};
}

export const OPENAI_MODELS: OpenAIModel[] = [
	{
		ChatgptModels: {
			models: [
				// Low cost models
				{ id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo, Cheapest option for basic tasks', description: 'Cheapest option for basic tasks' },
				{ id: 'gpt-4o-mini', name: 'GPT-4o mini, Affordable small model with good capabilities', description: 'Affordable small model with good capabilities' },
				{ id: 'o1-mini', name: 'o1-mini, Affordable reasoning model', description: 'Affordable reasoning model' },

				// Mid-range models
				{ id: 'o3-mini', name: 'o3-mini, Mid-range reasoning model', description: 'Mid-range reasoning model' },
				{ id: 'gpt-4-turbo', name: 'GPT-4 Turbo, Mid-range versatile model', description: 'Mid-range versatile model' },
				{ id: 'gpt-4o', name: 'GPT-4o, High-quality versatile model', description: 'High-quality versatile model' },

				// Premium models
				{ id: 'gpt-4', name: 'GPT-4, Premium model for complex tasks', description: 'Premium model for complex tasks' },
				{ id: 'o1', name: 'o1, Premium reasoning model', description: 'Premium reasoning model' },
				{ id: 'gpt-4.5-preview', name: 'GPT-4.5 Preview, Most expensive, most capable GPT model', description: 'Most expensive, most capable GPT model' },
			],
			endPoint: 'https://api.openai.com/v1/chat/completions'
		},
		// Anthropic Models
		AnthropicModels: {
			models: [
				// Fast models
				{ id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', description: 'Intelligence at blazing speeds' },

				// High performance models
				{ id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', description: 'Powerful model for complex tasks' },
				{ id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', description: 'High intelligence and capability' },
				{ id: 'claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet', description: 'Most intelligent model with extended thinking' },
			],
			endPoint: 'https://api.anthropic.com/v1/messages'
		},

		// Google Models
		GoogleModels: {
			models: [
				// Gemini 2.0 models
				{ id: 'gemini-2.0-pro-experimental', name: 'Gemini 2.0 Pro Experimental', description: 'Top model for coding and complex prompts' },

				// Gemini 2.0 models
				{ id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', description: 'Powerful workhorse with low latency' },
				{ id: 'gemini-2.0-flash-thinking', name: 'Gemini 2.0 Flash Thinking', description: 'Enhanced reasoning with visible thought process' },
				{ id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash-Lite', description: 'Most cost-efficient model' },

			],
			endPoint: 'https://generativelanguage.googleapis.com/v1beta/models'
		}
	}



];

export interface Message {
	id: string;
	role: 'user' | 'assistant' | 'system' | 'loading';
	content: string;
	timestamp: number;

	// Optional model-specific features
	thinking?: string;       // For models that support showing reasoning steps (e.g. Google "thinking" models)
	toolCalls?: any[];       // For models that support tool calls (Function Calling)
	followUpQuestions?: string[]; // Suggested follow-up questions
	attachments?: {          // For messages with attachments like code snippets or images
		type: 'code' | 'image' | 'file';
		content: string;     // Content or URL
		language?: string;   // For code snippets
		name?: string;       // For files
	}[];
}

export interface Chat {
	id: string;
	title: string;
	messages: Message[];
	lastModified: number;
	modelId: string;
	provider?: 'ChatgptModels' | 'AnthropicModels' | 'GoogleModels';

	// Additional metadata to enhance UI
	modelCapabilities?: {
		supportsImages?: boolean;
		supportsCode?: boolean;
		supportsThinking?: boolean;
		supportsFunctionCalling?: boolean;
	};
	pinnedMessages?: string[]; // IDs of pinned messages
	tags?: string[];           // User-defined tags for organization
}

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
	getAvailableModelsByProvider(providerType: 'ChatgptModels' | 'AnthropicModels' | 'GoogleModels'): { id: string; name: string; description: string; provider: string }[];
	findModelsByCapability(capability: 'coding' | 'reasoning' | 'speed' | 'cost-effective'): { id: string; name: string; description: string; provider: string }[];

	// Helper methods
	getModelInfoById(modelId: string): { provider: 'ChatgptModels' | 'AnthropicModels' | 'GoogleModels'; info: { id: string; name: string; description: string } } | null;
	getProviderNameFromType(providerType: 'ChatgptModels' | 'AnthropicModels' | 'GoogleModels'): string;

	// Chat persistence
	saveChat(chat: Chat): Promise<void>;
	loadChat(chatId: string): Promise<Chat | undefined>;
	getAllChats(): Promise<Chat[]>;
	deleteChat(chatId: string): Promise<void>;
	createNewChat(): Chat;
}

export const IDevSphereService = createDecorator<IDevSphereService>('devSphereService');

export class DevSphereService implements IDevSphereService {
	// API key storage keys for different providers
	private readonly OPENAI_API_KEY_SECRET_KEY = 'openai.api.key';
	private readonly ANTHROPIC_API_KEY_SECRET_KEY = 'anthropic.api.key';
	private readonly GOOGLE_API_KEY_SECRET_KEY = 'google.api.key';

	private readonly MODEL_STORAGE_KEY = 'openai.model.id';
	private readonly CHATS_STORAGE_KEY = 'devSphere.chats';
	private readonly MAX_TOKENS = 500;

	// Current model, default to first model in OPENAI_MODELS
	private currentModel: OpenAIModel = OPENAI_MODELS[0];
	private currentModelId: string = 'gpt-4o-mini'; // Default model ID
	private currentModelType: 'ChatgptModels' | 'AnthropicModels' | 'GoogleModels' = 'ChatgptModels'; // Default model type

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
			// Find the model with the saved ID across all provider models
			for (const model of OPENAI_MODELS) {
				// Check ChatGPT models
				const chatgptMatch = model.ChatgptModels.models.find(m => m.id === savedModelId);
				if (chatgptMatch) {
					this.currentModel = model;
					this.currentModelId = savedModelId;
					this.currentModelType = 'ChatgptModels';
					return;
				}

				// Check Anthropic models
				const anthropicMatch = model.AnthropicModels.models.find(m => m.id === savedModelId);
				if (anthropicMatch) {
					this.currentModel = model;
					this.currentModelId = savedModelId;
					this.currentModelType = 'AnthropicModels';
					return;
				}

				// Check Google models
				const googleMatch = model.GoogleModels.models.find(m => m.id === savedModelId);
				if (googleMatch) {
					this.currentModel = model;
					this.currentModelId = savedModelId;
					this.currentModelType = 'GoogleModels';
					return;
				}
			}
		}
	}

	public getAvailableModels(): OpenAIModel[] {
		return OPENAI_MODELS;
	}

	public getCurrentModel(): OpenAIModel {
		return this.currentModel;
	}

	public getCurrentModelId(): string {
		return this.currentModelId;
	}

	public getCurrentModelType(): string {
		return this.currentModelType;
	}

	public getCurrentModelName(): string {
		const models = this.currentModel[this.currentModelType].models;
		const model = models.find(m => m.id === this.currentModelId);
		return model ? model.name : this.currentModelId;
	}

	public getCurrentProviderName(): string {
		return this.getProviderNameFromType(this.currentModelType);
	}

	public getAvailableModelsByProvider(providerType: 'ChatgptModels' | 'AnthropicModels' | 'GoogleModels'): { id: string; name: string; description: string; provider: string }[] {
		// Get all models for a specific provider from all model definitions
		const modelsForProvider: { id: string; name: string; description: string; provider: string }[] = [];

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

	// Helper to get provider name from type
	public getProviderNameFromType(providerType: 'ChatgptModels' | 'AnthropicModels' | 'GoogleModels'): string {
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

	public setCurrentModel(modelId: string): void {
		// Find the model with the given ID across all provider models
		for (const model of OPENAI_MODELS) {
			// Check ChatGPT models
			const chatgptMatch = model.ChatgptModels.models.find(m => m.id === modelId);
			if (chatgptMatch) {
				this.currentModel = model;
				this.currentModelId = modelId;
				this.currentModelType = 'ChatgptModels';
				this.storageService.store(this.MODEL_STORAGE_KEY, modelId, StorageScope.PROFILE, StorageTarget.USER);
				return;
			}

			// Check Anthropic models
			const anthropicMatch = model.AnthropicModels.models.find(m => m.id === modelId);
			if (anthropicMatch) {
				this.currentModel = model;
				this.currentModelId = modelId;
				this.currentModelType = 'AnthropicModels';
				this.storageService.store(this.MODEL_STORAGE_KEY, modelId, StorageScope.PROFILE, StorageTarget.USER);
				return;
			}

			// Check Google models
			const googleMatch = model.GoogleModels.models.find(m => m.id === modelId);
			if (googleMatch) {
				this.currentModel = model;
				this.currentModelId = modelId;
				this.currentModelType = 'GoogleModels';
				this.storageService.store(this.MODEL_STORAGE_KEY, modelId, StorageScope.PROFILE, StorageTarget.USER);
				return;
			}
		}
	}

	// Helper to get the current API endpoint based on model type
	private getCurrentEndpoint(): string {
		return this.currentModel[this.currentModelType].endPoint;
	}

	// Helper method to get information about a specific model by ID
	public getModelInfoById(modelId: string): { provider: 'ChatgptModels' | 'AnthropicModels' | 'GoogleModels'; info: { id: string; name: string; description: string } } | null {
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

	// Helper to format the request body based on the provider
	private formatRequestBody(prompt: string): any {
		switch (this.currentModelType) {
			case 'ChatgptModels':
				return {
					model: this.currentModelId,
					messages: [
						{
							role: 'user',
							content: prompt
						}
					],
					max_tokens: this.MAX_TOKENS
				};
			case 'AnthropicModels':
				return {
					model: this.currentModelId,
					messages: [
						{
							role: 'user',
							content: prompt
						}
					],
					max_tokens: this.MAX_TOKENS
				};
			case 'GoogleModels':
				return {
					model: this.currentModelId,
					contents: [
						{
							role: 'user',
							parts: [{ text: prompt }]
						}
					],
					maxTokens: this.MAX_TOKENS
				};
			default:
				throw new Error(`Unsupported model type: ${this.currentModelType}`);
		}
	}

	// Helper to extract response content based on the provider
	private extractResponseContent(data: any): string {
		switch (this.currentModelType) {
			case 'ChatgptModels':
				if (data.choices && data.choices.length > 0) {
					return data.choices[0].message.content;
				}
				break;
			case 'AnthropicModels':
				if (data.content && data.content.length > 0) {
					return data.content[0].text;
				}
				break;
			case 'GoogleModels':
				if (data.candidates && data.candidates.length > 0 &&
					data.candidates[0].content &&
					data.candidates[0].content.parts &&
					data.candidates[0].content.parts.length > 0) {
					return data.candidates[0].content.parts[0].text;
				}
				break;
		}
		throw new Error('Unable to parse response from API.');
	}

	// Get the appropriate API key for the current model provider
	public async getOpenAIAPIKey(): Promise<string | undefined> {
		let keySecretKey = this.OPENAI_API_KEY_SECRET_KEY;

		// Determine which key to use based on the current model type
		switch (this.currentModelType) {
			case 'ChatgptModels':
				keySecretKey = this.OPENAI_API_KEY_SECRET_KEY;
				break;
			case 'AnthropicModels':
				keySecretKey = this.ANTHROPIC_API_KEY_SECRET_KEY;
				break;
			case 'GoogleModels':
				keySecretKey = this.GOOGLE_API_KEY_SECRET_KEY;
				break;
		}

		// Try to get the key from secret storage
		let key = await this.secretStorageService.get(keySecretKey);

		// If the key doesn't exist in storage, prompt the user to enter it
		if (!key) {
			key = await this.promptForAPIKey(this.currentModelType);
		}

		return key;
	}

	public async updateAPIKey(): Promise<void> {
		const newKey = await this.promptForAPIKey(this.currentModelType);
		if (newKey) {
			this.notificationService.info(`${this.getCurrentProviderName()} API key updated successfully.`);
		}
	}

	private async promptForAPIKey(modelType: 'ChatgptModels' | 'AnthropicModels' | 'GoogleModels'): Promise<string | undefined> {
		const providerName = this.getCurrentProviderName();
		let keyPattern = '';
		let secretKey = '';

		switch (modelType) {
			case 'ChatgptModels':
				keyPattern = 'sk-';
				secretKey = this.OPENAI_API_KEY_SECRET_KEY;
				break;
			case 'AnthropicModels':
				keyPattern = 'sk-';  // Anthropic also uses sk- prefix
				secretKey = this.ANTHROPIC_API_KEY_SECRET_KEY;
				break;
			case 'GoogleModels':
				keyPattern = '';  // Google keys don't have a specific prefix
				secretKey = this.GOOGLE_API_KEY_SECRET_KEY;
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

	public async fetchAIResponse(prompt: string): Promise<string> {
		// Get the API key based on the current provider
		let apiKey = await this.getOpenAIAPIKey();

		// If no API key exists, prompt the user directly
		if (!apiKey) {
			const providerName = this.getCurrentProviderName();
			this.notificationService.info(`No ${providerName} API key found. Please enter your API key.`);

			// Directly prompt for the API key
			apiKey = await this.promptForAPIKey(this.currentModelType);

			// If user still doesn't provide a key, return error message
			if (!apiKey) {
				const error: DevSphereError = {
					category: DevSphereErrorCategory.API_KEY,
					message: `No ${providerName} API key provided. Please add your API key to use this model.`,
					provider: providerName,
					modelId: this.getCurrentModelId(),
					retryable: true,
					actionLabel: `Add ${providerName} API Key`,
					actionFn: async () => {
						await this.promptForAPIKey(this.currentModelType);
					}
				};

				return DevSphereErrorHandler.formatErrorAsSystemMessage(error);
			}
		}

		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

			// Set up headers and request body
			const headers = {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${apiKey}`
			};

			const requestBody = this.formatRequestBody(prompt);

			// Make the API request
			const response = await fetch(this.getCurrentEndpoint(), {
				method: 'POST',
				headers,
				body: JSON.stringify(requestBody),
				signal: controller.signal
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
				const statusCode = response.status;

				let category: DevSphereErrorCategory;
				let actionLabel: string | undefined;
				let actionFn: (() => void) | undefined;

				// Determine the error category based on status code and response
				if (statusCode === 401 || errorData.error?.code === 'invalid_api_key') {
					category = DevSphereErrorCategory.AUTHENTICATION;

					// Show notification and prompt for a new key immediately
					this.notificationService.info(`${this.getCurrentProviderName()} API key is invalid. Please enter a new key.`);
					const newKey = await this.promptForAPIKey(this.currentModelType);

					// If user provided a new key, retry the request
					if (newKey) {
						// Retry the request with the new key
						return this.fetchAIResponse(prompt);
					}

					// If user cancelled, show error with action button
					actionLabel = `Update ${this.getCurrentProviderName()} API Key`;
					actionFn = async () => {
						await this.promptForAPIKey(this.currentModelType);
					};
				} else if (statusCode === 429) {
					category = DevSphereErrorCategory.API_RATE_LIMIT;
				} else if (statusCode >= 500) {
					category = DevSphereErrorCategory.API_RESPONSE;
				} else {
					category = DevSphereErrorCategory.UNKNOWN;
				}

				// Return a formatted error message
				const error: DevSphereError = {
					category,
					message: errorData.error?.message || 'Error connecting to API.',
					provider: this.getCurrentProviderName(),
					modelId: this.getCurrentModelId(),
					retryable: true,
					actionLabel,
					actionFn
				};

				return DevSphereErrorHandler.formatErrorAsSystemMessage(error);
			}

			const data = await response.json();
			return this.extractResponseContent(data);
		} catch (error) {
			console.error('Error fetching AI response:', error);

			// Process the error
			const providerName = this.getCurrentProviderName();
			const modelId = this.getCurrentModelId();

			// Check if it's an abort error (timeout)
			if (error instanceof DOMException && error.name === 'AbortError') {
				const timeoutError: DevSphereError = {
					category: DevSphereErrorCategory.NETWORK,
					message: `Request to ${providerName} timed out after 60 seconds.`,
					provider: providerName,
					modelId: modelId,
					retryable: true
				};
				return DevSphereErrorHandler.formatErrorAsSystemMessage(timeoutError);
			}

			// For other errors
			const networkError: DevSphereError = {
				category: DevSphereErrorCategory.NETWORK,
				message: error instanceof Error ? error.message : 'Network error occurred.',
				provider: providerName,
				modelId: modelId,
				retryable: true
			};
			return DevSphereErrorHandler.formatErrorAsSystemMessage(networkError);
		}
	}

	// Chat persistence methods
	public async saveChat(chat: Chat): Promise<void> {
		// Update last modified time
		chat.lastModified = Date.now();

		// If the chat doesn't have a provider field, add it
		if (!chat.provider) {
			// Find the provider for the model ID
			const modelInfo = this.getModelInfoById(chat.modelId);
			if (modelInfo) {
				chat.provider = modelInfo.provider;
			} else {
				// Default to current provider if model can't be found
				chat.provider = this.currentModelType;
			}
		}

		// Get existing chats
		const chats = await this.getAllChats();

		// Find and update the chat if it exists, otherwise add it
		const existingChatIndex = chats.findIndex(c => c.id === chat.id);
		if (existingChatIndex >= 0) {
			chats[existingChatIndex] = chat;
		} else {
			chats.push(chat);
		}

		// Save to storage
		await this.storageService.store(
			this.CHATS_STORAGE_KEY,
			JSON.stringify(chats),
			StorageScope.PROFILE,
			StorageTarget.USER
		);
	}

	public async loadChat(chatId: string): Promise<Chat | undefined> {
		const chats = await this.getAllChats();
		return chats.find(chat => chat.id === chatId);
	}

	public async getAllChats(): Promise<Chat[]> {
		const chatsJson = this.storageService.get(this.CHATS_STORAGE_KEY, StorageScope.PROFILE);
		if (!chatsJson) {
			return [];
		}

		try {
			return JSON.parse(chatsJson);
		} catch (e) {
			this.notificationService.error('Failed to load chats: Invalid data format');
			return [];
		}
	}

	public async deleteChat(chatId: string): Promise<void> {
		const chats = await this.getAllChats();
		const filteredChats = chats.filter(chat => chat.id !== chatId);

		await this.storageService.store(
			this.CHATS_STORAGE_KEY,
			JSON.stringify(filteredChats),
			StorageScope.PROFILE,
			StorageTarget.USER
		);
	}

	public createNewChat(): Chat {
		const modelName = this.getCurrentModelName();
		const providerName = this.getCurrentProviderName();

		// Determine model capabilities based on model ID and provider
		const modelCapabilities = this.getModelCapabilities(this.currentModelId, this.currentModelType);

		return {
			id: `chat-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
			title: `New ${providerName} ${modelName} Chat`,
			messages: [],
			lastModified: Date.now(),
			modelId: this.currentModelId,
			provider: this.currentModelType,
			modelCapabilities,
			tags: []
		};
	}

	// Helper to determine model capabilities based on model ID and provider
	private getModelCapabilities(modelId: string, providerType: 'ChatgptModels' | 'AnthropicModels' | 'GoogleModels'): Chat['modelCapabilities'] {
		// Base capabilities - conservative defaults
		const capabilities: Chat['modelCapabilities'] = {
			supportsImages: false,
			supportsCode: true,
			supportsThinking: false,
			supportsFunctionCalling: false
		};

		// Enhance based on provider
		switch (providerType) {
			case 'ChatgptModels':
				// Most OpenAI models support function calling
				capabilities.supportsFunctionCalling = true;

				// GPT-4 models support images
				if (modelId.includes('gpt-4')) {
					capabilities.supportsImages = true;
				}
				break;

			case 'AnthropicModels':
				// Claude models support images
				capabilities.supportsImages = true;
				break;

			case 'GoogleModels':
				// Gemini models with "thinking" in the name support thinking
				if (modelId.includes('thinking')) {
					capabilities.supportsThinking = true;
				}

				// Most Gemini models support images
				capabilities.supportsImages = true;
				break;
		}

		return capabilities;
	}

	public findModelsByCapability(capability: 'coding' | 'reasoning' | 'speed' | 'cost-effective'): { id: string; name: string; description: string; provider: string }[] {
		const result: { id: string; name: string; description: string; provider: string }[] = [];

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
			for (const m of model.ChatgptModels.models) {
				const nameAndDesc = (m.name + ' ' + m.description).toLowerCase();
				if (keywords.some(keyword => nameAndDesc.includes(keyword.toLowerCase()))) {
					result.push({
						...m,
						provider: 'OpenAI'
					});
				}
			}

			// Anthropic models
			for (const m of model.AnthropicModels.models) {
				const nameAndDesc = (m.name + ' ' + m.description).toLowerCase();
				if (keywords.some(keyword => nameAndDesc.includes(keyword.toLowerCase()))) {
					result.push({
						...m,
						provider: 'Anthropic'
					});
				}
			}

			// Google models
			for (const m of model.GoogleModels.models) {
				const nameAndDesc = (m.name + ' ' + m.description).toLowerCase();
				if (keywords.some(keyword => nameAndDesc.includes(keyword.toLowerCase()))) {
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
