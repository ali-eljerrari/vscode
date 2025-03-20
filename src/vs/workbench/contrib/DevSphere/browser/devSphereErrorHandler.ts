/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * @file DevSphere Error Handler
 *
 * This module provides comprehensive error handling for the DevSphere extension.
 * It includes:
 *
 * 1. Error categorization - Classifying errors into specific categories for
 *    targeted handling and user communication
 *
 * 2. Error processing - Converting various error types (API errors, network errors,
 *    etc.) into a standardized DevSphereError format
 *
 * 3. Error presentation - Converting errors into user-friendly notifications
 *    and system messages
 *
 * The error handler centralizes error management to ensure consistent handling
 * and messaging throughout the extension.
 */

import { INotificationService } from '../../../../platform/notification/common/notification.js';

/**
 * Error categories for DevSphere.
 * Categorizes errors by their source and type to enable specific handling
 * strategies for different error scenarios.
 */
export enum DevSphereErrorCategory {
	/** API key missing, invalid, or expired */
	API_KEY = 'api_key',

	/** Error in constructing or sending API request */
	API_REQUEST = 'api_request',

	/** Error in the API response format or content */
	API_RESPONSE = 'api_response',

	/** Rate limit exceeded for API calls */
	API_RATE_LIMIT = 'api_rate_limit',

	/** Usage quota exceeded for the API service */
	API_QUOTA = 'api_quota',

	/** Network connectivity issues */
	NETWORK = 'network',

	/** Authentication problems (beyond API key issues) */
	AUTHENTICATION = 'authentication',

	/** Problems with the AI model itself */
	MODEL = 'model',

	/** Content was filtered by the AI provider's content policy */
	CONTENT_FILTER = 'content_filter',

	/** Unclassified or unexpected errors */
	UNKNOWN = 'unknown'
}

/**
 * Standardized error object for DevSphere.
 * Provides a consistent structure for all errors in the system,
 * regardless of their original source.
 */
export interface DevSphereError {
	/** The category of the error */
	category: DevSphereErrorCategory;

	/** User-friendly error message */
	message: string;

	/** Additional technical details (for logs/debugging) */
	details?: string;

	/** HTTP status code (for API errors) */
	statusCode?: number;

	/** Which provider caused the error */
	provider?: string;

	/** Which model caused the error */
	modelId?: string;

	/** Whether the operation can be retried */
	retryable?: boolean;

	/** Label for action button (if applicable) */
	actionLabel?: string;

	/** Function to call when action is clicked */
	actionFn?: () => void;

	/** Original exception object */
	originalError?: Error;
}

/**
 * Utility class to handle DevSphere service errors.
 * Provides static methods for processing errors, displaying notifications,
 * and formatting error messages.
 */
export class DevSphereErrorHandler {
	/**
	 * Processes an API error and converts it to a standardized DevSphereError.
	 * Analyzes the error to determine its category and extracts relevant information.
	 *
	 * @param error - The original error from the API call
	 * @param modelId - ID of the model that was being used
	 * @param provider - Name of the provider that was being used
	 * @returns A standardized DevSphereError object
	 */
	public static processApiError(error: unknown, modelId: string, provider: string): DevSphereError {
		// Default error structure
		const devSphereError: DevSphereError = {
			category: DevSphereErrorCategory.UNKNOWN,
			message: 'An unexpected error occurred',
			provider,
			modelId,
			retryable: false,
			originalError: error instanceof Error ? error : undefined
		};

		// Handle different error types
		if (error instanceof Error) {
			devSphereError.message = error.message;
			devSphereError.details = error.stack;

			// Check for network errors
			if (error.message.includes('Failed to fetch') || error.message.includes('Network Error') || error.message.includes('ECONNREFUSED')) {
				devSphereError.category = DevSphereErrorCategory.NETWORK;
				devSphereError.message = 'Network connection error. Please check your internet connection.';
				devSphereError.retryable = true;
			}
		} else if (typeof error === 'object' && error !== null) {
			// Handle response-like errors with status codes
			const errorObj = error as Record<string, any>;

			if ('status' in errorObj && typeof errorObj.status === 'number') {
				devSphereError.statusCode = errorObj.status;

				// Handle specific HTTP status codes
				if (errorObj.status === 401 || errorObj.status === 403) {
					devSphereError.category = DevSphereErrorCategory.API_KEY;
					devSphereError.message = 'Authentication failed. Please check your API key.';
					devSphereError.retryable = false;
					devSphereError.actionLabel = 'Update API Key';
				} else if (errorObj.status === 429) {
					devSphereError.category = DevSphereErrorCategory.API_RATE_LIMIT;
					devSphereError.message = 'Rate limit exceeded. Please try again later.';
					devSphereError.retryable = true;
				} else if (errorObj.status >= 500) {
					devSphereError.category = DevSphereErrorCategory.API_RESPONSE;
					devSphereError.message = 'The AI service is currently unavailable. Please try again later.';
					devSphereError.retryable = true;
				}
			}

			// Handle provider-specific error formats
			if ('error' in errorObj && typeof errorObj.error === 'object' && errorObj.error !== null) {
				const errorDetails = errorObj.error;

				if (typeof errorDetails.message === 'string') {
					devSphereError.details = errorDetails.message;
				}

				if (typeof errorDetails.type === 'string') {
					// OpenAI-style error types
					if (errorDetails.type.includes('rate_limit_exceeded')) {
						devSphereError.category = DevSphereErrorCategory.API_RATE_LIMIT;
						devSphereError.message = 'Rate limit exceeded. Please try again later.';
						devSphereError.retryable = true;
					} else if (errorDetails.type.includes('invalid_api_key')) {
						devSphereError.category = DevSphereErrorCategory.API_KEY;
						devSphereError.message = 'Invalid API key. Please update your API key.';
						devSphereError.retryable = false;
						devSphereError.actionLabel = 'Update API Key';
					} else if (errorDetails.type.includes('insufficient_quota')) {
						devSphereError.category = DevSphereErrorCategory.API_QUOTA;
						devSphereError.message = 'You have exceeded your current quota. Please check your plan and billing details.';
						devSphereError.retryable = false;
					} else if (errorDetails.type.includes('content_filter')) {
						devSphereError.category = DevSphereErrorCategory.CONTENT_FILTER;
						devSphereError.message = 'Your request was blocked by the AI provider\'s content filter.';
						devSphereError.retryable = false;
					}
				}
			}
		} else if (typeof error === 'string') {
			// Handle string errors
			devSphereError.message = error;

			// Check for common error patterns in string messages
			if (error.includes('API key') || error.includes('authentication')) {
				devSphereError.category = DevSphereErrorCategory.API_KEY;
				devSphereError.retryable = false;
				devSphereError.actionLabel = 'Update API Key';
			} else if (error.includes('rate limit') || error.includes('too many requests')) {
				devSphereError.category = DevSphereErrorCategory.API_RATE_LIMIT;
				devSphereError.message = 'Rate limit exceeded. Please try again later.';
				devSphereError.retryable = true;
			}
		}

		return devSphereError;
	}

