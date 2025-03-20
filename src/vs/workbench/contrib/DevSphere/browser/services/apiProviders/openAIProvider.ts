/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAPIProvider } from './apiProviderInterface.js';

/**
 * API provider implementation for OpenAI's models.
 * This provider handles all interactions with OpenAI's API, including:
 * - Request formatting
 * - Response parsing
 * - Authentication
 * - Error management
 *
 * The provider is designed to work with OpenAI's GPT models and handles
 * the specific requirements of OpenAI's API, such as:
 * - Bearer token authentication
 * - Message-based request format
 * - Token-based response format
 */
export class OpenAIProvider implements IAPIProvider {
	/**
	 * Formats a request body for the OpenAI API.
	 * OpenAI's API requires a specific format with:
	 * - model: The specific model to use
	 * - messages: Array of message objects with role and content
	 * - max_tokens: Maximum number of tokens to generate
	 *
	 * @param prompt - The user's input text
	 * @param maxTokens - Maximum number of tokens to generate
	 * @returns Formatted request body matching OpenAI's API requirements
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
	 * Extracts the response content from the OpenAI API response.
	 * Handles OpenAI's standard response format which includes:
	 * - choices array with message objects
	 * - content field within messages
	 *
	 * @param data - Raw response data from the API
	 * @returns Extracted text content
	 * @throws Error if response cannot be parsed
	 */
	extractResponseContent(data: any): string {
		if (data.choices && data.choices.length > 0) {
			return data.choices[0].message.content;
		}

		// If we can't extract content in a structured way, try to stringify the entire response
		try {
			return JSON.stringify(data, null, 2);
		} catch (e) {
			throw new Error('Unable to parse response from OpenAI API.');
		}
	}

	/**
	 * Makes a request to the OpenAI API.
	 * Handles authentication using Bearer token and includes
	 * proper headers for JSON content.
	 *
	 * @param endpoint - The API endpoint URL
	 * @param apiKey - The OpenAI API key
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
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${apiKey}`
		};

		return fetch(endpoint, {
			method: 'POST',
			headers,
			body: JSON.stringify(requestBody),
			signal: abortSignal
		});
	}

	constructor(private modelId: string) { }
}
