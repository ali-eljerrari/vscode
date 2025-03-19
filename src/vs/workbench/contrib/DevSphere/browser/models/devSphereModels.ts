/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Define available OpenAI models
export interface OpenAIModel {
	ChatgptModels: {
		models: {
			id: string;
			name: string;
			description: string;
		}[];
		endPoint: string;
	};
	AnthropicModels: {
		models: {
			id: string;
			name: string;
			description: string;
		}[];
		endPoint: string;
	};
	GoogleModels: {
		models: {
			id: string;
			name: string;
			description: string;
		}[];
		endPoint: string;
	};
}

// Provider type definition
export type ModelProviderType = 'ChatgptModels' | 'AnthropicModels' | 'GoogleModels';

// Message interface
export interface Message {
	id: string;
	role: 'user' | 'assistant' | 'system' | 'loading';
	content: string;
	timestamp: number;

	// Optional model-specific features
	thinking?: string;       // For models that support showing reasoning steps (e.g. Google "thinking" models)
	toolCalls?: any[];       // For models that support tool calls (Function Calling)
	followUpQuestions?: string[]; // Suggested follow-up questions
	attachments?: {          // For messages with attachments like code snippets or images
		type: 'code' | 'image' | 'file';
		content: string;     // Content or URL
		language?: string;   // For code snippets
		name?: string;       // For files
	}[];
}

// Chat interface
export interface Chat {
	id: string;
	title: string;
	messages: Message[];
	lastModified: number;
	modelId: string;
	provider?: ModelProviderType;

	// Additional metadata to enhance UI
	modelCapabilities?: {
		supportsImages?: boolean;
		supportsCode?: boolean;
		supportsThinking?: boolean;
		supportsFunctionCalling?: boolean;
	};
	pinnedMessages?: string[]; // IDs of pinned messages
	tags?: string[];           // User-defined tags for organization
}

// Model capability types
export type ModelCapabilityType = 'coding' | 'reasoning' | 'speed' | 'cost-effective';
