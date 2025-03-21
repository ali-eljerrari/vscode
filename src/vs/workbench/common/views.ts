/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * This module provides the core view management functionality for VS Code's workbench.
 * It defines interfaces and implementations for:
 *
 * 1. View Containers - Logical containers that can hold multiple views (e.g. sidebar, panel, auxiliary bar, etc.)
 * 2. Views - Individual view components that can be added to containers
 * 3. View Registry - Manages registration and lifecycle of views and containers
 * 4. Tree Views - Specialized view type for hierarchical data display
 *
 * Key concepts:
 * - ViewContainers are the top-level containers (sidebar, panel, auxiliary bar, etc.)
 * - Views are the actual content components that can be added to containers
 * - The registry system allows for dynamic registration and management of views
 * - Tree views provide specialized functionality for displaying hierarchical data
 *
 * This module is central to VS Code's view management system and is used by
 * both core workbench features and extensions to create and manage views.
 */

import { Command } from '../../editor/common/languages.js';
import { UriComponents, URI } from '../../base/common/uri.js';
import { Event, Emitter } from '../../base/common/event.js';
import { ContextKeyExpression } from '../../platform/contextkey/common/contextkey.js';
import { localize } from '../../nls.js';
import { createDecorator } from '../../platform/instantiation/common/instantiation.js';
import { IDisposable, Disposable, toDisposable } from '../../base/common/lifecycle.js';
import { ThemeIcon } from '../../base/common/themables.js';
import { getOrSet, SetMap } from '../../base/common/map.js';
import { Registry } from '../../platform/registry/common/platform.js';
import { IKeybindings } from '../../platform/keybinding/common/keybindingsRegistry.js';
import { ExtensionIdentifier } from '../../platform/extensions/common/extensions.js';
import { SyncDescriptor } from '../../platform/instantiation/common/descriptors.js';
import { IProgressIndicator } from '../../platform/progress/common/progress.js';
import Severity from '../../base/common/severity.js';
import { IAccessibilityInformation } from '../../platform/accessibility/common/accessibility.js';
import { IMarkdownString, MarkdownString } from '../../base/common/htmlContent.js';
import { mixin } from '../../base/common/objects.js';
import { Codicon } from '../../base/common/codicons.js';
import { registerIcon } from '../../platform/theme/common/iconRegistry.js';
import { CancellationToken } from '../../base/common/cancellation.js';
import { VSDataTransfer } from '../../base/common/dataTransfer.js';
import { ILocalizedString } from '../../platform/action/common/action.js';

/** Logging identifiers for views */
export const VIEWS_LOG_ID = 'views';
export const VIEWS_LOG_NAME = localize('views log', "Views");
export const defaultViewIcon = registerIcon('default-view-icon', Codicon.window, localize('defaultViewIcon', 'Default view icon.'));

/** Registry extensions for views */
export namespace Extensions {
	export const ViewContainersRegistry = 'workbench.registry.view.containers';
	export const ViewsRegistry = 'workbench.registry.view';
}

/** Possible locations for view containers in the workbench */
export const enum ViewContainerLocation {
	Sidebar,
	Panel,
	AuxiliaryBar
}

export const ViewContainerLocations = [ViewContainerLocation.Sidebar, ViewContainerLocation.Panel, ViewContainerLocation.AuxiliaryBar];

/**
 * Converts a ViewContainerLocation enum value to its string representation
 * @param viewContainerLocation The location enum value to convert
 * @returns The string representation of the location
 */
export function ViewContainerLocationToString(viewContainerLocation: ViewContainerLocation) {
	switch (viewContainerLocation) {
		case ViewContainerLocation.Sidebar: return 'sidebar';
		case ViewContainerLocation.Panel: return 'panel';
		case ViewContainerLocation.AuxiliaryBar: return 'auxiliarybar';
	}
}

/** Descriptor for open command actions */
type OpenCommandActionDescriptor = {
	readonly id: string;
	readonly title?: ILocalizedString | string;
	readonly mnemonicTitle?: string;
	readonly order?: number;
	readonly keybindings?: IKeybindings & { when?: ContextKeyExpression };
};

/**
 * Descriptor for a view container that can hold multiple views
 */
export interface IViewContainerDescriptor {
	/** Unique identifier for the view container */
	readonly id: string;
	/** Display title for the view container */
	readonly title: ILocalizedString;
	/** Icon to display for the view container */
	readonly icon?: ThemeIcon | URI;
	/** Order in which the container appears */
	readonly order?: number;
	/** Constructor descriptor for the view pane container */
	readonly ctorDescriptor: SyncDescriptor<IViewPaneContainer>;
	/** Descriptor for the command that opens this container */
	readonly openCommandActionDescriptor?: OpenCommandActionDescriptor;
	/** Storage ID for persisting container state */
	readonly storageId?: string;
	/** Whether to hide the container when it has no active views */
	readonly hideIfEmpty?: boolean;
	/** ID of the extension that contributed this container */
	readonly extensionId?: ExtensionIdentifier;
	/** Whether to always use container info */
	readonly alwaysUseContainerInfo?: boolean;
	/** Delegate for custom view ordering */
	readonly viewOrderDelegate?: ViewOrderDelegate;
	/** Whether to reject added views */
	readonly rejectAddedViews?: boolean;
	/** Requested index for the container */
	requestedIndex?: number;
}

/**
 * Registry interface for managing view containers
 */
export interface IViewContainersRegistry {
	/** Event fired when a view container is registered */
	readonly onDidRegister: Event<{ viewContainer: ViewContainer; viewContainerLocation: ViewContainerLocation }>;
	/** Event fired when a view container is deregistered */
	readonly onDidDeregister: Event<{ viewContainer: ViewContainer; viewContainerLocation: ViewContainerLocation }>;
	/** All registered view containers */
	readonly all: ViewContainer[];

	/**
	 * Registers a view container at the specified location
	 * @param viewContainerDescriptor The container to register
	 * @param location Where to register the container
	 * @param options Additional registration options
	 * @returns The registered container
	 */
	registerViewContainer(viewContainerDescriptor: IViewContainerDescriptor, location: ViewContainerLocation, options?: { isDefault?: boolean; doNotRegisterOpenCommand?: boolean }): ViewContainer;

