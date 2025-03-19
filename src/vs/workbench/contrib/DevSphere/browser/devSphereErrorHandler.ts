/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { INotificationService } from '../../../../platform/notification/common/notification.js';

/**
 * Error categories for DevSphere
 */
export enum DevSphereErrorCategory {
	API_KEY = 'api_key',
	API_REQUEST = 'api_request',
	API_RESPONSE = 'api_response',
	API_RATE_LIMIT = 'api_rate_limit',
	API_QUOTA = 'api_quota',
	NETWORK = 'network',
	AUTHENTICATION = 'authentication',
	MODEL = 'model',
	CONTENT_FILTER = 'content_filter',
	UNKNOWN = 'unknown'
}

/**
 * Interface for DevSphere error details
 */
export interface DevSphereError {
	category: DevSphereErrorCategory;
	message: string;
	details?: string;
	statusCode?: number;
	provider?: string;
	modelId?: string;
	retryable?: boolean;
	actionLabel?: string;
	actionFn?: () => void;
	originalError?: Error;
}

/**
 * Utility to handle DevSphere service errors
 */
export class DevSphereErrorHandler {
	/**
	 * Process an API error and convert it to a standardized DevSphereError
	 */
	public static processApiError(error: unknown, modelId: string, provider: string): DevSphereError {
		// Default error in case we can't extract more specific information
		const result: DevSphereError = {
			category: DevSphereErrorCategory.UNKNOWN,
			message: 'An unknown error occurred',
			provider,
			modelId,
			retryable: false
		};

		if (error instanceof Error) {
			// Extract the raw error message
			result.message = error.message;
			result.originalError = error;

			const errorMessage = error.message.toLowerCase();

			// Check for common API errors
			if (errorMessage.includes('authentication') || errorMessage.includes('api key') ||
				errorMessage.includes('unauthorized') || errorMessage.includes('auth') ||
				errorMessage.includes('invalid key')) {
				result.category = DevSphereErrorCategory.AUTHENTICATION;
				result.message = 'Authentication failed. Please check your API key.';
				result.retryable = false;
				result.actionLabel = 'Update API Key';

			} else if (errorMessage.includes('exceeded') || errorMessage.includes('rate limit') ||
				errorMessage.includes('too many requests') || errorMessage.includes('429')) {
				result.category = DevSphereErrorCategory.API_RATE_LIMIT;
				result.message = 'Rate limit exceeded. Please try again later.';
				result.retryable = true;

			} else if (errorMessage.includes('model') &&
				(errorMessage.includes('not found') || errorMessage.includes('unavailable'))) {
				result.category = DevSphereErrorCategory.MODEL;
				result.message = `Model "${modelId}" is not available. Please select a different model.`;
				result.retryable = false;

			} else if (errorMessage.includes('content') && errorMessage.includes('filter')) {
				result.category = DevSphereErrorCategory.CONTENT_FILTER;
				result.message = 'Your request was flagged by content filters. Please modify your prompt and try again.';
				result.retryable = true;

			} else if (errorMessage.includes('quota') || errorMessage.includes('insufficient') ||
				errorMessage.includes('budget') || errorMessage.includes('credits')) {
				result.category = DevSphereErrorCategory.API_QUOTA;
				result.message = 'Your API quota or credits have been exhausted.';
				result.retryable = false;

			} else if (errorMessage.includes('network') || errorMessage.includes('connection') ||
				errorMessage.includes('timeout') || errorMessage.includes('connect')) {
				result.category = DevSphereErrorCategory.NETWORK;
				result.message = 'Network error. Please check your internet connection.';
				result.retryable = true;
			}

			// Try to extract response status code if available in the error message
			const statusCodeMatch = errorMessage.match(/(\b[45]\d\d\b)/);
			if (statusCodeMatch) {
				result.statusCode = parseInt(statusCodeMatch[1], 10);

				// Refine error further based on status code
				if (result.statusCode === 401 || result.statusCode === 403) {
					result.category = DevSphereErrorCategory.AUTHENTICATION;
					result.message = 'Authentication failed. Please check your API key.';
					result.retryable = false;
					result.actionLabel = 'Update API Key';
				} else if (result.statusCode === 429) {
					result.category = DevSphereErrorCategory.API_RATE_LIMIT;
					result.message = 'Rate limit exceeded. Please try again later.';
					result.retryable = true;
				} else if (result.statusCode === 404 && errorMessage.includes('model')) {
					result.category = DevSphereErrorCategory.MODEL;
					result.message = `Model "${modelId}" is not available. Please select a different model.`;
					result.retryable = false;
				}
			}

			// Add detailed explanation
			result.details = error.message;
		} else if (typeof error === 'string') {
			// Handle string errors
			result.message = error;
			result.details = error;
		} else if (error && typeof error === 'object') {
			// Try to extract information from error objects
			const errorObj = error as Record<string, any>;

			if (errorObj.message) {
				result.message = String(errorObj.message);
				result.details = JSON.stringify(errorObj, null, 2);
			} else {
				result.message = 'Unknown error occurred';
				result.details = JSON.stringify(errorObj, null, 2);
			}
		}

		return result;
	}

	/**
	 * Display an error notification to the user
	 */
	public static showErrorNotification(error: DevSphereError, notificationService: INotificationService): void {
		// Format the title based on category
		let title: string;
		switch (error.category) {
			case DevSphereErrorCategory.AUTHENTICATION:
				title = `Authentication Error (${error.provider})`;
				break;
			case DevSphereErrorCategory.API_RATE_LIMIT:
				title = `Rate Limit Exceeded (${error.provider})`;
				break;
			case DevSphereErrorCategory.MODEL:
				title = `Model Error (${error.provider})`;
				break;
			case DevSphereErrorCategory.CONTENT_FILTER:
				title = `Content Filter (${error.provider})`;
				break;
			case DevSphereErrorCategory.NETWORK:
				title = 'Network Error';
				break;
			default:
				title = `AI Service Error (${error.provider})`;
		}

		// Create notification based on error details
		const message = `${title}: ${error.message}`;

		if (error.actionLabel && error.actionFn) {
			notificationService.prompt(
				1, // Severity.Error
				message,
				[{
					label: error.actionLabel,
					run: () => error.actionFn?.()
				}],
				{ sticky: true }
			);
		} else {
			notificationService.error(message);
		}
	}

	/**
	 * Format error as a system message for display in the chat
	 */
	public static formatErrorAsSystemMessage(error: DevSphereError): string {
		let message = `**Error ${error.provider ? `from ${error.provider}` : ''}**: ${error.message}`;

		if (error.details && error.details !== error.message) {
			message += `\n\n\`\`\`\n${error.details}\n\`\`\``;
		}

		// Add helpful tips based on error category
		switch (error.category) {
			case DevSphereErrorCategory.AUTHENTICATION:
				message += '\n\n**Tip**: Check that your API key is correct and has not expired.';
				break;
			case DevSphereErrorCategory.API_RATE_LIMIT:
				message += '\n\n**Tip**: Wait a few moments and try again, or switch to a different model.';
				break;
			case DevSphereErrorCategory.MODEL:
				message += '\n\n**Tip**: Try selecting a different model from the dropdown menu.';
				break;
			case DevSphereErrorCategory.CONTENT_FILTER:
				message += '\n\n**Tip**: Rephrase your request to avoid potentially sensitive content.';
				break;
			case DevSphereErrorCategory.NETWORK:
				message += '\n\n**Tip**: Check your internet connection and try again.';
				break;
		}

		return message;
	}
}
