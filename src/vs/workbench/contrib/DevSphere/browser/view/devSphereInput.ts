/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * @file DevSphere Input Component
 *
 * This module implements the input component for the DevSphere extension.
 * It handles text input, message submission, and auto-resizing of the
 * text area. The component is integrated with the view model to process
 * user inputs and send them to the AI service.
 *
 * Key features:
 * - Auto-growing textarea for user input
 * - Enter key handling for message submission (Shift+Enter for new line)
 * - Dynamic state management based on loading state
 * - Focus management for better UX
 */

import { DevSphereViewModel } from '../devSphereViewModel.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';

/**
 * Input component for DevSphere chat interface.
 * Provides a textarea for user input and a submit button for sending messages.
 * Handles auto-resizing of the input area and keyboard shortcuts.
 */
export class DevSphereInput extends Disposable {
	/** The textarea element for user input */
	private inputElement: HTMLTextAreaElement;

	/** The button element for submitting messages */
	private submitButton: HTMLButtonElement;

	/** Container div for styling and arranging the input elements */
	private inputContainer: HTMLDivElement;

	/**
	 * Creates a new instance of the DevSphere input component.
	 *
	 * @param container - Parent DOM element to append the input component to
	 * @param viewModel - ViewModel instance for handling user actions and message processing
	 */
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
	 * Focuses the input element.
	 * Used to programmatically set focus after certain actions like sending a message
	 * or switching between views.
	 */
	public focus(): void {
		if (this.inputElement) {
			this.inputElement.focus();
		}
	}

	/**
	 * Updates the loading state of the input.
	 * Disables or enables the input and button based on whether a message is being processed.
	 *
	 * @param isLoading - Whether the application is currently loading (processing a message)
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
	 * Sends the current message from the input.
	 * Trims the input text, sends it to the view model, clears the input,
	 * resizes it, and then re-focuses it for the next message.
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
	 * Resizes the input based on content.
	 * Adjusts the height of the textarea to match its content,
	 * with a maximum height of 200px.
	 */
	private resizeInput(): void {
		if (this.inputElement) {
			this.inputElement.style.height = 'auto';
			this.inputElement.style.height = `${Math.min(this.inputElement.scrollHeight, 200)}px`;
		}
	}
}