	/**
	 * Deregisters a view container
	 * @param viewContainer The container to deregister
	 */
	deregisterViewContainer(viewContainer: ViewContainer): void;

	/**
	 * Gets a view container by ID
	 * @param id The container ID
	 * @returns The container if found, undefined otherwise
	 */
	get(id: string): ViewContainer | undefined;

	/**
	 * Gets all view containers at a specific location
	 * @param location The location to get containers for
	 * @returns Array of containers at the location
	 */
	getViewContainers(location: ViewContainerLocation): ViewContainer[];

	/**
	 * Gets the location of a specific container
	 * @param container The container to get location for
	 * @returns The container's location
	 */
	getViewContainerLocation(container: ViewContainer): ViewContainerLocation;

	/**
	 * Gets the default view container for a location
	 * @param location The location to get default container for
	 * @returns The default container if one exists
	 */
	getDefaultViewContainer(location: ViewContainerLocation): ViewContainer | undefined;
}

/** Delegate (give authority to something else) interface for custom view ordering */
interface ViewOrderDelegate {
	getOrder(group?: string): number | undefined;
}

/** Type alias for view container */
export interface ViewContainer extends IViewContainerDescriptor { }

/** Relaxed view container type with optional command descriptor */
interface RelaxedViewContainer extends ViewContainer {
	openCommandActionDescriptor?: OpenCommandActionDescriptor;
}

/**
 * Implementation of the view containers registry
 */
class ViewContainersRegistryImpl extends Disposable implements IViewContainersRegistry {

	private readonly _onDidRegister = this._register(new Emitter<{ viewContainer: ViewContainer; viewContainerLocation: ViewContainerLocation }>());
	readonly onDidRegister: Event<{ viewContainer: ViewContainer; viewContainerLocation: ViewContainerLocation }> = this._onDidRegister.event;

	private readonly _onDidDeregister = this._register(new Emitter<{ viewContainer: ViewContainer; viewContainerLocation: ViewContainerLocation }>());
	readonly onDidDeregister: Event<{ viewContainer: ViewContainer; viewContainerLocation: ViewContainerLocation }> = this._onDidDeregister.event;

	private readonly viewContainers: Map<ViewContainerLocation, ViewContainer[]> = new Map<ViewContainerLocation, ViewContainer[]>();
	private readonly defaultViewContainers: ViewContainer[] = [];

	/**
	 * Returns a flattened array of all view containers.
	 *
	 * This getter performs three operations in sequence:
	 * 1. Gets an iterator of values from the Map using values()
	 * 2. Converts the iterator to an array using spread operator
	 * 3. Flattens the resulting nested array structure
	 *
	 * Example transformation:
	 * ```typescript
	 * // Input Map structure:
	 * const viewContainers = new Map([
	 *   ['location1', ['container1', 'container2']],
	 *   ['location2', ['container3', 'container4']]
	 * ]);
	 *
	 * // Step 1: viewContainers.values() returns an iterator:
	 * // Iterator: [[container1, container2], [container3, container4]]
	 *
	 * // Step 2: [...viewContainers.values()] converts iterator to array:
	 * // Array: [[container1, container2], [container3, container4]]
	 *
	 * // Step 3: .flat() combines nested arrays into single array:
	 * // Result: [container1, container2, container3, container4]
	 *
	 * const result = [...viewContainers.values()].flat();
	 * ```
	 *
	 * @returns A flattened array of all view containers
	 */
	get all(): ViewContainer[] {
		return [...this.viewContainers.values()].flat();
	}

	registerViewContainer(viewContainerDescriptor: IViewContainerDescriptor, viewContainerLocation: ViewContainerLocation, options?: { isDefault?: boolean; doNotRegisterOpenCommand?: boolean }): ViewContainer {
		const existing = this.get(viewContainerDescriptor.id);
		if (existing) {
			return existing;
		}

		const viewContainer: RelaxedViewContainer = viewContainerDescriptor;
		viewContainer.openCommandActionDescriptor = options?.doNotRegisterOpenCommand ? undefined : (viewContainer.openCommandActionDescriptor ?? { id: viewContainer.id });
		const viewContainers = getOrSet(this.viewContainers, viewContainerLocation, []);
		viewContainers.push(viewContainer);
		if (options?.isDefault) {
			this.defaultViewContainers.push(viewContainer);
		}
		this._onDidRegister.fire({ viewContainer, viewContainerLocation });
		return viewContainer;
	}

	deregisterViewContainer(viewContainer: ViewContainer): void {
		for (const viewContainerLocation of this.viewContainers.keys()) {
			const viewContainers = this.viewContainers.get(viewContainerLocation)!;
			const index = viewContainers?.indexOf(viewContainer);
			if (index !== -1) {
				viewContainers?.splice(index, 1);
				if (viewContainers.length === 0) {
					this.viewContainers.delete(viewContainerLocation);
				}
				this._onDidDeregister.fire({ viewContainer, viewContainerLocation });
				return;
			}
		}
	}

	/**
	 * Gets a view container by ID
	 * @param id The container ID
	 * @returns The container if found, undefined otherwise
	 */
	get(id: string): ViewContainer | undefined {
		return this.all.filter(viewContainer => viewContainer.id === id)[0];
	}

	/**
	 * Gets all view containers at a specific location
	 * @param location The location to get containers for
	 * @returns Array of containers at the location
	 */
	getViewContainers(location: ViewContainerLocation): ViewContainer[] {
		return [...(this.viewContainers.get(location) || [])];
	}

	/**
	 * Gets the location of a specific container
	 * @param container The container to get location for
	 * @returns The container's location
	 */
	getViewContainerLocation(container: ViewContainer): ViewContainerLocation {
		return [...this.viewContainers.keys()].filter(location => this.getViewContainers(location).filter(viewContainer => viewContainer?.id === container.id).length > 0)[0];
	}