	/**
	 * Displays an error notification to the user.
	 * Shows a notification with appropriate actions based on the error category.
	 *
	 * @param error - The standardized DevSphere error
	 * @param notificationService - VS Code's notification service
	 */
	public static showErrorNotification(error: DevSphereError, notificationService: INotificationService): void {
		const message = error.message;
		const actions = [];

		// Add action button if specified
		if (error.actionLabel && error.actionFn) {
			actions.push({
				label: error.actionLabel,
				run: error.actionFn
			});
		}

		// Add retry button for retryable errors
		if (error.retryable) {
			actions.push({
				label: 'Retry',
				run: () => {
					// The retry logic should be handled by the caller
					console.log('User clicked retry for error:', error);
				}
			});
		}

		// Show different notification types based on error category
		switch (error.category) {
			case DevSphereErrorCategory.API_KEY:
			case DevSphereErrorCategory.AUTHENTICATION:
				notificationService.error(message);
				break;

			case DevSphereErrorCategory.API_RATE_LIMIT:
			case DevSphereErrorCategory.API_QUOTA:
			case DevSphereErrorCategory.NETWORK:
				notificationService.error(message);
				break;

			case DevSphereErrorCategory.CONTENT_FILTER:
				notificationService.error(message);
				break;

			default:
				notificationService.error(message);
		}
	}

	/**
	 * Formats an error as a system message for display in the chat.
	 * Creates a markdown-formatted error message that can be added to the chat.
	 *
	 * @param error - The standardized DevSphere error
	 * @returns A markdown-formatted error message
	 */
	public static formatErrorAsSystemMessage(error: DevSphereError): string {
		// Basic error message
		let message = `**Error**: ${error.message}`;

		// Add category info
		message += `\n\n**Type**: ${this.getCategoryDisplayName(error.category)}`;

		// Add provider info if available
		if (error.provider) {
			message += `\n\n**Provider**: ${error.provider}`;
		}

		// Add status code if available
		if (error.statusCode) {
			message += `\n\n**Status Code**: ${error.statusCode}`;
		}

		// Add retry information
		if (error.retryable) {
			message += '\n\n*You can try again later or try a different query.*';
		}

		return message;
	}

	/**
	 * Gets a user-friendly display name for an error category.
	 *
	 * @param category - The error category enum value
	 * @returns A human-readable category name
	 */
	private static getCategoryDisplayName(category: DevSphereErrorCategory): string {
		switch (category) {
			case DevSphereErrorCategory.API_KEY:
				return 'API Key Issue';
			case DevSphereErrorCategory.API_REQUEST:
				return 'Request Error';
			case DevSphereErrorCategory.API_RESPONSE:
				return 'Response Error';
			case DevSphereErrorCategory.API_RATE_LIMIT:
				return 'Rate Limit Exceeded';
			case DevSphereErrorCategory.API_QUOTA:
				return 'Quota Exceeded';
			case DevSphereErrorCategory.NETWORK:
				return 'Network Error';
			case DevSphereErrorCategory.AUTHENTICATION:
				return 'Authentication Error';
			case DevSphereErrorCategory.MODEL:
				return 'Model Error';
			case DevSphereErrorCategory.CONTENT_FILTER:
				return 'Content Filtered';
			case DevSphereErrorCategory.UNKNOWN:
			default:
				return 'Unknown Error';
		}
	}
}
