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
import { IDevSphereService } from '../devSphereService.js';
import { DevSphereViewModel } from '../devSphereViewModel.js';
import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { IQuickInputService } from '../../../../../platform/quickinput/common/quickInput.js';

// Import view components
import { DevSphereTabs } from './devSphereTabs.js';
import { DevSphereChatSelector } from './devSphereChatSelector.js';
import { DevSphereMessages } from './devSphereMessages.js';
import { DevSphereInput } from './devSphereInput.js';
import { DevSphereHeader } from './devSphereHeader.js';

export class DevSphereView extends ViewPane {
	static readonly ID = 'devSphereView';

	private container: HTMLElement | undefined;
	private viewModel: DevSphereViewModel;
	private chatSelectorComponent: DevSphereChatSelector | undefined;
	private messagesComponent: DevSphereMessages | undefined;
	private tabsComponent: DevSphereTabs | undefined;
	private inputComponent: DevSphereInput | undefined;
	private headerComponent: DevSphereHeader | undefined;

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
		}));

		this._register(this.viewModel.onCurrentChatChanged(() => {
			this.tabsComponent?.updateChatTabs();
			this.chatSelectorComponent?.updateChatSelectorList();
		}));
	}

	protected override renderBody(container: HTMLElement): void {
		this.container = container;
		container.classList.add('dev-sphere-container');

		// Create the tabs container
		this.tabsComponent = new DevSphereTabs(
			container,
			this.viewModel,
			this.quickInputService,
			() => this.focusInput()
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
			() => this.chatSelectorComponent?.showChatSelector()
		);

		// Create messages component
		this.messagesComponent = new DevSphereMessages(
			mainContent,
			this.viewModel
		);

		// Create input component
		this.inputComponent = new DevSphereInput(
			mainContent,
			this.viewModel
		);

		// Create chat selector dialog
		this.chatSelectorComponent = new DevSphereChatSelector(
			container,
			this.viewModel,
			this.quickInputService,
			() => this.focusInput()
		);

		// Add keyboard shortcuts
		this.addKeyboardShortcuts();

		// Initialize view
		this.messagesComponent.updateMessages();
		this.tabsComponent.updateChatTabs();
	}

	/**
	 * Add keyboard shortcuts for common actions
	 */
	private addKeyboardShortcuts(): void {
		// Listen for keyboard shortcuts on the container
		this.container?.addEventListener('keydown', (e) => {
			// Ctrl/Cmd+N for new chat
			if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
				e.preventDefault();
				this.viewModel.createNewChat();
			}

			// Ctrl/Cmd+O to open chat selector
			if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
				e.preventDefault();
				this.chatSelectorComponent?.showChatSelector();
			}

			// Escape to close dialogs
			if (e.key === 'Escape') {
				this.chatSelectorComponent?.hideChatSelector();
			}
		});
	}

	// Method to focus the input
	private focusInput(): void {
		this.inputComponent?.focus();
	}

	// Override the setVisible method to focus the input when the view becomes visible
	override setVisible(visible: boolean): void {
		super.setVisible(visible);
		if (visible) {
			// Focus the input when the view becomes visible
			setTimeout(() => this.focusInput(), 100);
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
		const model = this.devSphereService.getAvailableModels().find(m => m.id === modelId);
		if (model) {
			this.viewModel.addSystemMessage(`Model changed to **${model.name}** (${model.description})`);
		}
	}
}