	/**
	 * Gets the default view container for a specific location
	 * @param location The location to get the default container for
	 * @returns The default container if found, undefined otherwise
	 */
	getDefaultViewContainer(location: ViewContainerLocation): ViewContainer | undefined {
		return this.defaultViewContainers.find(viewContainer => this.getViewContainerLocation(viewContainer) === location);
	}
}

/**
 * Registry for view containers
 */
Registry.add(Extensions.ViewContainersRegistry, new ViewContainersRegistryImpl());

/**
 * Descriptor for a view that can be added to a container
 */
export interface IViewDescriptor {
	/** Type of the view */
	readonly type?: string;
	/** Unique identifier for the view */
	readonly id: string;
	/** Display name for the view */
	readonly name: ILocalizedString;
	/** Constructor descriptor for the view */
	readonly ctorDescriptor: SyncDescriptor<IView>;
	/** Context key expression for when the view should be shown */
	readonly when?: ContextKeyExpression;
	/** Order in which the view appears */
	readonly order?: number;
	/** Weight for view ordering */
	readonly weight?: number;
	/** Whether the view is collapsed by default */
	readonly collapsed?: boolean;
	/** Whether the view can be toggled */
	readonly canToggleVisibility?: boolean;
	/** Whether the view can be moved */
	readonly canMoveView?: boolean;
	/** Icon for the container */
	readonly containerIcon?: ThemeIcon | URI;
	/** Title for the container */
	readonly containerTitle?: string;
	/** Title when shown as single view */
	readonly singleViewPaneContainerTitle?: string;
	/** Whether to hide by default */
	readonly hideByDefault?: boolean;
	/** Whether this is a workspace view */
	readonly workspace?: boolean;
	/** Focus command configuration */
	readonly focusCommand?: { id: string; keybindings?: IKeybindings };
	/** Group identifier */
	readonly group?: string;
	/** Remote authority */
	readonly remoteAuthority?: string | string[];
	/** Virtual workspace */
	readonly virtualWorkspace?: string;
	/** Command descriptor for opening the view */
	readonly openCommandActionDescriptor?: OpenCommandActionDescriptor;
	/** Accessibility help content */
	readonly accessibilityHelpContent?: MarkdownString;
}

/**
 * Extended view descriptor for custom views
 */
export interface ICustomViewDescriptor extends IViewDescriptor {
	/** ID of the contributing extension */
	readonly extensionId: ExtensionIdentifier;
	/** Original container ID */
	readonly originalContainerId: string;
	/** Tree view if applicable */
	readonly treeView?: ITreeView;
}

/**
 * Reference to a view descriptor with index
 */
export interface IViewDescriptorRef {
	/** The view descriptor */
	viewDescriptor: IViewDescriptor;
	/** Index in the container */
	index: number;
}

/**
 * Extended view descriptor reference with collapse state
 */
export interface IAddedViewDescriptorRef extends IViewDescriptorRef {
	/** Whether the view is collapsed */
	collapsed: boolean;
	/** Size of the view */
	size?: number;
}

/**
 * State for an added view descriptor
 */
export interface IAddedViewDescriptorState {
	/** The view descriptor */
	viewDescriptor: IViewDescriptor;
	/** Whether the view is collapsed */
	collapsed?: boolean;
	/** Whether the view is visible */
	visible?: boolean;
}

/**
 * Model interface for view containers
 */
export interface IViewContainerModel {
	/** The view container */
	readonly viewContainer: ViewContainer;
	/** Container title */
	readonly title: string;
	/** Container icon */
	readonly icon: ThemeIcon | URI | undefined;
	/** Keybinding ID */
	readonly keybindingId: string | undefined;
	/** Event fired when container info changes */
	readonly onDidChangeContainerInfo: Event<{ title?: boolean; icon?: boolean; keybindingId?: boolean; badgeEnablement?: boolean }>;
	/** All view descriptors */
	readonly allViewDescriptors: ReadonlyArray<IViewDescriptor>;
	/** Event fired when view descriptors change */
	readonly onDidChangeAllViewDescriptors: Event<{ added: ReadonlyArray<IViewDescriptor>; removed: ReadonlyArray<IViewDescriptor> }>;
	/** Active view descriptors */
	readonly activeViewDescriptors: ReadonlyArray<IViewDescriptor>;
	/** Event fired when active views change */
	readonly onDidChangeActiveViewDescriptors: Event<{ added: ReadonlyArray<IViewDescriptor>; removed: ReadonlyArray<IViewDescriptor> }>;
	/** Visible view descriptors */
	readonly visibleViewDescriptors: ReadonlyArray<IViewDescriptor>;
	/** Event fired when visible views are added */
	readonly onDidAddVisibleViewDescriptors: Event<IAddedViewDescriptorRef[]>;
	/** Event fired when visible views are removed */
	readonly onDidRemoveVisibleViewDescriptors: Event<IViewDescriptorRef[]>;
	/** Event fired when visible views are moved */
	readonly onDidMoveVisibleViewDescriptors: Event<{ from: IViewDescriptorRef; to: IViewDescriptorRef }>;

	/**
	 * Checks if a view is visible
	 * @param id The view ID
	 * @returns Whether the view is visible
	 */
	isVisible(id: string): boolean;

	/**
	 * Sets the visibility of a view
	 * @param id The view ID
	 * @param visible Whether to show the view
	 */
	setVisible(id: string, visible: boolean): void;

	/**
	 * Checks if a view is collapsed
	 * @param id The view ID
	 * @returns Whether the view is collapsed
	 */
	isCollapsed(id: string): boolean;

	/**
	 * Sets the collapsed state of a view
	 * @param id The view ID
	 * @param collapsed Whether to collapse the view
	 */
	setCollapsed(id: string, collapsed: boolean): void;

	/**
	 * Gets the size of a view
	 * @param id The view ID
	 * @returns The view size if set
	 */
	getSize(id: string): number | undefined;

	/**
	 * Sets sizes for multiple views
	 * @param newSizes Array of view IDs and their new sizes
	 */
	setSizes(newSizes: readonly { id: string; size: number }[]): void;

	/**
	 * Moves a view to a new position
	 * @param from Source view ID
	 * @param to Target view ID
	 */
	move(from: string, to: string): void;
}

