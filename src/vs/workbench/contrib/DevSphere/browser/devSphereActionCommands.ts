/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerAction2, Action2 } from '../../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { localize } from '../../../../nls.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { DevSphereView } from './devSphereView.js';
import { IDevSphereService } from './devSphereService.js';
import { IQuickInputService, IQuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';
import { DevSphereViewType } from './view/devSphereViewTabs.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';

// Constants
export const DEV_SPHERE_CONTAINER_ID = 'devSphere';

// Define an extended QuickPickItem interface that includes the model ID
interface ModelQuickPickItem extends IQuickPickItem {
	id: string;
}

/**
 * Registers all DevSphere-related commands and actions
 */
export function registerDevSphereActions(): void {
	// Register a command to show the panel
	registerAction2(class extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.showDevSphere',
				title: { value: localize('showDevSphere', "Show DevSphere"), original: 'Show DevSphere' },
				category: Categories.View,
				f1: true
			});
		}

		run(accessor: ServicesAccessor): void {
			const viewsService = accessor.get(IViewsService);
			const viewDescriptorService = accessor.get(IViewDescriptorService);
			const viewDescriptor = viewDescriptorService.getViewDescriptorById('devSphereView');

			if (viewDescriptor) {
				// First ensure the view container is visible
				viewsService.openViewContainer(DEV_SPHERE_CONTAINER_ID, true);

				// Then focus the specific view
				viewsService.openView(viewDescriptor.id, true);
			}
		}
	});

	// Register a command to switch to Chat tab
	registerAction2(class extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.devSphere.showChatTab',
				title: { value: localize('showDevSphereChatTab', "DevSphere: Show Chat Tab"), original: 'DevSphere: Show Chat Tab' },
				category: Categories.View,
				f1: true,
				keybinding: {
					primary: 2050, // Ctrl/Cmd+1
					weight: 200,
					when: ContextKeyExpr.equals('viewId', 'devSphereView')
				}
			});
		}

		run(accessor: ServicesAccessor): void {
			const viewsService = accessor.get(IViewsService);
			// Find the active DevSphere view
			const view = viewsService.getActiveViewWithId('devSphereView') as DevSphereView | undefined;
			if (view) {
				// Get access to the underlying viewTabs component and switch to Chat tab
				(view as any).viewTabsComponent?.switchView(DevSphereViewType.Chat);
			}
		}
	});

	// Register a command to switch to History tab
	registerAction2(class extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.devSphere.showHistoryTab',
				title: { value: localize('showDevSphereHistoryTab', "DevSphere: Show History Tab"), original: 'DevSphere: Show History Tab' },
				category: Categories.View,
				f1: true,
				keybinding: {
					primary: 2051, // Ctrl/Cmd+2
					weight: 200,
					when: ContextKeyExpr.equals('viewId', 'devSphereView')
				}
			});
		}

		run(accessor: ServicesAccessor): void {
			const viewsService = accessor.get(IViewsService);
			// Find the active DevSphere view
			const view = viewsService.getActiveViewWithId('devSphereView') as DevSphereView | undefined;
			if (view) {
				// Get access to the underlying viewTabs component and switch to History tab
				(view as any).viewTabsComponent?.switchView(DevSphereViewType.History);
			}
		}
	});

	// Register a command to change the model
	registerAction2(class extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.changeDevSphereModel',
				title: { value: localize('changeDevSphereModel', "Change DevSphere AI Model"), original: 'Change DevSphere AI Model' },
				category: Categories.View,
				f1: true
			});
		}

		async run(accessor: ServicesAccessor): Promise<void> {
			const devSphereService = accessor.get(IDevSphereService);
			const quickInputService = accessor.get(IQuickInputService);
			const viewsService = accessor.get(IViewsService);

			const availableModels = devSphereService.getAvailableModels();
			const currentModel = devSphereService.getCurrentModel();

			// Create quick pick items from models with explicit id property
			const items: ModelQuickPickItem[] = availableModels.map(model => ({
				label: model.name,
				description: model.description,
				detail: model.id === currentModel.id ? 'Currently Selected' : undefined,
				id: model.id
			}));

			// Show quick pick UI
			const selection = await quickInputService.pick<ModelQuickPickItem>(items, {
				placeHolder: 'Select OpenAI Model',
				title: 'Change AI Model',
				activeItem: items.find(item => item.id === currentModel.id)
			});

			if (selection && selection.id) {
				// Set the model
				devSphereService.setCurrentModel(selection.id);

				// Notify in the view
				const view = viewsService.getActiveViewWithId('devSphereView') as DevSphereView | undefined;
				if (view) {
					view.addModelChangeMessage(selection.id);
				}
			}
		}
	});

	// Register a command to update the API key
	registerAction2(class extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.updateOpenAIAPIKey',
				title: { value: localize('updateOpenAIAPIKey', "Update OpenAI API Key"), original: 'Update OpenAI API Key' },
				category: Categories.View,
				f1: true
			});
		}

		async run(accessor: ServicesAccessor): Promise<void> {
			const viewsService = accessor.get(IViewsService);
			const devSphereService = accessor.get(IDevSphereService);
			const view = viewsService.getActiveViewWithId('devSphereView') as DevSphereView | undefined;

			if (view) {
				await view.updateAPIKey();
			} else {
				// If view is not active, use the service directly
				await devSphereService.updateAPIKey();
			}
		}
	});

	// Register a command to clear chat
	registerAction2(class extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.clearDevSphereChat',
				title: { value: localize('clearDevSphereChat', "Clear DevSphere Chat"), original: 'Clear DevSphere Chat' },
				category: Categories.View,
				f1: true
			});
		}

		run(accessor: ServicesAccessor): void {
			const viewsService = accessor.get(IViewsService);
			const view = viewsService.getActiveViewWithId('devSphereView') as DevSphereView | undefined;

			if (view) {
				view.clearChat();
			}
		}
	});
}
