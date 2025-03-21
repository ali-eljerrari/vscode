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

/**
 * Error categories for DevSphere.
 * Categorizes errors by their source and type to enable specific handling
 * strategies for different error scenarios.
 */


/**
 * Standardized error object for DevSphere.
 * Provides a consistent structure for all errors in the system,
 * regardless of their original source.
 */
export interface DevSphereError {

	/** User-friendly error message */
	message: string;


	/** Which provider caused the error */
	provider: string;

	/** Which model caused the error */
	modelId?: string;

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
	public static processApiError(message: string, modelId: string, provider: string): DevSphereError {
		// Default error structure
		const devSphereError: DevSphereError = {
			message,
			provider,
			modelId,
		};

		return devSphereError;
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
		return `${error.message}, Provider: ${error.provider}, Model ID: ${error.modelId}`;
	}

}
