/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * @file DevSphere Action Commands
 *
 * This module defines and registers all the actions and commands available
 * in the DevSphere extension. These include:
 *
 * 1. Global commands - Commands available from the command palette
 * 2. View commands - Commands related to showing and manipulating the DevSphere view
 * 3. Model commands - Commands for selecting and changing AI models
 * 4. Chat commands - Commands for managing chat conversations
 *
 * All commands use VS Code's Action2 system for registration and follow
 * the command pattern for consistent behavior and discoverability.
 */

import { registerAction2, Action2 } from '../../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { localize } from '../../../../nls.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { DevSphereView } from './devSphereView.js';
import { DevSphereViewType } from './view/devSphereViewTabs.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';

/**
 * Unique identifier for the DevSphere view container.
 * Used throughout the extension to reference the container.
 */
export const DEV_SPHERE_CONTAINER_ID = 'devSphere';

/**
 * Registers all DevSphere-related commands and actions.
 * This function is called during extension activation to make all
 * DevSphere commands available to the user.
 */
export function registerDevSphereActions(): void {
	// Register a command to show the panel
	registerAction2(class extends Action2 {
		/**
		 * Constructs the "Show DevSphere" command.
		 * This command is available in the command palette and opens the DevSphere view.
		 */
		constructor() {
			super({
				id: 'workbench.action.showDevSphere',
				title: { value: localize('showDevSphere', "Show DevSphere"), original: 'Show DevSphere' },
				category: Categories.View,
				f1: true,
				keybinding: {
					primary: 2049, // Ctrl/Cmd+0
					weight: 200,
					when: ContextKeyExpr.equals('viewId', 'devSphereView')
				}
			});
		}

		/**
		 * Shows the DevSphere view.
		 * This is executed when the user runs the "Show DevSphere" command.
		 *
		 * @param accessor - Service accessor for dependency injection
		 */
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

	// Register a command to close the DevSphere view
	registerAction2(class extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.closeDevSphere',
				title: { value: localize('closeDevSphere', "Close DevSphere"), original: 'Close DevSphere' },
				category: Categories.View,
				f1: true,
				keybinding: {
					primary: 2053, // Ctrl/Cmd+4
					weight: 200,
					when: ContextKeyExpr.equals('viewId', 'devSphereView')
				}
			});
		}

		run(accessor: ServicesAccessor): void {
			const viewsService = accessor.get(IViewsService);
			viewsService.closeView('devSphereView');
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

	// Register a command to switch to API Keys tab
	registerAction2(class extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.devSphere.showAPIKeysTab',
				title: { value: localize('showDevSphereAPIKeysTab', "DevSphere: Show API Keys Tab"), original: 'DevSphere: Show API Keys Tab' },
				category: Categories.View,
				f1: true,
				keybinding: {
					primary: 2052, // Ctrl/Cmd+3
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
				// Get access to the underlying viewTabs component and switch to API Keys tab
				(view as any).viewTabsComponent?.switchView(DevSphereViewType.APIKeys);
			}
		}
	});
}
