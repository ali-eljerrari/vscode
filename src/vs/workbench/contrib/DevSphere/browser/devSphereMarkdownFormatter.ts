/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Since we're not actually using the trusted types policy in this class,
// let's remove it to avoid the linter warning
// import { createTrustedTypesPolicy } from '../../../../base/browser/trustedTypes.js';

/**
 * Utility class for formatting markdown content into DOM elements
 */
export class MarkdownFormatter {
	// Remove the unused policy definition

	/**
	 * Converts a markdown-like text string into DOM nodes
	 * @param text The markdown text to format
	 * @returns An array of DOM nodes representing the formatted content
	 */
	public static formatMarkdown(text: string): Node[] {
		const container = document.createElement('div');
		MarkdownFormatter.appendFormattedContent(container, text);
		return Array.from(container.childNodes);
	}

	/**
	 * Appends formatted markdown content to a container element
	 * @param container The DOM element to append content to
	 * @param text The markdown text to format
	 */
	public static appendFormattedContent(container: HTMLElement, text: string): void {
		// Handle null/empty text
		if (!text) {
			return;
		}

		// Sanitize input text to prevent XSS
		// This escapes HTML characters so they're rendered as text, not HTML
		const sanitizedText = text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');

		// Split by code blocks first
		const parts = sanitizedText.split(/```([^`]+)```/);

		for (let i = 0; i < parts.length; i++) {
			if (i % 2 === 1) {
				// This is a code block
				const pre = document.createElement('pre');
				const code = document.createElement('code');
				code.textContent = parts[i].trim();
				pre.appendChild(code);
				container.appendChild(pre);
			} else if (parts[i]) {
				// Process the non-code block content
				// Split by line breaks
				const lines = parts[i].split('\n');

				for (let j = 0; j < lines.length; j++) {
					// Process line content (bold and inline code)
					const line = lines[j];
					const segments = MarkdownFormatter.processLineSegments(line);

					// Add the processed segments
					for (const segment of segments) {
						container.appendChild(segment);
					}

					// Add a line break if not the last line
					if (j < lines.length - 1) {
						container.appendChild(document.createElement('br'));
					}
				}
			}
		}
	}

	/**
	 * Processes a line of text into DOM nodes with formatting applied
	 * @param line A line of text to process
	 * @returns An array of DOM nodes representing the formatted line
	 */
	private static processLineSegments(line: string): Node[] {
		const segments: Node[] = [];

		// Split by inline code
		const codeParts = line.split(/`([^`]+)`/);

		for (let i = 0; i < codeParts.length; i++) {
			if (i % 2 === 1) {
				// This is inline code
				const code = document.createElement('code');
				code.textContent = codeParts[i];
				segments.push(code);
			} else if (codeParts[i]) {
				// Process bold text
				const boldParts = codeParts[i].split(/\*\*([^*]+)\*\*/);

				for (let j = 0; j < boldParts.length; j++) {
					if (j % 2 === 1) {
						// This is bold text
						const strong = document.createElement('strong');
						strong.textContent = boldParts[j];
						segments.push(strong);
					} else if (boldParts[j]) {
						// Regular text
						const text = document.createTextNode(boldParts[j]);
						segments.push(text);
					}
				}
			}
		}

		return segments;
	}
}
