/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../../platform/instantiation/common/instantiation.js';
import { Chat, ModelInfoWithProvider, ModelProviderType, OpenAIModel } from '../models/types.js';

/**
 * Interface for the DevSphere service
 */
export interface IDevSphereService {
	// API key management
	getProviderAPIKey(): Promise<string | undefined>;
	updateAPIKey(): Promise<void>;
	updateAPIKeyForProvider(providerType: ModelProviderType, providerName: string): Promise<void>;
	hasAPIKeyForProvider(providerType: ModelProviderType): Promise<boolean>;
	removeAPIKeyForProvider(providerType: ModelProviderType): Promise<void>;
	removeAllAPIKeys(): Promise<void>;

	// API interaction
	fetchAIResponse(prompt: string): Promise<string>;

	// Model management
	getAvailableModels(): OpenAIModel[];
	getCurrentModel(): OpenAIModel;
	setCurrentModel(modelId: string): void;

	// Model info and provider switching
	getCurrentModelId(): string;
	getCurrentModelType(): string;
	getCurrentModelName(): string;
	getCurrentProviderName(): string;
	getAvailableModelsByProvider(providerType: ModelProviderType): ModelInfoWithProvider[];
	findModelsByCapability(capability: 'coding' | 'reasoning' | 'speed' | 'cost-effective'): ModelInfoWithProvider[];

	// Helper methods
	getModelInfoById(modelId: string): { provider: ModelProviderType; info: { id: string; name: string; description: string } } | null;
	getProviderNameFromType(providerType: ModelProviderType): string;

	// Chat persistence
	saveChat(chat: Chat): Promise<void>;
	loadChat(chatId: string): Promise<Chat | undefined>;
	getAllChats(): Promise<Chat[]>;
	deleteChat(chatId: string): Promise<void>;
	createNewChat(): Chat;
}

/**
 * Service identifier for the DevSphere service
 */
export const IDevSphereService = createDecorator<IDevSphereService>('devSphereService');
