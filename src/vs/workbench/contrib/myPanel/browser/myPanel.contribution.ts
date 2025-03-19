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

		// Create a messages container
		const messagesContainer = document.createElement('div');
		messagesContainer.classList.add('my-panel-messages');
		container.appendChild(messagesContainer);

		// Create and append multiple messages to demonstrate scrolling
		const messages = [
			{ sender: 'user', text: 'What are the key features of Next.js that make it better than plain React?' },
			{ sender: 'assistant', text: 'Next.js offers several advantages over plain React that make it a powerful framework for production applications. Here are the key features that set it apart:\n\n1. **Server-Side Rendering (SSR)**: Next.js can pre-render pages on the server, improving both performance and SEO as search engines can crawl the fully rendered content.\n\n2. **Static Site Generation (SSG)**: For content that doesn\'t change frequently, Next.js can generate static HTML at build time, providing extremely fast page loads.\n\n3. **Incremental Static Regeneration (ISR)**: This allows you to update static content after you\'ve deployed, combining the benefits of static generation with dynamic data.\n\n4. **File-based Routing**: Instead of configuring routes manually, Next.js creates routes based on your file structure in the pages directory, simplifying navigation setup.\n\n5. **API Routes**: You can build API endpoints within your Next.js application, eliminating the need for a separate backend in many cases.\n\n6. **Built-in Image Optimization**: The Next.js Image component automatically optimizes images for different devices and implements lazy loading.\n\n7. **Automatic Code Splitting**: Next.js only loads the JavaScript needed for each page, reducing the initial load time.\n\nThese features work together to provide a more performant, SEO-friendly, and developer-friendly experience compared to using React alone.' },
			{ sender: 'user', text: 'How does the App Router differ from the Pages Router?' },
			{ sender: 'assistant', text: 'The App Router is Next.js\'s newer, more advanced routing system that offers significant improvements over the traditional Pages Router. Here\'s a comprehensive comparison:\n\n**App Router (newer)**:\n\n1. **React Server Components**: The App Router is built on React Server Components, allowing components to render on the server by default, reducing JavaScript sent to the client.\n\n2. **Nested Routing**: Uses a nested folder structure that mirrors your UI hierarchy, making complex layouts easier to implement.\n\n3. **Layout System**: Easily share UI between routes while preserving state and avoiding re-renders through layout components.\n\n4. **Loading States**: Built-in support for showing loading states while route segments are being loaded.\n\n5. **Streaming**: Supports streaming server rendering, progressively sending UI from the server to the client.\n\n6. **Data Fetching**: Can fetch data at the component level rather than only at the page level.\n\n7. **Route Handlers**: More powerful API route creation with enhanced control over requests and responses.\n\n8. **Parallel Routes**: Allows multiple pages to be shown in the same view simultaneously.\n\n**Pages Router (traditional)**:\n\n1. **File-system Based**: Routes are defined by files in the pages directory.\n\n2. **Client-side Rendering by Default**: Components render on the client unless using getServerSideProps or getStaticProps.\n\n3. **Single Layout with _app.js**: Shared layouts are typically implemented through _app.js and don\'t preserve state between pages.\n\n4. **API Routes**: Implemented through files in the pages/api directory.\n\nThe App Router represents a significant evolution in Next.js development, embracing React\'s latest innovations while offering more flexibility and performance optimizations. However, the Pages Router remains fully supported for existing applications.' },
			{ sender: 'user', text: 'Is it easy to integrate a database with Next.js?' },
			{ sender: 'assistant', text: 'Yes, integrating a database with Next.js is quite straightforward, and you have several approaches depending on your requirements:\n\n**1. Direct Database Connection**:\nYou can connect to databases like PostgreSQL, MySQL, MongoDB, or any other database directly from your Next.js application. This works especially well with the App Router\'s Server Components or with API routes, as the database connection occurs on the server.\n\nFor example, with Prisma ORM:\n```typescript\n// db.js\nimport { PrismaClient } from \'@prisma/client\'\n\nconst prisma = new PrismaClient()\nexport default prisma\n\n// In a Server Component or API route\nimport prisma from \'../lib/db\'\n\nasync function getUserData() {\n  const users = await prisma.user.findMany()\n  return users\n}\n```\n\n**2. Using API Routes**:\nWith the Pages Router, you can create API endpoints in the `pages/api` directory (or `app/api` with the App Router using Route Handlers). These server-side functions can safely connect to your database and return data to the client.\n\n**3. ORM Integration**:\nMany developers use ORMs like Prisma, Sequelize, TypeORM, or Drizzle with Next.js to simplify database operations and provide type safety.\n\n**4. Serverless Database Options**:\nServices like PlanetScale, Supabase, Firebase, or MongoDB Atlas work particularly well with Next.js\'s deployment model, especially when hosting on platforms like Vercel.\n\n**5. Data Fetching Strategies**:\nNext.js offers various data fetching methods that work well with databases:\n- Server Components can directly fetch data\n- `getServerSideProps` for server-side rendering\n- `getStaticProps` for static generation\n- API routes for client-side requests\n\nThe beauty of Next.js is that it allows you to choose the best data fetching strategy based on each page\'s needs, whether that\'s static generation for infrequently changing data or server-side rendering for dynamic content.\n\nFor the best developer experience, I recommend using Prisma or another type-safe ORM, which provides excellent TypeScript integration and simplifies database operations significantly.' },
			{ sender: 'user', text: 'What about authentication in Next.js?' },
			{ sender: 'assistant', text: 'Authentication in Next.js is well-supported through various approaches, giving you flexibility based on your project requirements:\n\n**1. NextAuth.js / Auth.js**:\nThis is the most popular authentication solution for Next.js, offering a complete authentication system with minimal setup.\n\nKey benefits include:\n- Support for 50+ authentication providers (Google, GitHub, etc.)\n- JWT and database session strategies\n- Built-in CSRF protection\n- Automatic refresh token rotation\n- Supports both Pages Router and App Router\n\nBasic implementation example:\n```typescript\n// pages/api/auth/[...nextauth].js\nimport NextAuth from \'next-auth\'\nimport GoogleProvider from \'next-auth/providers/google\'\n\nexport default NextAuth({\n  providers: [\n    GoogleProvider({\n      clientId: process.env.GOOGLE_CLIENT_ID,\n      clientSecret: process.env.GOOGLE_CLIENT_SECRET,\n    }),\n  ],\n  // Additional configuration options...\n})\n```\n\n**2. Middleware-based Authentication**:\nNext.js 12+ introduced middleware that runs before requests are completed, perfect for authentication:\n\n```typescript\n// middleware.ts\nexport function middleware(request) {\n  const token = request.cookies.get(\'token\')\n  const isAuthenticated = validateToken(token) // Your validation logic\n  \n  if (!isAuthenticated && request.nextUrl.pathname !== \'/login\') {\n    return NextResponse.redirect(new URL(\'/login\', request.url))\n  }\n}\n\nexport const config = {\n  matcher: [\'/dashboard/:path*\', \'/account/:path*\'],\n}\n```\n\n**3. Integrating Auth Services**:\nMany developers use dedicated authentication services with Next.js:\n\n- **Clerk**: Provides complete user management with pre-built components\n- **Supabase Auth**: Simple email/password and social auth with PostgreSQL integration\n- **Firebase Authentication**: Comprehensive auth from Google with many providers\n- **Auth0**: Enterprise-grade authentication platform\n\n**4. Custom Authentication**:\nYou can build custom authentication using API routes and JWT tokens, giving you complete control over the implementation.\n\n**App Router Specific Considerations**:\nWith the App Router, you can use Server Components to check authentication status securely, and Client Components for interactive login forms. The built-in middleware support makes protecting routes straightforward.\n\nThe best approach depends on your specific requirements, but NextAuth.js/Auth.js is a great starting point for most applications due to its ease of use and comprehensive feature set.' },
			{ sender: 'user', text: 'How do I deploy a Next.js application?' },
			{ sender: 'assistant', text: 'Deploying a Next.js application is straightforward with several excellent options available. Here\'s a comprehensive guide to the most popular deployment methods:\n\n**1. Vercel (Recommended/Easiest)**\nVercel, created by the team behind Next.js, offers the most optimized deployment experience:\n\n- **Zero configuration**: Connect your Git repository and deploy automatically\n- **Preview deployments**: Every pull request gets its own preview URL\n- **Edge functions**: Global CDN with serverless functions\n- **Environment variables**: Easy management through the dashboard\n- **Analytics**: Built-in performance monitoring\n\nTo deploy on Vercel:\n1. Push your code to GitHub/GitLab/Bitbucket\n2. Import your repository on Vercel\n3. Configure your project settings\n4. Deploy\n\n**2. Netlify**\nSimilar to Vercel with excellent Next.js support:\n\n- Git-based workflow with continuous deployment\n- Preview deployments for pull requests\n- Serverless functions support\n- Simple environment variable management\n\n**3. AWS Amplify**\nGood option if you\'re already using AWS services:\n\n- Continuous deployment from Git\n- Integrated with other AWS services\n- Handles SSR functions automatically\n\n**4. Traditional Hosting (Self-hosted)**\nFor complete control or specific infrastructure requirements:\n\n```bash\n# Build your application\nnpm run build\n\n# Start the production server\nnpm run start\n```\n\nYou can deploy this on:\n- **Docker containers**: Containerize your Next.js app\n- **AWS EC2/ECS**: Traditional server or container deployment\n- **Digital Ocean Droplets**: Virtual private servers\n- **Google Cloud Run**: Containerized deployment\n\n**5. Static Export (for static sites only)**\nIf your site doesn\'t use Server-Side Rendering or API routes:\n\n```bash\n# In next.config.js\nmodule.exports = {\n  output: \'export\'\n}\n\n# Generate static files\nnpm run build\n```\n\nThis creates a static site that can be deployed anywhere that hosts static sites (GitHub Pages, S3, etc.).\n\n**Considerations for Different Next.js Features:**\n\n- **API Routes**: Require a Node.js environment (Vercel, Netlify, etc.)\n- **Server Components**: Best supported on platforms that understand Next.js (Vercel)\n- **Middleware**: Needs a compatible hosting platform\n- **Image Optimization**: Some features need specific server support\n\n**Production Optimizations:**\n\n1. Use a Content Delivery Network (CDN)\n2. Implement proper caching strategies\n3. Configure environment variables correctly\n4. Set up monitoring and error tracking\n5. Consider using Edge functions for global performance\n\nVercel remains the most seamless option for Next.js deployment, but all these methods are viable depending on your specific requirements and existing infrastructure.' },
			{ sender: 'user', text: 'Thanks! This has been really helpful. One last question - what are the best resources to learn more about Next.js?' },
			{ sender: 'assistant', text: 'I\'m glad you found this helpful! Here\'s a curated list of the best resources to deepen your Next.js knowledge:\n\n**Official Documentation and Learning Resources**\n\n1. **Next.js Documentation**\n   The official docs are exceptional - comprehensive, well-organized, and frequently updated with the latest features.\n   https://nextjs.org/docs\n\n2. **Learn Next.js**\n   Interactive tutorial from the Next.js team covering fundamentals through advanced topics.\n   https://nextjs.org/learn\n\n3. **Next.js Examples**\n   Official repository with dozens of example projects demonstrating specific features and integrations.\n   https://github.com/vercel/next.js/tree/canary/examples\n\n**Courses and Video Tutorials**\n\n4. **Mastering Next.js by Lee Robinson**\n   Comprehensive course by Vercel\'s VP of Developer Experience.\n   https://masteringnextjs.com/\n\n5. **Next.js Conf Videos**\n   Recordings from the annual Next.js conference featuring best practices and case studies.\n   https://nextjs.org/conf\n\n6. **Academind\'s Next.js Course on Udemy**\n   Thorough course covering Next.js from basics to advanced topics.\n   https://www.udemy.com/course/nextjs-react-the-complete-guide/\n\n**Blogs and Articles**\n\n7. **Vercel Blog**\n   Regular articles about Next.js features, case studies, and best practices.\n   https://vercel.com/blog\n\n8. **Lee Robinson\'s Blog**\n   Insightful articles about Next.js and React from Vercel\'s VP of Developer Experience.\n   https://leerob.io/blog\n\n9. **Josh Comeau\'s Blog**\n   Excellent deep dives into Next.js and React concepts with interactive examples.\n   https://www.joshwcomeau.com/\n\n**Communities**\n\n10. **Next.js Discord**\n    Active community with dedicated channels for help and discussions.\n    https://discord.gg/nextjs\n\n11. **DEV Community Next.js Tag**\n    Articles and discussions specifically about Next.js.\n    https://dev.to/t/nextjs\n\n12. **Reddit r/nextjs**\n    Subreddit dedicated to Next.js discussions and help.\n    https://www.reddit.com/r/nextjs/\n\n**Advanced Tools and Resources**\n\n13. **Next Auth**\n    Authentication library specifically designed for Next.js.\n    https://next-auth.js.org/\n\n14. **SWR and React Query Documentation**\n    Data fetching libraries that work exceptionally well with Next.js.\n    https://swr.vercel.app/ and https://tanstack.com/query/\n\n15. **Tailwind CSS + Next.js**\n    These technologies pair exceptionally well together.\n    https://tailwindcss.com/docs/guides/nextjs\n\n**GitHub Repositories to Study**\n\n16. **Next.js Commerce**\n    Reference e-commerce site built with Next.js.\n    https://github.com/vercel/commerce\n\n17. **cal.com**\n    Open-source scheduling application built with Next.js.\n    https://github.com/calcom/cal.com\n\nFor a learning path, I recommend:\n\n1. Start with the official Learn Next.js tutorial\n2. Explore the documentation as you build your first project\n3. Join the Discord community for help when you get stuck\n4. Study example repositories for real-world implementation patterns\n5. Follow blogs and Twitter accounts of Next.js contributors for the latest updates\n\nAs you progress, contribute to discussions and consider sharing your own learnings through blog posts or community forums – teaching is one of the best ways to solidify your knowledge!' },
			{ sender: 'user', text: 'Perfect! I\'ll start with the official docs and tutorial. Looking forward to building something with Next.js!' }
		];

		// Add each message as a separate element with sender class
		messages.forEach(message => {
			const messageElement = document.createElement('div');
			messageElement.classList.add('my-panel-text');
			messageElement.classList.add(`my-panel-text-${message.sender}`);

			// Create and append content securely using DOM manipulation
			this.appendFormattedContent(messageElement, message.text);

			messagesContainer.appendChild(messageElement);
		});

		// Create the input section at the bottom
		this.createInputSection(container);
	}

	private createInputSection(container: HTMLElement): void {
		// Create a section with a title
		const section = document.createElement('div');
		section.classList.add('my-panel-section');

		const input = document.createElement('input');
		input.type = 'text';
		input.placeholder = 'Enter your text here';
		section.appendChild(input);

		const button = document.createElement('button');
		button.textContent = 'Submit';
		section.appendChild(button);

		// Add event listener for button click
		button.addEventListener('click', () => {
			const text = input.value.trim();
			if (text) {
				this.updateText(text);
				input.value = '';
				input.focus();
			}
		});

		// Add event listener for Enter key
		input.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				const text = input.value.trim();
				if (text) {
					this.updateText(text);
					input.value = '';
				}
			}
		});

		container.appendChild(section);
	}

	// Simple method to process markdown-like formatting using DOM manipulation
	private appendFormattedContent(container: HTMLElement, text: string): void {
		// Split by code blocks first
		const parts = text.split(/```([^`]+)```/);

		for (let i = 0; i < parts.length; i++) {
			if (i % 2 === 1) {
				// This is a code block
				const pre = document.createElement('pre');
				pre.textContent = parts[i];
				container.appendChild(pre);
			} else if (parts[i]) {
				// Process the non-code block content

				// Split by line breaks
				const lines = parts[i].split('\n');

				for (let j = 0; j < lines.length; j++) {
					// Process line content (bold and inline code)
					const line = lines[j];
					const segments = this.processLineSegments(line);

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

	// Process line segments for bold and inline code
	private processLineSegments(line: string): Node[] {
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

	// Method to update text content dynamically
	public updateText(text: string): void {
		if (!this.container) {
			return;
		}

		// Create a new message element
		const messageElement = document.createElement('div');
		messageElement.classList.add('my-panel-text');

		// Determine if this is a user message (for demo purposes, alternating)
		const messagesContainer = this.container.querySelector('.my-panel-messages');
		const existingMessages = messagesContainer?.querySelectorAll('.my-panel-text') || [];
		const isUserMessage = existingMessages.length % 2 === 0;

		// Add the appropriate sender class
		messageElement.classList.add(isUserMessage ? 'my-panel-text-user' : 'my-panel-text-assistant');

		// Create and append content securely using DOM manipulation
		this.appendFormattedContent(messageElement, text);

		// Find the messages container and append the new message
		if (messagesContainer) {
			messagesContainer.appendChild(messageElement);

			// Scroll to the new message
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
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
