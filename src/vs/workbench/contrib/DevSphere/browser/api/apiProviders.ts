/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ModelProviderType } from '../models/devSphereModels.js';
import { DevSphereError, DevSphereErrorCategory, DevSphereErrorHandler } from '../devSphereErrorHandler.js';

/**
 * Maximum tokens for AI responses
 */
const MAX_TOKENS = 500;

/**
 * Abstract class for API providers
 */
export abstract class ApiProvider {
	protected abstract formatRequestBody(prompt: string, modelId: string): any;
	protected abstract extractResponseContent(data: any): string;
	protected abstract getEndpoint(modelId: string): string;
	protected abstract getHeaders(apiKey: string): Record<string, string>;

	/**
	 * Sends a request to the API provider
	 */
	public async sendRequest(prompt: string, modelId: string, apiKey: string, providerName: string): Promise<string> {
		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

			const headers = this.getHeaders(apiKey);
			const requestBody = this.formatRequestBody(prompt, modelId);
			const endpoint = this.getEndpoint(modelId);

			const response = await fetch(endpoint, {
				method: 'POST',
				headers,
				body: JSON.stringify(requestBody),
				signal: controller.signal
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
				const statusCode = response.status;

				// Handle error based on status code
				const error = this.handleErrorResponse(statusCode, errorData, providerName, modelId);
				return DevSphereErrorHandler.formatErrorAsSystemMessage(error);
			}

			const data = await response.json();
			return this.extractResponseContent(data);
		} catch (error) {
			// Handle fetch errors, timeout errors, etc.
			const errorMessage = this.handleFetchError(error, providerName, modelId);
			return errorMessage;
		}
	}

	/**
	 * Handles error responses from the API
	 */
	protected handleErrorResponse(
		statusCode: number,
		errorData: any,
		providerName: string,
		modelId: string
	): DevSphereError {
		let category: DevSphereErrorCategory;
		let actionLabel: string | undefined;
		let actionFn: (() => void) | undefined;
		let message: string;

		// Determine the error category based on status code
		if (statusCode === 401 || errorData.error?.code === 'invalid_api_key') {
			category = DevSphereErrorCategory.AUTHENTICATION;
			message = `**Invalid ${providerName} API Key**

The API request failed with an authentication error (${statusCode}). This typically happens when:
- The API key is incorrect or has been revoked
- The API key doesn't have permission for the selected model
- The API key has expired or reached its quota limit

Please update your API key to continue using ${providerName} models.`;
			actionLabel = `Update ${providerName} API Key`;
		} else if (statusCode === 429) {
			category = DevSphereErrorCategory.API_RATE_LIMIT;
			message = `**Rate Limit Exceeded for ${providerName}**

The API request was rejected because you've reached the rate limit (${statusCode}). This typically happens when:
- You've sent too many requests in a short period of time
- You've exceeded your tier's usage quota or billing limits
- The service is experiencing high demand

Please wait a moment before trying again.`;
		} else if (statusCode >= 500) {
			category = DevSphereErrorCategory.API_RESPONSE;
			message = `**${providerName} Server Error (${statusCode})**

The API request failed due to a server error. This typically indicates:
- ${providerName}'s servers might be experiencing issues
- The service might be undergoing maintenance
- There might be a temporary outage

This is usually not related to your request or API key. Please try again after a few minutes.`;
		} else {
			category = DevSphereErrorCategory.UNKNOWN;
			const errorReason = errorData.error?.message || `Unknown error (${statusCode})`;
			message = `**Unexpected ${providerName} Error**

The API request failed with an unexpected error: ${errorReason}

This could be due to:
- An issue with the API request format
- A temporary service disruption
- Changes to the API requirements or endpoints`;
		}

		return {
			category,
			message,
			provider: providerName,
			modelId,
			retryable: true,
			actionLabel,
			actionFn
		};
	}

	/**
	 * Handles fetch errors (network issues, timeouts, etc.)
	 */
	protected handleFetchError(error: any, providerName: string, modelId: string): string {
		// Check if it's already a formatted DevSphereError
		if (error && typeof error.message === 'string' && error.category) {
			// If it's already a DevSphereError object, format it and return
			return DevSphereErrorHandler.formatErrorAsSystemMessage(error);
		}

		// Check if it's an abort error (timeout)
		if (error instanceof DOMException && error.name === 'AbortError') {
			const timeoutError: DevSphereError = {
				category: DevSphereErrorCategory.NETWORK,
				message: `**Request Timeout for ${providerName}**

Your request to ${providerName} timed out after 60 seconds. This could be due to:
- Slow internet connection
- High server load at ${providerName}
- A complex query that requires more processing time`,
				provider: providerName,
				modelId,
				retryable: true
			};
			return DevSphereErrorHandler.formatErrorAsSystemMessage(timeoutError);
		}

		// General network error
		const errorDetail = error instanceof Error ? error.message : 'Network error occurred';
		const networkError: DevSphereError = {
			category: DevSphereErrorCategory.NETWORK,
			message: `**Network Error Connecting to ${providerName}**

A network error occurred: ${errorDetail}

This could be due to:
- Internet connectivity issues
- Firewall or network restrictions
- ${providerName} service being temporarily unavailable`,
			provider: providerName,
			modelId,
			retryable: true
		};
		return DevSphereErrorHandler.formatErrorAsSystemMessage(networkError);
	}
}

/**
 * OpenAI API provider
 */
