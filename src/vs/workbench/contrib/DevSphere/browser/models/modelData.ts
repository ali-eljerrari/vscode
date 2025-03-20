/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { OpenAIModel } from './types.js';

/**
 * Default available models for the DevSphere service
 */
export const OPENAI_MODELS: OpenAIModel[] = [
	{
		ChatgptModels: {
			models: [
				// Low cost models
				{ id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo, Cheapest option for basic tasks', description: 'Cheapest option for basic tasks' },
				{ id: 'gpt-4o-mini', name: 'GPT-4o mini, Affordable small model with good capabilities', description: 'Affordable small model with good capabilities' },
				{ id: 'o1-mini', name: 'o1-mini, Affordable reasoning model', description: 'Affordable reasoning model' },

				// Mid-range models
				{ id: 'o3-mini', name: 'o3-mini, Mid-range reasoning model', description: 'Mid-range reasoning model' },
				{ id: 'gpt-4-turbo', name: 'GPT-4 Turbo, Mid-range versatile model', description: 'Mid-range versatile model' },
				{ id: 'gpt-4o', name: 'GPT-4o, High-quality versatile model', description: 'High-quality versatile model' },

				// Premium models
				{ id: 'gpt-4', name: 'GPT-4, Premium model for complex tasks', description: 'Premium model for complex tasks' },
				{ id: 'o1', name: 'o1, Premium reasoning model', description: 'Premium reasoning model' },
				{ id: 'gpt-4.5-preview', name: 'GPT-4.5 Preview, Most expensive, most capable GPT model', description: 'Most expensive, most capable GPT model' },
			],
			endPoint: 'https://api.openai.com/v1/chat/completions'
		},
		// Anthropic Models
		AnthropicModels: {
			models: [
				// Fast models
				{ id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', description: 'Intelligence at blazing speeds' },

				// High performance models
				{ id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', description: 'Powerful model for complex tasks' },
				{ id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', description: 'High intelligence and capability' },
				{ id: 'claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet', description: 'Most intelligent model with extended thinking' },
			],
			endPoint: 'https://api.anthropic.com/v1/messages'
		},

		// Google Models
		GoogleModels: {
			models: [
				// Gemini 2.0 models
				{ id: 'gemini-2.0-pro-experimental', name: 'Gemini 2.0 Pro Experimental', description: 'Top model for coding and complex prompts' },

				// Gemini 2.0 models
				{ id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', description: 'Powerful workhorse with low latency' },
				{ id: 'gemini-2.0-flash-thinking', name: 'Gemini 2.0 Flash Thinking', description: 'Enhanced reasoning with visible thought process' },
				{ id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash-Lite', description: 'Most cost-efficient model' },
			],
			endPoint: 'https://generativelanguage.googleapis.com/v1beta/models'
		}
	}
];

/**
 * Default token limit for API requests
 */
export const DEFAULT_MAX_TOKENS = 500;

/**
 * Default model ID to use if none is specified
 */
export const DEFAULT_MODEL_ID = 'gpt-4o-mini';

/**
 * Default model provider to use if none is specified
 */
export const DEFAULT_MODEL_PROVIDER = 'ChatgptModels';

/**
 * Storage keys used by the DevSphere service
 */
export const STORAGE_KEYS = {
	OPENAI_API_KEY: 'openai.api.key',
	ANTHROPIC_API_KEY: 'anthropic.api.key',
	GOOGLE_API_KEY: 'google.api.key',
	MODEL_ID: 'openai.model.id',
	CHATS: 'devSphere.chats'
};
