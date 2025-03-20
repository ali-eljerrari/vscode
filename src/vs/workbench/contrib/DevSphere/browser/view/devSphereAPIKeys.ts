/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../../base/common/lifecycle.js';
import { Emitter } from '../../../../../base/common/event.js';
import { IDevSphereService } from '../services/devSphereServiceInterface.js';
import { IQuickInputService } from '../../../../../platform/quickinput/common/quickInput.js';
import { ModelProviderType } from '../models/types.js';

/**
 * Component for managing API keys for different AI providers
 */
export class DevSphereAPIKeys extends Disposable {
	private container: HTMLElement;
	private apiKeysContainer: HTMLElement;
	private visible: boolean = false;
	private _onShow = this._register(new Emitter<void>());
	private readonly onShow = this._onShow.event;

	constructor(
		container: HTMLElement,
		private readonly devSphereService: IDevSphereService,
		private readonly quickInputService: IQuickInputService
	) {
		super();

		// Create the container
		this.container = document.createElement('div');
		this.container.classList.add('dev-sphere-apikeys-container');
		container.appendChild(this.container);

		// Initially hidden
		this.container.style.display = 'none';

		// Create header
		const header = document.createElement('h2');
		header.textContent = 'Manage API Keys';
		header.classList.add('dev-sphere-apikeys-header');
		this.container.appendChild(header);

		// Create description
		const description = document.createElement('p');
		description.textContent = 'Configure API keys for different AI providers to use in DevSphere. Keys are stored securely.';
		description.classList.add('dev-sphere-apikeys-description');
		this.container.appendChild(description);

		// Create API keys container
		this.apiKeysContainer = document.createElement('div');
		this.apiKeysContainer.classList.add('dev-sphere-apikeys-list');
		this.container.appendChild(this.apiKeysContainer);

		// Render provider sections
		this.renderProviderSection('ChatgptModels', 'OpenAI');
		this.renderProviderSection('AnthropicModels', 'Anthropic');
		this.renderProviderSection('GoogleModels', 'Google AI');
	}

	/**
	 * Creates a section for each provider with update button
	 */
	private renderProviderSection(providerType: string, displayName: string): void {
		const providerSection = document.createElement('div');
		providerSection.classList.add('dev-sphere-apikeys-provider');
		this.apiKeysContainer.appendChild(providerSection);

		// Provider name
		const providerHeader = document.createElement('h3');
		providerHeader.textContent = displayName;
		providerSection.appendChild(providerHeader);

		// Status indicator (placeholder, will be updated)
		const statusDiv = document.createElement('div');
		statusDiv.classList.add('dev-sphere-apikeys-status');
		statusDiv.innerHTML = `
            <span class="dev-sphere-apikeys-status-indicator">●</span>
            <span class="dev-sphere-apikeys-status-text">Status: Checking...</span>
        `;
		providerSection.appendChild(statusDiv);

		// Update button
		const updateButton = document.createElement('button');
		updateButton.textContent = `Update ${displayName} API Key`;
		updateButton.classList.add('dev-sphere-button');
		updateButton.addEventListener('click', () => {
			this.updateAPIKey(providerType as ModelProviderType, displayName);
		});
		providerSection.appendChild(updateButton);

		// Check key status when showing the view
		this._register(this.onShow(() => {
			this.checkAPIKeyStatus(providerType as ModelProviderType, statusDiv);
		}));
	}

	/**
	 * Updates API key for a specific provider
	 */
	private async updateAPIKey(providerType: ModelProviderType, providerName: string): Promise<void> {
		try {
			// Use the specific provider method if supported, otherwise fallback to general method
			if (this.devSphereService.updateAPIKeyForProvider) {
				await this.devSphereService.updateAPIKeyForProvider(providerType, providerName);
			} else {
				// Fallback to the general method
				await this.devSphereService.updateAPIKey();
			}
			// Update the status indicators after updating
			this.refreshAllStatusIndicators();
		} catch (error) {
			console.error('Error updating API key:', error);
		}
	}

	/**
	 * Checks if an API key exists for the given provider
	 */
	private async checkAPIKeyStatus(providerType: ModelProviderType, statusElement: HTMLElement): Promise<void> {
		try {
			// Try to use the specific method if available
			let hasKey = false;
			if (this.devSphereService.hasAPIKeyForProvider) {
				hasKey = await this.devSphereService.hasAPIKeyForProvider(providerType);
			} else {
				// Fallback to checking if we can get a key
				const apiKey = await this.devSphereService.getProviderAPIKey();
				hasKey = !!apiKey;
			}

			const indicator = statusElement.querySelector('.dev-sphere-apikeys-status-indicator');
			const text = statusElement.querySelector('.dev-sphere-apikeys-status-text');

			if (hasKey) {
				indicator?.classList.remove('dev-sphere-apikeys-status-missing');
				indicator?.classList.add('dev-sphere-apikeys-status-present');
				if (text) text.textContent = 'Status: API Key Set';
			} else {
				indicator?.classList.remove('dev-sphere-apikeys-status-present');
				indicator?.classList.add('dev-sphere-apikeys-status-missing');
				if (text) text.textContent = 'Status: API Key Missing';
			}
		} catch (error) {
			console.error('Error checking API key status:', error);
			const text = statusElement.querySelector('.dev-sphere-apikeys-status-text');
			if (text) text.textContent = 'Status: Error checking';
		}
	}

	/**
	 * Refreshes status indicators for all providers
	 */
	private refreshAllStatusIndicators(): void {
		const statusElements = this.apiKeysContainer.querySelectorAll('.dev-sphere-apikeys-status');
		const providers = ['ChatgptModels', 'AnthropicModels', 'GoogleModels'];

		statusElements.forEach((element, index) => {
			if (index < providers.length) {
				this.checkAPIKeyStatus(providers[index] as ModelProviderType, element as HTMLElement);
			}
		});
	}

	/**
	 * Sets the visibility of the component
	 */
	public setVisible(visible: boolean): void {
		if (this.visible === visible) return;

		this.visible = visible;
		this.container.style.display = visible ? 'flex' : 'none';

		if (visible) {
			this.refreshAllStatusIndicators();
			this._onShow.fire();
		}
	}
}
