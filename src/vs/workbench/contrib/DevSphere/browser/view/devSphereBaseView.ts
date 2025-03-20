/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IViewPaneOptions, ViewPane } from '../../../../browser/parts/views/viewPane.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IViewDescriptorService } from '../../../../common/views.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { IHoverService } from '../../../../../platform/hover/browser/hover.js';
import { IDevSphereService } from '../services/devSphereServiceInterface.js';
import { DevSphereViewModel } from '../devSphereViewModel.js';
import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { IQuickInputService } from '../../../../../platform/quickinput/common/quickInput.js';

// Import view components
import { DevSphereTabs } from './devSphereTabs.js';
import { DevSphereChatSelector } from './devSphereChatSelector.js';
import { DevSphereMessages } from './devSphereMessages.js';
import { DevSphereInput } from './devSphereInput.js';
import { DevSphereHeader } from './devSphereHeader.js';
import { DevSphereViewTabs, DevSphereViewType } from './devSphereViewTabs.js';
import { DevSphereHistory } from './devSphereHistory.js';
import { DevSphereAPIKeys } from './devSphereAPIKeys.js';

export class DevSphereView extends ViewPane {
	static readonly ID = 'devSphereView';

	private viewModel: DevSphereViewModel;
	private chatSelectorComponent: DevSphereChatSelector | undefined;
	private messagesComponent: DevSphereMessages | undefined;
	private tabsComponent: DevSphereTabs | undefined;
	private inputComponent: DevSphereInput | undefined;
	private headerComponent: DevSphereHeader | undefined;
	private viewTabsComponent: DevSphereViewTabs | undefined;
	private historyComponent: DevSphereHistory | undefined;
	private apiKeysComponent: DevSphereAPIKeys | undefined;
	private chatContentContainer: HTMLElement | undefined;

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
		@IDevSphereService private readonly devSphereService: IDevSphereService,
		@INotificationService private readonly notificationService: INotificationService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);

		// Create the view model
		this.viewModel = new DevSphereViewModel(this.devSphereService, this.notificationService);
		this._register(this.viewModel);

		// Register model event listeners
		this._register(this.viewModel.onMessagesChanged(() => {
			this.messagesComponent?.updateMessages();
		}));

		this._register(this.viewModel.onLoadingStateChanged((isLoading) => {
			this.messagesComponent?.updateLoadingState(isLoading);
			this.inputComponent?.updateLoadingState(isLoading);
		}));

		this._register(this.viewModel.onChatsChanged(() => {
			this.tabsComponent?.updateChatTabs();
			this.chatSelectorComponent?.updateChatSelectorList();
			this.historyComponent?.updateHistoryList();
			this.updateChatCount();
		}));

		this._register(this.viewModel.onCurrentChatChanged(() => {
			this.tabsComponent?.updateChatTabs();
			this.chatSelectorComponent?.updateChatSelectorList();
			this.historyComponent?.updateHistoryList();
		}));
	}

	protected override renderBody(container: HTMLElement): void {
		container.classList.add('dev-sphere-container');

		// Add view tabs at the top
		this.viewTabsComponent = new DevSphereViewTabs(
			container,
			(view) => this.onViewTabChanged(view)
		);

		// Create the main content area
		const mainContent = document.createElement('div');
		mainContent.classList.add('dev-sphere-main-content');
		container.appendChild(mainContent);

		// Add event listener for focus-input custom event
		container.addEventListener('focus-input', () => {
			this.focusInput();

			// Also refresh the history to ensure it shows the latest chats
			// This is important when a new chat is created
			this.refreshHistoryView();
		});

		// Add header
		this.headerComponent = new DevSphereHeader(
			mainContent,
			this.devSphereService,
			this.viewModel,
		);

		// Create chat content container (will be shown/hidden based on active tab)
		this.chatContentContainer = document.createElement('div');
		this.chatContentContainer.classList.add('dev-sphere-chat-content');
		mainContent.appendChild(this.chatContentContainer);

		// Initialize chat tabs component (this displays individual chat tabs)
		this.tabsComponent = new DevSphereTabs(
			this.chatContentContainer,
			this.viewModel,
			this.quickInputService,
			() => this.focusInput()
		);

		// Create messages component
		this.messagesComponent = new DevSphereMessages(
			this.chatContentContainer,
			this.viewModel
		);

		// Create input component
		this.inputComponent = new DevSphereInput(
			this.chatContentContainer,
			this.viewModel
		);

		// Create history component (initially hidden)
		this.historyComponent = new DevSphereHistory(
			mainContent,
			this.viewModel,
			this.quickInputService,
			() => {
				// Switch to chat view when a chat is selected from history
				this.viewTabsComponent?.switchView(DevSphereViewType.Chat);
				this.focusInput();
			}
		);
		this.historyComponent.setVisible(false);

		// Create API Keys component (initially hidden)
		this.apiKeysComponent = new DevSphereAPIKeys(
			mainContent,
			this.devSphereService,
			this.quickInputService
		);
		this.apiKeysComponent.setVisible(false);

		// Create chat selector dialog
		this.chatSelectorComponent = new DevSphereChatSelector(
			container,
			this.viewModel,
			this.quickInputService,
			() => this.focusInput()
		);
	}

	/**
	 * Handle view tab change
	 */
	private onViewTabChanged(view: DevSphereViewType): void {
		console.log('DevSphere BaseView: View tab changed to', view);

		// Hide all views first
		if (this.chatContentContainer) {
			this.chatContentContainer.style.display = 'none';
			console.log('DevSphere BaseView: Hidden chat content container');
		}

		this.historyComponent?.setVisible(false);
		console.log('DevSphere BaseView: Hidden history component');

		this.apiKeysComponent?.setVisible(false);
		console.log('DevSphere BaseView: Hidden API keys component');

		// Hide/show header based on view type
		if (this.headerComponent) {
			this.headerComponent.setVisible(view === DevSphereViewType.Chat);
			console.log(`DevSphere BaseView: ${view === DevSphereViewType.Chat ? 'Showing' : 'Hiding'} header`);
		}

		// Show the selected view
		if (view === DevSphereViewType.Chat) {
			console.log('DevSphere BaseView: Showing Chat view');
			if (this.chatContentContainer) {
				this.chatContentContainer.style.display = 'flex';
				console.log('DevSphere BaseView: Displayed chat content container');
			}
			// Focus the input
			setTimeout(() => this.focusInput(), 50);
		} else if (view === DevSphereViewType.History) {
			console.log('DevSphere BaseView: Showing History view');
			this.historyComponent?.setVisible(true);
			// Ensure history is refreshed when switching to the history tab
			this.refreshHistoryView();
		} else if (view === DevSphereViewType.APIKeys) {
			console.log('DevSphere BaseView: Showing API Keys view');
			this.apiKeysComponent?.setVisible(true);
		} else {
			console.error('DevSphere BaseView: Unknown view type', view);
		}
	}

	/**
	 * Refresh the history view to ensure it shows the latest chats
	 */
	private refreshHistoryView(): void {
		// Refresh the history list
		this.historyComponent?.updateHistoryList();
	}

	// Method to focus the input
	private focusInput(): void {
		this.inputComponent?.focus();
	}

	// Override the setVisible method to focus the input when the view becomes visible
	override setVisible(visible: boolean): void {
		super.setVisible(visible);
		if (visible) {
			// Get current view
			const currentView = this.viewTabsComponent?.getCurrentView();

			// Set header visibility based on current view
			if (this.headerComponent) {
				this.headerComponent.setVisible(currentView === DevSphereViewType.Chat);
			}

			// Focus the input when the view becomes visible (if in chat view)
			if (currentView === DevSphereViewType.Chat) {
				setTimeout(() => this.focusInput(), 100);
			} else if (currentView === DevSphereViewType.APIKeys) {
				// Ensure the API Keys component refreshes when becoming visible
				this.apiKeysComponent?.setVisible(true);
			}
		}
	}

	// Method to explicitly set or update the API key
	public async updateAPIKey(): Promise<void> {
		await this.devSphereService.updateAPIKey();
	}

	// Method to clear all messages
	public clearChat(): void {
		this.viewModel.clearMessages();
	}

	/**
	 * Adds a system message indicating the model has been changed
	 */
	public addModelChangeMessage(modelId: string): void {
		// Get model info using the service's helper method
		const modelInfo = this.devSphereService.getModelInfoById(modelId);
		if (modelInfo) {
			const { info, provider } = modelInfo;
			const providerName = this.devSphereService.getProviderNameFromType(provider);
			this.viewModel.addSystemMessage(`Model changed to **${info.name}** (${providerName})`);
		}
	}

	/**
	 * Updates the chat count in the header
	 */
	private updateChatCount(): void {
		this.headerComponent?.updateChatCount();
	}
}

