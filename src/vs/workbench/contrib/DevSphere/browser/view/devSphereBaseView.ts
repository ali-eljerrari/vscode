/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * @file DevSphere Base View
 *
 * This is the main view component for the DevSphere extension. It serves as the
 * central UI container that orchestrates all the sub-components and manages
 * the overall DevSphere user interface.
 *
 * The view extends VS Code's ViewPane class and implements:
 *
 * 1. The main container UI for all DevSphere components
 * 2. View tab switching between Chat, History, and API Keys views
 * 3. Management of all sub-components (messages, input, history, etc.)
 * 4. Event handling and coordination between components
 *
 * This component is instantiated by the VS Code workbench as part of the
 * view registration in DevSphere.contribution.ts.
 */

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

/**
 * Main view component for the DevSphere extension.
 * This class extends the VS Code ViewPane class and serves as the container
 * for all DevSphere UI components.
 */
export class DevSphereView extends ViewPane {
	/** Unique identifier for the DevSphere view */
	static readonly ID = 'devSphereView';

	/**
	 * View model that manages the state and data for the DevSphere UI
	 * and provides methods for interacting with the AI models
	 */
	private viewModel: DevSphereViewModel;

	/** Component for selecting and managing chat conversations */
	private chatSelectorComponent: DevSphereChatSelector | undefined;

	/** Component for displaying chat messages */
	private messagesComponent: DevSphereMessages | undefined;

	/** Component for managing chat tabs */
	private tabsComponent: DevSphereTabs | undefined;

	/** Component for user input and sending messages */
	private inputComponent: DevSphereInput | undefined;

	/** Component for the header area with controls */
	private headerComponent: DevSphereHeader | undefined;

	/** Component for switching between different views */
	private viewTabsComponent: DevSphereViewTabs | undefined;

	/** Component for displaying chat history */
	private historyComponent: DevSphereHistory | undefined;

	/** Component for managing API keys */
	private apiKeysComponent: DevSphereAPIKeys | undefined;

	/** Container for chat-related UI components */
	private chatContentContainer: HTMLElement | undefined;

	/**
	 * Creates a new instance of the DevSphere view.
	 *
	 * @param options - View pane options from VS Code
	 * @param keybindingService - Service for handling keyboard shortcuts
	 * @param contextMenuService - Service for context menus
	 * @param configurationService - Service for accessing configuration
	 * @param contextKeyService - Service for context keys
	 * @param viewDescriptorService - Service for view descriptors
	 * @param instantiationService - Service for instantiating components
	 * @param openerService - Service for opening links
	 * @param themeService - Service for theming
	 * @param hoverService - Service for hover tooltips
	 * @param devSphereService - Service for DevSphere functionality
	 * @param notificationService - Service for showing notifications
	 * @param quickInputService - Service for quick input dialogs
	 */
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

	/**
	 * Renders the main view body.
	 * This is called by VS Code when the view is being created and displayed.
	 *
	 * @param container - The DOM element to render the view into
	 */
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
	 * Handles tab changes in the view.
	 * Shows/hides the appropriate components based on the selected view.
	 *
	 * @param view - The view type that was selected
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
		} else if (view === DevSphereViewType.APIKeys) {
			console.log('DevSphere BaseView: Showing API Keys view');
			this.apiKeysComponent?.setVisible(true);
		} else {
			console.error('DevSphere BaseView: Unknown view type', view);
		}
	}

	/**
	 * Focuses the input component.
	 * Used to automatically focus the chat input field when appropriate.
	 */
	private focusInput(): void {
		this.inputComponent?.focus();
	}

	/**
	 * Overrides the setVisible method to handle visibility changes.
	 * Manages component visibility and focus when the view becomes visible.
	 *
	 * @param visible - Whether the view is visible
	 */
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

	/**
	 * Updates the API key.
	 * Public method that can be called from commands to trigger the API key update dialog.
	 */
	public async updateAPIKey(): Promise<void> {
		await this.devSphereService.updateAPIKey();
	}

	/**
	 * Clears all messages in the current chat.
	 * Public method that can be called from commands.
	 */
	public clearChat(): void {
		this.viewModel.clearMessages();
	}

	/**
	 * Adds a system message indicating the model has been changed.
	 * Displays information about the newly selected model.
	 *
	 * @param modelId - The ID of the new model
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
	 * Updates the chat count displayed in the header.
	 * Called when the number of chats changes.
	 */
	private updateChatCount(): void {
		this.headerComponent?.updateChatCount();
	}
}

