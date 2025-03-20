/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * @file DevSphere View Module
 *
 * This module serves as the entry point for the DevSphere extension view system.
 * It exports the main view component and view-related enums that control the
 * UI state of the DevSphere extension.
 *
 * The DevSphere feature provides AI-assisted development capabilities within VS Code,
 * offering functionalities like chat, history review, and API key management.
 *
 * This barrel file re-exports from the component modules to provide a clean API
 * for consumers of the DevSphere view system.
 */

/**
 * Re-export the main DevSphere view component.
 * This is the primary view pane that appears in the VS Code UI and contains
 * all DevSphere functionality including chat, history, and settings.
 */
export { DevSphereView } from './view/devSphereBaseView.js';

/**
 * Export view-related enumeration that defines the different view types.
 * This enum is used to control which tab/view is currently active:
 * - Chat: The main chat interface for AI assistance
 * - History: View of past conversations
 * - APIKeys: Settings interface for managing API credentials
 */
export { DevSphereViewType } from './view/devSphereViewTabs.js';
