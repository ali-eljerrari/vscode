/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Interface for AI API providers
 */
export interface IAPIProvider {
	/**
	 * Formats a request body for the API
	 */
	formatRequestBody(prompt: string, maxTokens: number): any;

	/**
	 * Extracts the response content from the API response
	 */
	extractResponseContent(data: any): string;

	/**
	 * Makes an API request
	 */
	makeRequest(
		endpoint: string,
		apiKey: string,
		requestBody: any,
		abortSignal: AbortSignal
	): Promise<Response>;
}
