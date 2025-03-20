/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CorsProxyOptions, DevSphereError } from '../models/types.js';
import { DevSphereErrorCategory } from '../devSphereErrorHandler.js';

/**
 * Service for handling CORS issues with API requests
 */
export class CorsHandlerService {
	/**
	 * Creates special request options for Anthropic API requests to avoid CORS issues
	 */
	public getAnthropicProxyOptions(apiKey: string): CorsProxyOptions {
		return {
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': apiKey, // Anthropic sometimes uses x-api-key instead of Authorization
				'anthropic-version': '2023-06-01', // Required Anthropic API version header
				'Authorization': `Bearer ${apiKey}`,
				'X-Request-Origin': 'vscode-dev-sphere-extension' // Custom header to identify our requests
			},
			mode: 'cors', // Try with standard CORS first
			useNodeProxy: true // Enable node-based proxy by default for Anthropic
		};
	}

	/**
	 * Creates a proxy URL for Google API requests with the API key in the URL
	 */
	public getGoogleAPIProxyUrl(baseUrl: string, modelId: string, apiKey: string): string {
		// Use the API directly with the key in the URL
		return `${baseUrl}/${modelId}:generateContent?key=${apiKey}`;
	}

	/**
	 * Detects if an error is CORS-related
	 */
	public isCORSError(error: Error): boolean {
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

	/**
	 * Creates a user-friendly CORS error message with actionable steps
	 */
	public createCORSErrorMessage(
		provider: string,
		modelId: string,
		errorDetail: string,
		actionFn: () => void
	): DevSphereError {
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
			actionFn
		};
	}

	/**
	 * Makes a request through Node.js to bypass CORS restrictions
	 * Node.js doesn't enforce browser's same-origin policy
	 */
	public async requestViaNodeProxy(
		url: string,
		options: RequestInit & { headers: Record<string, string> },
		requestBody: any
	): Promise<Response> {
		// In a real implementation, this method would:
		// 1. Use VS Code's extension APIs to access the Node.js runtime
		// 2. Make HTTP requests using Node.js http/https modules
		// 3. Convert the Node.js response to a standard Response object

		// For VS Code extensions, this could be implemented via:
		// - Extension API calls to a command registered by the extension
		// - IPC between webview and extension host
		// - Use of the extensions.* API namespace

		// For now, as a fallback, we'll simulate this by attempting a direct fetch
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
}