/**
 * Content groups for views
 */
export enum ViewContentGroups {
	Open = '2_open',
	Debug = '4_debug',
	SCM = '5_scm',
	More = '9_more'
}

/**
 * Descriptor for view content
 */
export interface IViewContentDescriptor {
	/** The content to display */
	readonly content: string;
	/** Whether to render secondary buttons */
	readonly renderSecondaryButtons?: boolean;
	/** Context key expression for when to show */
	readonly when?: ContextKeyExpression | 'default';
	/** Group identifier */
	readonly group?: string;
	/** Order in the group */
	readonly order?: number;
	/** Precondition for showing */
	readonly precondition?: ContextKeyExpression | undefined;
}

/**
 * Registry interface for managing views
 */
export interface IViewsRegistry {
	/** Event fired when views are registered */
	readonly onViewsRegistered: Event<{ views: IViewDescriptor[]; viewContainer: ViewContainer }[]>;
	/** Event fired when views are deregistered */
	readonly onViewsDeregistered: Event<{ views: IViewDescriptor[]; viewContainer: ViewContainer }>;
	/** Event fired when container changes */
	readonly onDidChangeContainer: Event<{ views: IViewDescriptor[]; from: ViewContainer; to: ViewContainer }>;

	/**
	 * Registers views in a container
	 * @param views The views to register
	 * @param viewContainer The container to add them to
	 */
	registerViews(views: IViewDescriptor[], viewContainer: ViewContainer): void;

	/**
	 * Registers multiple sets of views
	 * @param views Array of view sets to register
	 */
	registerViews2(views: { views: IViewDescriptor[]; viewContainer: ViewContainer }[]): void;

	/**
	 * Deregisters views from a container
	 * @param views The views to deregister
	 * @param viewContainer The container to remove them from
	 */
	deregisterViews(views: IViewDescriptor[], viewContainer: ViewContainer): void;

	/**
	 * Moves views to a new container
	 * @param views The views to move
	 * @param viewContainer The target container
	 */
	moveViews(views: IViewDescriptor[], viewContainer: ViewContainer): void;

	/**
	 * Gets all views in a container
	 * @param viewContainer The container to get views for
	 * @returns Array of view descriptors
	 */
	getViews(viewContainer: ViewContainer): IViewDescriptor[];

	/**
	 * Gets a view by ID
	 * @param id The view ID
	 * @returns The view descriptor if found
	 */
	getView(id: string): IViewDescriptor | null;

	/**
	 * Gets the container for a view
	 * @param viewId The view ID
	 * @returns The container if found
	 */
	getViewContainer(viewId: string): ViewContainer | null;

	/** Event fired when welcome content changes */
	readonly onDidChangeViewWelcomeContent: Event<string>;

	/**
	 * Registers welcome content for a view
	 * @param id The view ID
	 * @param viewContent The welcome content
	 * @returns Disposable to unregister
	 */
	registerViewWelcomeContent(id: string, viewContent: IViewContentDescriptor): IDisposable;

	/**
	 * Registers welcome content map for a view
	 * @param id The view ID
	 * @param viewContentMap Map of content descriptors
	 * @returns Map of disposables
	 */
	registerViewWelcomeContent2<TKey>(id: string, viewContentMap: Map<TKey, IViewContentDescriptor>): Map<TKey, IDisposable>;

	/**
	 * Gets welcome content for a view
	 * @param id The view ID
	 * @returns Array of content descriptors
	 */
	getViewWelcomeContent(id: string): IViewContentDescriptor[];
}

/**
 * Compares two view content descriptors
 * @param a First descriptor
 * @param b Second descriptor
 * @returns Comparison result
 */
function compareViewContentDescriptors(a: IViewContentDescriptor, b: IViewContentDescriptor): number {
	const aGroup = a.group ?? ViewContentGroups.More;
	const bGroup = b.group ?? ViewContentGroups.More;
	if (aGroup !== bGroup) {
		return aGroup.localeCompare(bGroup);
	}
	return (a.order ?? 5) - (b.order ?? 5);
}

/**
 * Implementation of the views registry
 */
class ViewsRegistry extends Disposable implements IViewsRegistry {

	/**
	 * Event fired when views are registered
	 */
	private readonly _onViewsRegistered = this._register(new Emitter<{ views: IViewDescriptor[]; viewContainer: ViewContainer }[]>());
	readonly onViewsRegistered = this._onViewsRegistered.event;

	/**
	 * Event fired when views are deregistered
	 */
	private readonly _onViewsDeregistered: Emitter<{ views: IViewDescriptor[]; viewContainer: ViewContainer }> = this._register(new Emitter<{ views: IViewDescriptor[]; viewContainer: ViewContainer }>());
	/**
	 * Event fired when views are deregistered
	 */
	readonly onViewsDeregistered: Event<{ views: IViewDescriptor[]; viewContainer: ViewContainer }> = this._onViewsDeregistered.event;

	/**
	 * Event fired when the container of views changes
	 */
	private readonly _onDidChangeContainer: Emitter<{ views: IViewDescriptor[]; from: ViewContainer; to: ViewContainer }> = this._register(new Emitter<{ views: IViewDescriptor[]; from: ViewContainer; to: ViewContainer }>());
	/**
	 * Event fired when the container of views changes
	 */
	readonly onDidChangeContainer: Event<{ views: IViewDescriptor[]; from: ViewContainer; to: ViewContainer }> = this._onDidChangeContainer.event;

	/**
	 * Event fired when the welcome content of a view changes
	 */
	private readonly _onDidChangeViewWelcomeContent: Emitter<string> = this._register(new Emitter<string>());
	/**
	 * Event fired when the welcome content of a view changes
	 */
	readonly onDidChangeViewWelcomeContent: Event<string> = this._onDidChangeViewWelcomeContent.event;

	/**
	 * List of view containers
	 */
	private _viewContainers: ViewContainer[] = [];
	/**
	 * Map of views in each container
	 */
	private _views: Map<ViewContainer, IViewDescriptor[]> = new Map<ViewContainer, IViewDescriptor[]>();
	/**
	 * Map of welcome content for each view
	 */
	private _viewWelcomeContents = new SetMap<string, IViewContentDescriptor>();

