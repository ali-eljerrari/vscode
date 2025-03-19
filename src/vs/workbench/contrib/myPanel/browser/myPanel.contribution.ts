/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IViewsRegistry, ViewContainerLocation, IViewContainersRegistry, Extensions as ViewContainerExtensions, IViewDescriptorService } from '../../../common/views.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { localize } from '../../../../nls.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkbenchContribution, IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from '../../../common/contributions.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { registerAction2, Action2 } from '../../../../platform/actions/common/actions.js';
import { ServicesAccessor, IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ViewPaneContainer } from '../../../browser/parts/views/viewPaneContainer.js';
import { ViewPane, IViewPaneOptions } from '../../../browser/parts/views/viewPane.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';

// Import CSS
import './media/myPanel.css';

// Define your panel view class
class MyPanelView extends ViewPane {
	static readonly ID = 'myPanelView';
	private container: HTMLElement | undefined;
	private messagesContainerSelector: HTMLElement | undefined;
	private inputElement: HTMLInputElement | undefined;

	constructor(
		options: IViewPaneOptions,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IOpenerService openerService: IOpenerService,
		@IThemeService themeService: IThemeService,
		@IHoverService hoverService: IHoverService,
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);
	}

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);
		this.container = container;

		// Add CSS class to the container
		container.classList.add('my-panel-container');

		// Create a messages container
		const messagesContainer = document.createElement('div');
		messagesContainer.classList.add('my-panel-messages');
		container.appendChild(messagesContainer);

		// Set the reference AFTER we've created and appended the element
		this.messagesContainerSelector = messagesContainer;

		// Create and append multiple messages to demonstrate scrolling
		const messages: { sender: string; text: string }[] = [];

		// Add each message as a separate element with sender class
		messages.forEach(message => {
			const messageElement = document.createElement('div');
			messageElement.classList.add('my-panel-text');
			messageElement.classList.add(`my-panel-text-${message.sender}`);

			// Create and append content securely using DOM manipulation
			this.appendFormattedContent(messageElement, message.text);

			messagesContainer.appendChild(messageElement);
		});

		// Create the input section at the bottom
		this.createInputSection(container);

		// Set focus after a short delay to ensure the DOM is ready
		setTimeout(() => this.focusInput(), 100);
	}

	private createInputSection(container: HTMLElement): void {
		// Create a section with a title
		const section = document.createElement('div');
		section.classList.add('my-panel-section');

		const input = document.createElement('input');
		input.type = 'text';
		input.placeholder = 'Enter your text here';

		// Store reference to the input element
		this.inputElement = input;

		section.appendChild(input);

		const button = document.createElement('button');
		button.textContent = 'Submit';
		section.appendChild(button);

		// Add event listener for button click
		button.addEventListener('click', () => {
			const text = input.value.trim();
			if (text) {
				this.updateText(text);
				this.fetchApiResponse(text);
				input.value = '';
				input.focus();
			}
		});

		// Add event listener for Enter key
		input.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				const text = input.value.trim();
				if (text) {
					this.updateText(text);
					this.fetchApiResponse(text);
					input.value = '';
				}
			}
		});

		container.appendChild(section);
	}

	// Method to focus the input
	private focusInput(): void {
		if (this.inputElement) {
			this.inputElement.focus();
		}
	}

	// Override the setVisible method to focus the input when the view becomes visible
	override setVisible(visible: boolean): void {
		super.setVisible(visible);
		if (visible) {
			// Focus the input when the view becomes visible
			setTimeout(() => this.focusInput(), 100);
		}
	}

	private async appendImage(imageUrl: string): Promise<void> {
		// Create a container for the API response
		const apiResponseContainer = document.createElement('div');
		apiResponseContainer.classList.add('my-panel-text', 'my-panel-text-api');

		// Create and append the image
		const image = document.createElement('img');
		image.src = imageUrl;
		image.classList.add('my-panel-image');
		apiResponseContainer.appendChild(image);

		// Append to the messages container and scroll to bottom
		if (this.messagesContainerSelector) {
			this.messagesContainerSelector.appendChild(apiResponseContainer);
			this.scrollToBottom();
		}
	}

	private scrollToBottom(): void {
		if (this.messagesContainerSelector) {
			this.messagesContainerSelector.scrollTop = this.messagesContainerSelector.scrollHeight;
		}
	}

	private async fetchApiResponse(text: string): Promise<void> {
		// TODO: Implement API response fetching
		console.log('Fetching API response for:', text);
		try {
			// disable input and button
			const input = this.container?.querySelector('input');
			const button = this.container?.querySelector('button');
			if (input) {
				input.disabled = true;
			}
			if (button) {
				button.disabled = true;
			}
			const response = await fetch('https://dog.ceo/api/breeds/image/random');

			const data = await response.json();
			console.log('API response:', JSON.stringify(data));
			if (this.messagesContainerSelector) {
				this.appendImage(data.message);
			}
			// enable input and button
			if (input) {
				input.disabled = false;
				input.focus();
			}
			if (button) {
				button.disabled = false;
			}
		} catch (error) {
			console.error('Error fetching API response:', error);
		}
	}

	// Simple method to process markdown-like formatting using DOM manipulation
	private appendFormattedContent(container: HTMLElement, text: string): void {
		// Split by code blocks first
		const parts = text.split(/```([^`]+)```/);

		for (let i = 0; i < parts.length; i++) {
			if (i % 2 === 1) {
				// This is a code block
				const pre = document.createElement('pre');
				pre.textContent = parts[i];
				container.appendChild(pre);
			} else if (parts[i]) {
				// Process the non-code block content

				// Split by line breaks
				const lines = parts[i].split('\n');

				for (let j = 0; j < lines.length; j++) {
					// Process line content (bold and inline code)
					const line = lines[j];
					const segments = this.processLineSegments(line);

					// Add the processed segments
					for (const segment of segments) {
						container.appendChild(segment);
					}

					// Add a line break if not the last line
					if (j < lines.length - 1) {
						container.appendChild(document.createElement('br'));
					}
				}
			}
		}
	}

	// Process line segments for bold and inline code
	private processLineSegments(line: string): Node[] {
		const segments: Node[] = [];

		// Split by inline code
		const codeParts = line.split(/`([^`]+)`/);

		for (let i = 0; i < codeParts.length; i++) {
			if (i % 2 === 1) {
				// This is inline code
				const code = document.createElement('code');
				code.textContent = codeParts[i];
				segments.push(code);
			} else if (codeParts[i]) {
				// Process bold text
				const boldParts = codeParts[i].split(/\*\*([^*]+)\*\*/);

				for (let j = 0; j < boldParts.length; j++) {
					if (j % 2 === 1) {
						// This is bold text
						const strong = document.createElement('strong');
						strong.textContent = boldParts[j];
						segments.push(strong);
					} else if (boldParts[j]) {
						// Regular text
						const text = document.createTextNode(boldParts[j]);
						segments.push(text);
					}
				}
			}
		}

		return segments;
	}

	// Method to update text content dynamically
	public updateText(text: string): void {
		if (!this.messagesContainerSelector) {
			return;
		}

		// Create a new message element
		const messageElement = document.createElement('div');
		messageElement.classList.add('my-panel-text', 'my-panel-text-user');

		// Create and append content securely using DOM manipulation
		this.appendFormattedContent(messageElement, text);

		// Append the message and scroll to bottom
		this.messagesContainerSelector.appendChild(messageElement);
		this.scrollToBottom();
	}
}

