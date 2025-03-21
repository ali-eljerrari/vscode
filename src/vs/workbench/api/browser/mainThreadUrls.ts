/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ExtHostContext, MainContext, MainThreadUrlsShape, ExtHostUrlsShape } from '../common/extHost.protocol.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { IURLService, IOpenURLOptions } from '../../../platform/url/common/url.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { IExtensionContributedURLHandler, IExtensionUrlHandler } from '../../services/extensions/browser/extensionUrlHandler.js';
import { ExtensionIdentifier } from '../../../platform/extensions/common/extensions.js';
import { ITrustedDomainService } from '../../contrib/url/browser/trustedDomainService.js';
import { readStaticTrustedDomains } from '../../contrib/url/browser/trustedDomains.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { IWebContentExtractorService } from '../../../platform/webContentExtractor/common/webContentExtractor.js';

class ExtensionUrlHandler implements IExtensionContributedURLHandler {

	constructor(
		private readonly proxy: ExtHostUrlsShape,
		private readonly handle: number,
		readonly extensionId: ExtensionIdentifier,
		readonly extensionDisplayName: string
	) { }

	handleURL(uri: URI, options?: IOpenURLOptions): Promise<boolean> {
		if (!ExtensionIdentifier.equals(this.extensionId, uri.authority)) {
			return Promise.resolve(false);
		}

		return Promise.resolve(this.proxy.$handleExternalUri(this.handle, uri)).then(() => true);
	}
}

@extHostNamedCustomer(MainContext.MainThreadUrls)
export class MainThreadUrls implements MainThreadUrlsShape {

	private readonly proxy: ExtHostUrlsShape;
	private handlers = new Map<number, { extensionId: ExtensionIdentifier; disposable: IDisposable }>();

	constructor(
		context: IExtHostContext,
		@ITrustedDomainService trustedDomainService: ITrustedDomainService,
		@IURLService private readonly urlService: IURLService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IWebContentExtractorService private readonly webContentExtractorService: IWebContentExtractorService,
		@IExtensionUrlHandler private readonly extensionUrlHandler: IExtensionUrlHandler
	) {
		this.proxy = context.getProxy(ExtHostContext.ExtHostUrls);
		trustedDomainService.onDidChangeTrustedDomains(() => this.handleTrustedDomainsChange());
		void this.handleTrustedDomainsChange();
	}

	$registerUriHandler(handle: number, extensionId: ExtensionIdentifier, extensionDisplayName: string): Promise<void> {
		const handler = new ExtensionUrlHandler(this.proxy, handle, extensionId, extensionDisplayName);
		const disposable = this.urlService.registerHandler(handler);

		this.handlers.set(handle, { extensionId, disposable });
		this.extensionUrlHandler.registerExtensionHandler(extensionId, handler);

		return Promise.resolve(undefined);
	}

	$unregisterUriHandler(handle: number): Promise<void> {
		const tuple = this.handlers.get(handle);

		if (!tuple) {
			return Promise.resolve(undefined);
		}

		const { extensionId, disposable } = tuple;

		this.extensionUrlHandler.unregisterExtensionHandler(extensionId);
		this.handlers.delete(handle);
		disposable.dispose();

		return Promise.resolve(undefined);
	}

	async $createAppUri(uri: UriComponents): Promise<URI> {
		return this.urlService.create(uri);
	}

	async handleTrustedDomainsChange() {
		const { defaultTrustedDomains, trustedDomains, } = this.instantiationService.invokeFunction(readStaticTrustedDomains);
		await this.proxy.$updateTrustedDomains([...defaultTrustedDomains, ...trustedDomains]);
	}

	async $extractExternalUris(uris: UriComponents[]): Promise<string[]> {
		const extractedUris = await this.webContentExtractorService.extract(uris.map(uri => URI.revive(uri)));
		return extractedUris;
	}

	dispose(): void {
		this.handlers.forEach(({ disposable }) => disposable.dispose());
		this.handlers.clear();
	}
}