	/**
	 * Registers views in a container
	 * @param views The views to register
	 * @param viewContainer The container to add them to
	 */
	registerViews(views: IViewDescriptor[], viewContainer: ViewContainer): void {
		this.registerViews2([{ views, viewContainer }]);
	}

	/**
	 * Registers multiple sets of views
	 * @param views Array of view sets to register
	 */
	registerViews2(views: { views: IViewDescriptor[]; viewContainer: ViewContainer }[]): void {
		views.forEach(({ views, viewContainer }) => this.addViews(views, viewContainer));
		this._onViewsRegistered.fire(views);
	}

	/**
	 * Deregisters views from a container
	 * @param viewDescriptors The views to deregister
	 * @param viewContainer The container to remove them from
	 */
	deregisterViews(viewDescriptors: IViewDescriptor[], viewContainer: ViewContainer): void {
		const views = this.removeViews(viewDescriptors, viewContainer);
		if (views.length) {
			this._onViewsDeregistered.fire({ views, viewContainer });
		}
	}

	/**
	 * Moves views to a new container
	 * @param viewsToMove The views to move
	 * @param viewContainer The target container
	 */
	moveViews(viewsToMove: IViewDescriptor[], viewContainer: ViewContainer): void {
		for (const container of this._views.keys()) {
			if (container !== viewContainer) {
				const views = this.removeViews(viewsToMove, container);
				if (views.length) {
					this.addViews(views, viewContainer);
					this._onDidChangeContainer.fire({ views, from: container, to: viewContainer });
				}
			}
		}
	}

	/**
	 * Gets all views in a specific container
	 * @param loc The container to get views from
	 * @returns Array of views in the container
	 */
	getViews(loc: ViewContainer): IViewDescriptor[] {
		return this._views.get(loc) || [];
	}

	/**
	 * Gets a view by ID
	 * @param id The ID of the view to get
	 * @returns The view if found, null otherwise
	 */
	getView(id: string): IViewDescriptor | null {
		for (const viewContainer of this._viewContainers) {
			const viewDescriptor = (this._views.get(viewContainer) || []).filter(v => v.id === id)[0];
			if (viewDescriptor) {
				return viewDescriptor;
			}
		}
		return null;
	}

	/**
	 * Gets the container of a view by ID
	 * @param viewId The ID of the view to get the container for
	 * @returns The container if found, null otherwise
	 */
	getViewContainer(viewId: string): ViewContainer | null {
		for (const viewContainer of this._viewContainers) {
			const viewDescriptor = (this._views.get(viewContainer) || []).filter(v => v.id === viewId)[0];
			if (viewDescriptor) {
				return viewContainer;
			}
		}
		return null;
	}

	/**
	 * Registers welcome content for a view
	 * @param id The ID of the view to register welcome content for
	 * @param viewContent The welcome content to register
	 * @returns A disposable to unregister the welcome content
	 */
	registerViewWelcomeContent(id: string, viewContent: IViewContentDescriptor): IDisposable {
		this._viewWelcomeContents.add(id, viewContent);
		this._onDidChangeViewWelcomeContent.fire(id);

		return toDisposable(() => {
			this._viewWelcomeContents.delete(id, viewContent);
			this._onDidChangeViewWelcomeContent.fire(id);
		});
	}

	/**
	 * Registers welcome content for a view
	 * @param id The ID of the view to register welcome content for
	 * @param viewContentMap The welcome content to register
	 * @returns A map of disposables to unregister the welcome content
	 */
	registerViewWelcomeContent2<TKey>(id: string, viewContentMap: Map<TKey, IViewContentDescriptor>): Map<TKey, IDisposable> {
		const disposables = new Map<TKey, IDisposable>();

		for (const [key, content] of viewContentMap) {
			this._viewWelcomeContents.add(id, content);

			disposables.set(key, toDisposable(() => {
				this._viewWelcomeContents.delete(id, content);
				this._onDidChangeViewWelcomeContent.fire(id);
			}));
		}
		this._onDidChangeViewWelcomeContent.fire(id);

		return disposables;
	}

	/**
	 * Gets welcome content for a view
	 * @param id The ID of the view to get welcome content for
	 * @returns Array of welcome content descriptors
	 */
	getViewWelcomeContent(id: string): IViewContentDescriptor[] {
		const result: IViewContentDescriptor[] = [];
		this._viewWelcomeContents.forEach(id, descriptor => result.push(descriptor));
		return result.sort(compareViewContentDescriptors);
	}

	/**
	 * Adds views to a container
	 * @param viewDescriptors The views to add
	 * @param viewContainer The container to add them to
	 */
	private addViews(viewDescriptors: IViewDescriptor[], viewContainer: ViewContainer): void {
		let views = this._views.get(viewContainer);
		if (!views) {
			views = [];
			this._views.set(viewContainer, views);
			this._viewContainers.push(viewContainer);
		}
		for (const viewDescriptor of viewDescriptors) {
			if (this.getView(viewDescriptor.id) !== null) {
				throw new Error(localize('duplicateId', "A view with id '{0}' is already registered", viewDescriptor.id));
			}
			views.push(viewDescriptor);
		}
	}

	/**
	 * Removes views from a container
	 * @param viewDescriptors The views to remove
	 * @param viewContainer The container to remove them from
	 * @returns Array of views that were removed
	 */
	private removeViews(viewDescriptors: IViewDescriptor[], viewContainer: ViewContainer): IViewDescriptor[] {
		const views = this._views.get(viewContainer);
		if (!views) {
			return [];
		}
		const viewsToDeregister: IViewDescriptor[] = [];
		const remaningViews: IViewDescriptor[] = [];
		for (const view of views) {
			if (!viewDescriptors.includes(view)) {
				remaningViews.push(view);
			} else {
				viewsToDeregister.push(view);
			}
		}
		if (viewsToDeregister.length) {
			if (remaningViews.length) {
				this._views.set(viewContainer, remaningViews);
			} else {
				this._views.delete(viewContainer);
				this._viewContainers.splice(this._viewContainers.indexOf(viewContainer), 1);
			}
		}
		return viewsToDeregister;
	}
}

