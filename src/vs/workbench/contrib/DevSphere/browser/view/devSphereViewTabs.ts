/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * @file DevSphere View Tabs Module
 *
 * This module defines the UI component for switching between different views
 * within the DevSphere panel. It contains:
 *
 * 1. The DevSphereViewType enum - Defines the available view types that can
 *    be displayed in the DevSphere panel
 *
 * 2. The DevSphereViewTabs class - A UI component that renders tabs for
 *    switching between different views and handles the view switching logic
 *
 * This component is used by the main DevSphereView to allow users to switch
 * between chat, history, and API key management views.
 */

import { Disposable } from '../../../../../base/common/lifecycle.js';

/**
 * Enumeration of the different view types available in the DevSphere panel.
 * Used to control which view is currently active and to switch between views.
 */
export enum DevSphereViewType {
	/** The main chat interface where users interact with AI models */
	Chat = 'chat',

	/** History view showing past conversations */
	History = 'history',

	/** API key management view for configuring AI provider credentials */
	APIKeys = 'apikeys',
}

/**
 * Component that renders a set of tabs for switching between different DevSphere views.
 * This is displayed at the top of the DevSphere panel and allows users to navigate
 * between the chat interface, conversation history, and API key management.
 */
export class DevSphereViewTabs extends Disposable {
	private tabsContainer: HTMLDivElement;
	private chatTab: HTMLDivElement;
	private historyTab: HTMLDivElement;
	private apiKeysTab: HTMLDivElement;
	private currentView: DevSphereViewType = DevSphereViewType.Chat;

	/**
	 * Creates a new instance of the DevSphereViewTabs component.
	 *
	 * @param container - The parent DOM element to append the tabs to
	 * @param onViewChange - Callback function that is invoked when the user switches views
	 */
	constructor(
		container: HTMLElement,
		private readonly onViewChange: (view: DevSphereViewType) => void
	) {
		super();

		// Create the view tabs container
		this.tabsContainer = document.createElement('div');
		this.tabsContainer.classList.add('dev-sphere-view-tabs');
		container.appendChild(this.tabsContainer);

		// Create the Chat tab
		this.chatTab = document.createElement('div');
		this.chatTab.classList.add('dev-sphere-view-tab');
		this.chatTab.classList.add('dev-sphere-view-tab-active'); // Active by default
		this.chatTab.textContent = 'Chat';
		this.chatTab.addEventListener('click', () => {
			this.switchView(DevSphereViewType.Chat);
		});
		this.tabsContainer.appendChild(this.chatTab);

		// Create the History tab
		this.historyTab = document.createElement('div');
		this.historyTab.classList.add('dev-sphere-view-tab');
		this.historyTab.textContent = 'History';
		this.historyTab.addEventListener('click', () => {
			this.switchView(DevSphereViewType.History);
		});
		this.tabsContainer.appendChild(this.historyTab);

		// Create the API Keys tab
		this.apiKeysTab = document.createElement('div');
		this.apiKeysTab.classList.add('dev-sphere-view-tab');
		this.apiKeysTab.textContent = 'API Keys';
		this.apiKeysTab.addEventListener('click', () => {
			this.switchView(DevSphereViewType.APIKeys);
		});
		this.tabsContainer.appendChild(this.apiKeysTab);
	}

	/**
	 * Switches the active view to the specified view type.
	 * Updates the UI to show the selected tab as active and invokes the onViewChange callback.
	 *
	 * @param viewType - The view type to switch to
	 */
	public switchView(viewType: DevSphereViewType): void {

		if (this.currentView === viewType) {
			return; // Already on this view
		}

		// Update the current view
		this.currentView = viewType;

		// Update tab classes
		this.chatTab.classList.remove('dev-sphere-view-tab-active');
		this.historyTab.classList.remove('dev-sphere-view-tab-active');
		this.apiKeysTab.classList.remove('dev-sphere-view-tab-active');

		// Add active class to the selected tab
		switch (viewType) {
			case DevSphereViewType.Chat:
				this.chatTab.classList.add('dev-sphere-view-tab-active');
				break;
			case DevSphereViewType.History:
				this.historyTab.classList.add('dev-sphere-view-tab-active');
				break;
			case DevSphereViewType.APIKeys:
				this.apiKeysTab.classList.add('dev-sphere-view-tab-active');
				break;
		}

		// Call the onViewChange callback
		this.onViewChange(viewType);
	}

	/**
	 * Returns the currently active view type.
	 *
	 * @returns The currently active DevSphereViewType
	 */
	public getCurrentView(): DevSphereViewType {
		return this.currentView;
	}
}
