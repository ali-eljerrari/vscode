/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../../base/common/lifecycle.js';

export enum DevSphereViewType {
	Chat = 'chat',
	History = 'history'
}

export class DevSphereViewTabs extends Disposable {
	private tabsContainer: HTMLDivElement;
	private chatTab: HTMLDivElement;
	private historyTab: HTMLDivElement;
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
	}

	/**
	 * Switches the active view tab
	 */
	public switchView(view: DevSphereViewType): void {
		if (this.currentView === view) {
			return; // Already on this view
		}

		// Update active tab
		if (view === DevSphereViewType.Chat) {
			this.chatTab.classList.add('dev-sphere-view-tab-active');
			this.historyTab.classList.remove('dev-sphere-view-tab-active');
		} else {
			this.historyTab.classList.add('dev-sphere-view-tab-active');
			this.chatTab.classList.remove('dev-sphere-view-tab-active');
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