/**
 * Registry for views
 */
Registry.add(Extensions.ViewsRegistry, new ViewsRegistry());

/**
 * Base interface for views
 */
export interface IView {
	/** Unique identifier */
	readonly id: string;

	/**
	 * Focuses the view
	 */
	focus(): void;

	/**
	 * Checks if the view is visible
	 * @returns Whether the view is visible
	 */
	isVisible(): boolean;

	/**
	 * Checks if the view body is visible
	 * @returns Whether the view body is visible
	 */
	isBodyVisible(): boolean;

	/**
	 * Sets the expanded state
	 * @param expanded Whether to expand
	 * @returns Whether the state changed
	 */
	setExpanded(expanded: boolean): boolean;

	/**
	 * Gets the progress indicator
	 * @returns The progress indicator if available
	 */
	getProgressIndicator(): IProgressIndicator | undefined;
}

/** Service decorator for view descriptor service */
export const IViewDescriptorService = createDecorator<IViewDescriptorService>('viewDescriptorService');

/**
 * Visibility states for views
 */
export enum ViewVisibilityState {
	Default = 0,
	Expand = 1
}

/**
 * Service for managing view descriptors
 */
export interface IViewDescriptorService {
	readonly _serviceBrand: undefined;

	/** All view containers */
	readonly viewContainers: ReadonlyArray<ViewContainer>;
	/** Event fired when containers change */
	readonly onDidChangeViewContainers: Event<{ added: ReadonlyArray<{ container: ViewContainer; location: ViewContainerLocation }>; removed: ReadonlyArray<{ container: ViewContainer; location: ViewContainerLocation }> }>;

	/**
	 * Gets the default container for a location
	 * @param location The location
	 * @returns The default container if found
	 */
	getDefaultViewContainer(location: ViewContainerLocation): ViewContainer | undefined;

	/**
	 * Gets a container by ID
	 * @param id The container ID
	 * @returns The container if found
	 */
	getViewContainerById(id: string): ViewContainer | null;

	/**
	 * Checks if a container is permanently removed
	 * @param id The container ID
	 * @returns Whether the container is removed
	 */
	isViewContainerRemovedPermanently(id: string): boolean;

	/**
	 * Gets the default location for a container
	 * @param viewContainer The container
	 * @returns The default location if found
	 */
	getDefaultViewContainerLocation(viewContainer: ViewContainer): ViewContainerLocation | null;

	/**
	 * Gets the current location of a container
	 * @param viewContainer The container
	 * @returns The current location if found
	 */
	getViewContainerLocation(viewContainer: ViewContainer): ViewContainerLocation | null;

	/**
	 * Gets all containers at a location
	 * @param location The location
	 * @returns Array of containers
	 */
	getViewContainersByLocation(location: ViewContainerLocation): ViewContainer[];

	/**
	 * Gets the model for a container
	 * @param viewContainer The container
	 * @returns The container model
	 */
	getViewContainerModel(viewContainer: ViewContainer): IViewContainerModel;

	/** Event fired when container location changes */
	readonly onDidChangeContainerLocation: Event<{ viewContainer: ViewContainer; from: ViewContainerLocation; to: ViewContainerLocation }>;

	/**
	 * Moves a container to a new location
	 * @param viewContainer The container to move
	 * @param location The target location
	 * @param requestedIndex Optional requested index
	 * @param reason Optional reason for the move
	 */
	moveViewContainerToLocation(viewContainer: ViewContainer, location: ViewContainerLocation, requestedIndex?: number, reason?: string): void;

	/**
	 * Gets badge enablement state for a container
	 * @param id The container ID
	 * @returns Whether badges are enabled
	 */
	getViewContainerBadgeEnablementState(id: string): boolean;

	/**
	 * Sets badge enablement state for a container
	 * @param id The container ID
	 * @param badgesEnabled Whether to enable badges
	 */
	setViewContainerBadgeEnablementState(id: string, badgesEnabled: boolean): void;

	/**
	 * Gets a view descriptor by ID
	 * @param id The view ID
	 * @returns The view descriptor if found
	 */
	getViewDescriptorById(id: string): IViewDescriptor | null;

	/**
	 * Gets the container for a view
	 * @param id The view ID
	 * @returns The container if found
	 */
	getViewContainerByViewId(id: string): ViewContainer | null;

	/**
	 * Gets the default container for a view
	 * @param id The view ID
	 * @returns The default container if found
	 */
	getDefaultContainerById(id: string): ViewContainer | null;

	/**
	 * Gets the location for a view
	 * @param id The view ID
	 * @returns The location if found
	 */
	getViewLocationById(id: string): ViewContainerLocation | null;

	/** Event fired when container changes */
	readonly onDidChangeContainer: Event<{ views: IViewDescriptor[]; from: ViewContainer; to: ViewContainer }>;

	/**
	 * Moves views to a container
	 * @param views The views to move
	 * @param viewContainer The target container
	 * @param visibilityState Optional visibility state
	 * @param reason Optional reason for the move
	 */
	moveViewsToContainer(views: IViewDescriptor[], viewContainer: ViewContainer, visibilityState?: ViewVisibilityState, reason?: string): void;

	/** Event fired when view location changes */
	readonly onDidChangeLocation: Event<{ views: IViewDescriptor[]; from: ViewContainerLocation; to: ViewContainerLocation }>;

	/**
	 * Moves a view to a new location
	 * @param view The view to move
	 * @param location The target location
	 * @param reason Optional reason for the move
	 */
	moveViewToLocation(view: IViewDescriptor, location: ViewContainerLocation, reason?: string): void;

	/**
	 * Resets the service state
	 */
	reset(): void;
}

/**
 * Interface for tree views
 */
