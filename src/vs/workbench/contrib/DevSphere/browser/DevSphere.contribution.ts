/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * @file DevSphere Contribution Module
 *
 * This module is the extension entry point that registers the DevSphere feature
 * in VS Code. It handles:
 *
 * 1. Service registration - Registers the DevSphere service using the VS Code
 *    dependency injection system
 *
 * 2. View container registration - Creates and registers the DevSphere view container
 *    that appears in the auxiliary sidebar
 *
 * 3. View registration - Registers the main DevSphere view within the container
 *
 * 4. Command registration - Registers all DevSphere-related commands and their handlers
 *
 * This is where the extension bootstraps all its components and makes them available
 * to the VS Code workbench.
 */

import { IViewsRegistry, ViewContainerLocation, IViewContainersRegistry, Extensions as ViewContainerExtensions } from '../../../common/views.js';
import { localize } from '../../../../nls.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkbenchContribution, IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from '../../../common/contributions.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ViewPaneContainer } from '../../../browser/parts/views/viewPaneContainer.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { DevSphereView } from './devSphereView.js';
// Import the refactored service implementation and interface
import { IDevSphereService } from './services/devSphereServiceInterface.js';
import { DevSphereService } from './services/devSphereServiceImpl.js';
import { DEV_SPHERE_CONTAINER_ID, registerDevSphereActions } from './devSphereActionCommands.js';

// Register the service using the proper instantiation mechanism
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';

// Import CSS
import './media/main.css';

/**
 * Register the DevSphere service as a singleton with delayed instantiation
 * to improve startup performance. The service will only be created when
 * it's first requested by a component.
 */
registerSingleton(IDevSphereService, DevSphereService, InstantiationType.Delayed);

/**
 * Register the DevSphere view container in the auxiliary sidebar.
 * This container will hold the main DevSphere view and defines its appearance
 * in the workbench.
 */
const DEV_SPHERE_CONTAINER = Registry.as<IViewContainersRegistry>(ViewContainerExtensions.ViewContainersRegistry).registerViewContainer({
	id: DEV_SPHERE_CONTAINER_ID,
	title: { value: localize('devSphere', "DevSphere"), original: 'DevSphere' },
	icon: Codicon.window,
	ctorDescriptor: new SyncDescriptor(ViewPaneContainer, [DEV_SPHERE_CONTAINER_ID, { mergeViewWithContainerWhenSingleView: true }]),
	storageId: DEV_SPHERE_CONTAINER_ID,
}, ViewContainerLocation.AuxiliaryBar);

/**
 * Register the main DevSphere view within the container.
 * This defines the view's properties and behavior within the container.
 */
Registry.as<IViewsRegistry>(ViewContainerExtensions.ViewsRegistry).registerViews([{
	id: DevSphereView.ID,
	name: { value: localize('devSphereView', "DevSphere"), original: 'DevSphere' },
	ctorDescriptor: new SyncDescriptor(DevSphereView),
	canToggleVisibility: true,
	canMoveView: true,
}], DEV_SPHERE_CONTAINER);

/**
 * DevSphere workbench contribution class that initializes the extension
 * when the workbench is ready (in the Restored lifecycle phase).
 *
 * This registers all DevSphere actions and commands that can be invoked
 * by users through the command palette, context menus, and keybindings.
 */
class DevSphereContribution implements IWorkbenchContribution {
	constructor(
		@IInstantiationService instantiationService: IInstantiationService
	) {
		// Register all DevSphere-related commands and actions
		registerDevSphereActions();
	}
}

/**
 * Register the DevSphere contribution to be initialized in the Restored lifecycle phase,
 * which occurs after the workbench UI is fully visible to the user.
 */
Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(
	DevSphereContribution,
	LifecyclePhase.Restored
);
