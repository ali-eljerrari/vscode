/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CorsHandlerService } from '../corsHandlerService.js';
import { IAPIProvider } from './apiProviderInterface.js';

/**
 * API provider implementation for Anthropic's models.
 * This provider handles all interactions with Anthropic's API, including:
 * - Request formatting
 * - Response parsing
 * - CORS handling
 * - Error management
 *
 * The provider is designed to work with Anthropic's Claude models and handles
 * the specific requirements of Anthropic's API, such as:
 * - Multiple authentication methods (Bearer token and x-api-key)
 * - Version-specific headers
 * - CORS restrictions
 * - Alternative endpoint support
 */
export class AnthropicProvider implements IAPIProvider {
	constructor(
		private modelId: string,
		private corsHandler: CorsHandlerService
	) { }

	/**
	 * Formats a request body for the Anthropic API.
	 * Anthropic's API requires a specific format with:
	 * - model: The specific model to use
	 * - messages: Array of message objects with role and content
	 * - max_tokens: Maximum number of tokens to generate
	 *
	 * @param prompt - The user's input text
	 * @param maxTokens - Maximum number of tokens to generate
	 * @returns Formatted request body matching Anthropic's API requirements
	 */
	formatRequestBody(prompt: string, maxTokens: number): any {
		return {
			model: this.modelId,
			messages: [
				{
					role: 'user',
					content: prompt
				}
			],
			max_tokens: maxTokens
		};
	}

	/**
	 * Extracts the response content from the Anthropic API response.
	 * Handles Anthropic's response format which includes:
	 * - content array with text objects
	 * - Alternative response formats
	 * - Error messages
	 *
	 * @param data - Raw response data from the API
	 * @returns Extracted text content
	 * @throws Error if response cannot be parsed
	 */
	extractResponseContent(data: any): string {
		// For opaque responses, we need to handle the response differently
		if (data.type === 'opaque') {
			return 'Response received from Anthropic API. Note: Due to CORS restrictions, the response content is not directly accessible.';
		}

		if (data.content && data.content.length > 0) {
			return data.content[0].text;
		}

		// If we can't extract content in a structured way, try to stringify the entire response
		try {
			return JSON.stringify(data, null, 2);
		} catch (e) {
			throw new Error('Unable to parse response from Anthropic API.');
		}
	}

	/**
	 * Makes a request to the Anthropic API with CORS handling.
	 * Implements multiple approaches to handle CORS restrictions:
	 * 1. Node-based proxy (primary approach)
	 * 2. Browser-based fetch with special headers
	 *
	 * @param endpoint - The API endpoint URL
	 * @param apiKey - The Anthropic API key
	 * @param requestBody - Formatted request body
	 * @param abortSignal - Signal for request cancellation
	 * @returns Promise resolving to the API response
	 */
	async makeRequest(
		endpoint: string,
		apiKey: string,
		requestBody: any,
		abortSignal: AbortSignal
	): Promise<Response> {
		// Get Anthropic-specific headers and options
		const anthropicOptions = this.corsHandler.getAnthropicProxyOptions(apiKey);

		// Use no-cors mode to bypass CORS restrictions
		return fetch(endpoint, {
			method: 'POST',
			headers: anthropicOptions.headers,
			body: JSON.stringify(requestBody),
			signal: abortSignal,
			mode: 'no-cors',
			credentials: 'omit'
		});
	}
}
