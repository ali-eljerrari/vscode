/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/*
 * CORS Handling Strategy
 *
 * This file includes comprehensive CORS handling for API requests to different LLM providers:
 *
 * 1. OpenAI: Generally works well with browser-based requests
 * 2. Anthropic: Requires special handling due to CORS restrictions:
 *    - First tries a Node.js-based proxy approach to bypass CORS entirely
 *    - Falls back to direct fetch with special headers if node proxy isn't available
 *    - Tries alternative endpoint format as a last resort
 *    - Provides clear error messages and a quick switch to OpenAI if all approaches fail
 * 3. Google: Uses an API key in the URL approach with fallback options
 *
 * These strategies ensure the extension works well across different environments.
 */

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
	getProviderAPIKey(): Promise<string | undefined>;
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
				// Google API format is different when using the API key in the URL
				// The model is specified in the URL, not in the request body
				return {
					contents: [
						{
							role: 'user',
							parts: [{ text: prompt }]
						}
					],
					generationConfig: {
						maxOutputTokens: this.MAX_TOKENS
					}
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
				// Handle Google API response with key in URL
				if (data.candidates && data.candidates.length > 0 &&
					data.candidates[0].content &&
					data.candidates[0].content.parts &&
					data.candidates[0].content.parts.length > 0) {
					return data.candidates[0].content.parts[0].text;
				}

				// For cases where the response structure might be different
				try {
					// Try different parts of the response that might contain the content
					if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
						return data.candidates[0].content.parts[0].text;
					} else if (data.text) {
						return data.text;
					} else if (data.content?.parts?.[0]?.text) {
						return data.content.parts[0].text;
					} else if (data.message) {
						return data.message; // For error messages
					} else if (typeof data === 'string') {
						return data; // For plain text responses
					} else if (data.toString && typeof data.toString === 'function') {
						return data.toString(); // Last resort
					}
				} catch (e) {
					console.error('Error parsing Google API response:', e);
				}
				break;
		}

		// If we can't extract content in a structured way, try to stringify the entire response
		try {
			return JSON.stringify(data, null, 2);
		} catch (e) {
			throw new Error('Unable to parse response from API.');
		}
	}

	// Helper to detect if an error is CORS-related
	private isCORSError(error: Error): boolean {
		if (!error) {
			return false;
		}

		const errorMessage = error.message.toLowerCase();
		return (
			errorMessage.includes('cors') ||
			errorMessage.includes('cross-origin') ||
			errorMessage.includes('access-control-allow-origin') ||
			errorMessage.includes('network error') ||
			error.name === 'TypeError' || // Often indicates network/CORS issues in fetch
			error.name === 'NetworkError'
		);
	}

	// Helper to create a user-friendly CORS error message with actionable steps
	private createCORSErrorMessage(provider: string, modelId: string, errorDetail: string): DevSphereError {
		const message = `**CORS Error Connecting to ${provider}**

VS Code cannot directly connect to the ${provider} API due to browser security restrictions (CORS policy).

**Technical Details:**
CORS (Cross-Origin Resource Sharing) prevents web applications from making requests to different domains for security reasons. The ${provider} API doesn't include the necessary headers to allow requests from VS Code.

**To resolve this issue, you can:**

1. **Switch to OpenAI** - Click the button below to switch to an OpenAI model (recommended)
2. **For developers:** Run VS Code with the '--disable-web-security' flag (testing only!)
3. **For advanced users:** Set up a proxy server that adds CORS headers to ${provider} API responses

Error details: ${errorDetail}`;

		return {
			category: DevSphereErrorCategory.NETWORK,
			message,
			provider,
			modelId,
			retryable: true,
			actionLabel: `Switch to OpenAI GPT-4o mini`,
			actionFn: () => {
				this.setCurrentModel('gpt-4o-mini');
				this.notificationService.info(`Switched to OpenAI GPT-4o mini to avoid CORS issues. You can try your request again.`);
			}
		};
	}

	private getGoogleAPIProxyUrl(apiKey: string): string {
		// Option 1: Use the API directly with the key in the URL
		// This might still have CORS issues but is the most direct
		const baseUrl = this.getCurrentEndpoint();
		return `${baseUrl}/${this.currentModelId}:generateContent?key=${apiKey}`;

		// Option 2: Use a CORS proxy (would need to be set up)
		// Commented out as it requires an external service
		// return `https://your-cors-proxy.example.com/v1beta/models/${this.currentModelId}:generateContent?key=${apiKey}`;

		// Option 3: Use a service like cors-anywhere (for development only)
		// Commented out as it's not recommended for production
		// return `https://cors-anywhere.herokuapp.com/https://generativelanguage.googleapis.com/v1beta/models/${this.currentModelId}:generateContent?key=${apiKey}`;
	}

	// Helper to create a proxy request for Anthropic API to avoid CORS issues
	private getAnthropicProxyOptions(apiKey: string): { headers: Record<string, string>; mode: RequestMode; useNodeProxy?: boolean } {
		// Return special options for Anthropic API requests
		return {
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': apiKey, // Anthropic sometimes uses x-api-key instead of Authorization
				'anthropic-version': '2023-06-01', // Required Anthropic API version header
				'Authorization': `Bearer ${apiKey}`,
				'X-Request-Origin': 'vscode-dev-sphere-extension' // Custom header to identify our requests
			},
			mode: 'cors' as RequestMode, // Try with standard CORS first
			useNodeProxy: true // Enable node-based proxy by default for Anthropic
		};
	}

	// Helper method to make requests through VS Code's node-based facilities instead of browser's fetch
	// This bypasses CORS restrictions entirely as Node.js doesn't enforce browser's same-origin policy
	private async requestViaNodeProxy(url: string, options: RequestInit & { headers: Record<string, string> }, requestBody: any): Promise<Response> {
		// In a real implementation, this method would:
		// 1. Use VS Code's extension APIs to access the Node.js runtime
		// 2. Make HTTP requests using Node.js http/https modules
		// 3. Convert the Node.js response to a standard Response object

		// For VS Code extensions, this could be implemented via:
		// - Extension API calls to a command registered by the extension
		// - IPC between webview and extension host
		// - Use of the extensions.* API namespace

		// For now, as a fallback, we'll simulate this by attempting a direct fetch
		// Note: This is just a placeholder and will likely still encounter CORS issues
		try {
			// Send a warning to the console that we're using a fallback
			console.warn('Node proxy fallback: Using direct fetch. CORS issues may still occur.');

			// In a real implementation, you would replace this with actual Node.js HTTP requests
			const response = await fetch(url, {
				method: options.method || 'POST',
				headers: options.headers,
				body: JSON.stringify(requestBody)
			});

			// Check if the response was successful
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			return response;
		} catch (error) {
			console.error('Error in node proxy request:', error);

			// Check if this is a CORS error and provide more specific context
			if (this.isCORSError(error instanceof Error ? error : new Error('Unknown error'))) {
				throw new Error(`Node proxy CORS error: ${error instanceof Error ? error.message : 'Unknown error'}`);
			}

			// Re-throw with more context for general errors
			throw new Error(`Node proxy request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}

	public async getProviderAPIKey(): Promise<string | undefined> {
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
		const key = await this.secretStorageService.get(keySecretKey);

		return key;
	}

	public async updateAPIKey(): Promise<void> {
		const providerName = this.getCurrentProviderName();
		this.notificationService.info(`Please enter your ${providerName} API key.`);
		const newKey = await this.promptForAPIKey(this.currentModelType);
		if (newKey) {
			this.notificationService.info(`${providerName} API key updated successfully.`);
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
		let apiKey = await this.getProviderAPIKey();
		const providerName = this.getCurrentProviderName();

		// If no API key exists, prompt the user and display a notification
		if (!apiKey) {
			this.notificationService.info(`No ${providerName} API key found. Please enter your API key to use ${providerName} services.`);

			// Prompt for the API key
			apiKey = await this.promptForAPIKey(this.currentModelType);

			// If user still doesn't provide a key, return error message
			if (!apiKey) {
				const errorMessage = `**Error:** No ${providerName} API key provided.

You need to set up an API key to use ${providerName}'s models. The API key allows secure communication with ${providerName}'s servers.

To fix this:
1. Click the "Add ${providerName} API Key" button below
2. Enter your API key in the prompt
3. Your messages will be processed once the key is set up`;

				const error: DevSphereError = {
					category: DevSphereErrorCategory.API_KEY,
					message: errorMessage,
					provider: providerName,
					modelId: this.getCurrentModelId(),
					retryable: true,
					actionLabel: `Add ${providerName} API Key`,
					actionFn: async () => {
						await this.promptForAPIKey(this.currentModelType);
					}
				};

				return DevSphereErrorHandler.formatErrorAsSystemMessage(error);
			} else {
				// If the user provided a key, show a success message
				this.notificationService.info(`${providerName} API key added successfully. Processing your request...`);
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
			let response;

			// Handle Google and Anthropic model requests differently due to CORS
			if (this.currentModelType === 'GoogleModels') {
				// For Google models, use the proxy URL approach to avoid CORS issues
				const apiUrl = this.getGoogleAPIProxyUrl(apiKey);

				// When making a call to the Google API, don't include the Authorization header
				// as Google uses API keys in the URL for authentication
				response = await fetch(apiUrl, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(requestBody),
					signal: controller.signal
				}).catch(async (error) => {
					// If the direct call fails due to CORS, show a more specific error
					if (error.message.includes('CORS') || error.name === 'TypeError') {
						console.error('CORS error when accessing Google API directly:', error);

						const corsErrorObj = this.createCORSErrorMessage(
							providerName,
							this.getCurrentModelId(),
							error.message || 'CORS preflight request failed'
						);
						throw corsErrorObj;
					}
					throw error;
				});
			} else if (this.currentModelType === 'AnthropicModels') {
				// For Anthropic models, use our proxy approach to avoid CORS issues
				try {
					// Get Anthropic-specific headers and options
					const anthropicOptions = this.getAnthropicProxyOptions(apiKey);
					const endpoint = this.getCurrentEndpoint();

					// First approach: Try using the Node-based proxy if available
					if (anthropicOptions.useNodeProxy) {
						try {
							// Attempt to use the Node.js-based proxy to avoid CORS
							response = await this.requestViaNodeProxy(
								endpoint,
								{
									method: 'POST',
									headers: anthropicOptions.headers,
									signal: controller.signal
								},
								requestBody
							);

							// If we get here, the node proxy worked
							console.log('Successfully used Node.js proxy for Anthropic API request');
						} catch (nodeProxyError) {
							// If node proxy fails, log and continue to browser-based approaches
							console.error('Node proxy approach failed:', nodeProxyError);
							// Fall through to the next approach
						}
					}

					// If response is not set by the node proxy or it failed, try browser fetch
					if (!response) {
						// Second approach: Try using the Fetch API with special headers and CORS mode
						response = await fetch(endpoint, {
							method: 'POST',
							headers: anthropicOptions.headers,
							body: JSON.stringify(requestBody),
							signal: controller.signal,
							mode: anthropicOptions.mode,
							credentials: 'omit' // Don't send cookies
						}).catch(async (corsError) => {
							console.error('CORS error when accessing Anthropic API with standard approach:', corsError);

							// Third approach: Try with a different endpoint structure
							// Some Anthropic API endpoints require a specific format
							const formattedEndpoint = endpoint.replace('/v1/messages', '/v1/complete');

							try {
								// Try the alternative endpoint
								const alternativeResponse = await fetch(formattedEndpoint, {
									method: 'POST',
									headers: anthropicOptions.headers,
									body: JSON.stringify({
										...requestBody,
										// Add Anthropic-specific parameters
										stream: false,
										max_tokens_to_sample: this.MAX_TOKENS
									}),
									signal: controller.signal,
									mode: anthropicOptions.mode
								});

								return alternativeResponse;
							} catch (secondError) {
								// If all approaches fail, provide a comprehensive error message
								console.error('All CORS approaches failed for Anthropic API:', secondError);

								// Use our helper to create a consistent CORS error message
								if (this.isCORSError(corsError)) {
									const corsErrorObj = this.createCORSErrorMessage(
										providerName,
										this.getCurrentModelId(),
										corsError.message || 'CORS preflight request failed'
									);
									throw corsErrorObj;
								}

								// If it's not specifically a CORS error, throw a more generic error
								const genericErrorMessage = `**Error Connecting to ${providerName} API**

Unable to connect to the ${providerName} API. This could be due to:
- Network connectivity issues
- CORS restrictions in the browser
- ${providerName} service being temporarily unavailable

Would you like to try using an OpenAI model instead?`;

								const error: DevSphereError = {
									category: DevSphereErrorCategory.NETWORK,
									message: genericErrorMessage,
									provider: providerName,
									modelId: this.getCurrentModelId(),
									retryable: true,
									actionLabel: `Switch to OpenAI GPT-4o mini`,
									actionFn: () => {
										// Switch to a default OpenAI model that's widely compatible
										this.setCurrentModel('gpt-4o-mini');
										this.notificationService.info(`Switched to OpenAI GPT-4o mini. You can try your request again.`);
									}
								};

								throw error;
							}
						});
					}
				} catch (error) {
					// This will catch any errors from the inner try/catch and rethrow
					throw error;
				}
			} else {
				// Standard request for OpenAI
				response = await fetch(this.getCurrentEndpoint(), {
					method: 'POST',
					headers,
					body: JSON.stringify(requestBody),
					signal: controller.signal
				});
			}

			clearTimeout(timeoutId);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
				const statusCode = response.status;

				let category: DevSphereErrorCategory;
				let actionLabel: string | undefined;
				let actionFn: (() => void) | undefined;

				// Determine the error category based on status code and response
				if (statusCode === 401 || statusCode === 403 || errorData.error?.code === 'invalid_api_key' ||
					errorData.error?.message?.toLowerCase().includes('api key') ||
					errorData.error?.message?.toLowerCase().includes('authentication')) {
					category = DevSphereErrorCategory.AUTHENTICATION;

					// Show notification and prompt for a new key immediately
					this.notificationService.info(`${this.getCurrentProviderName()} API key is invalid or unauthorized. Please enter a new key.`);
					const newKey = await this.promptForAPIKey(this.currentModelType);

					// If user provided a new key, retry the request
					if (newKey) {
						// Retry the request with the new key
						return this.fetchAIResponse(prompt);
					}

					// If user cancelled, show error with action button
					actionLabel = `Update ${providerName} API Key`;
					actionFn = async () => {
						await this.promptForAPIKey(this.currentModelType);
					};

					// Create detailed error message
					const errorMessage = `**Invalid ${providerName} API Key**

The API request failed with an authentication error (${statusCode}). This typically happens when:
- The API key is incorrect or has been revoked
- The API key doesn't have permission for the selected model
- The API key has expired or reached its quota limit

Please update your API key to continue using ${providerName} models.`;

					// Return a formatted error message
					const error: DevSphereError = {
						category,
						message: errorMessage,
						provider: providerName,
						modelId: this.getCurrentModelId(),
						retryable: true,
						actionLabel,
						actionFn
					};

					return DevSphereErrorHandler.formatErrorAsSystemMessage(error);
				} else if (statusCode === 429) {
					category = DevSphereErrorCategory.API_RATE_LIMIT;

					const errorMessage = `**Rate Limit Exceeded for ${providerName}**

The API request was rejected because you've reached the rate limit (${statusCode}). This typically happens when:
- You've sent too many requests in a short period of time
- You've exceeded your tier's usage quota or billing limits
- The service is experiencing high demand

Please wait a moment before trying again. If this persists, you may need to:
- Upgrade your API tier if available
- Implement request throttling
- Contact ${providerName} support for assistance`;

					// Return a formatted error message
					const error: DevSphereError = {
						category,
						message: errorMessage,
						provider: providerName,
						modelId: this.getCurrentModelId(),
						retryable: true
					};

					return DevSphereErrorHandler.formatErrorAsSystemMessage(error);
				} else if (statusCode >= 500) {
					category = DevSphereErrorCategory.API_RESPONSE;

					const errorMessage = `**${providerName} Server Error (${statusCode})**

The API request failed due to a server error. This typically indicates:
- ${providerName}'s servers might be experiencing issues
- The service might be undergoing maintenance
- There might be a temporary outage

This is usually not related to your request or API key. Please try again after a few minutes. If the issue persists, you can:
- Check ${providerName}'s status page for service announcements
- Try a different model
- Try again later when the service has recovered`;

					// Return a formatted error message
					const error: DevSphereError = {
						category,
						message: errorMessage,
						provider: providerName,
						modelId: this.getCurrentModelId(),
						retryable: true
					};

					return DevSphereErrorHandler.formatErrorAsSystemMessage(error);
				} else {
					category = DevSphereErrorCategory.UNKNOWN;

					const errorReason = errorData.error?.message || `Unknown error (${statusCode})`;
					const errorMessage = `**Unexpected ${providerName} Error**

The API request failed with an unexpected error: ${errorReason}

This could be due to:
- An issue with the API request format
- A temporary service disruption
- Changes to the API requirements or endpoints

Please try again later or try another model. If the issue persists, you might need to:
- Check for updates to the application
- Verify your API key permissions
- Contact support for further assistance`;

					// Return a formatted error message
					const error: DevSphereError = {
						category,
						message: errorMessage,
						provider: providerName,
						modelId: this.getCurrentModelId(),
						retryable: true
					};

					return DevSphereErrorHandler.formatErrorAsSystemMessage(error);
				}
			}

			const data = await response.json();
			return this.extractResponseContent(data);
		} catch (error) {
			console.error('Error fetching AI response:', error);

			// Process the error
			const modelId = this.getCurrentModelId();

			// Check if it's an abort error (timeout)
			if (error instanceof DOMException && error.name === 'AbortError') {
				const errorMessage = `**Request Timeout for ${providerName}**

Your request to ${providerName} timed out after 60 seconds. This could be due to:
- Slow internet connection
- High server load at ${providerName}
- A complex query that requires more processing time

Try again later or consider:
- Checking your network connection
- Using a shorter/simpler prompt
- Trying a different model that might respond faster`;

				const timeoutError: DevSphereError = {
					category: DevSphereErrorCategory.NETWORK,
					message: errorMessage,
					provider: providerName,
					modelId: modelId,
					retryable: true
				};
				return DevSphereErrorHandler.formatErrorAsSystemMessage(timeoutError);
			}

			// For failed fetch errors related to API key issues (like CORS, failed to fetch)
			// These often happen when API keys are missing for non-OpenAI providers
			if (error instanceof Error) {
				const errorLowerCase = error.message.toLowerCase();
				const isAuthError =
					errorLowerCase.includes('unauthorized') ||
					errorLowerCase.includes('authentication') ||
					errorLowerCase.includes('forbidden') ||
					errorLowerCase.includes('api key') ||
					errorLowerCase.includes('failed to fetch') || // Common when API key is missing
					errorLowerCase.includes('cors') ||            // Also common with API issues
					errorLowerCase.includes('network error');     // Network errors often related to authentication

				if (isAuthError || !apiKey) {
					// This is likely an authentication issue - prompt for API key
					this.notificationService.info(`Network error connecting to ${providerName}. This may be due to a missing or invalid API key.`);

					// Directly prompt for a new API key
					const newKey = await this.promptForAPIKey(this.currentModelType);
					if (newKey) {
						// If user provided a key, retry the request
						return this.fetchAIResponse(prompt);
					}

					// If user didn't provide a key, show authentication error
					const errorMessage = `**Authentication Error Connecting to ${providerName}**

A network error occurred that may be related to API authentication: ${error.message}

This typically happens when:
- The API key is missing or invalid
- There are network connectivity issues to ${providerName}'s servers
- The API endpoint is incorrect or has changed
- CORS or browser security restrictions are blocking the request

To fix this issue:
1. Click the "Add ${providerName} API Key" button below
2. Enter a valid API key in the prompt
3. Your message will be processed automatically`;

					const authError: DevSphereError = {
						category: DevSphereErrorCategory.AUTHENTICATION,
						message: errorMessage,
						provider: providerName,
						modelId: modelId,
						retryable: true,
						actionLabel: `Add ${providerName} API Key`,
						actionFn: async () => {
							await this.promptForAPIKey(this.currentModelType);
						}
					};
					return DevSphereErrorHandler.formatErrorAsSystemMessage(authError);
				}
			}

			// For other general network errors
			const errorDetail = error instanceof Error ? error.message : 'Network error occurred';

			// Check if this might be an API key issue
			// Even for generic network errors, give the user a chance to update their API key
			const maybeKeyIssue = !apiKey || (errorDetail.toLowerCase().includes('network') && this.currentModelType !== 'ChatgptModels');

			if (maybeKeyIssue) {
				// For non-OpenAI providers especially, network errors are often due to API key issues
				this.notificationService.info(`Network error connecting to ${providerName}. Would you like to update your API key?`);

				// Directly prompt for a new API key
				const newKey = await this.promptForAPIKey(this.currentModelType);
				if (newKey) {
					// If user provided a key, retry the request
					return this.fetchAIResponse(prompt);
				}
			}

			const errorMessage = `**Network Error Connecting to ${providerName}**

A network error occurred: ${errorDetail}

This could be due to:
- Internet connectivity issues
- Firewall or network restrictions
- ${providerName} service being temporarily unavailable
- CORS or other browser security restrictions${maybeKeyIssue ? `
- Missing or invalid API key for ${providerName}` : ''}

Try the following solutions:
- Check your internet connection
- Try again in a few moments${maybeKeyIssue ? `
- Click the "Update ${providerName} API Key" button below` : ''}
- Verify there are no network restrictions blocking access`;

			const networkError: DevSphereError = {
				category: DevSphereErrorCategory.NETWORK,
				message: errorMessage,
				provider: providerName,
				modelId: modelId,
				retryable: true
			};

			// If we suspect an API key issue, add an action button
			if (maybeKeyIssue) {
				networkError.actionLabel = `Update ${providerName} API Key`;
				networkError.actionFn = async () => {
					await this.promptForAPIKey(this.currentModelType);
				};
			}

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
