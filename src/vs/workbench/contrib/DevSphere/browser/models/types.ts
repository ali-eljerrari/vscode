/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DevSphereErrorCategory } from '../devSphereErrorHandler.js';

/**
 * Model provider types
 */
export type ModelProviderType = 'ChatgptModels' | 'AnthropicModels' | 'GoogleModels';

/**
 * Provider models configuration
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
 * Individual model information
 */
export interface ModelInfo {
	id: string;
	name: string;
	description: string;
}

/**
 * Extended model info with provider
 */
export interface ModelInfoWithProvider extends ModelInfo {
	provider: string;
}

/**
 * Model capabilities
 */
export interface ModelCapabilities {
	supportsImages?: boolean;
	supportsCode?: boolean;
	supportsThinking?: boolean;
	supportsFunctionCalling?: boolean;
}

/**
 * Chat message representation
 */
export interface Message {
	id: string;
	role: 'user' | 'assistant' | 'system' | 'loading';
	content: string;
	timestamp: number;

	// Optional model-specific features
	thinking?: string;       // For models that support showing reasoning steps
	toolCalls?: any[];       // For models that support tool calls
	followUpQuestions?: string[]; // Suggested follow-up questions
	attachments?: {          // For messages with attachments
		type: 'code' | 'image' | 'file';
		content: string;     // Content or URL
		language?: string;   // For code snippets
		name?: string;       // For files
	}[];
}

/**
 * Chat conversation representation
 */
export interface Chat {
	id: string;
	title: string;
	messages: Message[];
	lastModified: number;
	modelId: string;
	provider?: ModelProviderType;

	// Additional metadata
	modelCapabilities?: ModelCapabilities;
	pinnedMessages?: string[]; // IDs of pinned messages
	tags?: string[];           // User-defined tags for organization
}

/**
 * Error interface for DevSphere
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
 * CORS proxy options for API requests
 */
export interface CorsProxyOptions {
	headers: Record<string, string>;
	mode: RequestMode;
	useNodeProxy?: boolean;
}

/**
 * Model info with its provider type
 */
export interface ModelWithProvider {
	provider: ModelProviderType;
	info: ModelInfo;
}
