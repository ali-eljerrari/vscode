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

		// First approach: Try using the Node-based proxy if available
		if (anthropicOptions.useNodeProxy) {
			try {
				// Attempt to use the Node.js-based proxy to avoid CORS
				return await this.corsHandler.requestViaNodeProxy(
					endpoint,
					{
						method: 'POST',
						headers: anthropicOptions.headers,
						signal: abortSignal
					},
					requestBody
				);
			} catch (nodeProxyError) {
				// If node proxy fails, log and continue to browser-based approaches
				console.error('Node proxy approach failed:', nodeProxyError);
				// Fall through to the browser-based approach
			}
		}

		// Second approach: Try using the Fetch API with special headers and CORS mode
		return fetch(endpoint, {
			method: 'POST',
			headers: anthropicOptions.headers,
			body: JSON.stringify(requestBody),
			signal: abortSignal,
			mode: anthropicOptions.mode,
			credentials: 'omit' // Don't send cookies
		});
	}

	/**
	 * Alternative approach for when the normal endpoint fails.
	 * This method provides a fallback mechanism using:
	 * - Different endpoint format (/v1/complete instead of /v1/messages)
	 * - Additional parameters specific to the complete endpoint
	 * - Same CORS handling as the primary method
	 *
	 * @param endpoint - The API endpoint URL
	 * @param apiKey - The Anthropic API key
	 * @param requestBody - Formatted request body
	 * @param abortSignal - Signal for request cancellation
	 * @returns Promise resolving to the API response
	 */
	async makeAlternativeRequest(
		endpoint: string,
		apiKey: string,
		requestBody: any,
		abortSignal: AbortSignal
	): Promise<Response> {
		// Get Anthropic-specific headers and options
		const anthropicOptions = this.corsHandler.getAnthropicProxyOptions(apiKey);

		// Format the endpoint differently
		const formattedEndpoint = endpoint.replace('/v1/messages', '/v1/complete');

		// Add Anthropic-specific parameters to the request body
		const formattedBody = {
			...requestBody,
			stream: false,
			max_tokens_to_sample: requestBody.max_tokens
		};

		return fetch(formattedEndpoint, {
			method: 'POST',
			headers: anthropicOptions.headers,
			body: JSON.stringify(formattedBody),
			signal: abortSignal,
			mode: anthropicOptions.mode
		});
	}
}