export interface ITreeView extends IDisposable {
	/** Data provider for the tree */
	dataProvider: ITreeViewDataProvider | undefined;
	/** Drag and drop controller */
	dragAndDropController?: ITreeViewDragAndDropController;
	/** Whether to show collapse all action */
	showCollapseAllAction: boolean;
	/** Whether multiple items can be selected */
	canSelectMany: boolean;
	/** Whether checkboxes are managed manually */
	manuallyManageCheckboxes: boolean;
	/** Message to display */
	message?: string | IMarkdownString;
	/** View title */
	title: string;
	/** View description */
	description: string | undefined;
	/** View badge */
	badge: IViewBadge | undefined;
	/** Whether the view is visible */
	readonly visible: boolean;
	/** Event fired when an item is expanded */
	readonly onDidExpandItem: Event<ITreeItem>;
	/** Event fired when an item is collapsed */
	readonly onDidCollapseItem: Event<ITreeItem>;
	/** Event fired when selection and focus change */
	readonly onDidChangeSelectionAndFocus: Event<{ selection: readonly ITreeItem[]; focus: ITreeItem }>;
	/** Event fired when visibility changes */
	readonly onDidChangeVisibility: Event<boolean>;
	/** Event fired when actions change */
	readonly onDidChangeActions: Event<void>;
	/** Event fired when title changes */
	readonly onDidChangeTitle: Event<string>;
	/** Event fired when description changes */
	readonly onDidChangeDescription: Event<string | undefined>;
	/** Event fired when welcome state changes */
	readonly onDidChangeWelcomeState: Event<void>;
	/** Event fired when checkbox state changes */
	readonly onDidChangeCheckboxState: Event<readonly ITreeItem[]>;
	/** Container element */
	readonly container: any | undefined;

	/**
	 * Refreshes the tree view
	 * @param treeItems Optional items to refresh
	 * @param checkboxesChanged Optional items with changed checkboxes
	 */
	refresh(treeItems?: readonly ITreeItem[], checkboxesChanged?: readonly ITreeItem[]): Promise<void>;

	/**
	 * Sets the visibility of the view
	 * @param visible Whether to show the view
	 */
	setVisibility(visible: boolean): void;

	/**
	 * Focuses the view
	 */
	focus(): void;

	/**
	 * Updates the layout
	 * @param height New height
	 * @param width New width
	 */
	layout(height: number, width: number): void;

	/**
	 * Gets the optimal width
	 * @returns The optimal width
	 */
	getOptimalWidth(): number;

	/**
	 * Reveals an item in the tree
	 * @param item The item to reveal
	 */
	reveal(item: ITreeItem): Promise<void>;

	/**
	 * Expands items in the tree
	 * @param itemOrItems Items to expand
	 */
	expand(itemOrItems: ITreeItem | ITreeItem[]): Promise<void>;

	/**
	 * Checks if an item is collapsed
	 * @param item The item to check
	 * @returns Whether the item is collapsed
	 */
	isCollapsed(item: ITreeItem): boolean;

	/**
	 * Sets the selection
	 * @param items Items to select
	 */
	setSelection(items: ITreeItem[]): void;

	/**
	 * Gets the current selection
	 * @returns Selected items
	 */
	getSelection(): ITreeItem[];

	/**
	 * Sets the focus
	 * @param item Optional item to focus
	 */
	setFocus(item?: ITreeItem): void;

	/**
	 * Shows the view in a container
	 * @param container The container to show in
	 */
	show(container: any): void;
}

/**
 * Options for revealing items in a tree view
 */
export interface IRevealOptions {
	/** Whether to select the item */
	select?: boolean;
	/** Whether to focus the item */
	focus?: boolean;
	/** Whether to expand the item */
	expand?: boolean | number;
}

/**
 * Extended view descriptor for tree views
 */
export interface ITreeViewDescriptor extends IViewDescriptor {
	/** The tree view instance */
	treeView: ITreeView;
}

/**
 * Handle arguments for tree view panes
 */
export type TreeViewPaneHandleArg = {
	/** Tree view ID */
	$treeViewId: string;
	/** Whether items are selected */
	$selectedTreeItems?: boolean;
	/** Whether an item is focused */
	$focusedTreeItem?: boolean;
};

/**
 * Handle arguments for tree view items
 */
export type TreeViewItemHandleArg = {
	/** Tree view ID */
	$treeViewId: string;
	/** Tree item handle */
	$treeItemHandle: string;
};

/**
 * Collapsible states for tree items
 */
export enum TreeItemCollapsibleState {
	None = 0,
	Collapsed = 1,
	Expanded = 2
}

/**
 * Label for a tree item
 */
export interface ITreeItemLabel {
	/** Label text */
	label: string;
	/** Highlight ranges */
	highlights?: [number, number][];
	/** Whether the label is strikethrough */
	strikethrough?: boolean;
}

/** Tree command type */
export type TreeCommand = Command & { originalId?: string };

/**
 * Checkbox state for a tree item
 */
export interface ITreeItemCheckboxState {
	/** Whether the checkbox is checked */
	isChecked: boolean;
	/** Tooltip text */
	tooltip?: string;
	/** Accessibility information */
	accessibilityInformation?: IAccessibilityInformation;
}

/**
 * Interface for tree items
 */
export interface ITreeItem {
	/** Unique handle */
	handle: string;
	/** Parent handle */
	parentHandle?: string;
	/** Collapsible state */
	collapsibleState: TreeItemCollapsibleState;
	/** Item label */
	label?: ITreeItemLabel;
	/** Item description */
	description?: string | boolean;
	/** Item icon */
	icon?: UriComponents;
	/** Dark theme icon */
	iconDark?: UriComponents;
	/** Theme icon */
	themeIcon?: ThemeIcon;
	/** Resource URI */
	resourceUri?: UriComponents;
	/** Tooltip */
	tooltip?: string | IMarkdownString;
	/** Context value */
	contextValue?: string;
	/** Command to execute */
	command?: TreeCommand;
	/** Child items */
	children?: ITreeItem[];
	/** Parent item */
	parent?: ITreeItem;
	/** Accessibility information */
	accessibilityInformation?: IAccessibilityInformation;
	/** Checkbox state */
	checkbox?: ITreeItemCheckboxState;
}

/**
 * Class for resolvable tree items
 */
