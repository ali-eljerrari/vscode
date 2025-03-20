/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * @file DevSphere Service Interface
 *
 * This module defines the interface for the DevSphere service, which is the central
 * service that provides all DevSphere functionality to other components. The interface
 * follows the VS Code service pattern, with a clear API that components can depend on.
 *
 * The service handles several major areas:
 * - API key management for different AI providers
 * - AI model management and selection
 * - API interaction with AI providers
 * - Chat persistence and management
 *
 * Components throughout DevSphere depend on this interface rather than the concrete
 * implementation, following the dependency inversion principle.
 */

import { createDecorator } from '../../../../../platform/instantiation/common/instantiation.js';
import { Chat, ModelInfoWithProvider, ModelProviderType, OpenAIModel } from '../models/types.js';

/**
 * Interface for the DevSphere service.
 * Defines the complete API for interacting with AI models, managing settings,
 * and handling chat persistence.
 */
export interface IDevSphereService {
	/**
	 * API key management methods
	 * These methods handle secure storage and retrieval of API keys
	 * for different AI providers.
	 */

	/** Gets the API key for the current provider */
	getProviderAPIKey(): Promise<string | undefined>;

	/** Prompts the user to update the API key for the current provider */
	updateAPIKey(): Promise<void>;

	/** Updates the API key for a specific provider */
	updateAPIKeyForProvider(providerType: ModelProviderType, providerName: string): Promise<void>;

	/** Checks if an API key exists for the given provider */
	hasAPIKeyForProvider(providerType: ModelProviderType): Promise<boolean>;

	/** Removes the API key for a specific provider */
	removeAPIKeyForProvider(providerType: ModelProviderType): Promise<void>;

	/** Removes all stored API keys */
	removeAllAPIKeys(): Promise<void>;

	/**
	 * API interaction
	 * Core method to communicate with AI models and get responses.
	 */

	/** Sends a prompt to the current AI model and returns the response */
	fetchAIResponse(prompt: string): Promise<string>;

	/**
	 * Model management methods
	 * These methods handle model selection and information.
	 */

	/** Gets all available models across all providers */
	getAvailableModels(): OpenAIModel[];

	/** Gets the currently selected model configuration */
	getCurrentModel(): OpenAIModel;

	/** Sets the current model by ID */
	setCurrentModel(modelId: string): void;

	/**
	 * Model info and provider switching methods
	 * These methods provide information about models and help with
	 * selecting and switching between them.
	 */

	/** Gets the ID of the currently selected model */
	getCurrentModelId(): string;

	/** Gets the type/category of the currently selected model */
	getCurrentModelType(): string;

	/** Gets the display name of the currently selected model */
	getCurrentModelName(): string;

	/** Gets the display name of the current provider */
	getCurrentProviderName(): string;

	/** Gets all available models for a specific provider */
	getAvailableModelsByProvider(providerType: ModelProviderType): ModelInfoWithProvider[];

	/** Finds models that have specific capabilities */
	findModelsByCapability(capability: 'coding' | 'reasoning' | 'speed' | 'cost-effective'): ModelInfoWithProvider[];

	/**
	 * Helper methods
	 * Utility methods for working with models and providers.
	 */

	/** Gets detailed information about a model by its ID */
	getModelInfoById(modelId: string): { provider: ModelProviderType; info: { id: string; name: string; description: string } } | null;

	/** Converts a provider type to a human-readable name */
	getProviderNameFromType(providerType: ModelProviderType): string;

	/**
	 * Chat persistence methods
	 * These methods handle saving, loading, and managing chat conversations.
	 */

	/** Saves a chat to persistent storage */
	saveChat(chat: Chat): Promise<void>;

	/** Loads a specific chat by ID */
	loadChat(chatId: string): Promise<Chat | undefined>;

	/** Gets all saved chats */
	getAllChats(): Promise<Chat[]>;

	/** Deletes a chat by ID */
	deleteChat(chatId: string): Promise<void>;

	/** Creates a new empty chat */
	createNewChat(): Chat;
}

/**
 * Service identifier for the DevSphere service.
 * Used by the VS Code dependency injection system to identify and provide
 * the DevSphere service to components that depend on it.
 */
export const IDevSphereService = createDecorator<IDevSphereService>('devSphereService');
