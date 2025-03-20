/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CorsHandlerService } from '../corsHandlerService.js';
import { IAPIProvider } from './apiProviderInterface.js';

/**
 * API provider for Google
 */
export class GoogleProvider implements IAPIProvider {
	constructor(
		private modelId: string,
		private corsHandler: CorsHandlerService
	) { }

	/**
	 * Formats a request body for the Google API
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
	 * Extracts the response content from the Google API response
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
	 * Makes a request to the Google API, handling CORS issues
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
