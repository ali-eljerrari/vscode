/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Interface defining the contract for AI API providers.
 * This interface ensures consistent behavior across different AI service providers
 * by defining the core methods that each provider must implement.
 *
 * The interface handles three main aspects of API interaction:
 * 1. Request formatting - Converting user input into provider-specific format
 * 2. Response parsing - Extracting content from provider-specific responses
 * 3. API communication - Making requests to the provider's API
 *
 * Each provider implementation (OpenAI, Anthropic, Google) must implement
 * these methods according to their specific API requirements while maintaining
 * a consistent interface for the rest of the application.
 */
export interface IAPIProvider {
	/**
	 * Formats a request body for the API.
	 * This method converts the standard input format into the provider-specific
	 * request format required by the API.
	 *
	 * @param prompt - The user's input text to be sent to the API
	 * @param maxTokens - Maximum number of tokens to generate in the response
	 * @returns Formatted request body matching the provider's API requirements
	 */
	formatRequestBody(prompt: string, maxTokens: number): any;

	/**
	 * Extracts the response content from the API response.
	 * This method handles the provider-specific response format and extracts
	 * the relevant text content from the response.
	 *
	 * @param data - Raw response data from the API
	 * @returns Extracted text content from the response
	 * @throws Error if the response cannot be parsed
	 */
	extractResponseContent(data: any): string;

	/**
	 * Makes an API request.
	 * This method handles the actual communication with the provider's API,
	 * including authentication, headers, and request configuration.
	 *
	 * @param endpoint - The API endpoint URL to send the request to
	 * @param apiKey - The API key for authentication
	 * @param requestBody - The formatted request body to send
	 * @param abortSignal - Signal for request cancellation
	 * @returns Promise resolving to the API response
	 */
	makeRequest(
		endpoint: string,
		apiKey: string,
		requestBody: any,
		abortSignal: AbortSignal
	): Promise<Response>;
}
