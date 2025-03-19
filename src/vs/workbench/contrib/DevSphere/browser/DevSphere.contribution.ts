/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

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
import { DevSphereService, IDevSphereService } from './devSphereService.js';
import { DEV_SPHERE_CONTAINER_ID, registerDevSphereActions } from './devSphereActionCommands.js';

// Register the service using the proper instantiation mechanism
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';

// Import CSS
import './media/main.css';


registerSingleton(IDevSphereService, DevSphereService, InstantiationType.Delayed);

// Register the view container
const DEV_SPHERE_CONTAINER = Registry.as<IViewContainersRegistry>(ViewContainerExtensions.ViewContainersRegistry).registerViewContainer({
	id: DEV_SPHERE_CONTAINER_ID,
	title: { value: localize('devSphere', "DevSphere"), original: 'DevSphere' },
	icon: Codicon.window,
	ctorDescriptor: new SyncDescriptor(ViewPaneContainer, [DEV_SPHERE_CONTAINER_ID, { mergeViewWithContainerWhenSingleView: true }]),
	storageId: DEV_SPHERE_CONTAINER_ID,
}, ViewContainerLocation.AuxiliaryBar);

// Register the view
Registry.as<IViewsRegistry>(ViewContainerExtensions.ViewsRegistry).registerViews([{
	id: DevSphereView.ID,
	name: { value: localize('devSphereView', "DevSphere"), original: 'DevSphere' },
	ctorDescriptor: new SyncDescriptor(DevSphereView),
	canToggleVisibility: true,
	canMoveView: true,
}], DEV_SPHERE_CONTAINER);

// Register DevSphere contribution
class DevSphereContribution implements IWorkbenchContribution {
	constructor(
		@IInstantiationService instantiationService: IInstantiationService
	) {
		// Register all DevSphere-related commands and actions
		registerDevSphereActions();
	}
}

// Register the contribution
Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(
	DevSphereContribution,
	LifecyclePhase.Restored
);