// Register the view container
const MY_PANEL_CONTAINER_ID = 'myPanel';
const MY_PANEL_CONTAINER = Registry.as<IViewContainersRegistry>(ViewContainerExtensions.ViewContainersRegistry).registerViewContainer({
	id: MY_PANEL_CONTAINER_ID,
	title: { value: localize('myPanel', "My Panel"), original: 'My Panel' },
	icon: Codicon.window,
	ctorDescriptor: new SyncDescriptor(ViewPaneContainer, [MY_PANEL_CONTAINER_ID, { mergeViewWithContainerWhenSingleView: true }]),
	storageId: MY_PANEL_CONTAINER_ID,
}, ViewContainerLocation.AuxiliaryBar);

// Register the view
Registry.as<IViewsRegistry>(ViewContainerExtensions.ViewsRegistry).registerViews([{
	id: 'myPanelView',
	name: { value: localize('myPanelView', "My Panel View"), original: 'My Panel View' },
	ctorDescriptor: new SyncDescriptor(MyPanelView),
	canToggleVisibility: true,
	canMoveView: true,
}], MY_PANEL_CONTAINER);

// Register a command to show the panel
registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.showMyPanel',
			title: { value: localize('showMyPanel', "Show My Panel"), original: 'Show My Panel' },
			category: Categories.View,
			f1: true
		});
	}

	run(accessor: ServicesAccessor): void {
		const viewsService = accessor.get(IViewsService);
		const viewDescriptorService = accessor.get(IViewDescriptorService);
		const viewDescriptor = viewDescriptorService.getViewDescriptorById('myPanelView');

		if (viewDescriptor) {
			// First ensure the view container is visible
			viewsService.openViewContainer(MY_PANEL_CONTAINER_ID, true);

			// Then focus the specific view
			viewsService.openView(viewDescriptor.id, true);
		}
	}
});

// Register your contribution
class MyPanelContribution implements IWorkbenchContribution {
	constructor(@IInstantiationService instantiationService: IInstantiationService) {
		// Initialize your panel
	}
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(
	MyPanelContribution,
	LifecyclePhase.Restored
);
