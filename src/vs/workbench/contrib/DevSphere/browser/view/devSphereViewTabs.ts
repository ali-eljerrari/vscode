/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../../base/common/lifecycle.js';

export enum DevSphereViewType {
	Chat = 'chat',
	History = 'history',
	APIKeys = 'apikeys',
}

export class DevSphereViewTabs extends Disposable {
	private tabsContainer: HTMLDivElement;
	private chatTab: HTMLDivElement;
	private historyTab: HTMLDivElement;
	private apiKeysTab: HTMLDivElement;
	private currentView: DevSphereViewType = DevSphereViewType.Chat;

	constructor(
		container: HTMLElement,
		private readonly onViewChange: (view: DevSphereViewType) => void
	) {
		super();

		// Create the view tabs container
		this.tabsContainer = document.createElement('div');
		this.tabsContainer.classList.add('dev-sphere-view-tabs');
		container.appendChild(this.tabsContainer);

		console.log('DevSphere: Creating view tabs container', this.tabsContainer);

		// Create the Chat tab
		this.chatTab = document.createElement('div');
		this.chatTab.classList.add('dev-sphere-view-tab');
		this.chatTab.classList.add('dev-sphere-view-tab-active'); // Active by default
		this.chatTab.textContent = 'Chat';
		this.chatTab.addEventListener('click', () => {
			this.switchView(DevSphereViewType.Chat);
		});
		this.tabsContainer.appendChild(this.chatTab);
		console.log('DevSphere: Created Chat tab', this.chatTab);

		// Create the History tab
		this.historyTab = document.createElement('div');
		this.historyTab.classList.add('dev-sphere-view-tab');
		this.historyTab.textContent = 'History';
		this.historyTab.addEventListener('click', () => {
			this.switchView(DevSphereViewType.History);
		});
		this.tabsContainer.appendChild(this.historyTab);
		console.log('DevSphere: Created History tab', this.historyTab);

		// Create the API Keys tab
		this.apiKeysTab = document.createElement('div');
		this.apiKeysTab.classList.add('dev-sphere-view-tab');
		this.apiKeysTab.textContent = 'API Keys';
		this.apiKeysTab.addEventListener('click', () => {
			this.switchView(DevSphereViewType.APIKeys);
		});
		this.tabsContainer.appendChild(this.apiKeysTab);
		console.log('DevSphere: Created API Keys tab', this.apiKeysTab);

		// Log the number of tabs (should be 3)
		console.log('DevSphere: Number of tabs created:', this.tabsContainer.children.length);
	}

	/**
	 * Switches the active view tab
	 */
	public switchView(view: DevSphereViewType): void {
		console.log('DevSphere: Switching to tab', view);

		if (this.currentView === view) {
			console.log('DevSphere: Already on tab', view);
			return; // Already on this view
		}

		// Update active tab
		this.chatTab.classList.remove('dev-sphere-view-tab-active');
		this.historyTab.classList.remove('dev-sphere-view-tab-active');
		this.apiKeysTab.classList.remove('dev-sphere-view-tab-active');

		if (view === DevSphereViewType.Chat) {
			this.chatTab.classList.add('dev-sphere-view-tab-active');
			console.log('DevSphere: Activated Chat tab');
		} else if (view === DevSphereViewType.History) {
			this.historyTab.classList.add('dev-sphere-view-tab-active');
			console.log('DevSphere: Activated History tab');
		} else if (view === DevSphereViewType.APIKeys) {
			this.apiKeysTab.classList.add('dev-sphere-view-tab-active');
			console.log('DevSphere: Activated API Keys tab');
		}

		this.currentView = view;
		this.onViewChange(view);
	}

	/**
	 * Returns the current active view
	 */
	public getCurrentView(): DevSphereViewType {
		return this.currentView;
	}
}
