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

// Constants
export const DEV_SPHERE_CONTAINER_ID = 'devSphere';

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
