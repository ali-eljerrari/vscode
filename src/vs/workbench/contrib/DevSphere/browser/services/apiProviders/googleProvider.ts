/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CorsHandlerService } from '../corsHandlerService.js';
import { IAPIProvider } from './apiProviderInterface.js';

/**
 * API provider implementation for Google's AI models.
 * This provider handles all interactions with Google's AI API, including:
 * - Request formatting
 * - Response parsing
 * - CORS handling
 * - Error management
 *
 * The provider is designed to work with Google's Gemini models and handles
 * the specific requirements of Google's API, such as:
 * - API key placement in URL
 * - Specific request/response formats
 * - Error handling patterns
 */
export class GoogleProvider implements IAPIProvider {
	constructor(
		private modelId: string,
		private corsHandler: CorsHandlerService
	) { }

	/**
	 * Formats a request body for the Google API.
	 * Google's API requires a specific format with:
	 * - contents: Array of message objects with role and parts
	 * - generationConfig: Configuration for token limits
	 *
	 * @param prompt - The user's input text
	 * @param maxTokens - Maximum number of tokens to generate
	 * @returns Formatted request body matching Google's API requirements
	 */
	formatRequestBody(prompt: string, maxTokens: number): any {
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
				maxOutputTokens: maxTokens
			}
		};
	}

	/**
	 * Extracts the response content from the Google API response.
	 * Handles various response formats and error cases:
	 * - Standard response format with candidates
	 * - Alternative response formats
	 * - Error messages
	 * - Plain text responses
	 *
	 * @param data - Raw response data from the API
	 * @returns Extracted text content or error message
	 * @throws Error if response cannot be parsed
	 */
	extractResponseContent(data: any): string {
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

		// If we can't extract content in a structured way, try to stringify the entire response
		try {
			return JSON.stringify(data, null, 2);
		} catch (e) {
			throw new Error('Unable to parse response from Google API.');
		}
	}

	/**
	 * Makes a request to the Google API, handling CORS issues.
	 * Uses a proxy URL approach to avoid CORS restrictions and includes
	 * the API key in the URL as required by Google's API.
	 *
	 * @param endpoint - The API endpoint URL
	 * @param apiKey - The Google API key
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
		// Use the proxy URL approach to avoid CORS issues
		const apiUrl = this.corsHandler.getGoogleAPIProxyUrl(endpoint, this.modelId, apiKey);

		// When making a call to the Google API, don't include the Authorization header
		// as Google uses API keys in the URL for authentication
		return fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(requestBody),
			signal: abortSignal
		});
	}
}
