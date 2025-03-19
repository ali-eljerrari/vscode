/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DevSphereViewModel } from '../devSphereViewModel.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';

export class DevSphereInput extends Disposable {
	private inputElement: HTMLTextAreaElement;
	private submitButton: HTMLButtonElement;
	private inputContainer: HTMLDivElement;

	constructor(
		private readonly container: HTMLElement,
		private readonly viewModel: DevSphereViewModel
	) {
		super();

		// Create input section
		const inputSection = document.createElement('div');
		inputSection.className = 'dev-sphere-input-section';
		this.container.appendChild(inputSection);

		// Create a container for the input and button for better styling
		this.inputContainer = document.createElement('div');
		this.inputContainer.className = 'dev-sphere-input-container';
		inputSection.appendChild(this.inputContainer);

		// Create the input text field
		this.inputElement = document.createElement('textarea');
		this.inputElement.className = 'dev-sphere-input';
		this.inputElement.placeholder = 'Ask a question or type / for commands...';
		this.inputElement.rows = 1;
		this.inputElement.spellcheck = false;

		// Add event listener for Enter key
		this.inputElement.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault();
				this.sendMessage();
			}
		});

		// Auto-resize input as content grows
		this.inputElement.addEventListener('input', () => {
			this.resizeInput();
		});

		this.inputContainer.appendChild(this.inputElement);

		// Create the submit button
		this.submitButton = document.createElement('button');
		this.submitButton.className = 'dev-sphere-submit-button';
		this.submitButton.textContent = 'Send';
		this.submitButton.title = 'Send message (Enter)';

		// Add event listener for button click
		this.submitButton.addEventListener('click', () => {
			this.sendMessage();
		});

		this.inputContainer.appendChild(this.submitButton);
	}

	/**
	 * Focuses the input element
	 */
	public focus(): void {
		if (this.inputElement) {
			this.inputElement.focus();
		}
	}

	/**
	 * Updates the loading state of the input
	 */
	public updateLoadingState(isLoading: boolean): void {
		if (this.inputElement) {
			this.inputElement.disabled = isLoading;
		}

		if (this.submitButton) {
			this.submitButton.disabled = isLoading;
		}
	}

	/**
	 * Sends the current message from the input
	 */
	private sendMessage(): void {
		const text = this.inputElement.value.trim();
		if (text) {
			this.viewModel.sendMessage(text);
			this.inputElement.value = '';
			this.resizeInput();
			// Ensure input regains focus after sending a message
			setTimeout(() => this.focus(), 50);
		}
	}

	/**
	 * Resizes the input based on content
	 */
	private resizeInput(): void {
		if (this.inputElement) {
			this.inputElement.style.height = 'auto';
			this.inputElement.style.height = `${Math.min(this.inputElement.scrollHeight, 200)}px`;
		}
	}
}
