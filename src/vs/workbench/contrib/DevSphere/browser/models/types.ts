/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * @file DevSphere Types Module
 *
 * This module defines all the core data structures, interfaces, and types used
 * throughout the DevSphere feature. It serves as the foundation for type safety
 * and standardization across the codebase.
 *
 * The types defined here represent:
 * - Model provider information and configuration
 * - Chat message and conversation structures
 * - Error handling types
 * - Configuration interfaces
 *
 * These types are imported by various components and services to ensure
 * consistency in data handling throughout the extension.
 */



/**
 * Model provider types supported by DevSphere.
 * Each provider represents a different AI model service that can be configured.
 */
export type ModelProviderType = 'ChatgptModels' | 'AnthropicModels' | 'GoogleModels';

/**
 * Provider models configuration interface.
 * Defines the structure for model configuration data for each supported
 * AI provider, including available models and endpoint information.
 */
export interface OpenAIModel {
	ChatgptModels: {
		models: ModelInfo[];
		endPoint: string;
	};
	AnthropicModels: {
		models: ModelInfo[];
		endPoint: string;
	};
	GoogleModels: {
		models: ModelInfo[];
		endPoint: string;
	};
}

/**
 * Individual model information.
 * Contains the core information about a specific AI model.
 */
export interface ModelInfo {
	id: string;          // Unique identifier for the model
	name: string;        // Display name for the model
	description: string; // Brief description of the model's capabilities
}

/**
 * Extended model info that includes provider information.
 * Used when model information needs to be paired with its provider.
 */
export interface ModelInfoWithProvider extends ModelInfo {
	provider: string;    // Provider identifier
}

/**
 * Model capabilities interface.
 * Describes the specific features a model supports beyond basic chat.
 */
export interface ModelCapabilities {
	supportsImages?: boolean;          // Whether the model can process images
	supportsCode?: boolean;            // Whether the model is optimized for code
	supportsThinking?: boolean;        // Whether the model can show reasoning steps
	supportsFunctionCalling?: boolean; // Whether the model supports function/tool calling
}

/**
 * Chat message representation.
 * Defines the structure of individual messages in a conversation.
 */
export interface Message {
	id: string;                        // Unique identifier for the message
	role: 'user' | 'assistant' | 'system' | 'loading'; // Who sent the message
	content: string;                   // Main text content of the message
	timestamp: number;                 // When the message was created

	// Optional model-specific features
	thinking?: string;                 // For models that support showing reasoning steps
	toolCalls?: any[];                 // For models that support tool calls
	followUpQuestions?: string[];      // Suggested follow-up questions
	attachments?: {                    // For messages with attachments
		type: 'code' | 'image' | 'file';
		content: string;               // Content or URL
		language?: string;             // For code snippets
		name?: string;                 // For files
	}[];
}

/**
 * Chat conversation representation.
 * Defines the structure of a complete chat conversation.
 */
export interface Chat {
	id: string;                        // Unique identifier for the chat
	title: string;                     // User-friendly title
	messages: Message[];               // All messages in the conversation
	lastModified: number;              // When the chat was last updated
	modelId: string;                   // ID of the model used
	provider?: ModelProviderType;      // Provider of the model

	// Additional metadata
	modelCapabilities?: ModelCapabilities;
	pinnedMessages?: string[];         // IDs of pinned messages
	tags?: string[];                   // User-defined tags for organization
}

/**
 * Error interface for DevSphere.
 * Standardizes error handling across the extension.
 */
export interface DevSphereError {
	category: string;                   // Type of error (API, authentication, etc.)
	message: string;                   // User-friendly error message
	details?: string;                  // Additional technical details
	statusCode?: number;               // HTTP status code (for API errors)
	provider?: string;                 // Which provider caused the error
	modelId?: string;                  // Which model caused the error
	retryable?: boolean;               // Whether the operation can be retried
	actionLabel?: string;              // Label for action button (if any)
	actionFn?: () => void;             // Function to call when action is clicked
	originalError?: Error;             // Original error object (for debugging)
}

/**
 * CORS proxy options for API requests.
 * Configures how requests are made to external AI providers.
 */
export interface CorsProxyOptions {
	headers: Record<string, string>;   // Headers to send with the request
	mode: RequestMode;                 // CORS mode for the request
	useNodeProxy?: boolean;            // Whether to use Node.js-based proxy
}

/**
 * Model info with its provider type.
 * Used when both model information and provider are needed together.
 */
export interface ModelWithProvider {
	provider: ModelProviderType;       // Provider type
	info: ModelInfo;                   // Model information
}
