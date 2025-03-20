.
├── bootstrap-cli.ts
├── bootstrap-esm.ts
├── bootstrap-fork.ts
├── bootstrap-import.ts
├── bootstrap-meta.ts
├── bootstrap-node.ts
├── bootstrap-server.ts
├── bootstrap-window.ts
├── cli.ts
├── main.ts
├── server-cli.ts
├── server-main.ts
├── tsconfig.base.json
├── tsconfig.json
├── tsconfig.monaco.json
├── tsconfig.tsec.json
├── tsconfig.vscode-dts.json
├── tsconfig.vscode-proposed-dts.json
├── tsec.exemptions.json
├── typings
│   ├── base-common.d.ts
│   ├── crypto.d.ts
│   ├── editContext.d.ts
│   ├── thenable.d.ts
│   ├── vscode-globals-nls.d.ts
│   ├── vscode-globals-product.d.ts
│   └── vscode-globals-ttp.d.ts
├── vs
│   ├── amdX.ts
│   ├── base
│   │   ├── browser
│   │   │   ├── broadcast.ts
│   │   │   ├── browser.ts
│   │   │   ├── canIUse.ts
│   │   │   ├── contextmenu.ts
│   │   │   ├── cssValue.ts
│   │   │   ├── defaultWorkerFactory.ts
│   │   │   ├── deviceAccess.ts
│   │   │   ├── dnd.ts
│   │   │   ├── domImpl
│   │   │   │   ├── domObservable.ts
│   │   │   │   └── n.ts
│   │   │   ├── dompurify
│   │   │   │   ├── cgmanifest.json
│   │   │   │   └── dompurify.d.ts
│   │   │   ├── domStylesheets.ts
│   │   │   ├── dom.ts
│   │   │   ├── event.ts
│   │   │   ├── fastDomNode.ts
│   │   │   ├── fonts.ts
│   │   │   ├── formattedTextRenderer.ts
│   │   │   ├── globalPointerMoveMonitor.ts
│   │   │   ├── history.ts
│   │   │   ├── iframe.ts
│   │   │   ├── indexedDB.ts
│   │   │   ├── keyboardEvent.ts
│   │   │   ├── markdownRenderer.ts
│   │   │   ├── mouseEvent.ts
│   │   │   ├── performance.ts
│   │   │   ├── pixelRatio.ts
│   │   │   ├── touch.ts
│   │   │   ├── trustedTypes.ts
│   │   │   ├── ui
│   │   │   │   ├── actionbar
│   │   │   │   │   ├── actionbar.ts
│   │   │   │   │   └── actionViewItems.ts
│   │   │   │   ├── aria
│   │   │   │   │   └── aria.ts
│   │   │   │   ├── breadcrumbs
│   │   │   │   │   └── breadcrumbsWidget.ts
│   │   │   │   ├── button
│   │   │   │   │   └── button.ts
│   │   │   │   ├── centered
│   │   │   │   │   └── centeredViewLayout.ts
│   │   │   │   ├── codicons
│   │   │   │   │   └── codiconStyles.ts
│   │   │   │   ├── contextview
│   │   │   │   │   └── contextview.ts
│   │   │   │   ├── countBadge
│   │   │   │   │   └── countBadge.ts
│   │   │   │   ├── dialog
│   │   │   │   │   └── dialog.ts
│   │   │   │   ├── dnd
│   │   │   │   │   └── dnd.ts
│   │   │   │   ├── dropdown
│   │   │   │   │   ├── dropdownActionViewItem.ts
│   │   │   │   │   └── dropdown.ts
│   │   │   │   ├── findinput
│   │   │   │   │   ├── findInputToggles.ts
│   │   │   │   │   ├── findInput.ts
│   │   │   │   │   └── replaceInput.ts
│   │   │   │   ├── grid
│   │   │   │   │   ├── grid.ts
│   │   │   │   │   └── gridview.ts
│   │   │   │   ├── highlightedlabel
│   │   │   │   │   └── highlightedLabel.ts
│   │   │   │   ├── hover
│   │   │   │   │   ├── hoverDelegate2.ts
│   │   │   │   │   ├── hoverDelegateFactory.ts
│   │   │   │   │   ├── hoverDelegate.ts
│   │   │   │   │   ├── hover.ts
│   │   │   │   │   └── hoverWidget.ts
│   │   │   │   ├── iconLabel
│   │   │   │   │   ├── iconLabels.ts
│   │   │   │   │   ├── iconLabel.ts
│   │   │   │   │   └── simpleIconLabel.ts
│   │   │   │   ├── icons
│   │   │   │   │   └── iconSelectBox.ts
│   │   │   │   ├── inputbox
│   │   │   │   │   └── inputBox.ts
│   │   │   │   ├── keybindingLabel
│   │   │   │   │   └── keybindingLabel.ts
│   │   │   │   ├── list
│   │   │   │   │   ├── listPaging.ts
│   │   │   │   │   ├── list.ts
│   │   │   │   │   ├── listView.ts
│   │   │   │   │   ├── listWidget.ts
│   │   │   │   │   ├── rangeMap.ts
│   │   │   │   │   ├── rowCache.ts
│   │   │   │   │   └── splice.ts
│   │   │   │   ├── menu
│   │   │   │   │   ├── menubar.ts
│   │   │   │   │   └── menu.ts
│   │   │   │   ├── mouseCursor
│   │   │   │   │   └── mouseCursor.ts
│   │   │   │   ├── progressbar
│   │   │   │   │   ├── progressAccessibilitySignal.ts
│   │   │   │   │   └── progressbar.ts
│   │   │   │   ├── radio
│   │   │   │   │   └── radio.ts
│   │   │   │   ├── resizable
│   │   │   │   │   └── resizable.ts
│   │   │   │   ├── sash
│   │   │   │   │   └── sash.ts
│   │   │   │   ├── scrollbar
│   │   │   │   │   ├── abstractScrollbar.ts
│   │   │   │   │   ├── horizontalScrollbar.ts
│   │   │   │   │   ├── scrollableElementOptions.ts
│   │   │   │   │   ├── scrollableElement.ts
│   │   │   │   │   ├── scrollbarArrow.ts
│   │   │   │   │   ├── scrollbarState.ts
│   │   │   │   │   ├── scrollbarVisibilityController.ts
│   │   │   │   │   └── verticalScrollbar.ts
│   │   │   │   ├── selectBox
│   │   │   │   │   ├── selectBoxCustom.ts
│   │   │   │   │   ├── selectBoxNative.ts
│   │   │   │   │   └── selectBox.ts
│   │   │   │   ├── severityIcon
│   │   │   │   │   └── severityIcon.ts
│   │   │   │   ├── splitview
│   │   │   │   │   ├── paneview.ts
│   │   │   │   │   └── splitview.ts
│   │   │   │   ├── table
│   │   │   │   │   ├── table.ts
│   │   │   │   │   └── tableWidget.ts
│   │   │   │   ├── toggle
│   │   │   │   │   └── toggle.ts
│   │   │   │   ├── toolbar
│   │   │   │   │   └── toolbar.ts
│   │   │   │   ├── tree
│   │   │   │   │   ├── abstractTree.ts
│   │   │   │   │   ├── asyncDataTree.ts
│   │   │   │   │   ├── compressedObjectTreeModel.ts
│   │   │   │   │   ├── dataTree.ts
│   │   │   │   │   ├── indexTreeModel.ts
│   │   │   │   │   ├── indexTree.ts
│   │   │   │   │   ├── objectTreeModel.ts
│   │   │   │   │   ├── objectTree.ts
│   │   │   │   │   ├── treeDefaults.ts
│   │   │   │   │   └── tree.ts
│   │   │   │   └── widget.ts
│   │   │   └── window.ts
│   │   ├── common
│   │   │   ├── actions.ts
│   │   │   ├── arraysFind.ts
│   │   │   ├── arrays.ts
│   │   │   ├── assert.ts
│   │   │   ├── async.ts
│   │   │   ├── buffer.ts
│   │   │   ├── cache.ts
│   │   │   ├── cancellation.ts
│   │   │   ├── charCode.ts
│   │   │   ├── codecs
│   │   │   │   ├── asyncDecoder.ts
│   │   │   │   ├── baseDecoder.ts
│   │   │   │   └── types
│   │   │   │       └── ICodec.d.ts
│   │   │   ├── codiconsLibrary.ts
│   │   │   ├── codicons.ts
│   │   │   ├── codiconsUtil.ts
│   │   │   ├── collections.ts
│   │   │   ├── color.ts
│   │   │   ├── comparers.ts
│   │   │   ├── console.ts
│   │   │   ├── controlFlow.ts
│   │   │   ├── dataTransfer.ts
│   │   │   ├── date.ts
│   │   │   ├── decorators
│   │   │   │   └── cancelPreviousCalls.ts
│   │   │   ├── decorators.ts
│   │   │   ├── desktopEnvironmentInfo.ts
│   │   │   ├── diff
│   │   │   │   ├── diffChange.ts
│   │   │   │   └── diff.ts
│   │   │   ├── equals.ts
│   │   │   ├── errorMessage.ts
│   │   │   ├── errors.ts
│   │   │   ├── event.ts
│   │   │   ├── extpath.ts
│   │   │   ├── filters.ts
│   │   │   ├── functional.ts
│   │   │   ├── fuzzyScorer.ts
│   │   │   ├── glob.ts
│   │   │   ├── hash.ts
│   │   │   ├── hierarchicalKind.ts
│   │   │   ├── history.ts
│   │   │   ├── hotReloadHelpers.ts
│   │   │   ├── hotReload.ts
│   │   │   ├── htmlContent.ts
│   │   │   ├── iconLabels.ts
│   │   │   ├── idGenerator.ts
│   │   │   ├── ime.ts
│   │   │   ├── iterator.ts
│   │   │   ├── jsonc.ts
│   │   │   ├── jsonEdit.ts
│   │   │   ├── jsonErrorMessages.ts
│   │   │   ├── jsonFormatter.ts
│   │   │   ├── jsonSchema.ts
│   │   │   ├── json.ts
│   │   │   ├── keybindingLabels.ts
│   │   │   ├── keybindingParser.ts
│   │   │   ├── keybindings.ts
│   │   │   ├── keyCodes.ts
│   │   │   ├── labels.ts
│   │   │   ├── lazy.ts
│   │   │   ├── lifecycle.ts
│   │   │   ├── linkedList.ts
│   │   │   ├── linkedText.ts
│   │   │   ├── map.ts
│   │   │   ├── marked
│   │   │   │   ├── cgmanifest.json
│   │   │   │   └── marked.d.ts
│   │   │   ├── marshallingIds.ts
│   │   │   ├── marshalling.ts
│   │   │   ├── mime.ts
│   │   │   ├── naturalLanguage
│   │   │   │   └── korean.ts
│   │   │   ├── navigator.ts
│   │   │   ├── network.ts
│   │   │   ├── normalization.ts
│   │   │   ├── numbers.ts
│   │   │   ├── objectCache.ts
│   │   │   ├── objects.ts
│   │   │   ├── observableDisposable.ts
│   │   │   ├── observableInternal
│   │   │   │   ├── api.ts
│   │   │   │   ├── autorun.ts
│   │   │   │   ├── base.ts
│   │   │   │   ├── commonFacade
│   │   │   │   │   ├── cancellation.ts
│   │   │   │   │   └── deps.ts
│   │   │   │   ├── debugName.ts
│   │   │   │   ├── derived.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── lazyObservableValue.ts
│   │   │   │   ├── logging
│   │   │   │   │   ├── consoleObservableLogger.ts
│   │   │   │   │   ├── debugger
│   │   │   │   │   │   ├── debuggerApi.d.ts
│   │   │   │   │   │   ├── debuggerRpc.ts
│   │   │   │   │   │   ├── devToolsLogger.ts
│   │   │   │   │   │   ├── rpc.ts
│   │   │   │   │   │   └── utils.ts
│   │   │   │   │   └── logging.ts
│   │   │   │   ├── promise.ts
│   │   │   │   ├── utilsCancellation.ts
│   │   │   │   └── utils.ts
│   │   │   ├── observable.ts
│   │   │   ├── paging.ts
│   │   │   ├── parsers.ts
│   │   │   ├── path.ts
│   │   │   ├── performance.ts
│   │   │   ├── platform.ts
│   │   │   ├── ports.ts
│   │   │   ├── prefixTree.ts
│   │   │   ├── processes.ts
│   │   │   ├── process.ts
│   │   │   ├── product.ts
│   │   │   ├── range.ts
│   │   │   ├── resources.ts
│   │   │   ├── resourceTree.ts
│   │   │   ├── scrollable.ts
│   │   │   ├── search.ts
│   │   │   ├── semver
│   │   │   │   ├── cgmanifest.json
│   │   │   │   └── semver.d.ts
│   │   │   ├── sequence.ts
│   │   │   ├── severity.ts
│   │   │   ├── skipList.ts
│   │   │   ├── stopwatch.ts
│   │   │   ├── stream.ts
│   │   │   ├── strings.ts
│   │   │   ├── symbols.ts
│   │   │   ├── ternarySearchTree.ts
│   │   │   ├── tfIdf.ts
│   │   │   ├── themables.ts
│   │   │   ├── types.ts
│   │   │   ├── uint.ts
│   │   │   ├── uriIpc.ts
│   │   │   ├── uri.ts
│   │   │   ├── uuid.ts
│   │   │   ├── verifier.ts
│   │   │   └── worker
│   │   │       ├── simpleWorkerBootstrap.ts
│   │   │       └── simpleWorker.ts
│   │   ├── node
│   │   │   ├── crypto.ts
│   │   │   ├── extpath.ts
│   │   │   ├── id.ts
│   │   │   ├── macAddress.ts
│   │   │   ├── nls.ts
│   │   │   ├── nodeStreams.ts
│   │   │   ├── osDisplayProtocolInfo.ts
│   │   │   ├── osReleaseInfo.ts
│   │   │   ├── pfs.ts
│   │   │   ├── ports.ts
│   │   │   ├── powershell.ts
│   │   │   ├── processes.ts
│   │   │   ├── ps.ts
│   │   │   ├── shell.ts
│   │   │   ├── terminalEncoding.ts
│   │   │   ├── unc.ts
│   │   │   └── zip.ts
│   │   ├── parts
│   │   │   ├── contextmenu
│   │   │   │   ├── common
│   │   │   │   │   └── contextmenu.ts
│   │   │   │   ├── electron-main
│   │   │   │   │   └── contextmenu.ts
│   │   │   │   └── electron-sandbox
│   │   │   │       └── contextmenu.ts
│   │   │   ├── ipc
│   │   │   │   ├── browser
│   │   │   │   │   └── ipc.mp.ts
│   │   │   │   ├── common
│   │   │   │   │   ├── ipc.electron.ts
│   │   │   │   │   ├── ipc.mp.ts
│   │   │   │   │   ├── ipc.net.ts
│   │   │   │   │   └── ipc.ts
│   │   │   │   ├── electron-main
│   │   │   │   │   ├── ipc.electron.ts
│   │   │   │   │   ├── ipcMain.ts
│   │   │   │   │   └── ipc.mp.ts
│   │   │   │   ├── electron-sandbox
│   │   │   │   │   ├── ipc.electron.ts
│   │   │   │   │   └── ipc.mp.ts
│   │   │   │   ├── node
│   │   │   │   │   ├── ipc.cp.ts
│   │   │   │   │   ├── ipc.mp.ts
│   │   │   │   │   └── ipc.net.ts
│   │   │   │   └── test
│   │   │   │       └── node
│   │   │   │           ├── ipc.cp.integrationTest.ts
│   │   │   │           ├── testApp.ts
│   │   │   │           └── testService.ts
│   │   │   ├── request
│   │   │   │   └── common
│   │   │   │       ├── requestImpl.ts
│   │   │   │       └── request.ts
│   │   │   ├── sandbox
│   │   │   │   ├── common
│   │   │   │   │   ├── electronTypes.ts
│   │   │   │   │   └── sandboxTypes.ts
│   │   │   │   ├── electron-sandbox
│   │   │   │   │   ├── electronTypes.ts
│   │   │   │   │   ├── globals.ts
│   │   │   │   │   ├── preload-aux.ts
│   │   │   │   │   └── preload.ts
│   │   │   │   └── node
│   │   │   │       └── electronTypes.ts
│   │   │   └── storage
│   │   │       ├── common
│   │   │       │   └── storage.ts
│   │   │       ├── node
│   │   │       │   └── storage.ts
│   │   │       └── test
│   │   │           └── node
│   │   │               └── storage.integrationTest.ts
│   │   ├── test
│   │   │   ├── browser
│   │   │   │   └── ui
│   │   │   │       └── grid
│   │   │   │           └── util.ts
│   │   │   ├── common
│   │   │   │   ├── assertHeap.ts
│   │   │   │   ├── filters.perf.data.d.ts
│   │   │   │   ├── mock.ts
│   │   │   │   ├── snapshot.ts
│   │   │   │   ├── testUtils.ts
│   │   │   │   ├── timeTravelScheduler.ts
│   │   │   │   ├── troubleshooting.ts
│   │   │   │   └── utils.ts
│   │   │   └── node
│   │   │       ├── processes
│   │   │       │   ├── fixtures
│   │   │       │   │   ├── fork_large.ts
│   │   │       │   │   └── fork.ts
│   │   │       │   └── processes.integrationTest.ts
│   │   │       └── testUtils.ts
│   │   └── worker
│   │       └── workerMain.ts
│   ├── code
│   │   ├── browser
│   │   │   └── workbench
│   │   │       └── workbench.ts
│   │   ├── electron-main
│   │   │   ├── app.ts
│   │   │   └── main.ts
│   │   ├── electron-sandbox
│   │   │   ├── processExplorer
│   │   │   │   ├── processExplorerMain.ts
│   │   │   │   └── processExplorer.ts
│   │   │   └── workbench
│   │   │       └── workbench.ts
│   │   ├── electron-utility
│   │   │   └── sharedProcess
│   │   │       ├── contrib
│   │   │       │   ├── codeCacheCleaner.ts
│   │   │       │   ├── defaultExtensionsInitializer.ts
│   │   │       │   ├── extensions.ts
│   │   │       │   ├── languagePackCachedDataCleaner.ts
│   │   │       │   ├── localizationsUpdater.ts
│   │   │       │   ├── logsDataCleaner.ts
│   │   │       │   ├── storageDataCleaner.ts
│   │   │       │   └── userDataProfilesCleaner.ts
│   │   │       └── sharedProcessMain.ts
│   │   └── node
│   │       ├── cliProcessMain.ts
│   │       └── cli.ts
│   ├── editor
│   │   ├── browser
│   │   │   ├── config
│   │   │   │   ├── charWidthReader.ts
│   │   │   │   ├── domFontInfo.ts
│   │   │   │   ├── editorConfiguration.ts
│   │   │   │   ├── elementSizeObserver.ts
│   │   │   │   ├── fontMeasurements.ts
│   │   │   │   ├── migrateOptions.ts
│   │   │   │   └── tabFocus.ts
│   │   │   ├── controller
│   │   │   │   ├── editContext
│   │   │   │   │   ├── clipboardUtils.ts
│   │   │   │   │   ├── editContext.ts
│   │   │   │   │   ├── native
│   │   │   │   │   │   ├── debugEditContext.ts
│   │   │   │   │   │   ├── editContextFactory.ts
│   │   │   │   │   │   ├── nativeEditContextRegistry.ts
│   │   │   │   │   │   ├── nativeEditContext.ts
│   │   │   │   │   │   ├── nativeEditContextUtils.ts
│   │   │   │   │   │   └── screenReaderSupport.ts
│   │   │   │   │   ├── screenReaderUtils.ts
│   │   │   │   │   └── textArea
│   │   │   │   │       ├── textAreaEditContextInput.ts
│   │   │   │   │       ├── textAreaEditContextState.ts
│   │   │   │   │       └── textAreaEditContext.ts
│   │   │   │   ├── mouseHandler.ts
│   │   │   │   ├── mouseTarget.ts
│   │   │   │   └── pointerHandler.ts
│   │   │   ├── coreCommands.ts
│   │   │   ├── dnd.ts
│   │   │   ├── editorBrowser.ts
│   │   │   ├── editorDom.ts
│   │   │   ├── editorExtensions.ts
│   │   │   ├── gpu
│   │   │   │   ├── atlas
│   │   │   │   │   ├── atlas.ts
│   │   │   │   │   ├── textureAtlasPage.ts
│   │   │   │   │   ├── textureAtlasShelfAllocator.ts
│   │   │   │   │   ├── textureAtlasSlabAllocator.ts
│   │   │   │   │   └── textureAtlas.ts
│   │   │   │   ├── bufferDirtyTracker.ts
│   │   │   │   ├── contentSegmenter.ts
│   │   │   │   ├── css
│   │   │   │   │   ├── decorationCssRuleExtractor.ts
│   │   │   │   │   └── decorationStyleCache.ts
│   │   │   │   ├── gpuDisposable.ts
│   │   │   │   ├── gpu.ts
│   │   │   │   ├── gpuUtils.ts
│   │   │   │   ├── objectCollectionBuffer.ts
│   │   │   │   ├── raster
│   │   │   │   │   ├── glyphRasterizer.ts
│   │   │   │   │   └── raster.ts
│   │   │   │   ├── rectangleRenderer.ts
│   │   │   │   ├── rectangleRenderer.wgsl.ts
│   │   │   │   ├── renderStrategy
│   │   │   │   │   ├── baseRenderStrategy.ts
│   │   │   │   │   ├── fullFileRenderStrategy.ts
│   │   │   │   │   ├── fullFileRenderStrategy.wgsl.ts
│   │   │   │   │   └── viewportRenderStrategy.ts
│   │   │   │   ├── taskQueue.ts
│   │   │   │   └── viewGpuContext.ts
│   │   │   ├── observableCodeEditor.ts
│   │   │   ├── point.ts
│   │   │   ├── rect.ts
│   │   │   ├── services
│   │   │   │   ├── abstractCodeEditorService.ts
│   │   │   │   ├── bulkEditService.ts
│   │   │   │   ├── codeEditorService.ts
│   │   │   │   ├── editorWorkerService.ts
│   │   │   │   ├── hoverService
│   │   │   │   │   ├── hoverService.ts
│   │   │   │   │   ├── hoverWidget.ts
│   │   │   │   │   └── updatableHoverWidget.ts
│   │   │   │   ├── markerDecorations.ts
│   │   │   │   └── openerService.ts
│   │   │   ├── stableEditorScroll.ts
│   │   │   ├── view
│   │   │   │   ├── domLineBreaksComputer.ts
│   │   │   │   ├── dynamicViewOverlay.ts
│   │   │   │   ├── renderingContext.ts
│   │   │   │   ├── viewController.ts
│   │   │   │   ├── viewLayer.ts
│   │   │   │   ├── viewOverlays.ts
│   │   │   │   ├── viewPart.ts
│   │   │   │   └── viewUserInputEvents.ts
│   │   │   ├── viewParts
│   │   │   │   ├── blockDecorations
│   │   │   │   │   └── blockDecorations.ts
│   │   │   │   ├── contentWidgets
│   │   │   │   │   └── contentWidgets.ts
│   │   │   │   ├── currentLineHighlight
│   │   │   │   │   └── currentLineHighlight.ts
│   │   │   │   ├── decorations
│   │   │   │   │   └── decorations.ts
│   │   │   │   ├── editorScrollbar
│   │   │   │   │   └── editorScrollbar.ts
│   │   │   │   ├── glyphMargin
│   │   │   │   │   └── glyphMargin.ts
│   │   │   │   ├── gpuMark
│   │   │   │   │   └── gpuMark.ts
│   │   │   │   ├── indentGuides
│   │   │   │   │   └── indentGuides.ts
│   │   │   │   ├── lineNumbers
│   │   │   │   │   └── lineNumbers.ts
│   │   │   │   ├── linesDecorations
│   │   │   │   │   └── linesDecorations.ts
│   │   │   │   ├── margin
│   │   │   │   │   └── margin.ts
│   │   │   │   ├── marginDecorations
│   │   │   │   │   └── marginDecorations.ts
│   │   │   │   ├── minimap
│   │   │   │   │   ├── minimapCharRendererFactory.ts
│   │   │   │   │   ├── minimapCharRenderer.ts
│   │   │   │   │   ├── minimapCharSheet.ts
│   │   │   │   │   ├── minimapPreBaked.ts
│   │   │   │   │   └── minimap.ts
│   │   │   │   ├── overlayWidgets
│   │   │   │   │   └── overlayWidgets.ts
│   │   │   │   ├── overviewRuler
│   │   │   │   │   ├── decorationsOverviewRuler.ts
│   │   │   │   │   └── overviewRuler.ts
│   │   │   │   ├── rulers
│   │   │   │   │   └── rulers.ts
│   │   │   │   ├── rulersGpu
│   │   │   │   │   └── rulersGpu.ts
│   │   │   │   ├── scrollDecoration
│   │   │   │   │   └── scrollDecoration.ts
│   │   │   │   ├── selections
│   │   │   │   │   └── selections.ts
│   │   │   │   ├── viewCursors
│   │   │   │   │   ├── viewCursors.ts
│   │   │   │   │   └── viewCursor.ts
│   │   │   │   ├── viewLines
│   │   │   │   │   ├── domReadingContext.ts
│   │   │   │   │   ├── rangeUtil.ts
│   │   │   │   │   ├── viewLineOptions.ts
│   │   │   │   │   ├── viewLines.ts
│   │   │   │   │   └── viewLine.ts
│   │   │   │   ├── viewLinesGpu
│   │   │   │   │   └── viewLinesGpu.ts
│   │   │   │   ├── viewZones
│   │   │   │   │   └── viewZones.ts
│   │   │   │   └── whitespace
│   │   │   │       └── whitespace.ts
│   │   │   ├── view.ts
│   │   │   └── widget
│   │   │       ├── codeEditor
│   │   │       │   ├── codeEditorContributions.ts
│   │   │       │   ├── codeEditorWidget.ts
│   │   │       │   └── embeddedCodeEditorWidget.ts
│   │   │       ├── diffEditor
│   │   │       │   ├── commands.ts
│   │   │       │   ├── components
│   │   │       │   │   ├── accessibleDiffViewer.ts
│   │   │       │   │   ├── diffEditorDecorations.ts
│   │   │       │   │   ├── diffEditorEditors.ts
│   │   │       │   │   ├── diffEditorSash.ts
│   │   │       │   │   └── diffEditorViewZones
│   │   │       │   │       ├── diffEditorViewZones.ts
│   │   │       │   │       ├── inlineDiffDeletedCodeMargin.ts
│   │   │       │   │       └── renderLines.ts
│   │   │       │   ├── delegatingEditorImpl.ts
│   │   │       │   ├── diffEditor.contribution.ts
│   │   │       │   ├── diffEditorOptions.ts
│   │   │       │   ├── diffEditorViewModel.ts
│   │   │       │   ├── diffEditorWidget.ts
│   │   │       │   ├── diffProviderFactoryService.ts
│   │   │       │   ├── embeddedDiffEditorWidget.ts
│   │   │       │   ├── features
│   │   │       │   │   ├── gutterFeature.ts
│   │   │       │   │   ├── hideUnchangedRegionsFeature.ts
│   │   │       │   │   ├── movedBlocksLinesFeature.ts
│   │   │       │   │   ├── overviewRulerFeature.ts
│   │   │       │   │   └── revertButtonsFeature.ts
│   │   │       │   ├── registrations.contribution.ts
│   │   │       │   ├── utils
│   │   │       │   │   └── editorGutter.ts
│   │   │       │   └── utils.ts
│   │   │       ├── markdownRenderer
│   │   │       │   └── browser
│   │   │       │       └── markdownRenderer.ts
│   │   │       └── multiDiffEditor
│   │   │           ├── colors.ts
│   │   │           ├── diffEditorItemTemplate.ts
│   │   │           ├── model.ts
│   │   │           ├── multiDiffEditorViewModel.ts
│   │   │           ├── multiDiffEditorWidgetImpl.ts
│   │   │           ├── multiDiffEditorWidget.ts
│   │   │           ├── objectPool.ts
│   │   │           ├── utils.ts
│   │   │           └── workbenchUIElementFactory.ts
│   │   ├── common
│   │   │   ├── codecs
│   │   │   │   ├── baseToken.ts
│   │   │   │   ├── linesCodec
│   │   │   │   │   ├── linesDecoder.ts
│   │   │   │   │   └── tokens
│   │   │   │   │       ├── carriageReturn.ts
│   │   │   │   │       ├── line.ts
│   │   │   │   │       └── newLine.ts
│   │   │   │   ├── markdownCodec
│   │   │   │   │   ├── markdownDecoder.ts
│   │   │   │   │   ├── parsers
│   │   │   │   │   │   ├── markdownComment.ts
│   │   │   │   │   │   ├── markdownImage.ts
│   │   │   │   │   │   └── markdownLink.ts
│   │   │   │   │   └── tokens
│   │   │   │   │       ├── markdownComment.ts
│   │   │   │   │       ├── markdownImage.ts
│   │   │   │   │       ├── markdownLink.ts
│   │   │   │   │       └── markdownToken.ts
│   │   │   │   └── simpleCodec
│   │   │   │       ├── parserBase.ts
│   │   │   │       ├── simpleDecoder.ts
│   │   │   │       └── tokens
│   │   │   │           ├── angleBrackets.ts
│   │   │   │           ├── brackets.ts
│   │   │   │           ├── colon.ts
│   │   │   │           ├── dash.ts
│   │   │   │           ├── exclamationMark.ts
│   │   │   │           ├── formFeed.ts
│   │   │   │           ├── hash.ts
│   │   │   │           ├── parentheses.ts
│   │   │   │           ├── space.ts
│   │   │   │           ├── tab.ts
│   │   │   │           ├── verticalTab.ts
│   │   │   │           └── word.ts
│   │   │   ├── commands
│   │   │   │   ├── replaceCommand.ts
│   │   │   │   ├── shiftCommand.ts
│   │   │   │   ├── surroundSelectionCommand.ts
│   │   │   │   └── trimTrailingWhitespaceCommand.ts
│   │   │   ├── config
│   │   │   │   ├── diffEditor.ts
│   │   │   │   ├── editorConfigurationSchema.ts
│   │   │   │   ├── editorConfiguration.ts
│   │   │   │   ├── editorOptions.ts
│   │   │   │   ├── editorZoom.ts
│   │   │   │   └── fontInfo.ts
│   │   │   ├── core
│   │   │   │   ├── characterClassifier.ts
│   │   │   │   ├── cursorColumns.ts
│   │   │   │   ├── dimension.ts
│   │   │   │   ├── editOperation.ts
│   │   │   │   ├── editorColorRegistry.ts
│   │   │   │   ├── eolCounter.ts
│   │   │   │   ├── indentation.ts
│   │   │   │   ├── lineEdit.ts
│   │   │   │   ├── lineRange.ts
│   │   │   │   ├── offsetEdit.ts
│   │   │   │   ├── offsetRange.ts
│   │   │   │   ├── positionToOffset.ts
│   │   │   │   ├── position.ts
│   │   │   │   ├── rangeMapping.ts
│   │   │   │   ├── range.ts
│   │   │   │   ├── rgba.ts
│   │   │   │   ├── selection.ts
│   │   │   │   ├── stringBuilder.ts
│   │   │   │   ├── textChange.ts
│   │   │   │   ├── textEdit.ts
│   │   │   │   ├── textLength.ts
│   │   │   │   ├── textModelDefaults.ts
│   │   │   │   ├── wordCharacterClassifier.ts
│   │   │   │   └── wordHelper.ts
│   │   │   ├── cursor
│   │   │   │   ├── cursorAtomicMoveOperations.ts
│   │   │   │   ├── cursorCollection.ts
│   │   │   │   ├── cursorColumnSelection.ts
│   │   │   │   ├── cursorContext.ts
│   │   │   │   ├── cursorDeleteOperations.ts
│   │   │   │   ├── cursorMoveCommands.ts
│   │   │   │   ├── cursorMoveOperations.ts
│   │   │   │   ├── cursor.ts
│   │   │   │   ├── cursorTypeEditOperations.ts
│   │   │   │   ├── cursorTypeOperations.ts
│   │   │   │   ├── cursorWordOperations.ts
│   │   │   │   └── oneCursor.ts
│   │   │   ├── cursorCommon.ts
│   │   │   ├── cursorEvents.ts
│   │   │   ├── diff
│   │   │   │   ├── defaultLinesDiffComputer
│   │   │   │   │   ├── algorithms
│   │   │   │   │   │   ├── diffAlgorithm.ts
│   │   │   │   │   │   ├── dynamicProgrammingDiffing.ts
│   │   │   │   │   │   └── myersDiffAlgorithm.ts
│   │   │   │   │   ├── computeMovedLines.ts
│   │   │   │   │   ├── defaultLinesDiffComputer.ts
│   │   │   │   │   ├── heuristicSequenceOptimizations.ts
│   │   │   │   │   ├── lineSequence.ts
│   │   │   │   │   ├── linesSliceCharSequence.ts
│   │   │   │   │   └── utils.ts
│   │   │   │   ├── documentDiffProvider.ts
│   │   │   │   ├── legacyLinesDiffComputer.ts
│   │   │   │   ├── linesDiffComputers.ts
│   │   │   │   ├── linesDiffComputer.ts
│   │   │   │   └── rangeMapping.ts
│   │   │   ├── editorAction.ts
│   │   │   ├── editorCommon.ts
│   │   │   ├── editorContextKeys.ts
│   │   │   ├── editorFeatures.ts
│   │   │   ├── editorTheme.ts
│   │   │   ├── encodedTokenAttributes.ts
│   │   │   ├── inputMode.ts
│   │   │   ├── languageFeatureRegistry.ts
│   │   │   ├── languages
│   │   │   │   ├── autoIndent.ts
│   │   │   │   ├── defaultDocumentColorsComputer.ts
│   │   │   │   ├── enterAction.ts
│   │   │   │   ├── languageConfigurationRegistry.ts
│   │   │   │   ├── languageConfiguration.ts
│   │   │   │   ├── language.ts
│   │   │   │   ├── linkComputer.ts
│   │   │   │   ├── modesRegistry.ts
│   │   │   │   ├── nullTokenize.ts
│   │   │   │   ├── supports
│   │   │   │   │   ├── characterPair.ts
│   │   │   │   │   ├── electricCharacter.ts
│   │   │   │   │   ├── indentationLineProcessor.ts
│   │   │   │   │   ├── indentRules.ts
│   │   │   │   │   ├── inplaceReplaceSupport.ts
│   │   │   │   │   ├── languageBracketsConfiguration.ts
│   │   │   │   │   ├── onEnter.ts
│   │   │   │   │   ├── richEditBrackets.ts
│   │   │   │   │   └── tokenization.ts
│   │   │   │   ├── supports.ts
│   │   │   │   └── textToHtmlTokenizer.ts
│   │   │   ├── languageSelector.ts
│   │   │   ├── languages.ts
│   │   │   ├── model
│   │   │   │   ├── bracketPairsTextModelPart
│   │   │   │   │   ├── bracketPairsImpl.ts
│   │   │   │   │   ├── bracketPairsTree
│   │   │   │   │   │   ├── ast.ts
│   │   │   │   │   │   ├── beforeEditPositionMapper.ts
│   │   │   │   │   │   ├── bracketPairsTree.ts
│   │   │   │   │   │   ├── brackets.ts
│   │   │   │   │   │   ├── combineTextEditInfos.ts
│   │   │   │   │   │   ├── concat23Trees.ts
│   │   │   │   │   │   ├── length.ts
│   │   │   │   │   │   ├── nodeReader.ts
│   │   │   │   │   │   ├── parser.ts
│   │   │   │   │   │   ├── smallImmutableSet.ts
│   │   │   │   │   │   └── tokenizer.ts
│   │   │   │   │   ├── colorizedBracketPairsDecorationProvider.ts
│   │   │   │   │   └── fixBrackets.ts
│   │   │   │   ├── decorationProvider.ts
│   │   │   │   ├── editStack.ts
│   │   │   │   ├── fixedArray.ts
│   │   │   │   ├── guidesTextModelPart.ts
│   │   │   │   ├── indentationGuesser.ts
│   │   │   │   ├── intervalTree.ts
│   │   │   │   ├── mirrorTextModel.ts
│   │   │   │   ├── pieceTreeTextBuffer
│   │   │   │   │   ├── pieceTreeBase.ts
│   │   │   │   │   ├── pieceTreeTextBufferBuilder.ts
│   │   │   │   │   ├── pieceTreeTextBuffer.ts
│   │   │   │   │   └── rbTreeBase.ts
│   │   │   │   ├── prefixSumComputer.ts
│   │   │   │   ├── textModelOffsetEdit.ts
│   │   │   │   ├── textModelPart.ts
│   │   │   │   ├── textModelSearch.ts
│   │   │   │   ├── textModelText.ts
│   │   │   │   ├── textModelTokens.ts
│   │   │   │   ├── textModel.ts
│   │   │   │   ├── tokenizationTextModelPart.ts
│   │   │   │   ├── tokenStore.ts
│   │   │   │   ├── tokens.ts
│   │   │   │   ├── treeSitterTokenStoreService.ts
│   │   │   │   ├── treeSitterTokens.ts
│   │   │   │   └── utils.ts
│   │   │   ├── modelLineProjectionData.ts
│   │   │   ├── model.ts
│   │   │   ├── services
│   │   │   │   ├── editorBaseApi.ts
│   │   │   │   ├── editorSimpleWorkerMain.ts
│   │   │   │   ├── editorSimpleWorker.ts
│   │   │   │   ├── editorWorkerBootstrap.ts
│   │   │   │   ├── editorWorkerHost.ts
│   │   │   │   ├── editorWorker.ts
│   │   │   │   ├── findSectionHeaders.ts
│   │   │   │   ├── getIconClasses.ts
│   │   │   │   ├── languageFeatureDebounce.ts
│   │   │   │   ├── languageFeaturesService.ts
│   │   │   │   ├── languageFeatures.ts
│   │   │   │   ├── languagesAssociations.ts
│   │   │   │   ├── languageService.ts
│   │   │   │   ├── languagesRegistry.ts
│   │   │   │   ├── markerDecorationsService.ts
│   │   │   │   ├── markerDecorations.ts
│   │   │   │   ├── modelService.ts
│   │   │   │   ├── model.ts
│   │   │   │   ├── modelUndoRedoParticipant.ts
│   │   │   │   ├── resolverService.ts
│   │   │   │   ├── semanticTokensDto.ts
│   │   │   │   ├── semanticTokensProviderStyling.ts
│   │   │   │   ├── semanticTokensStylingService.ts
│   │   │   │   ├── semanticTokensStyling.ts
│   │   │   │   ├── textModelSync
│   │   │   │   │   ├── textModelSync.impl.ts
│   │   │   │   │   └── textModelSync.protocol.ts
│   │   │   │   ├── textResourceConfigurationService.ts
│   │   │   │   ├── textResourceConfiguration.ts
│   │   │   │   ├── treeSitter
│   │   │   │   │   ├── cursorUtils.ts
│   │   │   │   │   └── treeSitterParserService.ts
│   │   │   │   ├── treeSitterParserService.ts
│   │   │   │   ├── treeViewsDndService.ts
│   │   │   │   ├── treeViewsDnd.ts
│   │   │   │   └── unicodeTextModelHighlighter.ts
│   │   │   ├── standalone
│   │   │   │   └── standaloneEnums.ts
│   │   │   ├── standaloneStrings.ts
│   │   │   ├── textModelBracketPairs.ts
│   │   │   ├── textModelEvents.ts
│   │   │   ├── textModelGuides.ts
│   │   │   ├── tokenizationRegistry.ts
│   │   │   ├── tokenizationTextModelPart.ts
│   │   │   ├── tokens
│   │   │   │   ├── contiguousMultilineTokensBuilder.ts
│   │   │   │   ├── contiguousMultilineTokens.ts
│   │   │   │   ├── contiguousTokensEditing.ts
│   │   │   │   ├── contiguousTokensStore.ts
│   │   │   │   ├── lineTokens.ts
│   │   │   │   ├── sparseMultilineTokens.ts
│   │   │   │   ├── sparseTokensStore.ts
│   │   │   │   └── tokenArray.ts
│   │   │   ├── viewEventHandler.ts
│   │   │   ├── viewEvents.ts
│   │   │   ├── viewLayout
│   │   │   │   ├── lineDecorations.ts
│   │   │   │   ├── linePart.ts
│   │   │   │   ├── linesLayout.ts
│   │   │   │   ├── viewLayout.ts
│   │   │   │   ├── viewLineRenderer.ts
│   │   │   │   └── viewLinesViewportData.ts
│   │   │   ├── viewModel
│   │   │   │   ├── glyphLanesModel.ts
│   │   │   │   ├── minimapTokensColorTracker.ts
│   │   │   │   ├── modelLineProjection.ts
│   │   │   │   ├── monospaceLineBreaksComputer.ts
│   │   │   │   ├── overviewZoneManager.ts
│   │   │   │   ├── viewContext.ts
│   │   │   │   ├── viewModelDecorations.ts
│   │   │   │   ├── viewModelImpl.ts
│   │   │   │   └── viewModelLines.ts
│   │   │   ├── viewModelEventDispatcher.ts
│   │   │   └── viewModel.ts
│   │   ├── contrib
│   │   │   ├── anchorSelect
│   │   │   │   └── browser
│   │   │   │       └── anchorSelect.ts
│   │   │   ├── bracketMatching
│   │   │   │   └── browser
│   │   │   │       └── bracketMatching.ts
│   │   │   ├── caretOperations
│   │   │   │   └── browser
│   │   │   │       ├── caretOperations.ts
│   │   │   │       ├── moveCaretCommand.ts
│   │   │   │       └── transpose.ts
│   │   │   ├── clipboard
│   │   │   │   └── browser
│   │   │   │       └── clipboard.ts
│   │   │   ├── codeAction
│   │   │   │   ├── browser
│   │   │   │   │   ├── codeActionCommands.ts
│   │   │   │   │   ├── codeActionContributions.ts
│   │   │   │   │   ├── codeActionController.ts
│   │   │   │   │   ├── codeActionKeybindingResolver.ts
│   │   │   │   │   ├── codeActionMenu.ts
│   │   │   │   │   ├── codeActionModel.ts
│   │   │   │   │   ├── codeAction.ts
│   │   │   │   │   └── lightBulbWidget.ts
│   │   │   │   └── common
│   │   │   │       └── types.ts
│   │   │   ├── codelens
│   │   │   │   └── browser
│   │   │   │       ├── codeLensCache.ts
│   │   │   │       ├── codelensController.ts
│   │   │   │       ├── codelens.ts
│   │   │   │       └── codelensWidget.ts
│   │   │   ├── colorPicker
│   │   │   │   └── browser
│   │   │   │       ├── colorDetector.ts
│   │   │   │       ├── colorPickerContribution.ts
│   │   │   │       ├── colorPickerModel.ts
│   │   │   │       ├── colorPickerParticipantUtils.ts
│   │   │   │       ├── colorPickerParts
│   │   │   │       │   ├── colorPickerBody.ts
│   │   │   │       │   ├── colorPickerCloseButton.ts
│   │   │   │       │   ├── colorPickerHeader.ts
│   │   │   │       │   ├── colorPickerInsertButton.ts
│   │   │   │       │   ├── colorPickerSaturationBox.ts
│   │   │   │       │   └── colorPickerStrip.ts
│   │   │   │       ├── colorPickerWidget.ts
│   │   │   │       ├── color.ts
│   │   │   │       ├── defaultDocumentColorProvider.ts
│   │   │   │       ├── hoverColorPicker
│   │   │   │       │   ├── hoverColorPickerContribution.ts
│   │   │   │       │   ├── hoverColorPickerParticipant.ts
│   │   │   │       │   └── hoverColorPicker.ts
│   │   │   │       └── standaloneColorPicker
│   │   │   │           ├── standaloneColorPickerActions.ts
│   │   │   │           ├── standaloneColorPickerController.ts
│   │   │   │           ├── standaloneColorPickerParticipant.ts
│   │   │   │           └── standaloneColorPickerWidget.ts
│   │   │   ├── comment
│   │   │   │   └── browser
│   │   │   │       ├── blockCommentCommand.ts
│   │   │   │       ├── comment.ts
│   │   │   │       └── lineCommentCommand.ts
│   │   │   ├── contextmenu
│   │   │   │   └── browser
│   │   │   │       └── contextmenu.ts
│   │   │   ├── cursorUndo
│   │   │   │   └── browser
│   │   │   │       └── cursorUndo.ts
│   │   │   ├── diffEditorBreadcrumbs
│   │   │   │   └── browser
│   │   │   │       └── contribution.ts
│   │   │   ├── dnd
│   │   │   │   └── browser
│   │   │   │       ├── dnd.ts
│   │   │   │       └── dragAndDropCommand.ts
│   │   │   ├── documentSymbols
│   │   │   │   └── browser
│   │   │   │       ├── documentSymbols.ts
│   │   │   │       └── outlineModel.ts
│   │   │   ├── dropOrPasteInto
│   │   │   │   └── browser
│   │   │   │       ├── copyPasteContribution.ts
│   │   │   │       ├── copyPasteController.ts
│   │   │   │       ├── defaultProviders.ts
│   │   │   │       ├── dropIntoEditorContribution.ts
│   │   │   │       ├── dropIntoEditorController.ts
│   │   │   │       ├── edit.ts
│   │   │   │       └── postEditWidget.ts
│   │   │   ├── editorState
│   │   │   │   └── browser
│   │   │   │       ├── editorState.ts
│   │   │   │       └── keybindingCancellation.ts
│   │   │   ├── find
│   │   │   │   └── browser
│   │   │   │       ├── findController.ts
│   │   │   │       ├── findDecorations.ts
│   │   │   │       ├── findModel.ts
│   │   │   │       ├── findOptionsWidget.ts
│   │   │   │       ├── findState.ts
│   │   │   │       ├── findWidgetSearchHistory.ts
│   │   │   │       ├── findWidget.ts
│   │   │   │       ├── replaceAllCommand.ts
│   │   │   │       ├── replacePattern.ts
│   │   │   │       └── replaceWidgetHistory.ts
│   │   │   ├── folding
│   │   │   │   └── browser
│   │   │   │       ├── foldingDecorations.ts
│   │   │   │       ├── foldingModel.ts
│   │   │   │       ├── foldingRanges.ts
│   │   │   │       ├── folding.ts
│   │   │   │       ├── hiddenRangeModel.ts
│   │   │   │       ├── indentRangeProvider.ts
│   │   │   │       └── syntaxRangeProvider.ts
│   │   │   ├── fontZoom
│   │   │   │   └── browser
│   │   │   │       └── fontZoom.ts
│   │   │   ├── format
│   │   │   │   └── browser
│   │   │   │       ├── formatActions.ts
│   │   │   │       ├── formattingEdit.ts
│   │   │   │       └── format.ts
│   │   │   ├── gotoError
│   │   │   │   └── browser
│   │   │   │       ├── gotoError.ts
│   │   │   │       ├── gotoErrorWidget.ts
│   │   │   │       └── markerNavigationService.ts
│   │   │   ├── gotoSymbol
│   │   │   │   └── browser
│   │   │   │       ├── goToCommands.ts
│   │   │   │       ├── goToSymbol.ts
│   │   │   │       ├── link
│   │   │   │       │   ├── clickLinkGesture.ts
│   │   │   │       │   └── goToDefinitionAtPosition.ts
│   │   │   │       ├── peek
│   │   │   │       │   ├── referencesController.ts
│   │   │   │       │   ├── referencesTree.ts
│   │   │   │       │   └── referencesWidget.ts
│   │   │   │       ├── referencesModel.ts
│   │   │   │       └── symbolNavigation.ts
│   │   │   ├── gpu
│   │   │   │   └── browser
│   │   │   │       └── gpuActions.ts
│   │   │   ├── hover
│   │   │   │   └── browser
│   │   │   │       ├── contentHoverComputer.ts
│   │   │   │       ├── contentHoverController.ts
│   │   │   │       ├── contentHoverRendered.ts
│   │   │   │       ├── contentHoverStatusBar.ts
│   │   │   │       ├── contentHoverTypes.ts
│   │   │   │       ├── contentHoverWidget.ts
│   │   │   │       ├── contentHoverWidgetWrapper.ts
│   │   │   │       ├── getHover.ts
│   │   │   │       ├── glyphHoverComputer.ts
│   │   │   │       ├── glyphHoverController.ts
│   │   │   │       ├── glyphHoverWidget.ts
│   │   │   │       ├── hoverAccessibleViews.ts
│   │   │   │       ├── hoverActionIds.ts
│   │   │   │       ├── hoverActions.ts
│   │   │   │       ├── hoverContribution.ts
│   │   │   │       ├── hoverOperation.ts
│   │   │   │       ├── hoverTypes.ts
│   │   │   │       ├── hoverUtils.ts
│   │   │   │       ├── markdownHoverParticipant.ts
│   │   │   │       ├── markerHoverParticipant.ts
│   │   │   │       └── resizableContentWidget.ts
│   │   │   ├── indentation
│   │   │   │   ├── browser
│   │   │   │   │   └── indentation.ts
│   │   │   │   └── common
│   │   │   │       ├── indentation.ts
│   │   │   │       └── indentUtils.ts
│   │   │   ├── inlayHints
│   │   │   │   └── browser
│   │   │   │       ├── inlayHintsContribution.ts
│   │   │   │       ├── inlayHintsController.ts
│   │   │   │       ├── inlayHintsHover.ts
│   │   │   │       ├── inlayHintsLocations.ts
│   │   │   │       └── inlayHints.ts
│   │   │   ├── inlineCompletions
│   │   │   │   ├── browser
│   │   │   │   │   ├── controller
│   │   │   │   │   │   ├── commandIds.ts
│   │   │   │   │   │   ├── commands.ts
│   │   │   │   │   │   ├── inlineCompletionContextKeys.ts
│   │   │   │   │   │   └── inlineCompletionsController.ts
│   │   │   │   │   ├── hintsWidget
│   │   │   │   │   │   ├── hoverParticipant.ts
│   │   │   │   │   │   └── inlineCompletionsHintsWidget.ts
│   │   │   │   │   ├── inlineCompletionsAccessibleView.ts
│   │   │   │   │   ├── inlineCompletions.contribution.ts
│   │   │   │   │   ├── model
│   │   │   │   │   │   ├── animation.ts
│   │   │   │   │   │   ├── changeRecorder.ts
│   │   │   │   │   │   ├── computeGhostText.ts
│   │   │   │   │   │   ├── ghostText.ts
│   │   │   │   │   │   ├── inlineCompletionsModel.ts
│   │   │   │   │   │   ├── inlineCompletionsSource.ts
│   │   │   │   │   │   ├── inlineEditsAdapter.ts
│   │   │   │   │   │   ├── inlineEdit.ts
│   │   │   │   │   │   ├── provideInlineCompletions.ts
│   │   │   │   │   │   ├── singleTextEditHelpers.ts
│   │   │   │   │   │   └── suggestWidgetAdapter.ts
│   │   │   │   │   ├── structuredLogger.ts
│   │   │   │   │   ├── utils.ts
│   │   │   │   │   └── view
│   │   │   │   │       ├── ghostText
│   │   │   │   │       │   └── ghostTextView.ts
│   │   │   │   │       ├── inlineCompletionsView.ts
│   │   │   │   │       └── inlineEdits
│   │   │   │   │           ├── components
│   │   │   │   │           │   ├── gutterIndicatorMenu.ts
│   │   │   │   │           │   ├── gutterIndicatorView.ts
│   │   │   │   │           │   └── indicatorView.ts
│   │   │   │   │           ├── inlineEditsModel.ts
│   │   │   │   │           ├── inlineEditsViewInterface.ts
│   │   │   │   │           ├── inlineEditsViewProducer.ts
│   │   │   │   │           ├── inlineEditsViews
│   │   │   │   │           │   ├── debugVisualization.ts
│   │   │   │   │           │   ├── inlineEditsDeletionView.ts
│   │   │   │   │           │   ├── inlineEditsInsertionView.ts
│   │   │   │   │           │   ├── inlineEditsLineReplacementView.ts
│   │   │   │   │           │   ├── inlineEditsSideBySideView.ts
│   │   │   │   │           │   ├── inlineEditsWordInsertView.ts
│   │   │   │   │           │   ├── inlineEditsWordReplacementView.ts
│   │   │   │   │           │   └── originalEditorInlineDiffView.ts
│   │   │   │   │           ├── inlineEditsView.ts
│   │   │   │   │           ├── inlineEditWithChanges.ts
│   │   │   │   │           ├── theme.ts
│   │   │   │   │           └── utils
│   │   │   │   │               └── utils.ts
│   │   │   │   └── test
│   │   │   │       └── browser
│   │   │   │           └── utils.ts
│   │   │   ├── inlineProgress
│   │   │   │   └── browser
│   │   │   │       └── inlineProgress.ts
│   │   │   ├── inPlaceReplace
│   │   │   │   └── browser
│   │   │   │       ├── inPlaceReplaceCommand.ts
│   │   │   │       └── inPlaceReplace.ts
│   │   │   ├── insertFinalNewLine
│   │   │   │   └── browser
│   │   │   │       ├── insertFinalNewLineCommand.ts
│   │   │   │       └── insertFinalNewLine.ts
│   │   │   ├── lineSelection
│   │   │   │   └── browser
│   │   │   │       └── lineSelection.ts
│   │   │   ├── linesOperations
│   │   │   │   └── browser
│   │   │   │       ├── copyLinesCommand.ts
│   │   │   │       ├── linesOperations.ts
│   │   │   │       ├── moveLinesCommand.ts
│   │   │   │       └── sortLinesCommand.ts
│   │   │   ├── linkedEditing
│   │   │   │   └── browser
│   │   │   │       └── linkedEditing.ts
│   │   │   ├── links
│   │   │   │   └── browser
│   │   │   │       ├── getLinks.ts
│   │   │   │       └── links.ts
│   │   │   ├── longLinesHelper
│   │   │   │   └── browser
│   │   │   │       └── longLinesHelper.ts
│   │   │   ├── message
│   │   │   │   └── browser
│   │   │   │       └── messageController.ts
│   │   │   ├── multicursor
│   │   │   │   └── browser
│   │   │   │       └── multicursor.ts
│   │   │   ├── parameterHints
│   │   │   │   └── browser
│   │   │   │       ├── parameterHintsModel.ts
│   │   │   │       ├── parameterHints.ts
│   │   │   │       ├── parameterHintsWidget.ts
│   │   │   │       └── provideSignatureHelp.ts
│   │   │   ├── peekView
│   │   │   │   └── browser
│   │   │   │       └── peekView.ts
│   │   │   ├── placeholderText
│   │   │   │   └── browser
│   │   │   │       ├── placeholderText.contribution.ts
│   │   │   │       └── placeholderTextContribution.ts
│   │   │   ├── quickAccess
│   │   │   │   └── browser
│   │   │   │       ├── commandsQuickAccess.ts
│   │   │   │       ├── editorNavigationQuickAccess.ts
│   │   │   │       ├── gotoLineQuickAccess.ts
│   │   │   │       └── gotoSymbolQuickAccess.ts
│   │   │   ├── readOnlyMessage
│   │   │   │   └── browser
│   │   │   │       └── contribution.ts
│   │   │   ├── rename
│   │   │   │   └── browser
│   │   │   │       ├── rename.ts
│   │   │   │       └── renameWidget.ts
│   │   │   ├── sectionHeaders
│   │   │   │   └── browser
│   │   │   │       └── sectionHeaders.ts
│   │   │   ├── semanticTokens
│   │   │   │   ├── browser
│   │   │   │   │   ├── documentSemanticTokens.ts
│   │   │   │   │   └── viewportSemanticTokens.ts
│   │   │   │   └── common
│   │   │   │       ├── getSemanticTokens.ts
│   │   │   │       └── semanticTokensConfig.ts
│   │   │   ├── smartSelect
│   │   │   │   └── browser
│   │   │   │       ├── bracketSelections.ts
│   │   │   │       ├── smartSelect.ts
│   │   │   │       └── wordSelections.ts
│   │   │   ├── snippet
│   │   │   │   └── browser
│   │   │   │       ├── snippetController2.ts
│   │   │   │       ├── snippetParser.ts
│   │   │   │       ├── snippetSession.ts
│   │   │   │       └── snippetVariables.ts
│   │   │   ├── stickyScroll
│   │   │   │   └── browser
│   │   │   │       ├── stickyScrollActions.ts
│   │   │   │       ├── stickyScrollContribution.ts
│   │   │   │       ├── stickyScrollController.ts
│   │   │   │       ├── stickyScrollElement.ts
│   │   │   │       ├── stickyScrollModelProvider.ts
│   │   │   │       ├── stickyScrollProvider.ts
│   │   │   │       └── stickyScrollWidget.ts
│   │   │   ├── suggest
│   │   │   │   └── browser
│   │   │   │       ├── completionModel.ts
│   │   │   │       ├── suggestAlternatives.ts
│   │   │   │       ├── suggestCommitCharacters.ts
│   │   │   │       ├── suggestController.ts
│   │   │   │       ├── suggestInlineCompletions.ts
│   │   │   │       ├── suggestMemory.ts
│   │   │   │       ├── suggestModel.ts
│   │   │   │       ├── suggestOvertypingCapturer.ts
│   │   │   │       ├── suggest.ts
│   │   │   │       ├── suggestWidgetDetails.ts
│   │   │   │       ├── suggestWidgetRenderer.ts
│   │   │   │       ├── suggestWidgetStatus.ts
│   │   │   │       ├── suggestWidget.ts
│   │   │   │       ├── wordContextKey.ts
│   │   │   │       └── wordDistance.ts
│   │   │   ├── symbolIcons
│   │   │   │   └── browser
│   │   │   │       └── symbolIcons.ts
│   │   │   ├── toggleTabFocusMode
│   │   │   │   └── browser
│   │   │   │       └── toggleTabFocusMode.ts
│   │   │   ├── tokenization
│   │   │   │   └── browser
│   │   │   │       └── tokenization.ts
│   │   │   ├── unicodeHighlighter
│   │   │   │   └── browser
│   │   │   │       ├── bannerController.ts
│   │   │   │       └── unicodeHighlighter.ts
│   │   │   ├── unusualLineTerminators
│   │   │   │   └── browser
│   │   │   │       └── unusualLineTerminators.ts
│   │   │   ├── wordHighlighter
│   │   │   │   └── browser
│   │   │   │       ├── highlightDecorations.ts
│   │   │   │       ├── textualHighlightProvider.ts
│   │   │   │       └── wordHighlighter.ts
│   │   │   ├── wordOperations
│   │   │   │   ├── browser
│   │   │   │   │   └── wordOperations.ts
│   │   │   │   └── test
│   │   │   │       └── browser
│   │   │   │           └── wordTestUtils.ts
│   │   │   ├── wordPartOperations
│   │   │   │   ├── browser
│   │   │   │   │   └── wordPartOperations.ts
│   │   │   │   └── test
│   │   │   │       └── browser
│   │   │   │           └── utils.ts
│   │   │   └── zoneWidget
│   │   │       └── browser
│   │   │           └── zoneWidget.ts
│   │   ├── editor.all.ts
│   │   ├── editor.api.ts
│   │   ├── editor.main.ts
│   │   ├── editor.worker.ts
│   │   ├── standalone
│   │   │   ├── browser
│   │   │   │   ├── colorizer.ts
│   │   │   │   ├── inspectTokens
│   │   │   │   │   └── inspectTokens.ts
│   │   │   │   ├── iPadShowKeyboard
│   │   │   │   │   └── iPadShowKeyboard.ts
│   │   │   │   ├── quickAccess
│   │   │   │   │   ├── standaloneCommandsQuickAccess.ts
│   │   │   │   │   ├── standaloneGotoLineQuickAccess.ts
│   │   │   │   │   ├── standaloneGotoSymbolQuickAccess.ts
│   │   │   │   │   └── standaloneHelpQuickAccess.ts
│   │   │   │   ├── quickInput
│   │   │   │   │   └── standaloneQuickInputService.ts
│   │   │   │   ├── referenceSearch
│   │   │   │   │   └── standaloneReferenceSearch.ts
│   │   │   │   ├── standaloneCodeEditorService.ts
│   │   │   │   ├── standaloneCodeEditor.ts
│   │   │   │   ├── standaloneEditor.ts
│   │   │   │   ├── standaloneLanguages.ts
│   │   │   │   ├── standaloneLayoutService.ts
│   │   │   │   ├── standaloneServices.ts
│   │   │   │   ├── standaloneThemeService.ts
│   │   │   │   ├── standaloneTreeSitterService.ts
│   │   │   │   ├── standaloneWebWorker.ts
│   │   │   │   └── toggleHighContrast
│   │   │   │       └── toggleHighContrast.ts
│   │   │   └── common
│   │   │       ├── monarch
│   │   │       │   ├── monarchCommon.ts
│   │   │       │   ├── monarchCompile.ts
│   │   │       │   ├── monarchLexer.ts
│   │   │       │   └── monarchTypes.ts
│   │   │       ├── standaloneTheme.ts
│   │   │       └── themes.ts
│   │   └── test
│   │       ├── browser
│   │       │   ├── config
│   │       │   │   └── testConfiguration.ts
│   │       │   ├── controller
│   │       │   │   ├── cursor.integrationTest.ts
│   │       │   │   ├── imeRecordedTypes.ts
│   │       │   │   ├── imeRecorder.ts
│   │       │   │   └── imeTester.ts
│   │       │   ├── diff
│   │       │   │   └── testDiffProviderFactoryService.ts
│   │       │   ├── editorTestServices.ts
│   │       │   ├── gpu
│   │       │   │   └── atlas
│   │       │   │       └── testUtil.ts
│   │       │   ├── testCodeEditor.ts
│   │       │   ├── testCommand.ts
│   │       │   └── viewModel
│   │       │       └── testViewModel.ts
│   │       ├── common
│   │       │   ├── core
│   │       │   │   ├── random.ts
│   │       │   │   └── testLineToken.ts
│   │       │   ├── model
│   │       │   │   └── editableTextModelTestUtils.ts
│   │       │   ├── modes
│   │       │   │   ├── supports
│   │       │   │   │   ├── autoClosingPairsRules.ts
│   │       │   │   │   ├── bracketRules.ts
│   │       │   │   │   ├── indentationRules.ts
│   │       │   │   │   └── onEnterRules.ts
│   │       │   │   └── testLanguageConfigurationService.ts
│   │       │   ├── modesTestUtils.ts
│   │       │   ├── services
│   │       │   │   ├── testEditorWorkerService.ts
│   │       │   │   ├── testTextResourcePropertiesService.ts
│   │       │   │   └── testTreeSitterService.ts
│   │       │   ├── testTextModel.ts
│   │       │   └── utils
│   │       │       └── testDecoder.ts
│   │       └── node
│   │           └── diffing
│   │               └── fixtures
│   │                   ├── bracket-aligning
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── class-replacement
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   ├── advanced.human.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── deletion
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── difficult-move
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── equals
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── false-positive-move
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── fuzzy-matching
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── import-shifting
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── indentation
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── intra-block-align
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── invalid-diff-bug
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── invalid-diff-trimws
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── invalid-ranges
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── issue-131091
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── issue-185779
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── issue-201713
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── issue-202147-trimws
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── issue-204948
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── issue-214049
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── json-brackets
│   │                   │   ├── 1.json
│   │                   │   ├── 2.json
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── just-whitespace
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── method-splitting
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── minimal-diff-character
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── move-1
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── noise-1
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── noise-2
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── noisy-move1
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── penalize-fragmentation
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   ├── advanced.human.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── random-match-1
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── random-match-2
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── random-match-3
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── shifting-parameters
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── shifting-twice
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── sorted-offsets
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── subword
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── trivial
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── ts-advanced-bug
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── ts-class
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   ├── advanced.human.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── ts-comments
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── ts-confusing
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── ts-confusing-2
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── ts-diff-word-split
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── ts-example1
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── ts-example2-ts
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── ts-fragmented-eager-diffing
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── ts-fragmented-eager-diffing2
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── ts-fragmented-eager-diffing3
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── ts-import-ws-affinity
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── ts-insert
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── ts-methods
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── ts-shifting
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── ts-shift-to-ws
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── ts-strings
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── ts-too-much-minimization
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── ts-unfragmented-diffing
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── ts-unit-test
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   ├── word-shared-letters
│   │                   │   ├── advanced.expected.diff.json
│   │                   │   └── legacy.expected.diff.json
│   │                   └── ws-alignment
│   │                       ├── advanced.expected.diff.json
│   │                       └── legacy.expected.diff.json
│   ├── monaco.d.ts
│   ├── nls.messages.ts
│   ├── nls.ts
│   ├── platform
│   │   ├── accessibility
│   │   │   ├── browser
│   │   │   │   ├── accessibilityService.ts
│   │   │   │   ├── accessibleViewRegistry.ts
│   │   │   │   └── accessibleView.ts
│   │   │   ├── common
│   │   │   │   └── accessibility.ts
│   │   │   └── test
│   │   │       └── common
│   │   │           └── testAccessibilityService.ts
│   │   ├── accessibilitySignal
│   │   │   └── browser
│   │   │       ├── accessibilitySignalService.ts
│   │   │       └── progressAccessibilitySignalScheduler.ts
│   │   ├── action
│   │   │   └── common
│   │   │       ├── actionCommonCategories.ts
│   │   │       └── action.ts
│   │   ├── actions
│   │   │   ├── browser
│   │   │   │   ├── actionViewItemService.ts
│   │   │   │   ├── buttonbar.ts
│   │   │   │   ├── dropdownActionViewItemWithKeybinding.ts
│   │   │   │   ├── dropdownWithPrimaryActionViewItem.ts
│   │   │   │   ├── floatingMenu.ts
│   │   │   │   ├── menuEntryActionViewItem.ts
│   │   │   │   └── toolbar.ts
│   │   │   └── common
│   │   │       ├── actions.contribution.ts
│   │   │       ├── actions.ts
│   │   │       ├── menuResetAction.ts
│   │   │       └── menuService.ts
│   │   ├── actionWidget
│   │   │   ├── browser
│   │   │   │   ├── actionList.ts
│   │   │   │   └── actionWidget.ts
│   │   │   └── common
│   │   │       └── actionWidget.ts
│   │   ├── assignment
│   │   │   └── common
│   │   │       ├── assignmentService.ts
│   │   │       └── assignment.ts
│   │   ├── auxiliaryWindow
│   │   │   └── electron-main
│   │   │       ├── auxiliaryWindowsMainService.ts
│   │   │       ├── auxiliaryWindows.ts
│   │   │       └── auxiliaryWindow.ts
│   │   ├── backup
│   │   │   ├── common
│   │   │   │   └── backup.ts
│   │   │   ├── electron-main
│   │   │   │   ├── backupMainService.ts
│   │   │   │   └── backup.ts
│   │   │   └── node
│   │   │       └── backup.ts
│   │   ├── checksum
│   │   │   ├── common
│   │   │   │   └── checksumService.ts
│   │   │   └── node
│   │   │       └── checksumService.ts
│   │   ├── clipboard
│   │   │   ├── browser
│   │   │   │   └── clipboardService.ts
│   │   │   ├── common
│   │   │   │   └── clipboardService.ts
│   │   │   └── test
│   │   │       └── common
│   │   │           └── testClipboardService.ts
│   │   ├── commands
│   │   │   ├── common
│   │   │   │   └── commands.ts
│   │   │   └── test
│   │   │       └── common
│   │   │           └── nullCommandService.ts
│   │   ├── configuration
│   │   │   ├── common
│   │   │   │   ├── configurationModels.ts
│   │   │   │   ├── configurationRegistry.ts
│   │   │   │   ├── configurationService.ts
│   │   │   │   ├── configurations.ts
│   │   │   │   └── configuration.ts
│   │   │   └── test
│   │   │       └── common
│   │   │           └── testConfigurationService.ts
│   │   ├── contextkey
│   │   │   ├── browser
│   │   │   │   └── contextKeyService.ts
│   │   │   └── common
│   │   │       ├── contextkeys.ts
│   │   │       ├── contextkey.ts
│   │   │       └── scanner.ts
│   │   ├── contextview
│   │   │   └── browser
│   │   │       ├── contextMenuHandler.ts
│   │   │       ├── contextMenuService.ts
│   │   │       ├── contextViewService.ts
│   │   │       └── contextView.ts
│   │   ├── cssDev
│   │   │   └── node
│   │   │       └── cssDevService.ts
│   │   ├── debug
│   │   │   ├── common
│   │   │   │   ├── extensionHostDebugIpc.ts
│   │   │   │   └── extensionHostDebug.ts
│   │   │   └── electron-main
│   │   │       └── extensionHostDebugIpc.ts
│   │   ├── diagnostics
│   │   │   ├── common
│   │   │   │   └── diagnostics.ts
│   │   │   ├── electron-main
│   │   │   │   └── diagnosticsMainService.ts
│   │   │   ├── electron-sandbox
│   │   │   │   └── diagnosticsService.ts
│   │   │   └── node
│   │   │       └── diagnosticsService.ts
│   │   ├── dialogs
│   │   │   ├── browser
│   │   │   │   └── dialog.ts
│   │   │   ├── common
│   │   │   │   └── dialogs.ts
│   │   │   ├── electron-main
│   │   │   │   └── dialogMainService.ts
│   │   │   └── test
│   │   │       └── common
│   │   │           └── testDialogService.ts
│   │   ├── dnd
│   │   │   └── browser
│   │   │       └── dnd.ts
│   │   ├── download
│   │   │   └── common
│   │   │       ├── downloadIpc.ts
│   │   │       ├── downloadService.ts
│   │   │       └── download.ts
│   │   ├── editor
│   │   │   └── common
│   │   │       └── editor.ts
│   │   ├── encryption
│   │   │   ├── common
│   │   │   │   └── encryptionService.ts
│   │   │   └── electron-main
│   │   │       └── encryptionMainService.ts
│   │   ├── environment
│   │   │   ├── common
│   │   │   │   ├── argv.ts
│   │   │   │   ├── environmentService.ts
│   │   │   │   └── environment.ts
│   │   │   ├── electron-main
│   │   │   │   └── environmentMainService.ts
│   │   │   ├── node
│   │   │   │   ├── argvHelper.ts
│   │   │   │   ├── argv.ts
│   │   │   │   ├── environmentService.ts
│   │   │   │   ├── stdin.ts
│   │   │   │   ├── userDataPath.ts
│   │   │   │   └── wait.ts
│   │   │   └── test
│   │   │       └── node
│   │   │           └── nativeModules.integrationTest.ts
│   │   ├── extensionManagement
│   │   │   ├── common
│   │   │   │   ├── abstractExtensionManagementService.ts
│   │   │   │   ├── allowedExtensionsService.ts
│   │   │   │   ├── configRemotes.ts
│   │   │   │   ├── extensionEnablementService.ts
│   │   │   │   ├── extensionGalleryManifestServiceIpc.ts
│   │   │   │   ├── extensionGalleryManifestService.ts
│   │   │   │   ├── extensionGalleryManifest.ts
│   │   │   │   ├── extensionGalleryService.ts
│   │   │   │   ├── extensionManagementCLI.ts
│   │   │   │   ├── extensionManagementIpc.ts
│   │   │   │   ├── extensionManagement.ts
│   │   │   │   ├── extensionManagementUtil.ts
│   │   │   │   ├── extensionNls.ts
│   │   │   │   ├── extensionsProfileScannerService.ts
│   │   │   │   ├── extensionsScannerService.ts
│   │   │   │   ├── extensionStorage.ts
│   │   │   │   ├── extensionTipsService.ts
│   │   │   │   ├── implicitActivationEvents.ts
│   │   │   │   └── unsupportedExtensionsMigration.ts
│   │   │   ├── electron-sandbox
│   │   │   │   └── extensionsProfileScannerService.ts
│   │   │   └── node
│   │   │       ├── extensionDownloader.ts
│   │   │       ├── extensionLifecycle.ts
│   │   │       ├── extensionManagementService.ts
│   │   │       ├── extensionManagementUtil.ts
│   │   │       ├── extensionSignatureVerificationService.ts
│   │   │       ├── extensionsManifestCache.ts
│   │   │       ├── extensionsProfileScannerService.ts
│   │   │       ├── extensionsScannerService.ts
│   │   │       ├── extensionsWatcher.ts
│   │   │       └── extensionTipsService.ts
│   │   ├── extensionRecommendations
│   │   │   └── common
│   │   │       ├── extensionRecommendationsIpc.ts
│   │   │       └── extensionRecommendations.ts
│   │   ├── extensionResourceLoader
│   │   │   ├── browser
│   │   │   │   └── extensionResourceLoaderService.ts
│   │   │   └── common
│   │   │       ├── extensionResourceLoaderService.ts
│   │   │       └── extensionResourceLoader.ts
│   │   ├── extensions
│   │   │   ├── common
│   │   │   │   ├── extensionHostStarter.ts
│   │   │   │   ├── extensionsApiProposals.ts
│   │   │   │   ├── extensions.ts
│   │   │   │   └── extensionValidator.ts
│   │   │   └── electron-main
│   │   │       └── extensionHostStarter.ts
│   │   ├── externalServices
│   │   │   └── common
│   │   │       ├── marketplace.ts
│   │   │       └── serviceMachineId.ts
│   │   ├── externalTerminal
│   │   │   ├── common
│   │   │   │   └── externalTerminal.ts
│   │   │   ├── electron-main
│   │   │   │   └── externalTerminal.ts
│   │   │   ├── electron-sandbox
│   │   │   │   └── externalTerminalService.ts
│   │   │   └── node
│   │   │       └── externalTerminalService.ts
│   │   ├── files
│   │   │   ├── browser
│   │   │   │   ├── htmlFileSystemProvider.ts
│   │   │   │   ├── indexedDBFileSystemProvider.ts
│   │   │   │   └── webFileSystemAccess.ts
│   │   │   ├── common
│   │   │   │   ├── diskFileSystemProviderClient.ts
│   │   │   │   ├── diskFileSystemProvider.ts
│   │   │   │   ├── fileService.ts
│   │   │   │   ├── files.ts
│   │   │   │   ├── inMemoryFilesystemProvider.ts
│   │   │   │   ├── io.ts
│   │   │   │   └── watcher.ts
│   │   │   ├── electron-main
│   │   │   │   └── diskFileSystemProviderServer.ts
│   │   │   ├── node
│   │   │   │   ├── diskFileSystemProviderServer.ts
│   │   │   │   ├── diskFileSystemProvider.ts
│   │   │   │   └── watcher
│   │   │   │       ├── baseWatcher.ts
│   │   │   │       ├── nodejs
│   │   │   │       │   ├── nodejsClient.ts
│   │   │   │       │   ├── nodejsWatcherLib.ts
│   │   │   │       │   └── nodejsWatcher.ts
│   │   │   │       ├── parcel
│   │   │   │       │   └── parcelWatcher.ts
│   │   │   │       ├── watcherClient.ts
│   │   │   │       ├── watcherMain.ts
│   │   │   │       ├── watcherStats.ts
│   │   │   │       └── watcher.ts
│   │   │   └── test
│   │   │       ├── browser
│   │   │       │   └── indexedDBFileService.integrationTest.ts
│   │   │       ├── common
│   │   │       │   └── nullFileSystemProvider.ts
│   │   │       └── node
│   │   │           └── diskFileService.integrationTest.ts
│   │   ├── history
│   │   │   └── browser
│   │   │       ├── contextScopedHistoryWidget.ts
│   │   │       └── historyWidgetKeybindingHint.ts
│   │   ├── hover
│   │   │   ├── browser
│   │   │   │   └── hover.ts
│   │   │   └── test
│   │   │       └── browser
│   │   │           └── nullHoverService.ts
│   │   ├── instantiation
│   │   │   ├── common
│   │   │   │   ├── descriptors.ts
│   │   │   │   ├── extensions.ts
│   │   │   │   ├── graph.ts
│   │   │   │   ├── instantiationService.ts
│   │   │   │   ├── instantiation.ts
│   │   │   │   └── serviceCollection.ts
│   │   │   └── test
│   │   │       └── common
│   │   │           └── instantiationServiceMock.ts
│   │   ├── ipc
│   │   │   ├── common
│   │   │   │   ├── mainProcessService.ts
│   │   │   │   └── services.ts
│   │   │   └── electron-sandbox
│   │   │       ├── mainProcessService.ts
│   │   │       └── services.ts
│   │   ├── jsonschemas
│   │   │   └── common
│   │   │       └── jsonContributionRegistry.ts
│   │   ├── keybinding
│   │   │   ├── common
│   │   │   │   ├── abstractKeybindingService.ts
│   │   │   │   ├── baseResolvedKeybinding.ts
│   │   │   │   ├── keybindingResolver.ts
│   │   │   │   ├── keybindingsRegistry.ts
│   │   │   │   ├── keybinding.ts
│   │   │   │   ├── resolvedKeybindingItem.ts
│   │   │   │   └── usLayoutResolvedKeybinding.ts
│   │   │   └── test
│   │   │       └── common
│   │   │           ├── keybindingsTestUtils.ts
│   │   │           └── mockKeybindingService.ts
│   │   ├── keyboardLayout
│   │   │   ├── common
│   │   │   │   ├── keyboardConfig.ts
│   │   │   │   ├── keyboardLayoutService.ts
│   │   │   │   ├── keyboardLayout.ts
│   │   │   │   └── keyboardMapper.ts
│   │   │   └── electron-main
│   │   │       └── keyboardLayoutMainService.ts
│   │   ├── label
│   │   │   └── common
│   │   │       └── label.ts
│   │   ├── languagePacks
│   │   │   ├── browser
│   │   │   │   └── languagePacks.ts
│   │   │   ├── common
│   │   │   │   ├── languagePacks.ts
│   │   │   │   └── localizedStrings.ts
│   │   │   └── node
│   │   │       └── languagePacks.ts
│   │   ├── launch
│   │   │   └── electron-main
│   │   │       └── launchMainService.ts
│   │   ├── layout
│   │   │   └── browser
│   │   │       ├── layoutService.ts
│   │   │       └── zIndexRegistry.ts
│   │   ├── lifecycle
│   │   │   ├── common
│   │   │   │   └── lifecycle.ts
│   │   │   ├── electron-main
│   │   │   │   └── lifecycleMainService.ts
│   │   │   └── node
│   │   │       └── sharedProcessLifecycleService.ts
│   │   ├── list
│   │   │   └── browser
│   │   │       └── listService.ts
│   │   ├── log
│   │   │   ├── browser
│   │   │   │   └── log.ts
│   │   │   ├── common
│   │   │   │   ├── bufferLog.ts
│   │   │   │   ├── fileLog.ts
│   │   │   │   ├── logIpc.ts
│   │   │   │   ├── logService.ts
│   │   │   │   └── log.ts
│   │   │   ├── electron-main
│   │   │   │   ├── loggerService.ts
│   │   │   │   └── logIpc.ts
│   │   │   └── node
│   │   │       ├── loggerService.ts
│   │   │       └── spdlogLog.ts
│   │   ├── markers
│   │   │   └── common
│   │   │       ├── markerService.ts
│   │   │       └── markers.ts
│   │   ├── mcp
│   │   │   ├── common
│   │   │   │   ├── mcpManagementCli.ts
│   │   │   │   ├── mcpPlatformTypes.ts
│   │   │   │   └── nativeMcpDiscoveryHelper.ts
│   │   │   └── node
│   │   │       ├── nativeMcpDiscoveryHelperChannel.ts
│   │   │       └── nativeMcpDiscoveryHelperService.ts
│   │   ├── menubar
│   │   │   ├── common
│   │   │   │   └── menubar.ts
│   │   │   ├── electron-main
│   │   │   │   ├── menubarMainService.ts
│   │   │   │   └── menubar.ts
│   │   │   └── electron-sandbox
│   │   │       └── menubar.ts
│   │   ├── native
│   │   │   ├── common
│   │   │   │   ├── nativeHostService.ts
│   │   │   │   └── native.ts
│   │   │   └── electron-main
│   │   │       ├── auth.ts
│   │   │       └── nativeHostMainService.ts
│   │   ├── notification
│   │   │   ├── common
│   │   │   │   └── notification.ts
│   │   │   └── test
│   │   │       └── common
│   │   │           └── testNotificationService.ts
│   │   ├── observable
│   │   │   └── common
│   │   │       ├── observableMemento.ts
│   │   │       ├── platformObservableUtils.ts
│   │   │       ├── wrapInHotClass.ts
│   │   │       └── wrapInReloadableClass.ts
│   │   ├── opener
│   │   │   ├── browser
│   │   │   │   └── link.ts
│   │   │   ├── common
│   │   │   │   └── opener.ts
│   │   │   └── test
│   │   │       └── common
│   │   │           └── nullOpenerService.ts
│   │   ├── policy
│   │   │   ├── common
│   │   │   │   ├── filePolicyService.ts
│   │   │   │   ├── policyIpc.ts
│   │   │   │   └── policy.ts
│   │   │   └── node
│   │   │       └── nativePolicyService.ts
│   │   ├── process
│   │   │   ├── common
│   │   │   │   └── process.ts
│   │   │   └── electron-main
│   │   │       └── processMainService.ts
│   │   ├── product
│   │   │   └── common
│   │   │       ├── productService.ts
│   │   │       └── product.ts
│   │   ├── profiling
│   │   │   ├── common
│   │   │   │   ├── profilingModel.ts
│   │   │   │   ├── profilingTelemetrySpec.ts
│   │   │   │   └── profiling.ts
│   │   │   ├── electron-main
│   │   │   │   └── windowProfiling.ts
│   │   │   ├── electron-sandbox
│   │   │   │   ├── profileAnalysisWorkerMain.ts
│   │   │   │   ├── profileAnalysisWorkerService.ts
│   │   │   │   ├── profileAnalysisWorker.ts
│   │   │   │   └── profilingService.ts
│   │   │   └── node
│   │   │       └── profilingService.ts
│   │   ├── progress
│   │   │   └── common
│   │   │       └── progress.ts
│   │   ├── prompts
│   │   │   ├── common
│   │   │   │   ├── config.ts
│   │   │   │   └── constants.ts
│   │   │   └── test
│   │   │       └── common
│   │   │           └── utils
│   │   │               └── mock.ts
│   │   ├── protocol
│   │   │   └── electron-main
│   │   │       ├── protocolMainService.ts
│   │   │       └── protocol.ts
│   │   ├── quickinput
│   │   │   ├── browser
│   │   │   │   ├── commandsQuickAccess.ts
│   │   │   │   ├── helpQuickAccess.ts
│   │   │   │   ├── pickerQuickAccess.ts
│   │   │   │   ├── quickAccess.ts
│   │   │   │   ├── quickInputActions.ts
│   │   │   │   ├── quickInputBox.ts
│   │   │   │   ├── quickInputController.ts
│   │   │   │   ├── quickInputService.ts
│   │   │   │   ├── quickInputTree.ts
│   │   │   │   ├── quickInput.ts
│   │   │   │   ├── quickInputUtils.ts
│   │   │   │   └── quickPickPin.ts
│   │   │   └── common
│   │   │       ├── quickAccess.ts
│   │   │       └── quickInput.ts
│   │   ├── registry
│   │   │   └── common
│   │   │       └── platform.ts
│   │   ├── remote
│   │   │   ├── browser
│   │   │   │   ├── browserSocketFactory.ts
│   │   │   │   └── remoteAuthorityResolverService.ts
│   │   │   ├── common
│   │   │   │   ├── electronRemoteResources.ts
│   │   │   │   ├── managedSocket.ts
│   │   │   │   ├── remoteAgentConnection.ts
│   │   │   │   ├── remoteAgentEnvironment.ts
│   │   │   │   ├── remoteAuthorityResolver.ts
│   │   │   │   ├── remoteExtensionsScanner.ts
│   │   │   │   ├── remoteHosts.ts
│   │   │   │   ├── remoteSocketFactoryService.ts
│   │   │   │   ├── remote.ts
│   │   │   │   └── sharedProcessTunnelService.ts
│   │   │   ├── electron-sandbox
│   │   │   │   ├── electronRemoteResourceLoader.ts
│   │   │   │   ├── remoteAuthorityResolverService.ts
│   │   │   │   └── sharedProcessTunnelService.ts
│   │   │   └── node
│   │   │       ├── nodeSocketFactory.ts
│   │   │       └── wsl.ts
│   │   ├── remoteTunnel
│   │   │   ├── common
│   │   │   │   └── remoteTunnel.ts
│   │   │   ├── electron-sandbox
│   │   │   │   └── remoteTunnelService.ts
│   │   │   └── node
│   │   │       └── remoteTunnelService.ts
│   │   ├── request
│   │   │   ├── common
│   │   │   │   ├── requestIpc.ts
│   │   │   │   └── request.ts
│   │   │   ├── electron-utility
│   │   │   │   └── requestService.ts
│   │   │   └── node
│   │   │       ├── proxy.ts
│   │   │       └── requestService.ts
│   │   ├── secrets
│   │   │   ├── common
│   │   │   │   └── secrets.ts
│   │   │   └── test
│   │   │       └── common
│   │   │           └── testSecretStorageService.ts
│   │   ├── sharedProcess
│   │   │   ├── common
│   │   │   │   └── sharedProcess.ts
│   │   │   ├── electron-main
│   │   │   │   └── sharedProcess.ts
│   │   │   └── node
│   │   │       └── sharedProcess.ts
│   │   ├── shell
│   │   │   └── node
│   │   │       └── shellEnv.ts
│   │   ├── sign
│   │   │   ├── browser
│   │   │   │   └── signService.ts
│   │   │   ├── common
│   │   │   │   ├── abstractSignService.ts
│   │   │   │   └── sign.ts
│   │   │   └── node
│   │   │       └── signService.ts
│   │   ├── state
│   │   │   └── node
│   │   │       ├── stateService.ts
│   │   │       └── state.ts
│   │   ├── storage
│   │   │   ├── common
│   │   │   │   ├── storageIpc.ts
│   │   │   │   ├── storageService.ts
│   │   │   │   └── storage.ts
│   │   │   └── electron-main
│   │   │       ├── storageIpc.ts
│   │   │       ├── storageMainService.ts
│   │   │       └── storageMain.ts
│   │   ├── telemetry
│   │   │   ├── browser
│   │   │   │   ├── 1dsAppender.ts
│   │   │   │   └── errorTelemetry.ts
│   │   │   ├── common
│   │   │   │   ├── 1dsAppender.ts
│   │   │   │   ├── commonProperties.ts
│   │   │   │   ├── errorTelemetry.ts
│   │   │   │   ├── gdprTypings.ts
│   │   │   │   ├── remoteTelemetryChannel.ts
│   │   │   │   ├── serverTelemetryService.ts
│   │   │   │   ├── telemetryIpc.ts
│   │   │   │   ├── telemetryLogAppender.ts
│   │   │   │   ├── telemetryService.ts
│   │   │   │   ├── telemetry.ts
│   │   │   │   └── telemetryUtils.ts
│   │   │   ├── electron-main
│   │   │   │   └── telemetryUtils.ts
│   │   │   ├── electron-sandbox
│   │   │   │   └── customEndpointTelemetryService.ts
│   │   │   └── node
│   │   │       ├── 1dsAppender.ts
│   │   │       ├── customEndpointTelemetryService.ts
│   │   │       ├── errorTelemetry.ts
│   │   │       ├── telemetry.ts
│   │   │       └── telemetryUtils.ts
│   │   ├── terminal
│   │   │   ├── common
│   │   │   │   ├── capabilities
│   │   │   │   │   ├── bufferMarkCapability.ts
│   │   │   │   │   ├── capabilities.ts
│   │   │   │   │   ├── commandDetection
│   │   │   │   │   │   ├── promptInputModel.ts
│   │   │   │   │   │   └── terminalCommand.ts
│   │   │   │   │   ├── commandDetectionCapability.ts
│   │   │   │   │   ├── cwdDetectionCapability.ts
│   │   │   │   │   ├── naiveCwdDetectionCapability.ts
│   │   │   │   │   ├── partialCommandDetectionCapability.ts
│   │   │   │   │   ├── shellEnvDetectionCapability.ts
│   │   │   │   │   └── terminalCapabilityStore.ts
│   │   │   │   ├── environmentVariableCollection.ts
│   │   │   │   ├── environmentVariableShared.ts
│   │   │   │   ├── environmentVariable.ts
│   │   │   │   ├── requestStore.ts
│   │   │   │   ├── terminalDataBuffering.ts
│   │   │   │   ├── terminalEnvironment.ts
│   │   │   │   ├── terminalLogService.ts
│   │   │   │   ├── terminalPlatformConfiguration.ts
│   │   │   │   ├── terminalProcess.ts
│   │   │   │   ├── terminalProfiles.ts
│   │   │   │   ├── terminalRecorder.ts
│   │   │   │   ├── terminalStrings.ts
│   │   │   │   ├── terminal.ts
│   │   │   │   └── xterm
│   │   │   │       └── shellIntegrationAddon.ts
│   │   │   ├── electron-main
│   │   │   │   └── electronPtyHostStarter.ts
│   │   │   └── node
│   │   │       ├── childProcessMonitor.ts
│   │   │       ├── heartbeatService.ts
│   │   │       ├── nodePtyHostStarter.ts
│   │   │       ├── ptyHostMain.ts
│   │   │       ├── ptyHostService.ts
│   │   │       ├── ptyHost.ts
│   │   │       ├── ptyService.ts
│   │   │       ├── terminalContrib
│   │   │       │   └── autoReplies
│   │   │       │       ├── autoRepliesContribController.ts
│   │   │       │       └── terminalAutoResponder.ts
│   │   │       ├── terminalEnvironment.ts
│   │   │       ├── terminalProcess.ts
│   │   │       ├── terminalProfiles.ts
│   │   │       └── windowsShellHelper.ts
│   │   ├── test
│   │   │   └── electron-main
│   │   │       └── workbenchTestServices.ts
│   │   ├── theme
│   │   │   ├── browser
│   │   │   │   ├── defaultStyles.ts
│   │   │   │   └── iconsStyleSheet.ts
│   │   │   ├── common
│   │   │   │   ├── colorRegistry.ts
│   │   │   │   ├── colors
│   │   │   │   │   ├── baseColors.ts
│   │   │   │   │   ├── chartsColors.ts
│   │   │   │   │   ├── editorColors.ts
│   │   │   │   │   ├── inputColors.ts
│   │   │   │   │   ├── listColors.ts
│   │   │   │   │   ├── menuColors.ts
│   │   │   │   │   ├── minimapColors.ts
│   │   │   │   │   ├── miscColors.ts
│   │   │   │   │   ├── quickpickColors.ts
│   │   │   │   │   └── searchColors.ts
│   │   │   │   ├── colorUtils.ts
│   │   │   │   ├── iconRegistry.ts
│   │   │   │   ├── themeService.ts
│   │   │   │   ├── theme.ts
│   │   │   │   └── tokenClassificationRegistry.ts
│   │   │   ├── electron-main
│   │   │   │   └── themeMainService.ts
│   │   │   └── test
│   │   │       └── common
│   │   │           └── testThemeService.ts
│   │   ├── tunnel
│   │   │   ├── common
│   │   │   │   └── tunnel.ts
│   │   │   └── node
│   │   │       ├── sharedProcessTunnelService.ts
│   │   │       └── tunnelService.ts
│   │   ├── undoRedo
│   │   │   └── common
│   │   │       ├── undoRedoService.ts
│   │   │       └── undoRedo.ts
│   │   ├── update
│   │   │   ├── common
│   │   │   │   ├── update.config.contribution.ts
│   │   │   │   ├── updateIpc.ts
│   │   │   │   └── update.ts
│   │   │   └── electron-main
│   │   │       ├── abstractUpdateService.ts
│   │   │       ├── updateService.darwin.ts
│   │   │       ├── updateService.linux.ts
│   │   │       ├── updateService.snap.ts
│   │   │       └── updateService.win32.ts
│   │   ├── uriIdentity
│   │   │   └── common
│   │   │       ├── uriIdentityService.ts
│   │   │       └── uriIdentity.ts
│   │   ├── url
│   │   │   ├── common
│   │   │   │   ├── urlIpc.ts
│   │   │   │   ├── urlService.ts
│   │   │   │   └── url.ts
│   │   │   └── electron-main
│   │   │       ├── electronUrlListener.ts
│   │   │       └── url.ts
│   │   ├── userData
│   │   │   └── common
│   │   │       └── fileUserDataProvider.ts
│   │   ├── userDataProfile
│   │   │   ├── browser
│   │   │   │   └── userDataProfile.ts
│   │   │   ├── common
│   │   │   │   ├── userDataProfileIpc.ts
│   │   │   │   ├── userDataProfileStorageService.ts
│   │   │   │   └── userDataProfile.ts
│   │   │   ├── electron-main
│   │   │   │   ├── userDataProfilesHandler.ts
│   │   │   │   ├── userDataProfileStorageIpc.ts
│   │   │   │   └── userDataProfile.ts
│   │   │   ├── electron-sandbox
│   │   │   │   └── userDataProfileStorageService.ts
│   │   │   └── node
│   │   │       ├── userDataProfileStorageService.ts
│   │   │       └── userDataProfile.ts
│   │   ├── userDataSync
│   │   │   ├── common
│   │   │   │   ├── abstractSynchronizer.ts
│   │   │   │   ├── content.ts
│   │   │   │   ├── extensionsMerge.ts
│   │   │   │   ├── extensionsSync.ts
│   │   │   │   ├── globalStateMerge.ts
│   │   │   │   ├── globalStateSync.ts
│   │   │   │   ├── ignoredExtensions.ts
│   │   │   │   ├── keybindingsMerge.ts
│   │   │   │   ├── keybindingsSync.ts
│   │   │   │   ├── promptsSync
│   │   │   │   │   ├── promptsMerge.ts
│   │   │   │   │   └── promptsSync.ts
│   │   │   │   ├── settingsMerge.ts
│   │   │   │   ├── settingsSync.ts
│   │   │   │   ├── snippetsMerge.ts
│   │   │   │   ├── snippetsSync.ts
│   │   │   │   ├── tasksSync.ts
│   │   │   │   ├── userDataAutoSyncService.ts
│   │   │   │   ├── userDataProfilesManifestMerge.ts
│   │   │   │   ├── userDataProfilesManifestSync.ts
│   │   │   │   ├── userDataSyncAccount.ts
│   │   │   │   ├── userDataSyncEnablementService.ts
│   │   │   │   ├── userDataSyncIpc.ts
│   │   │   │   ├── userDataSyncLocalStoreService.ts
│   │   │   │   ├── userDataSyncLog.ts
│   │   │   │   ├── userDataSyncMachines.ts
│   │   │   │   ├── userDataSyncResourceProvider.ts
│   │   │   │   ├── userDataSyncServiceIpc.ts
│   │   │   │   ├── userDataSyncService.ts
│   │   │   │   ├── userDataSyncStoreService.ts
│   │   │   │   └── userDataSync.ts
│   │   │   ├── node
│   │   │   │   └── userDataAutoSyncService.ts
│   │   │   └── test
│   │   │       └── common
│   │   │           └── userDataSyncClient.ts
│   │   ├── utilityProcess
│   │   │   ├── common
│   │   │   │   └── utilityProcessWorkerService.ts
│   │   │   └── electron-main
│   │   │       ├── utilityProcess.ts
│   │   │       └── utilityProcessWorkerMainService.ts
│   │   ├── webContentExtractor
│   │   │   ├── common
│   │   │   │   └── webContentExtractor.ts
│   │   │   ├── electron-main
│   │   │   │   ├── cdpAccessibilityDomain.ts
│   │   │   │   └── webContentExtractorService.ts
│   │   │   └── electron-sandbox
│   │   │       └── webContentExtractorService.ts
│   │   ├── webview
│   │   │   ├── common
│   │   │   │   ├── mimeTypes.ts
│   │   │   │   ├── webviewManagerService.ts
│   │   │   │   └── webviewPortMapping.ts
│   │   │   └── electron-main
│   │   │       ├── webviewMainService.ts
│   │   │       └── webviewProtocolProvider.ts
│   │   ├── window
│   │   │   ├── common
│   │   │   │   └── window.ts
│   │   │   ├── electron-main
│   │   │   │   └── window.ts
│   │   │   └── electron-sandbox
│   │   │       └── window.ts
│   │   ├── windows
│   │   │   ├── electron-main
│   │   │   │   ├── windowImpl.ts
│   │   │   │   ├── windowsFinder.ts
│   │   │   │   ├── windowsMainService.ts
│   │   │   │   ├── windowsStateHandler.ts
│   │   │   │   └── windows.ts
│   │   │   └── node
│   │   │       └── windowTracker.ts
│   │   ├── workspace
│   │   │   ├── common
│   │   │   │   ├── canonicalUri.ts
│   │   │   │   ├── editSessions.ts
│   │   │   │   ├── virtualWorkspace.ts
│   │   │   │   ├── workspaceTrust.ts
│   │   │   │   └── workspace.ts
│   │   │   └── test
│   │   │       └── common
│   │   │           └── testWorkspace.ts
│   │   └── workspaces
│   │       ├── common
│   │       │   └── workspaces.ts
│   │       ├── electron-main
│   │       │   ├── workspacesHistoryMainService.ts
│   │       │   ├── workspacesMainService.ts
│   │       │   └── workspacesManagementMainService.ts
│   │       └── node
│   │           └── workspaces.ts
│   ├── server
│   │   └── node
│   │       ├── extensionHostConnection.ts
│   │       ├── extensionHostStatusService.ts
│   │       ├── extensionsScannerService.ts
│   │       ├── remoteAgentEnvironmentImpl.ts
│   │       ├── remoteExtensionHostAgentCli.ts
│   │       ├── remoteExtensionHostAgentServer.ts
│   │       ├── remoteExtensionManagement.ts
│   │       ├── remoteExtensionsScanner.ts
│   │       ├── remoteFileSystemProviderServer.ts
│   │       ├── remoteLanguagePacks.ts
│   │       ├── remoteTerminalChannel.ts
│   │       ├── server.cli.ts
│   │       ├── serverConnectionToken.ts
│   │       ├── serverEnvironmentService.ts
│   │       ├── server.main.ts
│   │       ├── serverServices.ts
│   │       └── webClientServer.ts
│   └── workbench
│       ├── api
│       │   ├── browser
│       │   │   ├── extensionHost.contribution.ts
│       │   │   ├── mainThreadAiEmbeddingVector.ts
│       │   │   ├── mainThreadAiRelatedInformation.ts
│       │   │   ├── mainThreadAuthentication.ts
│       │   │   ├── mainThreadBulkEdits.ts
│       │   │   ├── mainThreadChatAgents2.ts
│       │   │   ├── mainThreadChatCodeMapper.ts
│       │   │   ├── mainThreadCLICommands.ts
│       │   │   ├── mainThreadClipboard.ts
│       │   │   ├── mainThreadCodeInsets.ts
│       │   │   ├── mainThreadCommands.ts
│       │   │   ├── mainThreadComments.ts
│       │   │   ├── mainThreadConfiguration.ts
│       │   │   ├── mainThreadConsole.ts
│       │   │   ├── mainThreadCustomEditors.ts
│       │   │   ├── mainThreadDebugService.ts
│       │   │   ├── mainThreadDecorations.ts
│       │   │   ├── mainThreadDiagnostics.ts
│       │   │   ├── mainThreadDialogs.ts
│       │   │   ├── mainThreadDocumentContentProviders.ts
│       │   │   ├── mainThreadDocumentsAndEditors.ts
│       │   │   ├── mainThreadDocuments.ts
│       │   │   ├── mainThreadDownloadService.ts
│       │   │   ├── mainThreadEditors.ts
│       │   │   ├── mainThreadEditorTabs.ts
│       │   │   ├── mainThreadEditor.ts
│       │   │   ├── mainThreadEditSessionIdentityParticipant.ts
│       │   │   ├── mainThreadEmbeddings.ts
│       │   │   ├── mainThreadErrors.ts
│       │   │   ├── mainThreadExtensionService.ts
│       │   │   ├── mainThreadFileSystemEventService.ts
│       │   │   ├── mainThreadFileSystem.ts
│       │   │   ├── mainThreadInteractive.ts
│       │   │   ├── mainThreadLabelService.ts
│       │   │   ├── mainThreadLanguageFeatures.ts
│       │   │   ├── mainThreadLanguageModels.ts
│       │   │   ├── mainThreadLanguageModelTools.ts
│       │   │   ├── mainThreadLanguages.ts
│       │   │   ├── mainThreadLocalization.ts
│       │   │   ├── mainThreadLogService.ts
│       │   │   ├── mainThreadManagedSockets.ts
│       │   │   ├── mainThreadMcp.ts
│       │   │   ├── mainThreadMessageService.ts
│       │   │   ├── mainThreadNotebookDocumentsAndEditors.ts
│       │   │   ├── mainThreadNotebookDocuments.ts
│       │   │   ├── mainThreadNotebookDto.ts
│       │   │   ├── mainThreadNotebookEditors.ts
│       │   │   ├── mainThreadNotebookKernels.ts
│       │   │   ├── mainThreadNotebookRenderers.ts
│       │   │   ├── mainThreadNotebookSaveParticipant.ts
│       │   │   ├── mainThreadNotebook.ts
│       │   │   ├── mainThreadOutputService.ts
│       │   │   ├── mainThreadProfileContentHandlers.ts
│       │   │   ├── mainThreadProgress.ts
│       │   │   ├── mainThreadQuickDiff.ts
│       │   │   ├── mainThreadQuickOpen.ts
│       │   │   ├── mainThreadRemoteConnectionData.ts
│       │   │   ├── mainThreadSaveParticipant.ts
│       │   │   ├── mainThreadSCM.ts
│       │   │   ├── mainThreadSearch.ts
│       │   │   ├── mainThreadSecretState.ts
│       │   │   ├── mainThreadShare.ts
│       │   │   ├── mainThreadSpeech.ts
│       │   │   ├── mainThreadStatusBar.ts
│       │   │   ├── mainThreadStorage.ts
│       │   │   ├── mainThreadTask.ts
│       │   │   ├── mainThreadTelemetry.ts
│       │   │   ├── mainThreadTerminalService.ts
│       │   │   ├── mainThreadTerminalShellIntegration.ts
│       │   │   ├── mainThreadTesting.ts
│       │   │   ├── mainThreadTheming.ts
│       │   │   ├── mainThreadTimeline.ts
│       │   │   ├── mainThreadTreeViews.ts
│       │   │   ├── mainThreadTunnelService.ts
│       │   │   ├── mainThreadUriOpeners.ts
│       │   │   ├── mainThreadUrls.ts
│       │   │   ├── mainThreadWebviewManager.ts
│       │   │   ├── mainThreadWebviewPanels.ts
│       │   │   ├── mainThreadWebviews.ts
│       │   │   ├── mainThreadWebviewViews.ts
│       │   │   ├── mainThreadWindow.ts
│       │   │   ├── mainThreadWorkspace.ts
│       │   │   ├── statusBarExtensionPoint.ts
│       │   │   └── viewsExtensionPoint.ts
│       │   ├── common
│       │   │   ├── cache.ts
│       │   │   ├── configurationExtensionPoint.ts
│       │   │   ├── extensionHostMain.ts
│       │   │   ├── extHostAiRelatedInformation.ts
│       │   │   ├── extHostApiCommands.ts
│       │   │   ├── extHostApiDeprecationService.ts
│       │   │   ├── extHost.api.impl.ts
│       │   │   ├── extHostAuthentication.ts
│       │   │   ├── extHostBulkEdits.ts
│       │   │   ├── extHostChatAgents2.ts
│       │   │   ├── extHostClipboard.ts
│       │   │   ├── extHostCodeInsets.ts
│       │   │   ├── extHostCodeMapper.ts
│       │   │   ├── extHostCommands.ts
│       │   │   ├── extHostComments.ts
│       │   │   ├── extHost.common.services.ts
│       │   │   ├── extHostConfiguration.ts
│       │   │   ├── extHostConsoleForwarder.ts
│       │   │   ├── extHostCustomEditors.ts
│       │   │   ├── extHostDebugService.ts
│       │   │   ├── extHostDecorations.ts
│       │   │   ├── extHostDiagnostics.ts
│       │   │   ├── extHostDialogs.ts
│       │   │   ├── extHostDocumentContentProviders.ts
│       │   │   ├── extHostDocumentData.ts
│       │   │   ├── extHostDocumentsAndEditors.ts
│       │   │   ├── extHostDocumentSaveParticipant.ts
│       │   │   ├── extHostDocuments.ts
│       │   │   ├── extHostEditorTabs.ts
│       │   │   ├── extHostEmbedding.ts
│       │   │   ├── extHostEmbeddingVector.ts
│       │   │   ├── extHostExtensionActivator.ts
│       │   │   ├── extHostExtensionService.ts
│       │   │   ├── extHostFileSystemConsumer.ts
│       │   │   ├── extHostFileSystemEventService.ts
│       │   │   ├── extHostFileSystemInfo.ts
│       │   │   ├── extHostFileSystem.ts
│       │   │   ├── extHostInitDataService.ts
│       │   │   ├── extHostInteractive.ts
│       │   │   ├── extHostLabelService.ts
│       │   │   ├── extHostLanguageFeatures.ts
│       │   │   ├── extHostLanguageModels.ts
│       │   │   ├── extHostLanguageModelTools.ts
│       │   │   ├── extHostLanguages.ts
│       │   │   ├── extHostLocalizationService.ts
│       │   │   ├── extHostLoggerService.ts
│       │   │   ├── extHostLogService.ts
│       │   │   ├── extHostManagedSockets.ts
│       │   │   ├── extHostMcp.ts
│       │   │   ├── extHostMemento.ts
│       │   │   ├── extHostMessageService.ts
│       │   │   ├── extHostNotebookDocumentSaveParticipant.ts
│       │   │   ├── extHostNotebookDocuments.ts
│       │   │   ├── extHostNotebookDocument.ts
│       │   │   ├── extHostNotebookEditors.ts
│       │   │   ├── extHostNotebookEditor.ts
│       │   │   ├── extHostNotebookKernels.ts
│       │   │   ├── extHostNotebookRenderers.ts
│       │   │   ├── extHostNotebook.ts
│       │   │   ├── extHostOutput.ts
│       │   │   ├── extHostProfileContentHandler.ts
│       │   │   ├── extHostProgress.ts
│       │   │   ├── extHost.protocol.ts
│       │   │   ├── extHostQuickDiff.ts
│       │   │   ├── extHostQuickOpen.ts
│       │   │   ├── extHostRequireInterceptor.ts
│       │   │   ├── extHostRpcService.ts
│       │   │   ├── extHostSCM.ts
│       │   │   ├── extHostSearch.ts
│       │   │   ├── extHostSecretState.ts
│       │   │   ├── extHostSecrets.ts
│       │   │   ├── extHostShare.ts
│       │   │   ├── extHostSpeech.ts
│       │   │   ├── extHostStatusBar.ts
│       │   │   ├── extHostStoragePaths.ts
│       │   │   ├── extHostStorage.ts
│       │   │   ├── extHostTask.ts
│       │   │   ├── extHostTelemetry.ts
│       │   │   ├── extHostTerminalService.ts
│       │   │   ├── extHostTerminalShellIntegration.ts
│       │   │   ├── extHostTestingPrivateApi.ts
│       │   │   ├── extHostTesting.ts
│       │   │   ├── extHostTestItem.ts
│       │   │   ├── extHostTextEditors.ts
│       │   │   ├── extHostTextEditor.ts
│       │   │   ├── extHostTheming.ts
│       │   │   ├── extHostTimeline.ts
│       │   │   ├── extHostTreeViews.ts
│       │   │   ├── extHostTunnelService.ts
│       │   │   ├── extHostTypeConverters.ts
│       │   │   ├── extHostTypes.ts
│       │   │   ├── extHostUriOpener.ts
│       │   │   ├── extHostUriTransformerService.ts
│       │   │   ├── extHostUrls.ts
│       │   │   ├── extHostVariableResolverService.ts
│       │   │   ├── extHostWebviewMessaging.ts
│       │   │   ├── extHostWebviewPanels.ts
│       │   │   ├── extHostWebview.ts
│       │   │   ├── extHostWebviewView.ts
│       │   │   ├── extHostWindow.ts
│       │   │   ├── extHostWorkspace.ts
│       │   │   ├── jsonValidationExtensionPoint.ts
│       │   │   └── shared
│       │   │       ├── dataTransferCache.ts
│       │   │       └── tasks.ts
│       │   ├── node
│       │   │   ├── extensionHostProcess.ts
│       │   │   ├── extHostCLIServer.ts
│       │   │   ├── extHostConsoleForwarder.ts
│       │   │   ├── extHostDebugService.ts
│       │   │   ├── extHostDiskFileSystemProvider.ts
│       │   │   ├── extHostDownloadService.ts
│       │   │   ├── extHostExtensionService.ts
│       │   │   ├── extHostLoggerService.ts
│       │   │   ├── extHostMpcNode.ts
│       │   │   ├── extHost.node.services.ts
│       │   │   ├── extHostSearch.ts
│       │   │   ├── extHostStoragePaths.ts
│       │   │   ├── extHostTask.ts
│       │   │   ├── extHostTerminalService.ts
│       │   │   ├── extHostTunnelService.ts
│       │   │   ├── extHostVariableResolverService.ts
│       │   │   ├── proxyResolver.ts
│       │   │   └── uriTransformer.ts
│       │   ├── test
│       │   │   ├── browser
│       │   │   │   ├── extHostAuthentication.integrationTest.ts
│       │   │   │   └── extHostDocumentData.test.perf-data.ts
│       │   │   └── common
│       │   │       └── testRPCProtocol.ts
│       │   └── worker
│       │       ├── extensionHostWorkerMain.ts
│       │       ├── extensionHostWorker.ts
│       │       ├── extHostConsoleForwarder.ts
│       │       ├── extHostExtensionService.ts
│       │       └── extHost.worker.services.ts
│       ├── browser
│       │   ├── actions
│       │   │   ├── developerActions.ts
│       │   │   ├── helpActions.ts
│       │   │   ├── layoutActions.ts
│       │   │   ├── listCommands.ts
│       │   │   ├── navigationActions.ts
│       │   │   ├── quickAccessActions.ts
│       │   │   ├── textInputActions.ts
│       │   │   ├── widgetNavigationCommands.ts
│       │   │   ├── windowActions.ts
│       │   │   ├── workspaceActions.ts
│       │   │   └── workspaceCommands.ts
│       │   ├── actions.ts
│       │   ├── codeeditor.ts
│       │   ├── composite.ts
│       │   ├── contextkeys.ts
│       │   ├── dnd.ts
│       │   ├── editor.ts
│       │   ├── labels.ts
│       │   ├── layout.ts
│       │   ├── panecomposite.ts
│       │   ├── parts
│       │   │   ├── activitybar
│       │   │   │   └── activitybarPart.ts
│       │   │   ├── auxiliarybar
│       │   │   │   ├── auxiliaryBarActions.ts
│       │   │   │   └── auxiliaryBarPart.ts
│       │   │   ├── banner
│       │   │   │   └── bannerPart.ts
│       │   │   ├── compositeBarActions.ts
│       │   │   ├── compositeBar.ts
│       │   │   ├── compositePart.ts
│       │   │   ├── dialogs
│       │   │   │   ├── dialogHandler.ts
│       │   │   │   └── dialog.web.contribution.ts
│       │   │   ├── editor
│       │   │   │   ├── auxiliaryEditorPart.ts
│       │   │   │   ├── binaryDiffEditor.ts
│       │   │   │   ├── binaryEditor.ts
│       │   │   │   ├── breadcrumbsControl.ts
│       │   │   │   ├── breadcrumbsModel.ts
│       │   │   │   ├── breadcrumbsPicker.ts
│       │   │   │   ├── breadcrumbs.ts
│       │   │   │   ├── diffEditorCommands.ts
│       │   │   │   ├── editorActions.ts
│       │   │   │   ├── editorAutoSave.ts
│       │   │   │   ├── editorCommandsContext.ts
│       │   │   │   ├── editorCommands.ts
│       │   │   │   ├── editorConfiguration.ts
│       │   │   │   ├── editor.contribution.ts
│       │   │   │   ├── editorDropTarget.ts
│       │   │   │   ├── editorGroupView.ts
│       │   │   │   ├── editorGroupWatermark.ts
│       │   │   │   ├── editorPanes.ts
│       │   │   │   ├── editorPane.ts
│       │   │   │   ├── editorParts.ts
│       │   │   │   ├── editorPart.ts
│       │   │   │   ├── editorPlaceholder.ts
│       │   │   │   ├── editorQuickAccess.ts
│       │   │   │   ├── editorsObserver.ts
│       │   │   │   ├── editorStatus.ts
│       │   │   │   ├── editorTabsControl.ts
│       │   │   │   ├── editorTitleControl.ts
│       │   │   │   ├── editor.ts
│       │   │   │   ├── editorWithViewState.ts
│       │   │   │   ├── multiEditorTabsControl.ts
│       │   │   │   ├── multiRowEditorTabsControl.ts
│       │   │   │   ├── noEditorTabsControl.ts
│       │   │   │   ├── sideBySideEditor.ts
│       │   │   │   ├── singleEditorTabsControl.ts
│       │   │   │   ├── textCodeEditor.ts
│       │   │   │   ├── textDiffEditor.ts
│       │   │   │   ├── textEditor.ts
│       │   │   │   └── textResourceEditor.ts
│       │   │   ├── globalCompositeBar.ts
│       │   │   ├── notifications
│       │   │   │   ├── notificationAccessibleView.ts
│       │   │   │   ├── notificationsActions.ts
│       │   │   │   ├── notificationsAlerts.ts
│       │   │   │   ├── notificationsCenter.ts
│       │   │   │   ├── notificationsCommands.ts
│       │   │   │   ├── notificationsList.ts
│       │   │   │   ├── notificationsStatus.ts
│       │   │   │   ├── notificationsToasts.ts
│       │   │   │   └── notificationsViewer.ts
│       │   │   ├── paneCompositeBar.ts
│       │   │   ├── paneCompositePartService.ts
│       │   │   ├── paneCompositePart.ts
│       │   │   ├── panel
│       │   │   │   ├── panelActions.ts
│       │   │   │   └── panelPart.ts
│       │   │   ├── sidebar
│       │   │   │   ├── sidebarActions.ts
│       │   │   │   └── sidebarPart.ts
│       │   │   ├── statusbar
│       │   │   │   ├── statusbarActions.ts
│       │   │   │   ├── statusbarItem.ts
│       │   │   │   ├── statusbarModel.ts
│       │   │   │   └── statusbarPart.ts
│       │   │   ├── titlebar
│       │   │   │   ├── commandCenterControl.ts
│       │   │   │   ├── menubarControl.ts
│       │   │   │   ├── titlebarActions.ts
│       │   │   │   ├── titlebarPart.ts
│       │   │   │   └── windowTitle.ts
│       │   │   └── views
│       │   │       ├── checkbox.ts
│       │   │       ├── treeView.ts
│       │   │       ├── viewFilter.ts
│       │   │       ├── viewPaneContainer.ts
│       │   │       ├── viewPane.ts
│       │   │       └── viewsViewlet.ts
│       │   ├── part.ts
│       │   ├── quickaccess.ts
│       │   ├── style.ts
│       │   ├── web.api.ts
│       │   ├── web.factory.ts
│       │   ├── web.main.ts
│       │   ├── window.ts
│       │   ├── workbench.contribution.ts
│       │   └── workbench.ts
│       ├── common
│       │   ├── activity.ts
│       │   ├── comments.ts
│       │   ├── component.ts
│       │   ├── composite.ts
│       │   ├── configuration.ts
│       │   ├── contextkeys.ts
│       │   ├── contributions.ts
│       │   ├── dialogs.ts
│       │   ├── editor
│       │   │   ├── binaryEditorModel.ts
│       │   │   ├── diffEditorInput.ts
│       │   │   ├── diffEditorModel.ts
│       │   │   ├── editorGroupModel.ts
│       │   │   ├── editorInput.ts
│       │   │   ├── editorModel.ts
│       │   │   ├── editorOptions.ts
│       │   │   ├── filteredEditorGroupModel.ts
│       │   │   ├── resourceEditorInput.ts
│       │   │   ├── sideBySideEditorInput.ts
│       │   │   ├── textDiffEditorModel.ts
│       │   │   ├── textEditorModel.ts
│       │   │   ├── textResourceEditorInput.ts
│       │   │   └── textResourceEditorModel.ts
│       │   ├── editor.ts
│       │   ├── memento.ts
│       │   ├── notifications.ts
│       │   ├── panecomposite.ts
│       │   ├── resources.ts
│       │   ├── theme.ts
│       │   └── views.ts
│       ├── contrib
│       │   ├── accessibility
│       │   │   ├── browser
│       │   │   │   ├── accessibilityConfiguration.ts
│       │   │   │   ├── accessibility.contribution.ts
│       │   │   │   ├── accessibilityStatus.ts
│       │   │   │   ├── accessibleViewActions.ts
│       │   │   │   ├── accessibleViewContributions.ts
│       │   │   │   ├── accessibleViewKeybindingResolver.ts
│       │   │   │   ├── accessibleView.ts
│       │   │   │   ├── editorAccessibilityHelp.ts
│       │   │   │   ├── extensionAccesibilityHelp.contribution.ts
│       │   │   │   └── unfocusedViewDimmingContribution.ts
│       │   │   └── common
│       │   │       └── accessibilityCommands.ts
│       │   ├── accessibilitySignals
│       │   │   └── browser
│       │   │       ├── accessibilitySignal.contribution.ts
│       │   │       ├── accessibilitySignalDebuggerContribution.ts
│       │   │       ├── commands.ts
│       │   │       ├── editorTextPropertySignalsContribution.ts
│       │   │       ├── openDiffEditorAnnouncement.ts
│       │   │       └── saveAccessibilitySignal.ts
│       │   ├── authentication
│       │   │   └── browser
│       │   │       ├── actions
│       │   │       │   ├── manageAccountPreferencesForExtensionAction.ts
│       │   │       │   ├── manageTrustedExtensionsForAccountAction.ts
│       │   │       │   └── signOutOfAccountAction.ts
│       │   │       └── authentication.contribution.ts
│       │   ├── bracketPairColorizer2Telemetry
│       │   │   └── browser
│       │   │       └── bracketPairColorizer2Telemetry.contribution.ts
│       │   ├── bulkEdit
│       │   │   └── browser
│       │   │       ├── bulkCellEdits.ts
│       │   │       ├── bulkEditService.ts
│       │   │       ├── bulkFileEdits.ts
│       │   │       ├── bulkTextEdits.ts
│       │   │       ├── conflicts.ts
│       │   │       ├── opaqueEdits.ts
│       │   │       └── preview
│       │   │           ├── bulkEdit.contribution.ts
│       │   │           ├── bulkEditPane.ts
│       │   │           ├── bulkEditPreview.ts
│       │   │           └── bulkEditTree.ts
│       │   ├── callHierarchy
│       │   │   ├── browser
│       │   │   │   ├── callHierarchy.contribution.ts
│       │   │   │   ├── callHierarchyPeek.ts
│       │   │   │   └── callHierarchyTree.ts
│       │   │   └── common
│       │   │       └── callHierarchy.ts
│       │   ├── chat
│       │   │   ├── browser
│       │   │   │   ├── actions
│       │   │   │   │   ├── chatAccessibilityHelp.ts
│       │   │   │   │   ├── chatActions.ts
│       │   │   │   │   ├── chatAttachPromptAction
│       │   │   │   │   │   ├── chatAttachPromptAction.ts
│       │   │   │   │   │   └── dialogs
│       │   │   │   │   │       └── askToSelectPrompt.ts
│       │   │   │   │   ├── chatClearActions.ts
│       │   │   │   │   ├── chatClear.ts
│       │   │   │   │   ├── chatCodeblockActions.ts
│       │   │   │   │   ├── chatContextActions.ts
│       │   │   │   │   ├── chatCopyActions.ts
│       │   │   │   │   ├── chatDeveloperActions.ts
│       │   │   │   │   ├── chatExecuteActions.ts
│       │   │   │   │   ├── chatFileTreeActions.ts
│       │   │   │   │   ├── chatGettingStarted.ts
│       │   │   │   │   ├── chatImportExport.ts
│       │   │   │   │   ├── chatMoveActions.ts
│       │   │   │   │   ├── chatQuickInputActions.ts
│       │   │   │   │   ├── chatTitleActions.ts
│       │   │   │   │   ├── chatToolActions.ts
│       │   │   │   │   ├── chatTransfer.ts
│       │   │   │   │   └── codeBlockOperations.ts
│       │   │   │   ├── attachments
│       │   │   │   │   ├── implicitContextAttachment.ts
│       │   │   │   │   └── promptAttachments
│       │   │   │   │       ├── promptAttachmentsCollectionWidget.ts
│       │   │   │   │       └── promptAttachmentWidget.ts
│       │   │   │   ├── chatAccessibilityProvider.ts
│       │   │   │   ├── chatAccessibilityService.ts
│       │   │   │   ├── chatAgentHover.ts
│       │   │   │   ├── chatAttachmentModel
│       │   │   │   │   ├── chatPromptAttachmentModel.ts
│       │   │   │   │   └── chatPromptAttachmentsCollection.ts
│       │   │   │   ├── chatAttachmentModel.ts
│       │   │   │   ├── chatAttachmentWidgets.ts
│       │   │   │   ├── chatContentParts
│       │   │   │   │   ├── chatAgentCommandContentPart.ts
│       │   │   │   │   ├── chatAttachmentsContentPart.ts
│       │   │   │   │   ├── chatCodeCitationContentPart.ts
│       │   │   │   │   ├── chatCollections.ts
│       │   │   │   │   ├── chatCommandContentPart.ts
│       │   │   │   │   ├── chatConfirmationContentPart.ts
│       │   │   │   │   ├── chatConfirmationWidget.ts
│       │   │   │   │   ├── chatContentParts.ts
│       │   │   │   │   ├── chatMarkdownAnchorService.ts
│       │   │   │   │   ├── chatMarkdownContentPart.ts
│       │   │   │   │   ├── chatProgressContentPart.ts
│       │   │   │   │   ├── chatQuotaExceededPart.ts
│       │   │   │   │   ├── chatReferencesContentPart.ts
│       │   │   │   │   ├── chatTaskContentPart.ts
│       │   │   │   │   ├── chatTextEditContentPart.ts
│       │   │   │   │   ├── chatToolInvocationPart.ts
│       │   │   │   │   ├── chatTreeContentPart.ts
│       │   │   │   │   └── chatWarningContentPart.ts
│       │   │   │   ├── chat.contribution.ts
│       │   │   │   ├── chatDragAndDrop.ts
│       │   │   │   ├── chatEdinputInputContentProvider.ts
│       │   │   │   ├── chatEditing
│       │   │   │   │   ├── chatEditingActions.ts
│       │   │   │   │   ├── chatEditingCodeEditorIntegration.ts
│       │   │   │   │   ├── chatEditingEditorAccessibility.ts
│       │   │   │   │   ├── chatEditingEditorActions.ts
│       │   │   │   │   ├── chatEditingEditorContextKeys.ts
│       │   │   │   │   ├── chatEditingEditorOverlay.ts
│       │   │   │   │   ├── chatEditingModifiedDocumentEntry.ts
│       │   │   │   │   ├── chatEditingModifiedFileEntry.ts
│       │   │   │   │   ├── chatEditingModifiedNotebookEntry.ts
│       │   │   │   │   ├── chatEditingServiceImpl.ts
│       │   │   │   │   ├── chatEditingSession.ts
│       │   │   │   │   ├── chatEditingTextModelContentProviders.ts
│       │   │   │   │   ├── chatEditing.ts
│       │   │   │   │   └── notebook
│       │   │   │   │       ├── chatEditingModifiedNotebookDiff.ts
│       │   │   │   │       ├── chatEditingModifiedNotebookSnapshot.ts
│       │   │   │   │       ├── chatEditingNewNotebookContentEdits.ts
│       │   │   │   │       ├── chatEditingNotebookCellEntry.ts
│       │   │   │   │       ├── chatEditingNotebookEditorIntegration.ts
│       │   │   │   │       ├── chatEditingNotebookFileSystemProvider.ts
│       │   │   │   │       ├── helpers.ts
│       │   │   │   │       └── notebookCellChanges.ts
│       │   │   │   ├── chatEditorInput.ts
│       │   │   │   ├── chatEditor.ts
│       │   │   │   ├── chatFollowups.ts
│       │   │   │   ├── chatInlineAnchorWidget.ts
│       │   │   │   ├── chatInputPart.ts
│       │   │   │   ├── chatListRenderer.ts
│       │   │   │   ├── chatMarkdownDecorationsRenderer.ts
│       │   │   │   ├── chatMarkdownRenderer.ts
│       │   │   │   ├── chatOptions.ts
│       │   │   │   ├── chatParticipant.contribution.ts
│       │   │   │   ├── chatPasteProviders.ts
│       │   │   │   ├── chatQuick.ts
│       │   │   │   ├── chatResponseAccessibleView.ts
│       │   │   │   ├── chatSelectedTools.ts
│       │   │   │   ├── chatSetup.ts
│       │   │   │   ├── chatStatus.ts
│       │   │   │   ├── chat.ts
│       │   │   │   ├── chatVariables.ts
│       │   │   │   ├── chatViewPane.ts
│       │   │   │   ├── chatWidget.ts
│       │   │   │   ├── codeBlockContextProviderService.ts
│       │   │   │   ├── codeBlockPart.ts
│       │   │   │   ├── contrib
│       │   │   │   │   ├── chatDynamicVariables
│       │   │   │   │   │   └── chatFileReference.ts
│       │   │   │   │   ├── chatDynamicVariables.ts
│       │   │   │   │   ├── chatImplicitContext.ts
│       │   │   │   │   ├── chatInputCompletions.ts
│       │   │   │   │   ├── chatInputEditorContrib.ts
│       │   │   │   │   ├── chatInputEditorHover.ts
│       │   │   │   │   ├── chatInputRelatedFilesContrib.ts
│       │   │   │   │   ├── editorHoverWrapper.ts
│       │   │   │   │   └── screenshot.ts
│       │   │   │   ├── imageUtils.ts
│       │   │   │   ├── languageModelToolsService.ts
│       │   │   │   ├── promptSyntax
│       │   │   │   │   └── contributions
│       │   │   │   │       ├── createPromptCommand
│       │   │   │   │       │   ├── createPromptCommand.ts
│       │   │   │   │       │   ├── dialogs
│       │   │   │   │       │   │   ├── askForPromptName.ts
│       │   │   │   │       │   │   └── askForPromptSourceFolder.ts
│       │   │   │   │       │   ├── errors.ts
│       │   │   │   │       │   └── utils
│       │   │   │   │       │       └── createPromptFile.ts
│       │   │   │   │       └── usePromptCommand.ts
│       │   │   │   └── viewsWelcome
│       │   │   │       ├── chatViewsWelcomeHandler.ts
│       │   │   │       ├── chatViewsWelcome.ts
│       │   │   │       └── chatViewWelcomeController.ts
│       │   │   ├── common
│       │   │   │   ├── annotations.ts
│       │   │   │   ├── chatActions.ts
│       │   │   │   ├── chatAgents.ts
│       │   │   │   ├── chatCodeMapperService.ts
│       │   │   │   ├── chatColors.ts
│       │   │   │   ├── chatContextKeys.ts
│       │   │   │   ├── chatEditingService.ts
│       │   │   │   ├── chatEntitlementService.ts
│       │   │   │   ├── chatModel.ts
│       │   │   │   ├── chatParserTypes.ts
│       │   │   │   ├── chatParticipantContribTypes.ts
│       │   │   │   ├── chatProgressTypes
│       │   │   │   │   └── chatToolInvocation.ts
│       │   │   │   ├── chatRequestParser.ts
│       │   │   │   ├── chatServiceImpl.ts
│       │   │   │   ├── chatServiceTelemetry.ts
│       │   │   │   ├── chatService.ts
│       │   │   │   ├── chatSlashCommands.ts
│       │   │   │   ├── chatTransferService.ts
│       │   │   │   ├── chat.ts
│       │   │   │   ├── chatVariables.ts
│       │   │   │   ├── chatViewModel.ts
│       │   │   │   ├── chatWidgetHistoryService.ts
│       │   │   │   ├── chatWordCounter.ts
│       │   │   │   ├── codeBlockModelCollection.ts
│       │   │   │   ├── constants.ts
│       │   │   │   ├── ignoredFiles.ts
│       │   │   │   ├── languageModelStats.ts
│       │   │   │   ├── languageModels.ts
│       │   │   │   ├── languageModelToolsService.ts
│       │   │   │   ├── promptFileReferenceErrors.ts
│       │   │   │   ├── promptSyntax
│       │   │   │   │   ├── codecs
│       │   │   │   │   │   ├── chatPromptCodec.ts
│       │   │   │   │   │   ├── chatPromptDecoder.ts
│       │   │   │   │   │   ├── parsers
│       │   │   │   │   │   │   └── promptVariableParser.ts
│       │   │   │   │   │   └── tokens
│       │   │   │   │   │       ├── fileReference.ts
│       │   │   │   │   │       ├── promptToken.ts
│       │   │   │   │   │       └── promptVariable.ts
│       │   │   │   │   ├── constants.ts
│       │   │   │   │   ├── contentProviders
│       │   │   │   │   │   ├── filePromptContentsProvider.ts
│       │   │   │   │   │   ├── promptContentsProviderBase.ts
│       │   │   │   │   │   ├── textModelContentsProvider.ts
│       │   │   │   │   │   └── types.d.ts
│       │   │   │   │   ├── languageFeatures
│       │   │   │   │   │   ├── promptLinkDiagnosticsProvider.ts
│       │   │   │   │   │   ├── promptLinkProvider.ts
│       │   │   │   │   │   ├── promptPathAutocompletion.ts
│       │   │   │   │   │   └── types.d.ts
│       │   │   │   │   ├── parsers
│       │   │   │   │   │   ├── basePromptParser.ts
│       │   │   │   │   │   ├── filePromptParser.ts
│       │   │   │   │   │   ├── textModelPromptParser.ts
│       │   │   │   │   │   ├── topError.ts
│       │   │   │   │   │   └── types.d.ts
│       │   │   │   │   ├── service
│       │   │   │   │   │   ├── promptsService.ts
│       │   │   │   │   │   └── types.ts
│       │   │   │   │   └── utils
│       │   │   │   │       └── promptFilesLocator.ts
│       │   │   │   ├── tools
│       │   │   │   │   ├── editFileTool.ts
│       │   │   │   │   ├── languageModelToolsContribution.ts
│       │   │   │   │   ├── languageModelToolsParametersSchema.ts
│       │   │   │   │   └── tools.ts
│       │   │   │   └── voiceChatService.ts
│       │   │   ├── electron-sandbox
│       │   │   │   ├── actions
│       │   │   │   │   └── voiceChatActions.ts
│       │   │   │   ├── chat.contribution.ts
│       │   │   │   └── tools
│       │   │   │       └── fetchPageTool.ts
│       │   │   └── test
│       │   │       ├── browser
│       │   │       │   └── mockChatWidget.ts
│       │   │       └── common
│       │   │           ├── mockChatService.ts
│       │   │           ├── mockChatVariables.ts
│       │   │           ├── mockLanguageModelToolsService.ts
│       │   │           └── promptSyntax
│       │   │               └── testUtils
│       │   │                   ├── createUri.ts
│       │   │                   ├── expectedReference.ts
│       │   │                   └── mockFilesystem.ts
│       │   ├── codeActions
│       │   │   └── browser
│       │   │       ├── codeActions.contribution.ts
│       │   │       └── codeActionsContribution.ts
│       │   ├── codeEditor
│       │   │   ├── browser
│       │   │   │   ├── accessibility
│       │   │   │   │   └── accessibility.ts
│       │   │   │   ├── codeEditor.contribution.ts
│       │   │   │   ├── dictation
│       │   │   │   │   └── editorDictation.ts
│       │   │   │   ├── diffEditorAccessibilityHelp.ts
│       │   │   │   ├── diffEditorHelper.ts
│       │   │   │   ├── editorFeatures.ts
│       │   │   │   ├── editorLineNumberMenu.ts
│       │   │   │   ├── editorSettingsMigration.ts
│       │   │   │   ├── emptyTextEditorHint
│       │   │   │   │   └── emptyTextEditorHint.ts
│       │   │   │   ├── find
│       │   │   │   │   └── simpleFindWidget.ts
│       │   │   │   ├── inspectEditorTokens
│       │   │   │   │   └── inspectEditorTokens.ts
│       │   │   │   ├── inspectKeybindings.ts
│       │   │   │   ├── largeFileOptimizations.ts
│       │   │   │   ├── menuPreventer.ts
│       │   │   │   ├── outline
│       │   │   │   │   ├── documentSymbolsOutline.ts
│       │   │   │   │   └── documentSymbolsTree.ts
│       │   │   │   ├── quickaccess
│       │   │   │   │   ├── gotoLineQuickAccess.ts
│       │   │   │   │   └── gotoSymbolQuickAccess.ts
│       │   │   │   ├── saveParticipants.ts
│       │   │   │   ├── selectionClipboard.ts
│       │   │   │   ├── simpleEditorOptions.ts
│       │   │   │   ├── suggestEnabledInput
│       │   │   │   │   └── suggestEnabledInput.ts
│       │   │   │   ├── toggleColumnSelection.ts
│       │   │   │   ├── toggleMinimap.ts
│       │   │   │   ├── toggleMultiCursorModifier.ts
│       │   │   │   ├── toggleOvertype.ts
│       │   │   │   ├── toggleRenderControlCharacter.ts
│       │   │   │   ├── toggleRenderWhitespace.ts
│       │   │   │   ├── toggleWordWrap.ts
│       │   │   │   ├── workbenchEditorWorkerService.ts
│       │   │   │   └── workbenchReferenceSearch.ts
│       │   │   ├── common
│       │   │   │   └── languageConfigurationExtensionPoint.ts
│       │   │   ├── electron-sandbox
│       │   │   │   ├── codeEditor.contribution.ts
│       │   │   │   ├── displayChangeRemeasureFonts.ts
│       │   │   │   ├── inputClipboardActions.ts
│       │   │   │   ├── selectionClipboard.ts
│       │   │   │   ├── sleepResumeRepaintMinimap.ts
│       │   │   │   └── startDebugTextMate.ts
│       │   │   └── test
│       │   │       └── node
│       │   │           └── language-configuration.json
│       │   ├── commands
│       │   │   └── common
│       │   │       └── commands.contribution.ts
│       │   ├── comments
│       │   │   ├── browser
│       │   │   │   ├── commentColors.ts
│       │   │   │   ├── commentFormActions.ts
│       │   │   │   ├── commentGlyphWidget.ts
│       │   │   │   ├── commentMenus.ts
│       │   │   │   ├── commentNode.ts
│       │   │   │   ├── commentReply.ts
│       │   │   │   ├── commentsAccessibility.ts
│       │   │   │   ├── commentsAccessibleView.ts
│       │   │   │   ├── comments.contribution.ts
│       │   │   │   ├── commentsController.ts
│       │   │   │   ├── commentsEditorContribution.ts
│       │   │   │   ├── commentService.ts
│       │   │   │   ├── commentsFilterOptions.ts
│       │   │   │   ├── commentsInputContentProvider.ts
│       │   │   │   ├── commentsModel.ts
│       │   │   │   ├── commentsTreeViewer.ts
│       │   │   │   ├── comments.ts
│       │   │   │   ├── commentsViewActions.ts
│       │   │   │   ├── commentsView.ts
│       │   │   │   ├── commentThreadAdditionalActions.ts
│       │   │   │   ├── commentThreadBody.ts
│       │   │   │   ├── commentThreadHeader.ts
│       │   │   │   ├── commentThreadRangeDecorator.ts
│       │   │   │   ├── commentThreadWidget.ts
│       │   │   │   ├── commentThreadZoneWidget.ts
│       │   │   │   ├── reactionsAction.ts
│       │   │   │   ├── simpleCommentEditor.ts
│       │   │   │   └── timestamp.ts
│       │   │   └── common
│       │   │       ├── commentCommandIds.ts
│       │   │       ├── commentContextKeys.ts
│       │   │       ├── commentModel.ts
│       │   │       ├── commentsConfiguration.ts
│       │   │       └── commentThreadWidget.ts
│       │   ├── configExporter
│       │   │   └── electron-sandbox
│       │   │       ├── configurationExportHelper.contribution.ts
│       │   │       └── configurationExportHelper.ts
│       │   ├── contextmenu
│       │   │   └── browser
│       │   │       └── contextmenu.contribution.ts
│       │   ├── customEditor
│       │   │   ├── browser
│       │   │   │   ├── customEditor.contribution.ts
│       │   │   │   ├── customEditorInputFactory.ts
│       │   │   │   ├── customEditorInput.ts
│       │   │   │   └── customEditors.ts
│       │   │   └── common
│       │   │       ├── contributedCustomEditors.ts
│       │   │       ├── customEditorModelManager.ts
│       │   │       ├── customEditor.ts
│       │   │       ├── customTextEditorModel.ts
│       │   │       └── extensionPoint.ts
│       │   ├── debug
│       │   │   ├── browser
│       │   │   │   ├── baseDebugView.ts
│       │   │   │   ├── breakpointEditorContribution.ts
│       │   │   │   ├── breakpointsView.ts
│       │   │   │   ├── breakpointWidget.ts
│       │   │   │   ├── callStackEditorContribution.ts
│       │   │   │   ├── callStackView.ts
│       │   │   │   ├── callStackWidget.ts
│       │   │   │   ├── debugActionViewItems.ts
│       │   │   │   ├── debugAdapterManager.ts
│       │   │   │   ├── debugANSIHandling.ts
│       │   │   │   ├── debugColors.ts
│       │   │   │   ├── debugCommands.ts
│       │   │   │   ├── debugConfigurationManager.ts
│       │   │   │   ├── debugConsoleQuickAccess.ts
│       │   │   │   ├── debug.contribution.ts
│       │   │   │   ├── debugEditorActions.ts
│       │   │   │   ├── debugEditorContribution.ts
│       │   │   │   ├── debugExpressionRenderer.ts
│       │   │   │   ├── debugHover.ts
│       │   │   │   ├── debugIcons.ts
│       │   │   │   ├── debugMemory.ts
│       │   │   │   ├── debugProgress.ts
│       │   │   │   ├── debugQuickAccess.ts
│       │   │   │   ├── debugService.ts
│       │   │   │   ├── debugSessionPicker.ts
│       │   │   │   ├── debugSession.ts
│       │   │   │   ├── debugSettingMigration.ts
│       │   │   │   ├── debugStatus.ts
│       │   │   │   ├── debugTaskRunner.ts
│       │   │   │   ├── debugTitle.ts
│       │   │   │   ├── debugToolBar.ts
│       │   │   │   ├── debugViewlet.ts
│       │   │   │   ├── disassemblyView.ts
│       │   │   │   ├── exceptionWidget.ts
│       │   │   │   ├── extensionHostDebugService.ts
│       │   │   │   ├── linkDetector.ts
│       │   │   │   ├── loadedScriptsView.ts
│       │   │   │   ├── rawDebugSession.ts
│       │   │   │   ├── replAccessibilityHelp.ts
│       │   │   │   ├── replAccessibleView.ts
│       │   │   │   ├── replFilter.ts
│       │   │   │   ├── repl.ts
│       │   │   │   ├── replViewer.ts
│       │   │   │   ├── runAndDebugAccessibilityHelp.ts
│       │   │   │   ├── statusbarColorProvider.ts
│       │   │   │   ├── variablesView.ts
│       │   │   │   ├── watchExpressionsView.ts
│       │   │   │   └── welcomeView.ts
│       │   │   ├── common
│       │   │   │   ├── abstractDebugAdapter.ts
│       │   │   │   ├── breakpoints.ts
│       │   │   │   ├── debugAccessibilityAnnouncer.ts
│       │   │   │   ├── debugCompoundRoot.ts
│       │   │   │   ├── debugContentProvider.ts
│       │   │   │   ├── debugContext.ts
│       │   │   │   ├── debugger.ts
│       │   │   │   ├── debugLifecycle.ts
│       │   │   │   ├── debugModel.ts
│       │   │   │   ├── debugProtocol.d.ts
│       │   │   │   ├── debugSchemas.ts
│       │   │   │   ├── debugSource.ts
│       │   │   │   ├── debugStorage.ts
│       │   │   │   ├── debugTelemetry.ts
│       │   │   │   ├── debug.ts
│       │   │   │   ├── debugUtils.ts
│       │   │   │   ├── debugViewModel.ts
│       │   │   │   ├── debugVisualizers.ts
│       │   │   │   ├── disassemblyViewInput.ts
│       │   │   │   ├── loadedScriptsPicker.ts
│       │   │   │   ├── replAccessibilityAnnouncer.ts
│       │   │   │   └── replModel.ts
│       │   │   ├── electron-sandbox
│       │   │   │   └── extensionHostDebugService.ts
│       │   │   ├── node
│       │   │   │   ├── debugAdapter.ts
│       │   │   │   ├── telemetryApp.ts
│       │   │   │   └── terminals.ts
│       │   │   └── test
│       │   │       ├── browser
│       │   │       │   └── mockDebugModel.ts
│       │   │       └── common
│       │   │           └── mockDebug.ts
│       │   ├── deprecatedExtensionMigrator
│       │   │   └── browser
│       │   │       └── deprecatedExtensionMigrator.contribution.ts
│       │   ├── DevSphere
│       │   │   └── browser
│       │   │       ├── devSphereActionCommands.ts
│       │   │       ├── DevSphere.contribution.ts
│       │   │       ├── devSphereErrorHandler.ts
│       │   │       ├── devSphereMarkdownFormatter.ts
│       │   │       ├── devSphereService.ts
│       │   │       ├── devSphereViewModel.ts
│       │   │       ├── devSphereView.ts
│       │   │       ├── models
│       │   │       │   ├── modelData.ts
│       │   │       │   └── types.ts
│       │   │       ├── services
│       │   │       │   ├── apiKeyService.ts
│       │   │       │   ├── apiProviders
│       │   │       │   │   ├── anthropicProvider.ts
│       │   │       │   │   ├── apiProviderFactory.ts
│       │   │       │   │   ├── apiProviderInterface.ts
│       │   │       │   │   ├── googleProvider.ts
│       │   │       │   │   └── openAIProvider.ts
│       │   │       │   ├── chatService.ts
│       │   │       │   ├── corsHandlerService.ts
│       │   │       │   ├── devSphereServiceImpl.ts
│       │   │       │   ├── devSphereServiceInterface.ts
│       │   │       │   └── modelService.ts
│       │   │       └── view
│       │   │           ├── devSphereAPIKeys.ts
│       │   │           ├── devSphereBaseView.ts
│       │   │           ├── devSphereChatSelector.ts
│       │   │           ├── devSphereHeader.ts
│       │   │           ├── devSphereHistory.ts
│       │   │           ├── devSphereInput.ts
│       │   │           ├── devSphereMessages.ts
│       │   │           ├── devSphereTabs.ts
│       │   │           └── devSphereViewTabs.ts
│       │   ├── dropOrPasteInto
│       │   │   └── browser
│       │   │       ├── commands.ts
│       │   │       ├── configurationSchema.ts
│       │   │       └── dropOrPasteInto.contribution.ts
│       │   ├── editSessions
│       │   │   ├── browser
│       │   │   │   ├── editSessions.contribution.ts
│       │   │   │   ├── editSessionsFileSystemProvider.ts
│       │   │   │   ├── editSessionsStorageService.ts
│       │   │   │   └── editSessionsViews.ts
│       │   │   └── common
│       │   │       ├── editSessionsLogService.ts
│       │   │       ├── editSessionsStorageClient.ts
│       │   │       ├── editSessions.ts
│       │   │       └── workspaceStateSync.ts
│       │   ├── emergencyAlert
│       │   │   └── electron-sandbox
│       │   │       └── emergencyAlert.contribution.ts
│       │   ├── emmet
│       │   │   └── browser
│       │   │       ├── actions
│       │   │       │   └── expandAbbreviation.ts
│       │   │       ├── emmetActions.ts
│       │   │       └── emmet.contribution.ts
│       │   ├── encryption
│       │   │   └── electron-sandbox
│       │   │       └── encryption.contribution.ts
│       │   ├── extensions
│       │   │   ├── browser
│       │   │   │   ├── abstractRuntimeExtensionsEditor.ts
│       │   │   │   ├── browserRuntimeExtensionsEditor.ts
│       │   │   │   ├── configBasedRecommendations.ts
│       │   │   │   ├── exeBasedRecommendations.ts
│       │   │   │   ├── extensionEditor.ts
│       │   │   │   ├── extensionEnablementWorkspaceTrustTransitionParticipant.ts
│       │   │   │   ├── extensionFeaturesTab.ts
│       │   │   │   ├── extensionRecommendationNotificationService.ts
│       │   │   │   ├── extensionRecommendationsService.ts
│       │   │   │   ├── extensionRecommendations.ts
│       │   │   │   ├── extensionsActions.ts
│       │   │   │   ├── extensionsActivationProgress.ts
│       │   │   │   ├── extensionsCompletionItemsProvider.ts
│       │   │   │   ├── extensions.contribution.ts
│       │   │   │   ├── extensionsDependencyChecker.ts
│       │   │   │   ├── extensionsIcons.ts
│       │   │   │   ├── extensionsList.ts
│       │   │   │   ├── extensionsQuickAccess.ts
│       │   │   │   ├── extensionsViewer.ts
│       │   │   │   ├── extensionsViewlet.ts
│       │   │   │   ├── extensionsViews.ts
│       │   │   │   ├── extensions.web.contribution.ts
│       │   │   │   ├── extensionsWidgets.ts
│       │   │   │   ├── extensionsWorkbenchService.ts
│       │   │   │   ├── fileBasedRecommendations.ts
│       │   │   │   ├── keymapRecommendations.ts
│       │   │   │   ├── languageRecommendations.ts
│       │   │   │   ├── remoteRecommendations.ts
│       │   │   │   ├── unsupportedExtensionsMigrationContribution.ts
│       │   │   │   ├── webRecommendations.ts
│       │   │   │   └── workspaceRecommendations.ts
│       │   │   ├── common
│       │   │   │   ├── extensionQuery.ts
│       │   │   │   ├── extensionsFileTemplate.ts
│       │   │   │   ├── extensionsInput.ts
│       │   │   │   ├── extensions.ts
│       │   │   │   ├── extensionsUtils.ts
│       │   │   │   ├── reportExtensionIssueAction.ts
│       │   │   │   └── runtimeExtensionsInput.ts
│       │   │   └── electron-sandbox
│       │   │       ├── debugExtensionHostAction.ts
│       │   │       ├── extensionProfileService.ts
│       │   │       ├── extensionsActions.ts
│       │   │       ├── extensionsAutoProfiler.ts
│       │   │       ├── extensions.contribution.ts
│       │   │       ├── extensionsSlowActions.ts
│       │   │       ├── remoteExtensionsInit.ts
│       │   │       └── runtimeExtensionsEditor.ts
│       │   ├── externalTerminal
│       │   │   ├── browser
│       │   │   │   └── externalTerminal.contribution.ts
│       │   │   └── electron-sandbox
│       │   │       └── externalTerminal.contribution.ts
│       │   ├── externalUriOpener
│       │   │   └── common
│       │   │       ├── configuration.ts
│       │   │       ├── contributedOpeners.ts
│       │   │       ├── externalUriOpener.contribution.ts
│       │   │       └── externalUriOpenerService.ts
│       │   ├── files
│       │   │   ├── browser
│       │   │   │   ├── editors
│       │   │   │   │   ├── binaryFileEditor.ts
│       │   │   │   │   ├── fileEditorHandler.ts
│       │   │   │   │   ├── fileEditorInput.ts
│       │   │   │   │   ├── textFileEditorTracker.ts
│       │   │   │   │   ├── textFileEditor.ts
│       │   │   │   │   └── textFileSaveErrorHandler.ts
│       │   │   │   ├── explorerFileContrib.ts
│       │   │   │   ├── explorerService.ts
│       │   │   │   ├── explorerViewlet.ts
│       │   │   │   ├── fileActions.contribution.ts
│       │   │   │   ├── fileActions.ts
│       │   │   │   ├── fileCommands.ts
│       │   │   │   ├── fileConstants.ts
│       │   │   │   ├── fileImportExport.ts
│       │   │   │   ├── files.contribution.ts
│       │   │   │   ├── files.ts
│       │   │   │   ├── views
│       │   │   │   │   ├── emptyView.ts
│       │   │   │   │   ├── explorerDecorationsProvider.ts
│       │   │   │   │   ├── explorerViewer.ts
│       │   │   │   │   ├── explorerView.ts
│       │   │   │   │   └── openEditorsView.ts
│       │   │   │   └── workspaceWatcher.ts
│       │   │   ├── common
│       │   │   │   ├── dirtyFilesIndicator.ts
│       │   │   │   ├── explorerFileNestingTrie.ts
│       │   │   │   ├── explorerModel.ts
│       │   │   │   └── files.ts
│       │   │   └── electron-sandbox
│       │   │       ├── fileActions.contribution.ts
│       │   │       └── fileCommands.ts
│       │   ├── folding
│       │   │   └── browser
│       │   │       └── folding.contribution.ts
│       │   ├── format
│       │   │   └── browser
│       │   │       ├── formatActionsMultiple.ts
│       │   │       ├── formatActionsNone.ts
│       │   │       ├── format.contribution.ts
│       │   │       └── formatModified.ts
│       │   ├── inlayHints
│       │   │   └── browser
│       │   │       └── inlayHintsAccessibilty.ts
│       │   ├── inlineChat
│       │   │   ├── browser
│       │   │   │   ├── inlineChatAccessibilityHelp.ts
│       │   │   │   ├── inlineChatAccessibleView.ts
│       │   │   │   ├── inlineChatActions.ts
│       │   │   │   ├── inlineChat.contribution.ts
│       │   │   │   ├── inlineChatController.ts
│       │   │   │   ├── inlineChatCurrentLine.ts
│       │   │   │   ├── inlineChatNotebook.ts
│       │   │   │   ├── inlineChatSessionServiceImpl.ts
│       │   │   │   ├── inlineChatSessionService.ts
│       │   │   │   ├── inlineChatSession.ts
│       │   │   │   ├── inlineChatStrategies.ts
│       │   │   │   ├── inlineChatWidget.ts
│       │   │   │   ├── inlineChatZoneWidget.ts
│       │   │   │   └── utils.ts
│       │   │   ├── common
│       │   │   │   └── inlineChat.ts
│       │   │   ├── electron-sandbox
│       │   │   │   ├── inlineChatActions.ts
│       │   │   │   └── inlineChat.contribution.ts
│       │   │   └── test
│       │   │       └── browser
│       │   │           └── testWorkerService.ts
│       │   ├── inlineCompletions
│       │   │   └── browser
│       │   │       ├── inlineCompletionLanguageStatusBarContribution.ts
│       │   │       └── inlineCompletions.contribution.ts
│       │   ├── interactive
│       │   │   └── browser
│       │   │       ├── interactiveCommon.ts
│       │   │       ├── interactive.contribution.ts
│       │   │       ├── interactiveDocumentService.ts
│       │   │       ├── interactiveEditorInput.ts
│       │   │       ├── interactiveEditor.ts
│       │   │       ├── interactiveHistoryService.ts
│       │   │       └── replInputHintContentWidget.ts
│       │   ├── issue
│       │   │   ├── browser
│       │   │   │   ├── baseIssueReporterService.ts
│       │   │   │   ├── issue.contribution.ts
│       │   │   │   ├── issueFormService.ts
│       │   │   │   ├── issueQuickAccess.ts
│       │   │   │   ├── issueReporterModel.ts
│       │   │   │   ├── issueReporterPage.ts
│       │   │   │   ├── issueReporterService.ts
│       │   │   │   ├── issueService.ts
│       │   │   │   └── issueTroubleshoot.ts
│       │   │   ├── common
│       │   │   │   ├── issue.contribution.ts
│       │   │   │   ├── issueReporterUtil.ts
│       │   │   │   └── issue.ts
│       │   │   └── electron-sandbox
│       │   │       ├── issue.contribution.ts
│       │   │       ├── issueReporterService.ts
│       │   │       ├── issueService.ts
│       │   │       ├── nativeIssueFormService.ts
│       │   │       ├── process.contribution.ts
│       │   │       ├── processMainService.ts
│       │   │       └── processService.ts
│       │   ├── keybindings
│       │   │   └── browser
│       │   │       └── keybindings.contribution.ts
│       │   ├── languageDetection
│       │   │   └── browser
│       │   │       └── languageDetection.contribution.ts
│       │   ├── languageStatus
│       │   │   └── browser
│       │   │       ├── languageStatus.contribution.ts
│       │   │       └── languageStatus.ts
│       │   ├── limitIndicator
│       │   │   └── browser
│       │   │       └── limitIndicator.contribution.ts
│       │   ├── list
│       │   │   └── browser
│       │   │       ├── list.contribution.ts
│       │   │       ├── listResizeColumnAction.ts
│       │   │       └── tableColumnResizeQuickPick.ts
│       │   ├── localHistory
│       │   │   ├── browser
│       │   │   │   ├── localHistoryCommands.ts
│       │   │   │   ├── localHistory.contribution.ts
│       │   │   │   ├── localHistoryFileSystemProvider.ts
│       │   │   │   ├── localHistoryTimeline.ts
│       │   │   │   └── localHistory.ts
│       │   │   └── electron-sandbox
│       │   │       ├── localHistoryCommands.ts
│       │   │       └── localHistory.contribution.ts
│       │   ├── localization
│       │   │   ├── browser
│       │   │   │   └── localization.contribution.ts
│       │   │   ├── common
│       │   │   │   ├── localization.contribution.ts
│       │   │   │   └── localizationsActions.ts
│       │   │   └── electron-sandbox
│       │   │       ├── localization.contribution.ts
│       │   │       └── minimalTranslations.ts
│       │   ├── logs
│       │   │   ├── browser
│       │   │   │   └── logs.contribution.ts
│       │   │   ├── common
│       │   │   │   ├── defaultLogLevels.ts
│       │   │   │   ├── logsActions.ts
│       │   │   │   ├── logs.contribution.ts
│       │   │   │   └── logsDataCleaner.ts
│       │   │   └── electron-sandbox
│       │   │       ├── logsActions.ts
│       │   │       └── logs.contribution.ts
│       │   ├── markdown
│       │   │   └── browser
│       │   │       ├── markdownDocumentRenderer.ts
│       │   │       ├── markdownSettingRenderer.ts
│       │   │       └── markedGfmHeadingIdPlugin.ts
│       │   ├── markers
│       │   │   ├── browser
│       │   │   │   ├── markers.contribution.ts
│       │   │   │   ├── markersFileDecorations.ts
│       │   │   │   ├── markersFilterOptions.ts
│       │   │   │   ├── markersModel.ts
│       │   │   │   ├── markersTable.ts
│       │   │   │   ├── markersTreeViewer.ts
│       │   │   │   ├── markers.ts
│       │   │   │   ├── markersViewActions.ts
│       │   │   │   ├── markersView.ts
│       │   │   │   └── messages.ts
│       │   │   └── common
│       │   │       └── markers.ts
│       │   ├── mcp
│       │   │   ├── browser
│       │   │   │   ├── mcpCommandsAddConfiguration.ts
│       │   │   │   ├── mcpCommands.ts
│       │   │   │   ├── mcp.contribution.ts
│       │   │   │   └── mcpDiscovery.ts
│       │   │   ├── common
│       │   │   │   ├── discovery
│       │   │   │   │   ├── configMcpDiscovery.ts
│       │   │   │   │   ├── extensionMcpDiscovery.ts
│       │   │   │   │   ├── mcpDiscovery.ts
│       │   │   │   │   ├── nativeMcpDiscoveryAbstract.ts
│       │   │   │   │   ├── nativeMcpDiscoveryAdapters.ts
│       │   │   │   │   └── nativeMcpRemoteDiscovery.ts
│       │   │   │   ├── mcpConfigFileUtils.ts
│       │   │   │   ├── mcpConfiguration.ts
│       │   │   │   ├── mcpContextKeys.ts
│       │   │   │   ├── mcpRegistryInputStorage.ts
│       │   │   │   ├── mcpRegistry.ts
│       │   │   │   ├── mcpRegistryTypes.ts
│       │   │   │   ├── mcpServerConnection.ts
│       │   │   │   ├── mcpServerRequestHandler.ts
│       │   │   │   ├── mcpServer.ts
│       │   │   │   ├── mcpService.ts
│       │   │   │   ├── mcpTypes.ts
│       │   │   │   └── modelContextProtocol.ts
│       │   │   ├── electron-sandbox
│       │   │   │   ├── mcp.contribution.ts
│       │   │   │   └── nativeMpcDiscovery.ts
│       │   │   └── test
│       │   │       └── common
│       │   │           └── mcpRegistryTypes.ts
│       │   ├── mergeEditor
│       │   │   ├── browser
│       │   │   │   ├── commands
│       │   │   │   │   ├── commands.ts
│       │   │   │   │   └── devCommands.ts
│       │   │   │   ├── mergeEditorAccessibilityHelp.ts
│       │   │   │   ├── mergeEditor.contribution.ts
│       │   │   │   ├── mergeEditorInputModel.ts
│       │   │   │   ├── mergeEditorInput.ts
│       │   │   │   ├── mergeEditorSerializer.ts
│       │   │   │   ├── mergeMarkers
│       │   │   │   │   └── mergeMarkersController.ts
│       │   │   │   ├── model
│       │   │   │   │   ├── diffComputer.ts
│       │   │   │   │   ├── editing.ts
│       │   │   │   │   ├── lineRange.ts
│       │   │   │   │   ├── mapping.ts
│       │   │   │   │   ├── mergeEditorModel.ts
│       │   │   │   │   ├── modifiedBaseRange.ts
│       │   │   │   │   ├── rangeUtils.ts
│       │   │   │   │   └── textModelDiffs.ts
│       │   │   │   ├── telemetry.ts
│       │   │   │   ├── utils.ts
│       │   │   │   └── view
│       │   │   │       ├── colors.ts
│       │   │   │       ├── conflictActions.ts
│       │   │   │       ├── editorGutter.ts
│       │   │   │       ├── editors
│       │   │   │       │   ├── baseCodeEditorView.ts
│       │   │   │       │   ├── codeEditorView.ts
│       │   │   │       │   ├── inputCodeEditorView.ts
│       │   │   │       │   └── resultCodeEditorView.ts
│       │   │   │       ├── fixedZoneWidget.ts
│       │   │   │       ├── lineAlignment.ts
│       │   │   │       ├── mergeEditor.ts
│       │   │   │       ├── scrollSynchronizer.ts
│       │   │   │       ├── viewModel.ts
│       │   │   │       └── viewZones.ts
│       │   │   ├── common
│       │   │   │   └── mergeEditor.ts
│       │   │   └── electron-sandbox
│       │   │       ├── devCommands.ts
│       │   │       └── mergeEditor.contribution.ts
│       │   ├── multiDiffEditor
│       │   │   └── browser
│       │   │       ├── actions.ts
│       │   │       ├── icons.contribution.ts
│       │   │       ├── multiDiffEditor.contribution.ts
│       │   │       ├── multiDiffEditorInput.ts
│       │   │       ├── multiDiffEditor.ts
│       │   │       ├── multiDiffSourceResolverService.ts
│       │   │       └── scmMultiDiffSourceResolver.ts
│       │   ├── notebook
│       │   │   ├── browser
│       │   │   │   ├── contrib
│       │   │   │   │   ├── cellCommands
│       │   │   │   │   │   └── cellCommands.ts
│       │   │   │   │   ├── cellDiagnostics
│       │   │   │   │   │   ├── cellDiagnosticEditorContrib.ts
│       │   │   │   │   │   ├── cellDiagnosticsActions.ts
│       │   │   │   │   │   ├── cellDiagnostics.ts
│       │   │   │   │   │   └── diagnosticCellStatusBarContrib.ts
│       │   │   │   │   ├── cellStatusBar
│       │   │   │   │   │   ├── contributedStatusBarItemController.ts
│       │   │   │   │   │   ├── executionStatusBarItemController.ts
│       │   │   │   │   │   ├── notebookVisibleCellObserver.ts
│       │   │   │   │   │   └── statusBarProviders.ts
│       │   │   │   │   ├── clipboard
│       │   │   │   │   │   └── notebookClipboard.ts
│       │   │   │   │   ├── debug
│       │   │   │   │   │   ├── notebookBreakpoints.ts
│       │   │   │   │   │   ├── notebookCellPausing.ts
│       │   │   │   │   │   └── notebookDebugDecorations.ts
│       │   │   │   │   ├── editorHint
│       │   │   │   │   │   └── emptyCellEditorHint.ts
│       │   │   │   │   ├── editorStatusBar
│       │   │   │   │   │   └── editorStatusBar.ts
│       │   │   │   │   ├── execute
│       │   │   │   │   │   └── executionEditorProgress.ts
│       │   │   │   │   ├── find
│       │   │   │   │   │   ├── findFilters.ts
│       │   │   │   │   │   ├── findMatchDecorationModel.ts
│       │   │   │   │   │   ├── findModel.ts
│       │   │   │   │   │   ├── notebookFindReplaceWidget.ts
│       │   │   │   │   │   ├── notebookFind.ts
│       │   │   │   │   │   └── notebookFindWidget.ts
│       │   │   │   │   ├── format
│       │   │   │   │   │   └── formatting.ts
│       │   │   │   │   ├── gettingStarted
│       │   │   │   │   │   └── notebookGettingStarted.ts
│       │   │   │   │   ├── kernelDetection
│       │   │   │   │   │   └── notebookKernelDetection.ts
│       │   │   │   │   ├── layout
│       │   │   │   │   │   └── layoutActions.ts
│       │   │   │   │   ├── marker
│       │   │   │   │   │   └── markerProvider.ts
│       │   │   │   │   ├── multicursor
│       │   │   │   │   │   ├── notebookMulticursor.ts
│       │   │   │   │   │   └── notebookSelectionHighlight.ts
│       │   │   │   │   ├── navigation
│       │   │   │   │   │   └── arrow.ts
│       │   │   │   │   ├── notebookVariables
│       │   │   │   │   │   ├── notebookInlineVariables.ts
│       │   │   │   │   │   ├── notebookVariableCommands.ts
│       │   │   │   │   │   ├── notebookVariableContextKeys.ts
│       │   │   │   │   │   ├── notebookVariablesDataSource.ts
│       │   │   │   │   │   ├── notebookVariablesTree.ts
│       │   │   │   │   │   ├── notebookVariables.ts
│       │   │   │   │   │   └── notebookVariablesView.ts
│       │   │   │   │   ├── outline
│       │   │   │   │   │   └── notebookOutline.ts
│       │   │   │   │   ├── profile
│       │   │   │   │   │   └── notebookProfile.ts
│       │   │   │   │   ├── saveParticipants
│       │   │   │   │   │   └── saveParticipants.ts
│       │   │   │   │   ├── troubleshoot
│       │   │   │   │   │   └── layout.ts
│       │   │   │   │   ├── undoRedo
│       │   │   │   │   │   └── notebookUndoRedo.ts
│       │   │   │   │   └── viewportWarmup
│       │   │   │   │       └── viewportWarmup.ts
│       │   │   │   ├── controller
│       │   │   │   │   ├── apiActions.ts
│       │   │   │   │   ├── cellOperations.ts
│       │   │   │   │   ├── cellOutputActions.ts
│       │   │   │   │   ├── chat
│       │   │   │   │   │   ├── cellChatActions.ts
│       │   │   │   │   │   ├── notebookChatContext.ts
│       │   │   │   │   │   ├── notebook.chat.contribution.ts
│       │   │   │   │   │   └── notebookChatController.ts
│       │   │   │   │   ├── coreActions.ts
│       │   │   │   │   ├── editActions.ts
│       │   │   │   │   ├── executeActions.ts
│       │   │   │   │   ├── foldingController.ts
│       │   │   │   │   ├── insertCellActions.ts
│       │   │   │   │   ├── layoutActions.ts
│       │   │   │   │   ├── notebookIndentationActions.ts
│       │   │   │   │   ├── sectionActions.ts
│       │   │   │   │   └── variablesActions.ts
│       │   │   │   ├── diff
│       │   │   │   │   ├── diffCellEditorOptions.ts
│       │   │   │   │   ├── diffComponents.ts
│       │   │   │   │   ├── diffElementOutputs.ts
│       │   │   │   │   ├── diffElementViewModel.ts
│       │   │   │   │   ├── diffNestedCellViewModel.ts
│       │   │   │   │   ├── editorHeightCalculator.ts
│       │   │   │   │   ├── eventDispatcher.ts
│       │   │   │   │   ├── inlineDiff
│       │   │   │   │   │   ├── notebookCellDiffDecorator.ts
│       │   │   │   │   │   ├── notebookDeletedCellDecorator.ts
│       │   │   │   │   │   ├── notebookInlineDiff.ts
│       │   │   │   │   │   ├── notebookInlineDiffWidget.ts
│       │   │   │   │   │   ├── notebookInsertedCellDecorator.ts
│       │   │   │   │   │   ├── notebookModifiedCellDecorator.ts
│       │   │   │   │   │   ├── notebookOriginalCellModelFactory.ts
│       │   │   │   │   │   └── notebookOriginalModelRefFactory.ts
│       │   │   │   │   ├── notebookDiffActions.ts
│       │   │   │   │   ├── notebookDiffEditorBrowser.ts
│       │   │   │   │   ├── notebookDiffEditor.ts
│       │   │   │   │   ├── notebookDiffList.ts
│       │   │   │   │   ├── notebookDiffOverviewRuler.ts
│       │   │   │   │   ├── notebookDiffViewModel.ts
│       │   │   │   │   ├── notebookMultiDiffEditorInput.ts
│       │   │   │   │   ├── notebookMultiDiffEditor.ts
│       │   │   │   │   └── unchangedEditorRegions.ts
│       │   │   │   ├── notebookAccessibilityHelp.ts
│       │   │   │   ├── notebookAccessibilityProvider.ts
│       │   │   │   ├── notebookAccessibleView.ts
│       │   │   │   ├── notebookBrowser.ts
│       │   │   │   ├── notebook.contribution.ts
│       │   │   │   ├── notebookEditorExtensions.ts
│       │   │   │   ├── notebookEditor.ts
│       │   │   │   ├── notebookEditorWidget.ts
│       │   │   │   ├── notebookExtensionPoint.ts
│       │   │   │   ├── notebookIcons.ts
│       │   │   │   ├── notebookLogger.ts
│       │   │   │   ├── notebookOptions.ts
│       │   │   │   ├── notebookViewEvents.ts
│       │   │   │   ├── replEditorAccessibleView.ts
│       │   │   │   ├── services
│       │   │   │   │   ├── notebookCellStatusBarServiceImpl.ts
│       │   │   │   │   ├── notebookEditorServiceImpl.ts
│       │   │   │   │   ├── notebookEditorService.ts
│       │   │   │   │   ├── notebookExecutionServiceImpl.ts
│       │   │   │   │   ├── notebookExecutionStateServiceImpl.ts
│       │   │   │   │   ├── notebookKernelHistoryServiceImpl.ts
│       │   │   │   │   ├── notebookKernelServiceImpl.ts
│       │   │   │   │   ├── notebookKeymapServiceImpl.ts
│       │   │   │   │   ├── notebookLoggingServiceImpl.ts
│       │   │   │   │   ├── notebookRendererMessagingServiceImpl.ts
│       │   │   │   │   ├── notebookServiceImpl.ts
│       │   │   │   │   └── notebookWorkerServiceImpl.ts
│       │   │   │   ├── view
│       │   │   │   │   ├── cellParts
│       │   │   │   │   │   ├── cellActionView.ts
│       │   │   │   │   │   ├── cellComments.ts
│       │   │   │   │   │   ├── cellContextKeys.ts
│       │   │   │   │   │   ├── cellDecorations.ts
│       │   │   │   │   │   ├── cellDnd.ts
│       │   │   │   │   │   ├── cellDragRenderer.ts
│       │   │   │   │   │   ├── cellEditorOptions.ts
│       │   │   │   │   │   ├── cellExecution.ts
│       │   │   │   │   │   ├── cellFocusIndicator.ts
│       │   │   │   │   │   ├── cellFocus.ts
│       │   │   │   │   │   ├── cellOutput.ts
│       │   │   │   │   │   ├── cellProgressBar.ts
│       │   │   │   │   │   ├── cellStatusPart.ts
│       │   │   │   │   │   ├── cellToolbarStickyScroll.ts
│       │   │   │   │   │   ├── cellToolbars.ts
│       │   │   │   │   │   ├── cellWidgets.ts
│       │   │   │   │   │   ├── chat
│       │   │   │   │   │   │   └── cellChatPart.ts
│       │   │   │   │   │   ├── codeCellExecutionIcon.ts
│       │   │   │   │   │   ├── codeCellRunToolbar.ts
│       │   │   │   │   │   ├── codeCell.ts
│       │   │   │   │   │   ├── collapsedCellInput.ts
│       │   │   │   │   │   ├── collapsedCellOutput.ts
│       │   │   │   │   │   ├── foldedCellHint.ts
│       │   │   │   │   │   └── markupCell.ts
│       │   │   │   │   ├── cellPart.ts
│       │   │   │   │   ├── notebookCellAnchor.ts
│       │   │   │   │   ├── notebookCellEditorPool.ts
│       │   │   │   │   ├── notebookCellList.ts
│       │   │   │   │   ├── notebookCellListView.ts
│       │   │   │   │   ├── notebookRenderingCommon.ts
│       │   │   │   │   └── renderers
│       │   │   │   │       ├── backLayerWebView.ts
│       │   │   │   │       ├── cellRenderer.ts
│       │   │   │   │       ├── webviewMessages.ts
│       │   │   │   │       ├── webviewPreloads.ts
│       │   │   │   │       └── webviewThemeMapping.ts
│       │   │   │   ├── viewModel
│       │   │   │   │   ├── baseCellViewModel.ts
│       │   │   │   │   ├── cellEditorOptions.ts
│       │   │   │   │   ├── cellEdit.ts
│       │   │   │   │   ├── cellOutputTextHelper.ts
│       │   │   │   │   ├── cellOutputViewModel.ts
│       │   │   │   │   ├── cellSelectionCollection.ts
│       │   │   │   │   ├── codeCellViewModel.ts
│       │   │   │   │   ├── eventDispatcher.ts
│       │   │   │   │   ├── foldingModel.ts
│       │   │   │   │   ├── markupCellViewModel.ts
│       │   │   │   │   ├── notebookOutlineDataSourceFactory.ts
│       │   │   │   │   ├── notebookOutlineDataSource.ts
│       │   │   │   │   ├── notebookOutlineEntryFactory.ts
│       │   │   │   │   ├── notebookViewModelImpl.ts
│       │   │   │   │   ├── OutlineEntry.ts
│       │   │   │   │   └── viewContext.ts
│       │   │   │   └── viewParts
│       │   │   │       ├── notebookEditorStickyScroll.ts
│       │   │   │       ├── notebookEditorToolbar.ts
│       │   │   │       ├── notebookEditorWidgetContextKeys.ts
│       │   │   │       ├── notebookHorizontalTracker.ts
│       │   │   │       ├── notebookKernelQuickPickStrategy.ts
│       │   │   │       ├── notebookKernelView.ts
│       │   │   │       ├── notebookOverviewRuler.ts
│       │   │   │       ├── notebookTopCellToolbar.ts
│       │   │   │       └── notebookViewZones.ts
│       │   │   ├── common
│       │   │   │   ├── model
│       │   │   │   │   ├── cellEdit.ts
│       │   │   │   │   ├── notebookCellOutputTextModel.ts
│       │   │   │   │   ├── notebookCellTextModel.ts
│       │   │   │   │   ├── notebookMetadataTextModel.ts
│       │   │   │   │   └── notebookTextModel.ts
│       │   │   │   ├── notebookCellStatusBarService.ts
│       │   │   │   ├── notebookCommon.ts
│       │   │   │   ├── notebookContextKeys.ts
│       │   │   │   ├── notebookDiffEditorInput.ts
│       │   │   │   ├── notebookDiff.ts
│       │   │   │   ├── notebookEditorInput.ts
│       │   │   │   ├── notebookEditorModelResolverServiceImpl.ts
│       │   │   │   ├── notebookEditorModelResolverService.ts
│       │   │   │   ├── notebookEditorModel.ts
│       │   │   │   ├── notebookExecutionService.ts
│       │   │   │   ├── notebookExecutionStateService.ts
│       │   │   │   ├── notebookKernelService.ts
│       │   │   │   ├── notebookKeymapService.ts
│       │   │   │   ├── notebookLoggingService.ts
│       │   │   │   ├── notebookOutputRenderer.ts
│       │   │   │   ├── notebookPerformance.ts
│       │   │   │   ├── notebookProvider.ts
│       │   │   │   ├── notebookRange.ts
│       │   │   │   ├── notebookRendererMessagingService.ts
│       │   │   │   ├── notebookService.ts
│       │   │   │   └── services
│       │   │   │       ├── notebookCellMatching.ts
│       │   │   │       ├── notebookSimpleWorkerMain.ts
│       │   │   │       ├── notebookSimpleWorker.ts
│       │   │   │       └── notebookWorkerService.ts
│       │   │   └── test
│       │   │       └── browser
│       │   │           └── testNotebookEditor.ts
│       │   ├── outline
│       │   │   └── browser
│       │   │       ├── outlineActions.ts
│       │   │       ├── outline.contribution.ts
│       │   │       ├── outlinePane.ts
│       │   │       ├── outline.ts
│       │   │       └── outlineViewState.ts
│       │   ├── output
│       │   │   ├── browser
│       │   │   │   ├── output.contribution.ts
│       │   │   │   ├── outputLinkProvider.ts
│       │   │   │   ├── outputServices.ts
│       │   │   │   └── outputView.ts
│       │   │   └── common
│       │   │       ├── outputChannelModel.ts
│       │   │       ├── outputLinkComputerMain.ts
│       │   │       └── outputLinkComputer.ts
│       │   ├── performance
│       │   │   ├── browser
│       │   │   │   ├── inputLatencyContrib.ts
│       │   │   │   ├── performance.contribution.ts
│       │   │   │   ├── performance.web.contribution.ts
│       │   │   │   ├── perfviewEditor.ts
│       │   │   │   └── startupTimings.ts
│       │   │   └── electron-sandbox
│       │   │       ├── performance.contribution.ts
│       │   │       ├── rendererAutoProfiler.ts
│       │   │       ├── startupProfiler.ts
│       │   │       └── startupTimings.ts
│       │   ├── preferences
│       │   │   ├── browser
│       │   │   │   ├── keybindingsEditorContribution.ts
│       │   │   │   ├── keybindingsEditor.ts
│       │   │   │   ├── keybindingWidgets.ts
│       │   │   │   ├── keyboardLayoutPicker.ts
│       │   │   │   ├── preferencesActions.ts
│       │   │   │   ├── preferences.contribution.ts
│       │   │   │   ├── preferencesEditor.ts
│       │   │   │   ├── preferencesIcons.ts
│       │   │   │   ├── preferencesRenderers.ts
│       │   │   │   ├── preferencesSearch.ts
│       │   │   │   ├── preferencesWidgets.ts
│       │   │   │   ├── settingsEditor2.ts
│       │   │   │   ├── settingsEditorSettingIndicators.ts
│       │   │   │   ├── settingsLayout.ts
│       │   │   │   ├── settingsSearchMenu.ts
│       │   │   │   ├── settingsTreeModels.ts
│       │   │   │   ├── settingsTree.ts
│       │   │   │   ├── settingsWidgets.ts
│       │   │   │   └── tocTree.ts
│       │   │   └── common
│       │   │       ├── preferencesContribution.ts
│       │   │       ├── preferences.ts
│       │   │       ├── settingsEditorColorRegistry.ts
│       │   │       ├── settingsFilesystemProvider.ts
│       │   │       └── smartSnippetInserter.ts
│       │   ├── quickaccess
│       │   │   └── browser
│       │   │       ├── commandsQuickAccess.ts
│       │   │       ├── quickAccess.contribution.ts
│       │   │       └── viewQuickAccess.ts
│       │   ├── relauncher
│       │   │   └── browser
│       │   │       └── relauncher.contribution.ts
│       │   ├── remote
│       │   │   ├── browser
│       │   │   │   ├── explorerViewItems.ts
│       │   │   │   ├── remoteConnectionHealth.ts
│       │   │   │   ├── remote.contribution.ts
│       │   │   │   ├── remoteExplorer.ts
│       │   │   │   ├── remoteIcons.ts
│       │   │   │   ├── remoteIndicator.ts
│       │   │   │   ├── remoteStartEntry.contribution.ts
│       │   │   │   ├── remoteStartEntry.ts
│       │   │   │   ├── remote.ts
│       │   │   │   ├── showCandidate.ts
│       │   │   │   ├── tunnelFactory.ts
│       │   │   │   ├── tunnelView.ts
│       │   │   │   └── urlFinder.ts
│       │   │   ├── common
│       │   │   │   └── remote.contribution.ts
│       │   │   └── electron-sandbox
│       │   │       └── remote.contribution.ts
│       │   ├── remoteTunnel
│       │   │   └── electron-sandbox
│       │   │       └── remoteTunnel.contribution.ts
│       │   ├── replNotebook
│       │   │   └── browser
│       │   │       ├── repl.contribution.ts
│       │   │       ├── replEditorAccessibilityHelp.ts
│       │   │       ├── replEditorInput.ts
│       │   │       └── replEditor.ts
│       │   ├── sash
│       │   │   └── browser
│       │   │       ├── sash.contribution.ts
│       │   │       └── sash.ts
│       │   ├── scm
│       │   │   ├── browser
│       │   │   │   ├── activity.ts
│       │   │   │   ├── menus.ts
│       │   │   │   ├── quickDiffDecorator.ts
│       │   │   │   ├── quickDiffModel.ts
│       │   │   │   ├── quickDiffWidget.ts
│       │   │   │   ├── scmAccessibilityHelp.ts
│       │   │   │   ├── scm.contribution.ts
│       │   │   │   ├── scmHistory.ts
│       │   │   │   ├── scmHistoryViewPane.ts
│       │   │   │   ├── scmRepositoriesViewPane.ts
│       │   │   │   ├── scmRepositoryRenderer.ts
│       │   │   │   ├── scmViewPaneContainer.ts
│       │   │   │   ├── scmViewPane.ts
│       │   │   │   ├── scmViewService.ts
│       │   │   │   ├── util.ts
│       │   │   │   └── workingSet.ts
│       │   │   └── common
│       │   │       ├── history.ts
│       │   │       ├── quickDiffService.ts
│       │   │       ├── quickDiff.ts
│       │   │       ├── scmService.ts
│       │   │       └── scm.ts
│       │   ├── scrollLocking
│       │   │   └── browser
│       │   │       ├── scrollLocking.contribution.ts
│       │   │       └── scrollLocking.ts
│       │   ├── search
│       │   │   ├── browser
│       │   │   │   ├── AISearch
│       │   │   │   │   ├── aiSearchModelBase.ts
│       │   │   │   │   └── aiSearchModel.ts
│       │   │   │   ├── anythingQuickAccess.ts
│       │   │   │   ├── notebookSearch
│       │   │   │   │   ├── notebookSearchContributions.ts
│       │   │   │   │   ├── notebookSearchModelBase.ts
│       │   │   │   │   ├── notebookSearchModel.ts
│       │   │   │   │   ├── notebookSearchService.ts
│       │   │   │   │   └── searchNotebookHelpers.ts
│       │   │   │   ├── patternInputWidget.ts
│       │   │   │   ├── quickTextSearch
│       │   │   │   │   └── textSearchQuickAccess.ts
│       │   │   │   ├── replaceContributions.ts
│       │   │   │   ├── replaceService.ts
│       │   │   │   ├── replace.ts
│       │   │   │   ├── searchActionsBase.ts
│       │   │   │   ├── searchActionsCopy.ts
│       │   │   │   ├── searchActionsFind.ts
│       │   │   │   ├── searchActionsNav.ts
│       │   │   │   ├── searchActionsRemoveReplace.ts
│       │   │   │   ├── searchActionsSymbol.ts
│       │   │   │   ├── searchActionsTextQuickAccess.ts
│       │   │   │   ├── searchActionsTopBar.ts
│       │   │   │   ├── searchCompare.ts
│       │   │   │   ├── search.contribution.ts
│       │   │   │   ├── searchFindInput.ts
│       │   │   │   ├── searchIcons.ts
│       │   │   │   ├── searchMessage.ts
│       │   │   │   ├── searchResultsView.ts
│       │   │   │   ├── searchTreeModel
│       │   │   │   │   ├── fileMatch.ts
│       │   │   │   │   ├── folderMatch.ts
│       │   │   │   │   ├── match.ts
│       │   │   │   │   ├── rangeDecorations.ts
│       │   │   │   │   ├── searchModel.ts
│       │   │   │   │   ├── searchResult.ts
│       │   │   │   │   ├── searchTreeCommon.ts
│       │   │   │   │   ├── searchViewModelWorkbenchService.ts
│       │   │   │   │   └── textSearchHeading.ts
│       │   │   │   ├── searchView.ts
│       │   │   │   ├── searchWidget.ts
│       │   │   │   └── symbolsQuickAccess.ts
│       │   │   ├── common
│       │   │   │   ├── cacheState.ts
│       │   │   │   ├── cellSearchModel.ts
│       │   │   │   ├── constants.ts
│       │   │   │   ├── notebookSearch.ts
│       │   │   │   ├── searchHistoryService.ts
│       │   │   │   ├── searchNotebookHelpers.ts
│       │   │   │   └── search.ts
│       │   │   └── test
│       │   │       └── browser
│       │   │           ├── mockSearchTree.ts
│       │   │           └── searchTestCommon.ts
│       │   ├── searchEditor
│       │   │   └── browser
│       │   │       ├── constants.ts
│       │   │       ├── searchEditorActions.ts
│       │   │       ├── searchEditor.contribution.ts
│       │   │       ├── searchEditorInput.ts
│       │   │       ├── searchEditorModel.ts
│       │   │       ├── searchEditorSerialization.ts
│       │   │       └── searchEditor.ts
│       │   ├── share
│       │   │   ├── browser
│       │   │   │   ├── share.contribution.ts
│       │   │   │   └── shareService.ts
│       │   │   └── common
│       │   │       └── share.ts
│       │   ├── snippets
│       │   │   └── browser
│       │   │       ├── commands
│       │   │       │   ├── abstractSnippetsActions.ts
│       │   │       │   ├── configureSnippets.ts
│       │   │       │   ├── fileTemplateSnippets.ts
│       │   │       │   ├── insertSnippet.ts
│       │   │       │   └── surroundWithSnippet.ts
│       │   │       ├── snippetCodeActionProvider.ts
│       │   │       ├── snippetCompletionProvider.ts
│       │   │       ├── snippetPicker.ts
│       │   │       ├── snippets.contribution.ts
│       │   │       ├── snippetsFile.ts
│       │   │       ├── snippetsService.ts
│       │   │       ├── snippets.ts
│       │   │       └── tabCompletion.ts
│       │   ├── speech
│       │   │   ├── browser
│       │   │   │   ├── speechAccessibilitySignal.ts
│       │   │   │   ├── speech.contribution.ts
│       │   │   │   └── speechService.ts
│       │   │   └── common
│       │   │       └── speechService.ts
│       │   ├── splash
│       │   │   ├── browser
│       │   │   │   ├── partsSplash.ts
│       │   │   │   ├── splash.contribution.ts
│       │   │   │   └── splash.ts
│       │   │   └── electron-sandbox
│       │   │       └── splash.contribution.ts
│       │   ├── surveys
│       │   │   └── browser
│       │   │       ├── languageSurveys.contribution.ts
│       │   │       └── nps.contribution.ts
│       │   ├── tags
│       │   │   ├── browser
│       │   │   │   └── workspaceTagsService.ts
│       │   │   ├── common
│       │   │   │   ├── javaWorkspaceTags.ts
│       │   │   │   └── workspaceTags.ts
│       │   │   └── electron-sandbox
│       │   │       ├── tags.contribution.ts
│       │   │       ├── workspaceTagsService.ts
│       │   │       └── workspaceTags.ts
│       │   ├── tasks
│       │   │   ├── browser
│       │   │   │   ├── abstractTaskService.ts
│       │   │   │   ├── runAutomaticTasks.ts
│       │   │   │   ├── task.contribution.ts
│       │   │   │   ├── taskQuickPick.ts
│       │   │   │   ├── taskService.ts
│       │   │   │   ├── tasksQuickAccess.ts
│       │   │   │   ├── taskTerminalStatus.ts
│       │   │   │   └── terminalTaskSystem.ts
│       │   │   ├── common
│       │   │   │   ├── jsonSchemaCommon.ts
│       │   │   │   ├── jsonSchema_v1.ts
│       │   │   │   ├── jsonSchema_v2.ts
│       │   │   │   ├── problemCollectors.ts
│       │   │   │   ├── problemMatcher.ts
│       │   │   │   ├── taskConfiguration.ts
│       │   │   │   ├── taskDefinitionRegistry.ts
│       │   │   │   ├── taskService.ts
│       │   │   │   ├── tasks.ts
│       │   │   │   ├── taskSystem.ts
│       │   │   │   └── taskTemplates.ts
│       │   │   └── electron-sandbox
│       │   │       └── taskService.ts
│       │   ├── telemetry
│       │   │   └── browser
│       │   │       └── telemetry.contribution.ts
│       │   ├── terminal
│       │   │   ├── browser
│       │   │   │   ├── baseTerminalBackend.ts
│       │   │   │   ├── detachedTerminal.ts
│       │   │   │   ├── environmentVariableInfo.ts
│       │   │   │   ├── remotePty.ts
│       │   │   │   ├── remoteTerminalBackend.ts
│       │   │   │   ├── terminalActions.ts
│       │   │   │   ├── terminalCommands.ts
│       │   │   │   ├── terminalConfigurationService.ts
│       │   │   │   ├── terminalContextMenu.ts
│       │   │   │   ├── terminal.contribution.ts
│       │   │   │   ├── terminalEditorInput.ts
│       │   │   │   ├── terminalEditorSerializer.ts
│       │   │   │   ├── terminalEditorService.ts
│       │   │   │   ├── terminalEditor.ts
│       │   │   │   ├── terminalEscapeSequences.ts
│       │   │   │   ├── terminalEvents.ts
│       │   │   │   ├── terminalExtensions.ts
│       │   │   │   ├── terminalGroupService.ts
│       │   │   │   ├── terminalGroup.ts
│       │   │   │   ├── terminalIconPicker.ts
│       │   │   │   ├── terminalIcons.ts
│       │   │   │   ├── terminalIcon.ts
│       │   │   │   ├── terminalInstanceService.ts
│       │   │   │   ├── terminalInstance.ts
│       │   │   │   ├── terminalKeybindings.ts
│       │   │   │   ├── terminalMainContribution.ts
│       │   │   │   ├── terminalMenus.ts
│       │   │   │   ├── terminalProcessExtHostProxy.ts
│       │   │   │   ├── terminalProcessManager.ts
│       │   │   │   ├── terminalProfileQuickpick.ts
│       │   │   │   ├── terminalProfileResolverService.ts
│       │   │   │   ├── terminalProfileService.ts
│       │   │   │   ├── terminalResizeDebouncer.ts
│       │   │   │   ├── terminalService.ts
│       │   │   │   ├── terminalStatusList.ts
│       │   │   │   ├── terminalTabbedView.ts
│       │   │   │   ├── terminalTabsList.ts
│       │   │   │   ├── terminalTestHelpers.ts
│       │   │   │   ├── terminalTooltip.ts
│       │   │   │   ├── terminal.ts
│       │   │   │   ├── terminalUri.ts
│       │   │   │   ├── terminalView.ts
│       │   │   │   ├── terminal.web.contribution.ts
│       │   │   │   ├── widgets
│       │   │   │   │   ├── terminalHoverWidget.ts
│       │   │   │   │   ├── widgetManager.ts
│       │   │   │   │   └── widgets.ts
│       │   │   │   ├── xterm
│       │   │   │   │   ├── decorationAddon.ts
│       │   │   │   │   ├── decorationStyles.ts
│       │   │   │   │   ├── lineDataEventAddon.ts
│       │   │   │   │   ├── markNavigationAddon.ts
│       │   │   │   │   ├── xtermAddonImporter.ts
│       │   │   │   │   └── xtermTerminal.ts
│       │   │   │   └── xterm-private.d.ts
│       │   │   ├── common
│       │   │   │   ├── basePty.ts
│       │   │   │   ├── environmentVariable.contribution.ts
│       │   │   │   ├── environmentVariableService.ts
│       │   │   │   ├── environmentVariable.ts
│       │   │   │   ├── remote
│       │   │   │   │   ├── remoteTerminalChannel.ts
│       │   │   │   │   └── terminal.ts
│       │   │   │   ├── scripts
│       │   │   │   │   └── cgmanifest.json
│       │   │   │   ├── terminalColorRegistry.ts
│       │   │   │   ├── terminalConfiguration.ts
│       │   │   │   ├── terminalContextKey.ts
│       │   │   │   ├── terminalEnvironment.ts
│       │   │   │   ├── terminalExtensionPoints.contribution.ts
│       │   │   │   ├── terminalExtensionPoints.ts
│       │   │   │   ├── terminalStorageKeys.ts
│       │   │   │   ├── terminalStrings.ts
│       │   │   │   └── terminal.ts
│       │   │   ├── electron-sandbox
│       │   │   │   ├── localPty.ts
│       │   │   │   ├── localTerminalBackend.ts
│       │   │   │   ├── terminal.contribution.ts
│       │   │   │   ├── terminalNativeContribution.ts
│       │   │   │   ├── terminalProfileResolverService.ts
│       │   │   │   └── terminalRemote.ts
│       │   │   ├── terminal.all.ts
│       │   │   ├── terminalContribChatExports.ts
│       │   │   ├── terminalContribExports.ts
│       │   │   └── test
│       │   │       └── browser
│       │   │           └── terminalProfileService.integrationTest.ts
│       │   ├── terminalContrib
│       │   │   ├── accessibility
│       │   │   │   ├── browser
│       │   │   │   │   ├── bufferContentTracker.ts
│       │   │   │   │   ├── terminal.accessibility.contribution.ts
│       │   │   │   │   ├── terminalAccessibilityHelp.ts
│       │   │   │   │   ├── terminalAccessibleBufferProvider.ts
│       │   │   │   │   └── textAreaSyncAddon.ts
│       │   │   │   └── common
│       │   │   │       ├── terminalAccessibilityConfiguration.ts
│       │   │   │       └── terminal.accessibility.ts
│       │   │   ├── autoReplies
│       │   │   │   ├── browser
│       │   │   │   │   └── terminal.autoReplies.contribution.ts
│       │   │   │   └── common
│       │   │   │       └── terminalAutoRepliesConfiguration.ts
│       │   │   ├── chat
│       │   │   │   ├── browser
│       │   │   │   │   ├── terminalChatAccessibilityHelp.ts
│       │   │   │   │   ├── terminalChatAccessibleView.ts
│       │   │   │   │   ├── terminalChatActions.ts
│       │   │   │   │   ├── terminal.chat.contribution.ts
│       │   │   │   │   ├── terminalChatController.ts
│       │   │   │   │   ├── terminalChatEnabler.ts
│       │   │   │   │   ├── terminalChat.ts
│       │   │   │   │   ├── terminalChatWidget.ts
│       │   │   │   │   └── terminal.initialHint.contribution.ts
│       │   │   │   └── common
│       │   │   │       └── terminalInitialHintConfiguration.ts
│       │   │   ├── clipboard
│       │   │   │   └── browser
│       │   │   │       ├── terminal.clipboard.contribution.ts
│       │   │   │       └── terminalClipboard.ts
│       │   │   ├── commandGuide
│       │   │   │   ├── browser
│       │   │   │   │   └── terminal.commandGuide.contribution.ts
│       │   │   │   └── common
│       │   │   │       └── terminalCommandGuideConfiguration.ts
│       │   │   ├── developer
│       │   │   │   ├── browser
│       │   │   │   │   └── terminal.developer.contribution.ts
│       │   │   │   └── common
│       │   │   │       └── terminal.developer.ts
│       │   │   ├── environmentChanges
│       │   │   │   └── browser
│       │   │   │       └── terminal.environmentChanges.contribution.ts
│       │   │   ├── find
│       │   │   │   ├── browser
│       │   │   │   │   ├── terminal.find.contribution.ts
│       │   │   │   │   └── terminalFindWidget.ts
│       │   │   │   └── common
│       │   │   │       └── terminal.find.ts
│       │   │   ├── history
│       │   │   │   ├── browser
│       │   │   │   │   ├── terminal.history.contribution.ts
│       │   │   │   │   └── terminalRunRecentQuickPick.ts
│       │   │   │   └── common
│       │   │   │       ├── history.ts
│       │   │   │       └── terminal.history.ts
│       │   │   ├── links
│       │   │   │   ├── browser
│       │   │   │   │   ├── links.ts
│       │   │   │   │   ├── terminalExternalLinkDetector.ts
│       │   │   │   │   ├── terminalLinkDetectorAdapter.ts
│       │   │   │   │   ├── terminalLinkHelpers.ts
│       │   │   │   │   ├── terminalLinkManager.ts
│       │   │   │   │   ├── terminalLinkOpeners.ts
│       │   │   │   │   ├── terminalLinkParsing.ts
│       │   │   │   │   ├── terminalLinkProviderService.ts
│       │   │   │   │   ├── terminalLinkQuickpick.ts
│       │   │   │   │   ├── terminalLinkResolver.ts
│       │   │   │   │   ├── terminal.links.contribution.ts
│       │   │   │   │   ├── terminalLink.ts
│       │   │   │   │   ├── terminalLocalLinkDetector.ts
│       │   │   │   │   ├── terminalMultiLineLinkDetector.ts
│       │   │   │   │   ├── terminalUriLinkDetector.ts
│       │   │   │   │   └── terminalWordLinkDetector.ts
│       │   │   │   ├── common
│       │   │   │   │   └── terminal.links.ts
│       │   │   │   └── test
│       │   │   │       └── browser
│       │   │   │           └── linkTestUtils.ts
│       │   │   ├── quickAccess
│       │   │   │   └── browser
│       │   │   │       ├── terminal.quickAccess.contribution.ts
│       │   │   │       └── terminalQuickAccess.ts
│       │   │   ├── quickFix
│       │   │   │   └── browser
│       │   │   │       ├── quickFixAddon.ts
│       │   │   │       ├── quickFix.ts
│       │   │   │       ├── terminalQuickFixBuiltinActions.ts
│       │   │   │       ├── terminal.quickFix.contribution.ts
│       │   │   │       └── terminalQuickFixService.ts
│       │   │   ├── stickyScroll
│       │   │   │   ├── browser
│       │   │   │   │   ├── terminalStickyScrollColorRegistry.ts
│       │   │   │   │   ├── terminal.stickyScroll.contribution.ts
│       │   │   │   │   ├── terminalStickyScrollContribution.ts
│       │   │   │   │   └── terminalStickyScrollOverlay.ts
│       │   │   │   └── common
│       │   │   │       └── terminalStickyScrollConfiguration.ts
│       │   │   ├── suggest
│       │   │   │   ├── browser
│       │   │   │   │   ├── pwshCompletionProviderAddon.ts
│       │   │   │   │   ├── terminalCompletionItem.ts
│       │   │   │   │   ├── terminalCompletionModel.ts
│       │   │   │   │   ├── terminalCompletionService.ts
│       │   │   │   │   ├── terminalSuggestAddon.ts
│       │   │   │   │   ├── terminal.suggest.contribution.ts
│       │   │   │   │   ├── terminalSuggestTelemetry.ts
│       │   │   │   │   └── terminalSymbolIcons.ts
│       │   │   │   └── common
│       │   │   │       ├── terminalSuggestConfiguration.ts
│       │   │   │       └── terminal.suggest.ts
│       │   │   ├── typeAhead
│       │   │   │   ├── browser
│       │   │   │   │   ├── terminalTypeAheadAddon.ts
│       │   │   │   │   └── terminal.typeAhead.contribution.ts
│       │   │   │   └── common
│       │   │   │       └── terminalTypeAheadConfiguration.ts
│       │   │   ├── wslRecommendation
│       │   │   │   └── browser
│       │   │   │       └── terminal.wslRecommendation.contribution.ts
│       │   │   └── zoom
│       │   │       ├── browser
│       │   │       │   └── terminal.zoom.contribution.ts
│       │   │       └── common
│       │   │           └── terminal.zoom.ts
│       │   ├── testing
│       │   │   ├── browser
│       │   │   │   ├── codeCoverageDecorations.ts
│       │   │   │   ├── codeCoverageDisplayUtils.ts
│       │   │   │   ├── explorerProjections
│       │   │   │   │   ├── display.ts
│       │   │   │   │   ├── index.ts
│       │   │   │   │   ├── listProjection.ts
│       │   │   │   │   ├── testingObjectTree.ts
│       │   │   │   │   ├── testingViewState.ts
│       │   │   │   │   ├── testItemContextOverlay.ts
│       │   │   │   │   └── treeProjection.ts
│       │   │   │   ├── icons.ts
│       │   │   │   ├── testCoverageBars.ts
│       │   │   │   ├── testCoverageView.ts
│       │   │   │   ├── testExplorerActions.ts
│       │   │   │   ├── testingConfigurationUi.ts
│       │   │   │   ├── testing.contribution.ts
│       │   │   │   ├── testingDecorations.ts
│       │   │   │   ├── testingExplorerFilter.ts
│       │   │   │   ├── testingExplorerView.ts
│       │   │   │   ├── testingOutputPeek.ts
│       │   │   │   ├── testingProgressUiService.ts
│       │   │   │   ├── testingViewPaneContainer.ts
│       │   │   │   ├── testMessageColorizer.ts
│       │   │   │   ├── testResultsView
│       │   │   │   │   ├── testResultsOutput.ts
│       │   │   │   │   ├── testResultsSubject.ts
│       │   │   │   │   ├── testResultsTree.ts
│       │   │   │   │   └── testResultsViewContent.ts
│       │   │   │   └── theme.ts
│       │   │   ├── common
│       │   │   │   ├── configuration.ts
│       │   │   │   ├── constants.ts
│       │   │   │   ├── getComputedState.ts
│       │   │   │   ├── mainThreadTestCollection.ts
│       │   │   │   ├── observableUtils.ts
│       │   │   │   ├── observableValue.ts
│       │   │   │   ├── storedValue.ts
│       │   │   │   ├── testCoverageService.ts
│       │   │   │   ├── testCoverage.ts
│       │   │   │   ├── testExclusions.ts
│       │   │   │   ├── testExplorerFilterState.ts
│       │   │   │   ├── testId.ts
│       │   │   │   ├── testingContentProvider.ts
│       │   │   │   ├── testingContextKeys.ts
│       │   │   │   ├── testingContinuousRunService.ts
│       │   │   │   ├── testingDecorations.ts
│       │   │   │   ├── testingPeekOpener.ts
│       │   │   │   ├── testingStates.ts
│       │   │   │   ├── testingUri.ts
│       │   │   │   ├── testItemCollection.ts
│       │   │   │   ├── testProfileService.ts
│       │   │   │   ├── testResultService.ts
│       │   │   │   ├── testResultStorage.ts
│       │   │   │   ├── testResult.ts
│       │   │   │   ├── testServiceImpl.ts
│       │   │   │   ├── testService.ts
│       │   │   │   └── testTypes.ts
│       │   │   └── test
│       │   │       ├── browser
│       │   │       │   └── testObjectTree.ts
│       │   │       └── common
│       │   │           └── testStubs.ts
│       │   ├── themes
│       │   │   ├── browser
│       │   │   │   ├── themes.contribution.ts
│       │   │   │   └── themes.test.contribution.ts
│       │   │   └── test
│       │   │       └── node
│       │   │           └── colorRegistry.releaseTest.ts
│       │   ├── timeline
│       │   │   ├── browser
│       │   │   │   ├── timeline.contribution.ts
│       │   │   │   └── timelinePane.ts
│       │   │   └── common
│       │   │       ├── timelineService.ts
│       │   │       └── timeline.ts
│       │   ├── typeHierarchy
│       │   │   ├── browser
│       │   │   │   ├── typeHierarchy.contribution.ts
│       │   │   │   ├── typeHierarchyPeek.ts
│       │   │   │   └── typeHierarchyTree.ts
│       │   │   └── common
│       │   │       └── typeHierarchy.ts
│       │   ├── update
│       │   │   ├── browser
│       │   │   │   ├── releaseNotesEditor.ts
│       │   │   │   ├── update.contribution.ts
│       │   │   │   └── update.ts
│       │   │   └── common
│       │   │       └── update.ts
│       │   ├── url
│       │   │   ├── browser
│       │   │   │   ├── externalUriResolver.ts
│       │   │   │   ├── trustedDomainService.ts
│       │   │   │   ├── trustedDomainsFileSystemProvider.ts
│       │   │   │   ├── trustedDomains.ts
│       │   │   │   ├── trustedDomainsValidator.ts
│       │   │   │   └── url.contribution.ts
│       │   │   ├── common
│       │   │   │   ├── trustedDomains.ts
│       │   │   │   └── urlGlob.ts
│       │   │   └── test
│       │   │       └── browser
│       │   │           └── mockTrustedDomainService.ts
│       │   ├── userDataProfile
│       │   │   ├── browser
│       │   │   │   ├── userDataProfileActions.ts
│       │   │   │   ├── userDataProfile.contribution.ts
│       │   │   │   ├── userDataProfilesEditorModel.ts
│       │   │   │   ├── userDataProfilesEditor.ts
│       │   │   │   └── userDataProfile.ts
│       │   │   └── common
│       │   │       └── userDataProfile.ts
│       │   ├── userDataSync
│       │   │   ├── browser
│       │   │   │   ├── userDataSyncConflictsView.ts
│       │   │   │   ├── userDataSync.contribution.ts
│       │   │   │   ├── userDataSyncTrigger.ts
│       │   │   │   ├── userDataSync.ts
│       │   │   │   └── userDataSyncViews.ts
│       │   │   └── electron-sandbox
│       │   │       └── userDataSync.contribution.ts
│       │   ├── webview
│       │   │   ├── browser
│       │   │   │   ├── overlayWebview.ts
│       │   │   │   ├── resourceLoading.ts
│       │   │   │   ├── themeing.ts
│       │   │   │   ├── webview.contribution.ts
│       │   │   │   ├── webviewElement.ts
│       │   │   │   ├── webviewFindWidget.ts
│       │   │   │   ├── webviewMessages.d.ts
│       │   │   │   ├── webviewService.ts
│       │   │   │   ├── webview.ts
│       │   │   │   ├── webview.web.contribution.ts
│       │   │   │   └── webviewWindowDragMonitor.ts
│       │   │   ├── common
│       │   │   │   └── webview.ts
│       │   │   └── electron-sandbox
│       │   │       ├── webviewCommands.ts
│       │   │       ├── webview.contribution.ts
│       │   │       ├── webviewElement.ts
│       │   │       ├── webviewService.ts
│       │   │       └── windowIgnoreMenuShortcutsManager.ts
│       │   ├── webviewPanel
│       │   │   └── browser
│       │   │       ├── webviewCommands.ts
│       │   │       ├── webviewEditorInputSerializer.ts
│       │   │       ├── webviewEditorInput.ts
│       │   │       ├── webviewEditor.ts
│       │   │       ├── webviewIconManager.ts
│       │   │       ├── webviewPanel.contribution.ts
│       │   │       └── webviewWorkbenchService.ts
│       │   ├── webviewView
│       │   │   └── browser
│       │   │       ├── webviewView.contribution.ts
│       │   │       ├── webviewViewPane.ts
│       │   │       └── webviewViewService.ts
│       │   ├── welcomeBanner
│       │   │   └── browser
│       │   │       └── welcomeBanner.contribution.ts
│       │   ├── welcomeDialog
│       │   │   └── browser
│       │   │       ├── welcomeDialog.contribution.ts
│       │   │       └── welcomeWidget.ts
│       │   ├── welcomeGettingStarted
│       │   │   ├── browser
│       │   │   │   ├── gettingStartedAccessibleView.ts
│       │   │   │   ├── gettingStartedColors.ts
│       │   │   │   ├── gettingStarted.contribution.ts
│       │   │   │   ├── gettingStartedDetailsRenderer.ts
│       │   │   │   ├── gettingStartedExtensionPoint.ts
│       │   │   │   ├── gettingStartedIcons.ts
│       │   │   │   ├── gettingStartedInput.ts
│       │   │   │   ├── gettingStartedList.ts
│       │   │   │   ├── gettingStartedService.ts
│       │   │   │   ├── gettingStarted.ts
│       │   │   │   └── startupPage.ts
│       │   │   └── common
│       │   │       ├── gettingStartedContent.ts
│       │   │       └── media
│       │   │           ├── empty.ts
│       │   │           ├── notebookProfile.ts
│       │   │           └── theme_picker.ts
│       │   ├── welcomeViews
│       │   │   └── common
│       │   │       ├── newFile.contribution.ts
│       │   │       ├── viewsWelcome.contribution.ts
│       │   │       ├── viewsWelcomeContribution.ts
│       │   │       └── viewsWelcomeExtensionPoint.ts
│       │   ├── welcomeWalkthrough
│       │   │   ├── browser
│       │   │   │   ├── editor
│       │   │   │   │   ├── editorWalkThrough.ts
│       │   │   │   │   └── vs_code_editor_walkthrough.ts
│       │   │   │   ├── walkThroughActions.ts
│       │   │   │   ├── walkThrough.contribution.ts
│       │   │   │   ├── walkThroughInput.ts
│       │   │   │   └── walkThroughPart.ts
│       │   │   └── common
│       │   │       ├── walkThroughContentProvider.ts
│       │   │       └── walkThroughUtils.ts
│       │   ├── workspace
│       │   │   ├── browser
│       │   │   │   ├── workspace.contribution.ts
│       │   │   │   └── workspaceTrustEditor.ts
│       │   │   └── common
│       │   │       └── workspace.ts
│       │   └── workspaces
│       │       └── browser
│       │           └── workspaces.contribution.ts
│       ├── electron-sandbox
│       │   ├── actions
│       │   │   ├── developerActions.ts
│       │   │   ├── installActions.ts
│       │   │   └── windowActions.ts
│       │   ├── desktop.contribution.ts
│       │   ├── desktop.main.ts
│       │   ├── parts
│       │   │   ├── dialogs
│       │   │   │   ├── dialog.contribution.ts
│       │   │   │   └── dialogHandler.ts
│       │   │   └── titlebar
│       │   │       ├── menubarControl.ts
│       │   │       └── titlebarPart.ts
│       │   └── window.ts
│       ├── services
│       │   ├── accessibility
│       │   │   ├── common
│       │   │   │   └── accessibleViewInformationService.ts
│       │   │   └── electron-sandbox
│       │   │       └── accessibilityService.ts
│       │   ├── actions
│       │   │   └── common
│       │   │       └── menusExtensionPoint.ts
│       │   ├── activity
│       │   │   ├── browser
│       │   │   │   └── activityService.ts
│       │   │   └── common
│       │   │       └── activity.ts
│       │   ├── aiEmbeddingVector
│       │   │   └── common
│       │   │       └── aiEmbeddingVectorService.ts
│       │   ├── aiRelatedInformation
│       │   │   └── common
│       │   │       ├── aiRelatedInformationService.ts
│       │   │       └── aiRelatedInformation.ts
│       │   ├── assignment
│       │   │   ├── common
│       │   │   │   └── assignmentService.ts
│       │   │   └── test
│       │   │       └── common
│       │   │           └── nullAssignmentService.ts
│       │   ├── authentication
│       │   │   ├── browser
│       │   │   │   ├── authenticationAccessService.ts
│       │   │   │   ├── authenticationExtensionsService.ts
│       │   │   │   ├── authenticationService.ts
│       │   │   │   └── authenticationUsageService.ts
│       │   │   └── common
│       │   │       └── authentication.ts
│       │   ├── auxiliaryWindow
│       │   │   ├── browser
│       │   │   │   └── auxiliaryWindowService.ts
│       │   │   └── electron-sandbox
│       │   │       └── auxiliaryWindowService.ts
│       │   ├── banner
│       │   │   └── browser
│       │   │       └── bannerService.ts
│       │   ├── checksum
│       │   │   └── electron-sandbox
│       │   │       └── checksumService.ts
│       │   ├── clipboard
│       │   │   ├── browser
│       │   │   │   └── clipboardService.ts
│       │   │   └── electron-sandbox
│       │   │       └── clipboardService.ts
│       │   ├── commands
│       │   │   └── common
│       │   │       └── commandService.ts
│       │   ├── configuration
│       │   │   ├── browser
│       │   │   │   ├── configurationService.ts
│       │   │   │   └── configuration.ts
│       │   │   ├── common
│       │   │   │   ├── configurationCache.ts
│       │   │   │   ├── configurationEditing.ts
│       │   │   │   ├── configurationModels.ts
│       │   │   │   ├── configuration.ts
│       │   │   │   ├── jsonEditingService.ts
│       │   │   │   └── jsonEditing.ts
│       │   │   └── test
│       │   │       └── common
│       │   │           └── testServices.ts
│       │   ├── configurationResolver
│       │   │   ├── browser
│       │   │   │   ├── baseConfigurationResolverService.ts
│       │   │   │   └── configurationResolverService.ts
│       │   │   ├── common
│       │   │   │   ├── configurationResolverSchema.ts
│       │   │   │   ├── configurationResolver.ts
│       │   │   │   ├── configurationResolverUtils.ts
│       │   │   │   └── variableResolver.ts
│       │   │   └── electron-sandbox
│       │   │       └── configurationResolverService.ts
│       │   ├── contextmenu
│       │   │   └── electron-sandbox
│       │   │       └── contextmenuService.ts
│       │   ├── decorations
│       │   │   ├── browser
│       │   │   │   └── decorationsService.ts
│       │   │   └── common
│       │   │       └── decorations.ts
│       │   ├── dialogs
│       │   │   ├── browser
│       │   │   │   ├── abstractFileDialogService.ts
│       │   │   │   ├── fileDialogService.ts
│       │   │   │   └── simpleFileDialog.ts
│       │   │   ├── common
│       │   │   │   └── dialogService.ts
│       │   │   └── electron-sandbox
│       │   │       └── fileDialogService.ts
│       │   ├── driver
│       │   │   ├── browser
│       │   │   │   └── driver.ts
│       │   │   ├── common
│       │   │   │   └── driver.ts
│       │   │   └── electron-sandbox
│       │   │       └── driver.ts
│       │   ├── editor
│       │   │   ├── browser
│       │   │   │   ├── codeEditorService.ts
│       │   │   │   ├── editorPaneService.ts
│       │   │   │   ├── editorResolverService.ts
│       │   │   │   └── editorService.ts
│       │   │   └── common
│       │   │       ├── customEditorLabelService.ts
│       │   │       ├── editorGroupColumn.ts
│       │   │       ├── editorGroupFinder.ts
│       │   │       ├── editorGroupsService.ts
│       │   │       ├── editorPaneService.ts
│       │   │       ├── editorResolverService.ts
│       │   │       └── editorService.ts
│       │   ├── encryption
│       │   │   ├── browser
│       │   │   │   └── encryptionService.ts
│       │   │   └── electron-sandbox
│       │   │       └── encryptionService.ts
│       │   ├── environment
│       │   │   ├── browser
│       │   │   │   └── environmentService.ts
│       │   │   ├── common
│       │   │   │   └── environmentService.ts
│       │   │   └── electron-sandbox
│       │   │       ├── environmentService.ts
│       │   │       └── shellEnvironmentService.ts
│       │   ├── extensionManagement
│       │   │   ├── browser
│       │   │   │   ├── builtinExtensionsScannerService.ts
│       │   │   │   ├── extensionBisect.ts
│       │   │   │   ├── extensionEnablementService.ts
│       │   │   │   ├── extensionGalleryManifestService.ts
│       │   │   │   ├── extensionsProfileScannerService.ts
│       │   │   │   └── webExtensionsScannerService.ts
│       │   │   ├── common
│       │   │   │   ├── extensionFeaturesManagemetService.ts
│       │   │   │   ├── extensionFeatures.ts
│       │   │   │   ├── extensionGalleryService.ts
│       │   │   │   ├── extensionManagementChannelClient.ts
│       │   │   │   ├── extensionManagementServerService.ts
│       │   │   │   ├── extensionManagementService.ts
│       │   │   │   ├── extensionManagement.ts
│       │   │   │   ├── extensionsIcons.ts
│       │   │   │   ├── remoteExtensionManagementService.ts
│       │   │   │   └── webExtensionManagementService.ts
│       │   │   └── electron-sandbox
│       │   │       ├── extensionGalleryManifestService.ts
│       │   │       ├── extensionManagementServerService.ts
│       │   │       ├── extensionManagementService.ts
│       │   │       ├── extensionTipsService.ts
│       │   │       ├── nativeExtensionManagementService.ts
│       │   │       └── remoteExtensionManagementService.ts
│       │   ├── extensionRecommendations
│       │   │   └── common
│       │   │       ├── extensionIgnoredRecommendationsService.ts
│       │   │       ├── extensionRecommendations.ts
│       │   │       └── workspaceExtensionsConfig.ts
│       │   ├── extensions
│       │   │   ├── browser
│       │   │   │   ├── extensionService.ts
│       │   │   │   ├── extensionsScannerService.ts
│       │   │   │   ├── extensionUrlHandler.ts
│       │   │   │   ├── webWorkerExtensionHost.ts
│       │   │   │   └── webWorkerFileSystemProvider.ts
│       │   │   ├── common
│       │   │   │   ├── abstractExtensionService.ts
│       │   │   │   ├── extensionDescriptionRegistry.ts
│       │   │   │   ├── extensionDevOptions.ts
│       │   │   │   ├── extensionHostEnv.ts
│       │   │   │   ├── extensionHostKind.ts
│       │   │   │   ├── extensionHostManagers.ts
│       │   │   │   ├── extensionHostManager.ts
│       │   │   │   ├── extensionHostProtocol.ts
│       │   │   │   ├── extensionHostProxy.ts
│       │   │   │   ├── extensionManifestPropertiesService.ts
│       │   │   │   ├── extensionRunningLocationTracker.ts
│       │   │   │   ├── extensionRunningLocation.ts
│       │   │   │   ├── extensionsProposedApi.ts
│       │   │   │   ├── extensionsRegistry.ts
│       │   │   │   ├── extensionStorageMigration.ts
│       │   │   │   ├── extensions.ts
│       │   │   │   ├── extensionsUtil.ts
│       │   │   │   ├── extHostCustomers.ts
│       │   │   │   ├── lazyCreateExtensionHostManager.ts
│       │   │   │   ├── lazyPromise.ts
│       │   │   │   ├── polyfillNestedWorker.protocol.ts
│       │   │   │   ├── proxyIdentifier.ts
│       │   │   │   ├── remoteConsoleUtil.ts
│       │   │   │   ├── remoteExtensionHost.ts
│       │   │   │   ├── rpcProtocol.ts
│       │   │   │   └── workspaceContains.ts
│       │   │   ├── electron-sandbox
│       │   │   │   ├── cachedExtensionScanner.ts
│       │   │   │   ├── extensionHostProfiler.ts
│       │   │   │   ├── extensionHostStarter.ts
│       │   │   │   ├── extensionsScannerService.ts
│       │   │   │   ├── localProcessExtensionHost.ts
│       │   │   │   └── nativeExtensionService.ts
│       │   │   └── worker
│       │   │       └── polyfillNestedWorker.ts
│       │   ├── files
│       │   │   ├── browser
│       │   │   │   └── elevatedFileService.ts
│       │   │   ├── common
│       │   │   │   └── elevatedFileService.ts
│       │   │   └── electron-sandbox
│       │   │       ├── diskFileSystemProvider.ts
│       │   │       ├── elevatedFileService.ts
│       │   │       └── watcherClient.ts
│       │   ├── filesConfiguration
│       │   │   └── common
│       │   │       └── filesConfigurationService.ts
│       │   ├── history
│       │   │   ├── browser
│       │   │   │   └── historyService.ts
│       │   │   └── common
│       │   │       └── history.ts
│       │   ├── host
│       │   │   ├── browser
│       │   │   │   ├── browserHostService.ts
│       │   │   │   └── host.ts
│       │   │   └── electron-sandbox
│       │   │       └── nativeHostService.ts
│       │   ├── integrity
│       │   │   ├── browser
│       │   │   │   └── integrityService.ts
│       │   │   ├── common
│       │   │   │   └── integrity.ts
│       │   │   └── electron-sandbox
│       │   │       └── integrityService.ts
│       │   ├── keybinding
│       │   │   ├── browser
│       │   │   │   ├── keybindingService.ts
│       │   │   │   ├── keyboardLayouts
│       │   │   │   │   ├── _.contribution.ts
│       │   │   │   │   ├── cz.win.ts
│       │   │   │   │   ├── de.darwin.ts
│       │   │   │   │   ├── de.linux.ts
│       │   │   │   │   ├── de-swiss.win.ts
│       │   │   │   │   ├── de.win.ts
│       │   │   │   │   ├── dk.win.ts
│       │   │   │   │   ├── dvorak.darwin.ts
│       │   │   │   │   ├── en-belgian.win.ts
│       │   │   │   │   ├── en.darwin.ts
│       │   │   │   │   ├── en-ext.darwin.ts
│       │   │   │   │   ├── en-intl.darwin.ts
│       │   │   │   │   ├── en-intl.win.ts
│       │   │   │   │   ├── en-in.win.ts
│       │   │   │   │   ├── en.linux.ts
│       │   │   │   │   ├── en-uk.darwin.ts
│       │   │   │   │   ├── en-uk.win.ts
│       │   │   │   │   ├── en.win.ts
│       │   │   │   │   ├── es.darwin.ts
│       │   │   │   │   ├── es-latin.win.ts
│       │   │   │   │   ├── es.linux.ts
│       │   │   │   │   ├── es.win.ts
│       │   │   │   │   ├── fr.darwin.ts
│       │   │   │   │   ├── fr.linux.ts
│       │   │   │   │   ├── fr.win.ts
│       │   │   │   │   ├── hu.win.ts
│       │   │   │   │   ├── it.darwin.ts
│       │   │   │   │   ├── it.win.ts
│       │   │   │   │   ├── jp.darwin.ts
│       │   │   │   │   ├── jp-roman.darwin.ts
│       │   │   │   │   ├── ko.darwin.ts
│       │   │   │   │   ├── layout.contribution.darwin.ts
│       │   │   │   │   ├── layout.contribution.linux.ts
│       │   │   │   │   ├── layout.contribution.win.ts
│       │   │   │   │   ├── no.win.ts
│       │   │   │   │   ├── pl.darwin.ts
│       │   │   │   │   ├── pl.win.ts
│       │   │   │   │   ├── pt-br.win.ts
│       │   │   │   │   ├── pt.darwin.ts
│       │   │   │   │   ├── pt.win.ts
│       │   │   │   │   ├── ru.darwin.ts
│       │   │   │   │   ├── ru.linux.ts
│       │   │   │   │   ├── ru.win.ts
│       │   │   │   │   ├── sv.darwin.ts
│       │   │   │   │   ├── sv.win.ts
│       │   │   │   │   ├── thai.win.ts
│       │   │   │   │   ├── tr.win.ts
│       │   │   │   │   └── zh-hans.darwin.ts
│       │   │   │   ├── keyboardLayoutService.ts
│       │   │   │   ├── navigatorKeyboard.ts
│       │   │   │   └── unboundCommands.ts
│       │   │   ├── common
│       │   │   │   ├── fallbackKeyboardMapper.ts
│       │   │   │   ├── keybindingEditing.ts
│       │   │   │   ├── keybindingIO.ts
│       │   │   │   ├── keymapInfo.ts
│       │   │   │   ├── macLinuxKeyboardMapper.ts
│       │   │   │   └── windowsKeyboardMapper.ts
│       │   │   ├── electron-sandbox
│       │   │   │   ├── nativeKeyboardLayoutService.ts
│       │   │   │   └── nativeKeyboardLayout.ts
│       │   │   └── test
│       │   │       └── node
│       │   │           └── keyboardMapperTestUtils.ts
│       │   ├── label
│       │   │   ├── common
│       │   │   │   └── labelService.ts
│       │   │   └── test
│       │   │       └── common
│       │   │           └── mockLabelService.ts
│       │   ├── language
│       │   │   └── common
│       │   │       └── languageService.ts
│       │   ├── languageDetection
│       │   │   ├── browser
│       │   │   │   ├── languageDetectionSimpleWorkerMain.ts
│       │   │   │   ├── languageDetectionSimpleWorker.ts
│       │   │   │   ├── languageDetectionWorker.protocol.ts
│       │   │   │   └── languageDetectionWorkerServiceImpl.ts
│       │   │   └── common
│       │   │       └── languageDetectionWorkerService.ts
│       │   ├── languageStatus
│       │   │   └── common
│       │   │       └── languageStatusService.ts
│       │   ├── layout
│       │   │   └── browser
│       │   │       └── layoutService.ts
│       │   ├── lifecycle
│       │   │   ├── browser
│       │   │   │   └── lifecycleService.ts
│       │   │   ├── common
│       │   │   │   ├── lifecycleService.ts
│       │   │   │   └── lifecycle.ts
│       │   │   └── electron-sandbox
│       │   │       └── lifecycleService.ts
│       │   ├── localization
│       │   │   ├── browser
│       │   │   │   └── localeService.ts
│       │   │   ├── common
│       │   │   │   └── locale.ts
│       │   │   └── electron-sandbox
│       │   │       ├── languagePackService.ts
│       │   │       └── localeService.ts
│       │   ├── log
│       │   │   ├── common
│       │   │   │   └── logConstants.ts
│       │   │   └── electron-sandbox
│       │   │       └── logService.ts
│       │   ├── menubar
│       │   │   └── electron-sandbox
│       │   │       └── menubarService.ts
│       │   ├── model
│       │   │   └── common
│       │   │       └── modelService.ts
│       │   ├── notebook
│       │   │   └── common
│       │   │       └── notebookDocumentService.ts
│       │   ├── notification
│       │   │   └── common
│       │   │       └── notificationService.ts
│       │   ├── outline
│       │   │   └── browser
│       │   │       ├── outlineService.ts
│       │   │       └── outline.ts
│       │   ├── output
│       │   │   └── common
│       │   │       ├── delayedLogChannel.ts
│       │   │       └── output.ts
│       │   ├── panecomposite
│       │   │   └── browser
│       │   │       └── panecomposite.ts
│       │   ├── path
│       │   │   ├── browser
│       │   │   │   └── pathService.ts
│       │   │   ├── common
│       │   │   │   └── pathService.ts
│       │   │   └── electron-sandbox
│       │   │       └── pathService.ts
│       │   ├── preferences
│       │   │   ├── browser
│       │   │   │   ├── keybindingsEditorInput.ts
│       │   │   │   ├── keybindingsEditorModel.ts
│       │   │   │   └── preferencesService.ts
│       │   │   └── common
│       │   │       ├── preferencesEditorInput.ts
│       │   │       ├── preferencesModels.ts
│       │   │       ├── preferences.ts
│       │   │       └── preferencesValidation.ts
│       │   ├── progress
│       │   │   └── browser
│       │   │       ├── progressIndicator.ts
│       │   │       └── progressService.ts
│       │   ├── quickinput
│       │   │   └── browser
│       │   │       └── quickInputService.ts
│       │   ├── remote
│       │   │   ├── browser
│       │   │   │   ├── browserRemoteResourceHandler.ts
│       │   │   │   └── remoteAgentService.ts
│       │   │   ├── common
│       │   │   │   ├── abstractRemoteAgentService.ts
│       │   │   │   ├── remoteAgentEnvironmentChannel.ts
│       │   │   │   ├── remoteAgentService.ts
│       │   │   │   ├── remoteExplorerService.ts
│       │   │   │   ├── remoteExtensionsScanner.ts
│       │   │   │   ├── remoteFileSystemProviderClient.ts
│       │   │   │   └── tunnelModel.ts
│       │   │   └── electron-sandbox
│       │   │       └── remoteAgentService.ts
│       │   ├── request
│       │   │   ├── browser
│       │   │   │   └── requestService.ts
│       │   │   └── electron-sandbox
│       │   │       └── requestService.ts
│       │   ├── search
│       │   │   ├── browser
│       │   │   │   └── searchService.ts
│       │   │   ├── common
│       │   │   │   ├── fileSearchManager.ts
│       │   │   │   ├── folderQuerySearchTree.ts
│       │   │   │   ├── getFileResults.ts
│       │   │   │   ├── ignoreFile.ts
│       │   │   │   ├── localFileSearchWorkerTypes.ts
│       │   │   │   ├── queryBuilder.ts
│       │   │   │   ├── replace.ts
│       │   │   │   ├── searchExtConversionTypes.ts
│       │   │   │   ├── searchExtTypesInternal.ts
│       │   │   │   ├── searchExtTypes.ts
│       │   │   │   ├── searchHelpers.ts
│       │   │   │   ├── searchService.ts
│       │   │   │   ├── search.ts
│       │   │   │   └── textSearchManager.ts
│       │   │   ├── electron-sandbox
│       │   │   │   └── searchService.ts
│       │   │   ├── node
│       │   │   │   ├── fileSearch.ts
│       │   │   │   ├── rawSearchService.ts
│       │   │   │   ├── ripgrepFileSearch.ts
│       │   │   │   ├── ripgrepSearchProvider.ts
│       │   │   │   ├── ripgrepSearchUtils.ts
│       │   │   │   ├── ripgrepTextSearchEngine.ts
│       │   │   │   ├── textSearchAdapter.ts
│       │   │   │   └── textSearchManager.ts
│       │   │   ├── test
│       │   │   │   └── node
│       │   │   │       ├── fileSearch.integrationTest.ts
│       │   │   │       ├── rawSearchService.integrationTest.ts
│       │   │   │       ├── search.integrationTest.ts
│       │   │   │       └── textSearch.integrationTest.ts
│       │   │   └── worker
│       │   │       ├── localFileSearchMain.ts
│       │   │       └── localFileSearch.ts
│       │   ├── secrets
│       │   │   ├── browser
│       │   │   │   └── secretStorageService.ts
│       │   │   └── electron-sandbox
│       │   │       └── secretStorageService.ts
│       │   ├── sharedProcess
│       │   │   └── electron-sandbox
│       │   │       └── sharedProcessService.ts
│       │   ├── statusbar
│       │   │   └── browser
│       │   │       └── statusbar.ts
│       │   ├── storage
│       │   │   ├── browser
│       │   │   │   └── storageService.ts
│       │   │   └── electron-sandbox
│       │   │       └── storageService.ts
│       │   ├── suggest
│       │   │   └── browser
│       │   │       ├── simpleCompletionItem.ts
│       │   │       ├── simpleCompletionModel.ts
│       │   │       ├── simpleSuggestWidgetDetails.ts
│       │   │       ├── simpleSuggestWidgetRenderer.ts
│       │   │       └── simpleSuggestWidget.ts
│       │   ├── telemetry
│       │   │   ├── browser
│       │   │   │   ├── telemetryService.ts
│       │   │   │   └── workbenchCommonProperties.ts
│       │   │   ├── common
│       │   │   │   └── workbenchCommonProperties.ts
│       │   │   └── electron-sandbox
│       │   │       └── telemetryService.ts
│       │   ├── terminal
│       │   │   └── common
│       │   │       └── embedderTerminalService.ts
│       │   ├── textfile
│       │   │   ├── browser
│       │   │   │   ├── browserTextFileService.ts
│       │   │   │   └── textFileService.ts
│       │   │   ├── common
│       │   │   │   ├── encoding.ts
│       │   │   │   ├── textEditorService.ts
│       │   │   │   ├── textFileEditorModelManager.ts
│       │   │   │   ├── textFileEditorModel.ts
│       │   │   │   ├── textFileSaveParticipant.ts
│       │   │   │   └── textfiles.ts
│       │   │   ├── electron-sandbox
│       │   │   │   └── nativeTextFileService.ts
│       │   │   └── test
│       │   │       ├── browser
│       │   │       │   └── textFileEditorModel.integrationTest.ts
│       │   │       ├── common
│       │   │       │   └── fixtures
│       │   │       │       └── files.ts
│       │   │       └── node
│       │   │           └── encoding
│       │   │               └── encoding.integrationTest.ts
│       │   ├── textMate
│       │   │   ├── browser
│       │   │   │   ├── arrayOperation.ts
│       │   │   │   ├── backgroundTokenization
│       │   │   │   │   ├── textMateWorkerTokenizerController.ts
│       │   │   │   │   ├── threadedBackgroundTokenizerFactory.ts
│       │   │   │   │   └── worker
│       │   │   │   │       ├── textMateTokenizationWorker.workerMain.ts
│       │   │   │   │       ├── textMateTokenizationWorker.worker.ts
│       │   │   │   │       ├── textMateWorkerHost.ts
│       │   │   │   │       └── textMateWorkerTokenizer.ts
│       │   │   │   ├── textMateTokenizationFeature.contribution.ts
│       │   │   │   ├── textMateTokenizationFeatureImpl.ts
│       │   │   │   ├── textMateTokenizationFeature.ts
│       │   │   │   └── tokenizationSupport
│       │   │   │       ├── textMateTokenizationSupport.ts
│       │   │   │       └── tokenizationSupportWithLineLimit.ts
│       │   │   └── common
│       │   │       ├── cgmanifest.json
│       │   │       ├── TMGrammarFactory.ts
│       │   │       ├── TMGrammars.ts
│       │   │       ├── TMHelper.ts
│       │   │       └── TMScopeRegistry.ts
│       │   ├── textmodelResolver
│       │   │   └── common
│       │   │       └── textModelResolverService.ts
│       │   ├── textresourceProperties
│       │   │   └── common
│       │   │       └── textResourcePropertiesService.ts
│       │   ├── themes
│       │   │   ├── browser
│       │   │   │   ├── browserHostColorSchemeService.ts
│       │   │   │   ├── fileIconThemeData.ts
│       │   │   │   ├── productIconThemeData.ts
│       │   │   │   └── workbenchThemeService.ts
│       │   │   ├── common
│       │   │   │   ├── colorExtensionPoint.ts
│       │   │   │   ├── colorThemeData.ts
│       │   │   │   ├── colorThemeSchema.ts
│       │   │   │   ├── fileIconThemeSchema.ts
│       │   │   │   ├── hostColorSchemeService.ts
│       │   │   │   ├── iconExtensionPoint.ts
│       │   │   │   ├── plistParser.ts
│       │   │   │   ├── productIconThemeSchema.ts
│       │   │   │   ├── textMateScopeMatcher.ts
│       │   │   │   ├── themeCompatibility.ts
│       │   │   │   ├── themeConfiguration.ts
│       │   │   │   ├── themeExtensionPoints.ts
│       │   │   │   ├── tokenClassificationExtensionPoint.ts
│       │   │   │   └── workbenchThemeService.ts
│       │   │   ├── electron-sandbox
│       │   │   │   ├── nativeHostColorSchemeService.ts
│       │   │   │   └── themes.contribution.ts
│       │   │   └── test
│       │   │       └── node
│       │   │           └── color-theme.json
│       │   ├── timer
│       │   │   ├── browser
│       │   │   │   └── timerService.ts
│       │   │   └── electron-sandbox
│       │   │       └── timerService.ts
│       │   ├── title
│       │   │   ├── browser
│       │   │   │   └── titleService.ts
│       │   │   └── electron-sandbox
│       │   │       └── titleService.ts
│       │   ├── treeSitter
│       │   │   └── browser
│       │   │       ├── treeSitterCodeEditors.ts
│       │   │       ├── treeSitterTokenizationFeature.contribution.ts
│       │   │       └── treeSitterTokenizationFeature.ts
│       │   ├── tunnel
│       │   │   ├── browser
│       │   │   │   └── tunnelService.ts
│       │   │   └── electron-sandbox
│       │   │       └── tunnelService.ts
│       │   ├── untitled
│       │   │   ├── common
│       │   │   │   ├── untitledTextEditorHandler.ts
│       │   │   │   ├── untitledTextEditorInput.ts
│       │   │   │   ├── untitledTextEditorModel.ts
│       │   │   │   └── untitledTextEditorService.ts
│       │   │   └── test
│       │   │       └── browser
│       │   │           └── untitledTextEditor.integrationTest.ts
│       │   ├── update
│       │   │   ├── browser
│       │   │   │   └── updateService.ts
│       │   │   └── electron-sandbox
│       │   │       └── updateService.ts
│       │   ├── url
│       │   │   ├── browser
│       │   │   │   └── urlService.ts
│       │   │   └── electron-sandbox
│       │   │       └── urlService.ts
│       │   ├── userActivity
│       │   │   ├── browser
│       │   │   │   ├── domActivityTracker.ts
│       │   │   │   └── userActivityBrowser.ts
│       │   │   └── common
│       │   │       ├── userActivityRegistry.ts
│       │   │       └── userActivityService.ts
│       │   ├── userData
│       │   │   └── browser
│       │   │       └── userDataInit.ts
│       │   ├── userDataProfile
│       │   │   ├── browser
│       │   │   │   ├── extensionsResource.ts
│       │   │   │   ├── globalStateResource.ts
│       │   │   │   ├── iconSelectBox.ts
│       │   │   │   ├── keybindingsResource.ts
│       │   │   │   ├── settingsResource.ts
│       │   │   │   ├── snippetsResource.ts
│       │   │   │   ├── tasksResource.ts
│       │   │   │   ├── userDataProfileImportExportService.ts
│       │   │   │   ├── userDataProfileInit.ts
│       │   │   │   ├── userDataProfileManagement.ts
│       │   │   │   └── userDataProfileStorageService.ts
│       │   │   └── common
│       │   │       ├── remoteUserDataProfiles.ts
│       │   │       ├── userDataProfileIcons.ts
│       │   │       ├── userDataProfileService.ts
│       │   │       └── userDataProfile.ts
│       │   ├── userDataSync
│       │   │   ├── browser
│       │   │   │   ├── userDataSyncEnablementService.ts
│       │   │   │   ├── userDataSyncInit.ts
│       │   │   │   ├── userDataSyncWorkbenchService.ts
│       │   │   │   └── webUserDataSyncEnablementService.ts
│       │   │   ├── common
│       │   │   │   ├── userDataSync.ts
│       │   │   │   └── userDataSyncUtil.ts
│       │   │   └── electron-sandbox
│       │   │       ├── userDataAutoSyncService.ts
│       │   │       └── userDataSyncService.ts
│       │   ├── utilityProcess
│       │   │   └── electron-sandbox
│       │   │       └── utilityProcessWorkerWorkbenchService.ts
│       │   ├── views
│       │   │   ├── browser
│       │   │   │   ├── viewDescriptorService.ts
│       │   │   │   └── viewsService.ts
│       │   │   └── common
│       │   │       ├── viewContainerModel.ts
│       │   │       └── viewsService.ts
│       │   ├── workingCopy
│       │   │   ├── browser
│       │   │   │   ├── workingCopyBackupService.ts
│       │   │   │   ├── workingCopyBackupTracker.ts
│       │   │   │   └── workingCopyHistoryService.ts
│       │   │   ├── common
│       │   │   │   ├── abstractFileWorkingCopyManager.ts
│       │   │   │   ├── fileWorkingCopyManager.ts
│       │   │   │   ├── fileWorkingCopy.ts
│       │   │   │   ├── resourceWorkingCopy.ts
│       │   │   │   ├── storedFileWorkingCopyManager.ts
│       │   │   │   ├── storedFileWorkingCopySaveParticipant.ts
│       │   │   │   ├── storedFileWorkingCopy.ts
│       │   │   │   ├── untitledFileWorkingCopyManager.ts
│       │   │   │   ├── untitledFileWorkingCopy.ts
│       │   │   │   ├── workingCopyBackupService.ts
│       │   │   │   ├── workingCopyBackupTracker.ts
│       │   │   │   ├── workingCopyBackup.ts
│       │   │   │   ├── workingCopyEditorService.ts
│       │   │   │   ├── workingCopyFileOperationParticipant.ts
│       │   │   │   ├── workingCopyFileService.ts
│       │   │   │   ├── workingCopyHistoryService.ts
│       │   │   │   ├── workingCopyHistoryTracker.ts
│       │   │   │   ├── workingCopyHistory.ts
│       │   │   │   ├── workingCopyService.ts
│       │   │   │   └── workingCopy.ts
│       │   │   └── electron-sandbox
│       │   │       ├── workingCopyBackupService.ts
│       │   │       ├── workingCopyBackupTracker.ts
│       │   │       └── workingCopyHistoryService.ts
│       │   └── workspaces
│       │       ├── browser
│       │       │   ├── abstractWorkspaceEditingService.ts
│       │       │   ├── workspaceEditingService.ts
│       │       │   ├── workspacesService.ts
│       │       │   ├── workspaces.ts
│       │       │   └── workspaceTrustEditorInput.ts
│       │       ├── common
│       │       │   ├── canonicalUriService.ts
│       │       │   ├── editSessionIdentityService.ts
│       │       │   ├── workspaceEditing.ts
│       │       │   ├── workspaceIdentityService.ts
│       │       │   ├── workspaceTrust.ts
│       │       │   └── workspaceUtils.ts
│       │       └── electron-sandbox
│       │           ├── workspaceEditingService.ts
│       │           └── workspacesService.ts
│       ├── test
│       │   ├── browser
│       │   │   └── workbenchTestServices.ts
│       │   ├── common
│       │   │   ├── utils.ts
│       │   │   └── workbenchTestServices.ts
│       │   └── electron-sandbox
│       │       └── workbenchTestServices.ts
│       ├── workbench.common.main.ts
│       ├── workbench.desktop.main.ts
│       ├── workbench.web.main.internal.ts
│       └── workbench.web.main.ts
└── vscode-dts
    ├── vscode.d.ts
    ├── vscode.proposed.activeComment.d.ts
    ├── vscode.proposed.aiRelatedInformation.d.ts
    ├── vscode.proposed.aiTextSearchProvider.d.ts
    ├── vscode.proposed.authLearnMore.d.ts
    ├── vscode.proposed.authSession.d.ts
    ├── vscode.proposed.canonicalUriProvider.d.ts
    ├── vscode.proposed.chatEditing.d.ts
    ├── vscode.proposed.chatParticipantAdditions.d.ts
    ├── vscode.proposed.chatParticipantPrivate.d.ts
    ├── vscode.proposed.chatProvider.d.ts
    ├── vscode.proposed.chatReferenceBinaryData.d.ts
    ├── vscode.proposed.chatReferenceDiagnostic.d.ts
    ├── vscode.proposed.chatTab.d.ts
    ├── vscode.proposed.codeActionAI.d.ts
    ├── vscode.proposed.codeActionRanges.d.ts
    ├── vscode.proposed.codiconDecoration.d.ts
    ├── vscode.proposed.commentingRangeHint.d.ts
    ├── vscode.proposed.commentReactor.d.ts
    ├── vscode.proposed.commentReveal.d.ts
    ├── vscode.proposed.commentsDraftState.d.ts
    ├── vscode.proposed.commentThreadApplicability.d.ts
    ├── vscode.proposed.contribAccessibilityHelpContent.d.ts
    ├── vscode.proposed.contribCommentEditorActionsMenu.d.ts
    ├── vscode.proposed.contribCommentPeekContext.d.ts
    ├── vscode.proposed.contribCommentsViewThreadMenus.d.ts
    ├── vscode.proposed.contribCommentThreadAdditionalMenu.d.ts
    ├── vscode.proposed.contribDebugCreateConfiguration.d.ts
    ├── vscode.proposed.contribDiffEditorGutterToolBarMenus.d.ts
    ├── vscode.proposed.contribEditorContentMenu.d.ts
    ├── vscode.proposed.contribEditSessions.d.ts
    ├── vscode.proposed.contribLabelFormatterWorkspaceTooltip.d.ts
    ├── vscode.proposed.contribMenuBarHome.d.ts
    ├── vscode.proposed.contribMergeEditorMenus.d.ts
    ├── vscode.proposed.contribMultiDiffEditorMenus.d.ts
    ├── vscode.proposed.contribNotebookStaticPreloads.d.ts
    ├── vscode.proposed.contribRemoteHelp.d.ts
    ├── vscode.proposed.contribShareMenu.d.ts
    ├── vscode.proposed.contribSourceControlHistoryItemMenu.d.ts
    ├── vscode.proposed.contribSourceControlHistoryTitleMenu.d.ts
    ├── vscode.proposed.contribSourceControlInputBoxMenu.d.ts
    ├── vscode.proposed.contribSourceControlTitleMenu.d.ts
    ├── vscode.proposed.contribStatusBarItems.d.ts
    ├── vscode.proposed.contribViewContainerTitle.d.ts
    ├── vscode.proposed.contribViewsRemote.d.ts
    ├── vscode.proposed.contribViewsWelcome.d.ts
    ├── vscode.proposed.customEditorMove.d.ts
    ├── vscode.proposed.debugVisualization.d.ts
    ├── vscode.proposed.defaultChatParticipant.d.ts
    ├── vscode.proposed.diffCommand.d.ts
    ├── vscode.proposed.diffContentOptions.d.ts
    ├── vscode.proposed.documentFiltersExclusive.d.ts
    ├── vscode.proposed.editorHoverVerbosityLevel.d.ts
    ├── vscode.proposed.editorInsets.d.ts
    ├── vscode.proposed.editSessionIdentityProvider.d.ts
    ├── vscode.proposed.embeddings.d.ts
    ├── vscode.proposed.envExtractUri.d.ts
    ├── vscode.proposed.extensionRuntime.d.ts
    ├── vscode.proposed.extensionsAny.d.ts
    ├── vscode.proposed.externalUriOpener.d.ts
    ├── vscode.proposed.fileSearchProvider2.d.ts
    ├── vscode.proposed.fileSearchProvider.d.ts
    ├── vscode.proposed.findFiles2.d.ts
    ├── vscode.proposed.findTextInFiles2.d.ts
    ├── vscode.proposed.findTextInFiles.d.ts
    ├── vscode.proposed.fsChunks.d.ts
    ├── vscode.proposed.idToken.d.ts
    ├── vscode.proposed.inlineCompletionsAdditions.d.ts
    ├── vscode.proposed.inlineEdit.d.ts
    ├── vscode.proposed.interactive.d.ts
    ├── vscode.proposed.interactiveWindow.d.ts
    ├── vscode.proposed.ipc.d.ts
    ├── vscode.proposed.languageModelCapabilities.d.ts
    ├── vscode.proposed.languageModelSystem.d.ts
    ├── vscode.proposed.languageModelToolsForAgent.d.ts
    ├── vscode.proposed.languageStatusText.d.ts
    ├── vscode.proposed.mappedEditsProvider.d.ts
    ├── vscode.proposed.mcpConfigurationProvider.d.ts
    ├── vscode.proposed.multiDocumentHighlightProvider.d.ts
    ├── vscode.proposed.nativeWindowHandle.d.ts
    ├── vscode.proposed.newSymbolNamesProvider.d.ts
    ├── vscode.proposed.notebookCellExecution.d.ts
    ├── vscode.proposed.notebookCellExecutionState.d.ts
    ├── vscode.proposed.notebookControllerAffinityHidden.d.ts
    ├── vscode.proposed.notebookDeprecated.d.ts
    ├── vscode.proposed.notebookExecution.d.ts
    ├── vscode.proposed.notebookKernelSource.d.ts
    ├── vscode.proposed.notebookLiveShare.d.ts
    ├── vscode.proposed.notebookMessaging.d.ts
    ├── vscode.proposed.notebookMime.d.ts
    ├── vscode.proposed.notebookReplDocument.d.ts
    ├── vscode.proposed.notebookVariableProvider.d.ts
    ├── vscode.proposed.portsAttributes.d.ts
    ├── vscode.proposed.profileContentHandlers.d.ts
    ├── vscode.proposed.quickDiffProvider.d.ts
    ├── vscode.proposed.quickInputButtonLocation.d.ts
    ├── vscode.proposed.quickPickItemTooltip.d.ts
    ├── vscode.proposed.quickPickSortByLabel.d.ts
    ├── vscode.proposed.resolvers.d.ts
    ├── vscode.proposed.scmActionButton.d.ts
    ├── vscode.proposed.scmHistoryProvider.d.ts
    ├── vscode.proposed.scmMultiDiffEditor.d.ts
    ├── vscode.proposed.scmSelectedProvider.d.ts
    ├── vscode.proposed.scmTextDocument.d.ts
    ├── vscode.proposed.scmValidation.d.ts
    ├── vscode.proposed.shareProvider.d.ts
    ├── vscode.proposed.speech.d.ts
    ├── vscode.proposed.statusBarItemTooltip.d.ts
    ├── vscode.proposed.tabInputMultiDiff.d.ts
    ├── vscode.proposed.tabInputTextMerge.d.ts
    ├── vscode.proposed.taskPresentationGroup.d.ts
    ├── vscode.proposed.taskProblemMatcherStatus.d.ts
    ├── vscode.proposed.telemetry.d.ts
    ├── vscode.proposed.terminalCompletionProvider.d.ts
    ├── vscode.proposed.terminalDataWriteEvent.d.ts
    ├── vscode.proposed.terminalDimensions.d.ts
    ├── vscode.proposed.terminalExecuteCommandEvent.d.ts
    ├── vscode.proposed.terminalQuickFixProvider.d.ts
    ├── vscode.proposed.terminalSelection.d.ts
    ├── vscode.proposed.terminalShellEnv.d.ts
    ├── vscode.proposed.testObserver.d.ts
    ├── vscode.proposed.testRelatedCode.d.ts
    ├── vscode.proposed.textDocumentEncoding.d.ts
    ├── vscode.proposed.textEditorDiffInformation.d.ts
    ├── vscode.proposed.textSearchComplete2.d.ts
    ├── vscode.proposed.textSearchProvider2.d.ts
    ├── vscode.proposed.textSearchProvider.d.ts
    ├── vscode.proposed.timeline.d.ts
    ├── vscode.proposed.tokenInformation.d.ts
    ├── vscode.proposed.treeViewActiveItem.d.ts
    ├── vscode.proposed.treeViewMarkdownMessage.d.ts
    ├── vscode.proposed.treeViewReveal.d.ts
    ├── vscode.proposed.tunnelFactory.d.ts
    ├── vscode.proposed.tunnels.d.ts
    ├── vscode.proposed.valueSelectionInQuickPick.d.ts
    └── vscode.proposed.workspaceTrust.d.ts

1417 directories, 3959 files