export class OpenAIProvider extends ApiProvider {
	protected getEndpoint(_modelId: string): string {
		return 'https://api.openai.com/v1/chat/completions';
	}

	protected getHeaders(apiKey: string): Record<string, string> {
		return {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${apiKey}`
		};
	}

	protected formatRequestBody(prompt: string, modelId: string): any {
		return {
			model: modelId,
			messages: [
				{
					role: 'user',
					content: prompt
				}
			],
			max_tokens: MAX_TOKENS
		};
	}

	protected extractResponseContent(data: any): string {
		if (data.choices && data.choices.length > 0) {
			return data.choices[0].message.content;
		}

		// If we can't extract content in the expected way
		try {
			return JSON.stringify(data, null, 2);
		} catch (e) {
			throw new Error('Unable to parse response from OpenAI API.');
		}
	}
}

/**
 * Anthropic API provider
 */
export class AnthropicProvider extends ApiProvider {
	protected getEndpoint(_modelId: string): string {
		return 'https://api.anthropic.com/v1/messages';
	}

	protected getHeaders(apiKey: string): Record<string, string> {
		return {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${apiKey}`,
			'anthropic-version': '2023-06-01'
		};
	}

	protected formatRequestBody(prompt: string, modelId: string): any {
		return {
			model: modelId,
			messages: [
				{
					role: 'user',
					content: prompt
				}
			],
			max_tokens: MAX_TOKENS
		};
	}

	protected extractResponseContent(data: any): string {
		if (data.content && data.content.length > 0) {
			return data.content[0].text;
		}

		// If we can't extract content in the expected way
		try {
			return JSON.stringify(data, null, 2);
		} catch (e) {
			throw new Error('Unable to parse response from Anthropic API.');
		}
	}
}

/**
 * Google API provider
 */
export class GoogleProvider extends ApiProvider {
	protected getEndpoint(modelId: string): string {
		// For Google, append the model ID directly to the endpoint
		return `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`;
	}

	protected getHeaders(_apiKey: string): Record<string, string> {
		return {
			'Content-Type': 'application/json'
		};
		// Note: Google API key is sent as a URL parameter, not in headers
	}

	protected formatRequestBody(prompt: string, _modelId: string): any {
		return {
			contents: [
				{
					role: 'user',
					parts: [{ text: prompt }]
				}
			],
			generationConfig: {
				maxOutputTokens: MAX_TOKENS
			}
		};
	}

	protected extractResponseContent(data: any): string {
		// Try different parts of the Google API response
		if (data.candidates && data.candidates.length > 0 &&
			data.candidates[0].content &&
			data.candidates[0].content.parts &&
			data.candidates[0].content.parts.length > 0) {

			return data.candidates[0].content.parts[0].text;
		}

		// Try alternative response formats
		if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
			return data.candidates[0].content.parts[0].text;
		} else if (data.text) {
			return data.text;
		} else if (data.content?.parts?.[0]?.text) {
			return data.content.parts[0].text;
		} else if (data.message) {
			return data.message;
		} else if (typeof data === 'string') {
			return data;
		}

		// If we can't extract content in any of the expected ways
		try {
			return JSON.stringify(data, null, 2);
		} catch (e) {
			throw new Error('Unable to parse response from Google API.');
		}
	}

	/**
	 * Modified method that handles Google API key as a URL parameter
	 */
	public override async sendRequest(prompt: string, modelId: string, apiKey: string, providerName: string): Promise<string> {
		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

			const headers = this.getHeaders(apiKey);
			const requestBody = this.formatRequestBody(prompt, modelId);

			// For Google API, append the API key as a URL parameter
			const endpoint = `${this.getEndpoint(modelId)}?key=${apiKey}`;

			const response = await fetch(endpoint, {
				method: 'POST',
				headers,
				body: JSON.stringify(requestBody),
				signal: controller.signal
			}).catch(async (error) => {
				// Special handling for CORS errors with Google API
				if (error.message.includes('CORS') || error.name === 'TypeError') {
					console.error('CORS error when accessing Google API directly:', error);

					const corsError: DevSphereError = {
						category: DevSphereErrorCategory.NETWORK,
						message: `**CORS Error Connecting to Google API**

A CORS policy error occurred when trying to access the Google API. This is a common issue with browser-based applications.`,
						provider: providerName,
						modelId: modelId,
						retryable: true
					};

					throw corsError;
				}
				throw error;
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
				const statusCode = response.status;

				// Handle error based on status code
				const error = this.handleErrorResponse(statusCode, errorData, providerName, modelId);
				return DevSphereErrorHandler.formatErrorAsSystemMessage(error);
			}

			const data = await response.json();
			return this.extractResponseContent(data);
		} catch (error) {
			// Handle fetch errors, timeout errors, etc.
			const errorMessage = this.handleFetchError(error, providerName, modelId);
			return errorMessage;
		}
	}
}

/**
 * Factory for creating provider instances
 */
export class ApiProviderFactory {
	/**
	 * Creates the appropriate provider based on the model type
	 */
	public static createProvider(modelType: ModelProviderType): ApiProvider {
		switch (modelType) {
			case 'ChatgptModels':
				return new OpenAIProvider();
			case 'AnthropicModels':
				return new AnthropicProvider();
			case 'GoogleModels':
				return new GoogleProvider();
			default:
				return new OpenAIProvider(); // Default to OpenAI provider
		}
	}
}