export class ResolvableTreeItem implements ITreeItem {
	handle!: string;
	parentHandle?: string;
	collapsibleState!: TreeItemCollapsibleState;
	label?: ITreeItemLabel;
	description?: string | boolean;
	icon?: UriComponents;
	iconDark?: UriComponents;
	themeIcon?: ThemeIcon;
	resourceUri?: UriComponents;
	tooltip?: string | IMarkdownString;
	contextValue?: string;
	command?: Command & { originalId?: string };
	children?: ITreeItem[];
	accessibilityInformation?: IAccessibilityInformation;
	resolve: (token: CancellationToken) => Promise<void>;
	private resolved: boolean = false;
	private _hasResolve: boolean = false;

	/**
	 * Creates a new resolvable tree item
	 * @param treeItem The base tree item
	 * @param resolve Optional resolve function
	 */
	constructor(treeItem: ITreeItem, resolve?: ((token: CancellationToken) => Promise<ITreeItem | undefined>)) {
		mixin(this, treeItem);
		this._hasResolve = !!resolve;
		this.resolve = async (token: CancellationToken) => {
			if (resolve && !this.resolved) {
				const resolvedItem = await resolve(token);
				if (resolvedItem) {
					this.tooltip = this.tooltip ?? resolvedItem.tooltip;
					this.command = this.command ?? resolvedItem.command;
				}
			}
			if (!token.isCancellationRequested) {
				this.resolved = true;
			}
		};
	}

	/** Whether the item has a resolve function */
	get hasResolve(): boolean {
		return this._hasResolve;
	}

	/**
	 * Resets the resolved state
	 */
	public resetResolve() {
		this.resolved = false;
	}

	/**
	 * Converts to a regular tree item
	 * @returns The tree item
	 */
	public asTreeItem(): ITreeItem {
		return {
			handle: this.handle,
			parentHandle: this.parentHandle,
			collapsibleState: this.collapsibleState,
			label: this.label,
			description: this.description,
			icon: this.icon,
			iconDark: this.iconDark,
			themeIcon: this.themeIcon,
			resourceUri: this.resourceUri,
			tooltip: this.tooltip,
			contextValue: this.contextValue,
			command: this.command,
			children: this.children,
			accessibilityInformation: this.accessibilityInformation
		};
	}
}

/**
 * Error thrown when a tree view is not found
 */
export class NoTreeViewError extends Error {
	override readonly name = 'NoTreeViewError';
	constructor(treeViewId: string) {
		super(localize('treeView.notRegistered', 'No tree view with id \'{0}\' registered.', treeViewId));
	}
	static is(err: unknown): err is NoTreeViewError {
		return !!err && (err as Error).name === 'NoTreeViewError';
	}
}

/**
 * Interface for tree view data providers
 */
export interface ITreeViewDataProvider {
	/** Whether the tree is empty */
	readonly isTreeEmpty?: boolean;
	/** Event fired when empty state changes */
	onDidChangeEmpty?: Event<void>;
	/**
	 * Gets children for an item
	 * @param element Optional parent item
	 * @returns Promise resolving to child items
	 */
	getChildren(element?: ITreeItem): Promise<ITreeItem[] | undefined>;
	/**
	 * Gets children for multiple items
	 * @param element Optional parent items
	 * @returns Promise resolving to child items
	 */
	getChildrenBatch?(element?: ITreeItem[]): Promise<ITreeItem[][] | undefined>;
}

/**
 * Interface for tree view drag and drop controllers
 */
export interface ITreeViewDragAndDropController {
	/** MIME types for dropping */
	readonly dropMimeTypes: string[];
	/** MIME types for dragging */
	readonly dragMimeTypes: string[];
	/**
	 * Handles drag operation
	 * @param sourceTreeItemHandles Handles of source items
	 * @param operationUuid Operation UUID
	 * @param token Cancellation token
	 * @returns Promise resolving to data transfer
	 */
	handleDrag(sourceTreeItemHandles: string[], operationUuid: string, token: CancellationToken): Promise<VSDataTransfer | undefined>;
	/**
	 * Handles drop operation
	 * @param elements Dropped elements
	 * @param target Target item
	 * @param token Cancellation token
	 * @param operationUuid Optional operation UUID
	 * @param sourceTreeId Optional source tree ID
	 * @param sourceTreeItemHandles Optional source item handles
	 */
	handleDrop(elements: VSDataTransfer, target: ITreeItem | undefined, token: CancellationToken, operationUuid?: string, sourceTreeId?: string, sourceTreeItemHandles?: string[]): Promise<void>;
}

/**
 * Interface for editable data
 */
export interface IEditableData {
	/** Validation message function */
	validationMessage: (value: string) => { content: string; severity: Severity } | null;
	/** Placeholder text */
	placeholder?: string | null;
	/** Starting value */
	startingValue?: string | null;
	/** Finish callback */
	onFinish: (value: string, success: boolean) => Promise<void>;
}

/**
 * Interface for view pane containers
 */
export interface IViewPaneContainer {
	/** Event fired when views are added */
	onDidAddViews: Event<IView[]>;
	/** Event fired when views are removed */
	onDidRemoveViews: Event<IView[]>;
	/** Event fired when view visibility changes */
	onDidChangeViewVisibility: Event<IView>;

	/** All views */
	readonly views: IView[];

	/**
	 * Sets container visibility
	 * @param visible Whether to show the container
	 */
	setVisible(visible: boolean): void;

	/**
	 * Checks if container is visible
	 * @returns Whether the container is visible
	 */
	isVisible(): boolean;

	/**
	 * Focuses the container
	 */
	focus(): void;

	/**
	 * Gets actions context
	 * @returns Actions context
	 */
	getActionsContext(): unknown;

	/**
	 * Gets a view by ID
	 * @param viewId The view ID
	 * @returns The view if found
	 */
	getView(viewId: string): IView | undefined;

	/**
	 * Toggles view visibility
	 * @param viewId The view ID
	 */
	toggleViewVisibility(viewId: string): void;
}

/**
 * Interface for view badges
 */
export interface IViewBadge {
	/** Badge tooltip */
	readonly tooltip: string;
	/** Badge value */
	readonly value: number;
}
