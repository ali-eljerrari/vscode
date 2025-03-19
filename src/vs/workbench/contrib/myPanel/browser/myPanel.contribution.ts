/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IViewsRegistry, ViewContainerLocation, IViewContainersRegistry, Extensions as ViewContainerExtensions, IViewDescriptorService } from '../../../common/views.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { localize } from '../../../../nls.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkbenchContribution, IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from '../../../common/contributions.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { registerAction2, Action2 } from '../../../../platform/actions/common/actions.js';
import { ServicesAccessor, IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ViewPaneContainer } from '../../../browser/parts/views/viewPaneContainer.js';
import { ViewPane, IViewPaneOptions } from '../../../browser/parts/views/viewPane.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';

// Import CSS
import './media/myPanel.css';

// Define your panel view class
class MyPanelView extends ViewPane {
	static readonly ID = 'myPanelView';
	private container: HTMLElement | undefined;

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
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);
	}

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);
		this.container = container;

		// Add CSS class to the container
		container.classList.add('my-panel-container');

		// Create and append text content
		const textElement = document.createElement('div');
		textElement.classList.add('my-panel-text');
		textElement.textContent = 'Hello from My Panel!';
		container.appendChild(textElement);

		// Optionally add more complex content
		this.createAdditionalContent(container);
	}

	private createAdditionalContent(container: HTMLElement): void {
		// Create a section with a title
		const section = document.createElement('div');
		section.classList.add('my-panel-section');

		const title = document.createElement('h3');
		title.textContent = 'Panel Information';
		section.appendChild(title);

		const info = document.createElement('p');
		info.textContent = 'This is a custom panel created for VSCode.';
		section.appendChild(info);

		container.appendChild(section);
	}

	// Method to update text content dynamically
	public updateText(text: string): void {
		if (!this.container) {
			return;
		}

		const textElement = this.container.querySelector('.my-panel-text');
		if (textElement) {
			textElement.textContent = text;
		}
	}
}

// Register the view container
const MY_PANEL_CONTAINER_ID = 'myPanel';
const MY_PANEL_CONTAINER = Registry.as<IViewContainersRegistry>(ViewContainerExtensions.ViewContainersRegistry).registerViewContainer({
	id: MY_PANEL_CONTAINER_ID,
	title: { value: localize('myPanel', "My Panel"), original: 'My Panel' },
	icon: Codicon.window,
	ctorDescriptor: new SyncDescriptor(ViewPaneContainer, [MY_PANEL_CONTAINER_ID, { mergeViewWithContainerWhenSingleView: true }]),
	storageId: MY_PANEL_CONTAINER_ID,
}, ViewContainerLocation.AuxiliaryBar);

// Register the view
Registry.as<IViewsRegistry>(ViewContainerExtensions.ViewsRegistry).registerViews([{
	id: 'myPanelView',
	name: { value: localize('myPanelView', "My Panel View"), original: 'My Panel View' },
	ctorDescriptor: new SyncDescriptor(MyPanelView),
	canToggleVisibility: true,
	canMoveView: true,
}], MY_PANEL_CONTAINER);

// Register a command to show the panel
registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.showMyPanel',
			title: { value: localize('showMyPanel', "Show My Panel"), original: 'Show My Panel' },
			category: Categories.View,
			f1: true
		});
	}

	run(accessor: ServicesAccessor): void {
		const viewsService = accessor.get(IViewsService);
		const viewDescriptorService = accessor.get(IViewDescriptorService);
		const viewDescriptor = viewDescriptorService.getViewDescriptorById('myPanelView');

		if (viewDescriptor) {
			// First ensure the view container is visible
			viewsService.openViewContainer(MY_PANEL_CONTAINER_ID, true);

			// Then focus the specific view
			viewsService.openView(viewDescriptor.id, true);
		}
	}
});

// Register your contribution
class MyPanelContribution implements IWorkbenchContribution {
	constructor(@IInstantiationService instantiationService: IInstantiationService) {
		// Initialize your panel
		console.log('MyPanelContribution', instantiationService);
	}
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(
	MyPanelContribution,
	LifecyclePhase.Restored
);
