/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAPIProvider } from './apiProviderInterface.js';

/**
 * API provider for OpenAI
 */
export class OpenAIProvider implements IAPIProvider {
	/**
	 * Formats a request body for the OpenAI API
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
	 * Extracts the response content from the OpenAI API response
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
	 * Makes a request to the OpenAI API
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
