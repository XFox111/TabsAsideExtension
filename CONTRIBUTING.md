# Contribution Guidelines
Welcome, and thank you for your interest in contributing to my project!

There are many ways in which you can contribute, beyond writing code. The goal of this document is to provide a high-level overview of how you can get involved.

## Table of Contents
- [Contribution Guidelines](#contribution-guidelines)
  - [Table of Contents](#table-of-contents)
  - [Asking Questions](#asking-questions)
  - [Providing Feedback](#providing-feedback)
  - [Reporting Issues](#reporting-issues)
    - [Look For an Existing Issue](#look-for-an-existing-issue)
    - [Writing Good Bug Reports and Feature Requests](#writing-good-bug-reports-and-feature-requests)
    - [Final Checklist](#final-checklist)
    - [Follow Your Issue](#follow-your-issue)
  - [Contributing to the codebase](#contributing-to-the-codebase)
    - [Deploy test version on your browser](#deploy-test-version-on-your-browser)
    - [Development workflow](#development-workflow)
      - [Release](#release)
    - [Coding guidelines](#coding-guidelines)
      - [Indentation](#indentation)
      - [Names](#names)
      - [Comments](#comments)
      - [Strings](#strings)
      - [Style](#style)
    - [Finding an issue to work on](#finding-an-issue-to-work-on)
    - [Contributing to translations](#contributing-to-translations)
    - [Submitting pull requests](#submitting-pull-requests)
      - [Spell check errors](#spell-check-errors)
  - [Thank You!](#thank-you)
  - [Attribution](#attribution)

## Asking Questions
Have a question? Rather than opening an issue, please ask me directly on opensource@xfox111.net.

## Providing Feedback
Your comments and feedback are welcome.
You can leave your feedbak on feedback@xfox111.net or do it on [Microsoft Edge Add-ons Webstore](https://microsoftedge.microsoft.com/addons/detail/tabs-aside/kmnblllmalkiapkfknnlpobmjjdnlhnd), [Chrome Extensions Webstore](https://chrome.google.com/webstore/detail/tabs-aside/mgmjbodjgijnebfgohlnjkegdpbdjgin) or [Mozilla Add-ons Webstore](https://addons.mozilla.org/firefox/addon/ms-edge-tabs-aside/)

## Reporting Issues
Have you identified a reproducible problem in the extension? Have a feature request? I'd like to hear it! Here's how you can make reporting your issue as effective as possible.

### Look For an Existing Issue
Before you create a new issue, please do a search in [open issues](https://github.com/xfox111/TabsAsideExtension/issues) to see if the issue or feature request has already been filed.

Be sure to scan through the [feature requests](https://github.com/XFox111/TabsAsideExtension/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement).

If you find your issue already exists, make relevant comments and add your [reaction](https://github.com/blog/2119-add-reactions-to-pull-requests-issues-and-comments). Use a reaction in place of a "+1" comment:

- 👍 - upvote
- 👎 - downvote

If you cannot find an existing issue that describes your bug or feature, create a new issue using the guidelines below.

### Writing Good Bug Reports and Feature Requests
File a single issue per problem and feature request. Do not enumerate multiple bugs or feature requests in the same issue.

Do not add your issue as a comment to an existing issue unless they are the same ones. Many issues look similar, but have different causes.

The more information you can provide, the more likely someone will be successful at reproducing the issue and finding a solution.

Please include the following with each issue:
- Current version of the extension
- Your current browser and OS name
- Reproducible steps (1... 2... 3...) that cause the issue
- What you expected to see, versus what you actually saw
- Images, animations, or a link to a video showing the issue occurring

### Final Checklist
Please remember to do the following:

- [*] Search the issue repository to ensure your report is a new issue
- [*] Separate issues reports
- [*] Include as much information as you can to your report

Don't feel bad if the developers can't reproduce the issue right away. They will simply ask for more information!

### Follow Your Issue
Once your report is submitted, be sure to stay in touch with the devs in case they need more help from you.

## Contributing to the codebase
If you are interested in writing code to fix issues or implement new awesome features you can follow these guidelines to get a better result

### Deploy test version on your browser
1. Clone repository to local storage using [Git](https://guides.github.com/introduction/git-handbook/)

   ```bash
   git clone https://github.com/xfox111/TabsAsideExtension.git
   ```
2. Install [Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/)
3. Open terminal in project directory and run
	```bash
	yarn install
	```
4. Build project
	```bash
	yarn build
	```
2. Enable Developers mode on your browser extensions page
3. Click "Load unpacked" button and navigate to the `build` folder of the repo (contains `manifest.json`)
4. Done!

To run extension as standalone web application you can use `yarn start` command

Next time you make any changes to the codebase, rebuild extension with `yarn build` and reload extension by toggling it off and on or by pressing "Reload" button on extensions list page

> **Note:** You can also check [this article](https://xfox111.net/46hsgv) to get more information about debugging web extensions

### Development workflow
This section represents how contributors should interact with codebase implementing features and fixing bugs

1. Getting assigned to the issue
2. Creating a repository fork
3. Making changes to the codebase
4. Creating a pull request to `main`
5. Reviewing & completing PR
6. Done

#### Release
The next stage is the release. Release performs on every push to main (which makes functional changes to the source code). Release performs manually by @XFox111 into: Chrome webstore, Edge webstore and GitHub releases

### Coding guidelines
#### Indentation
We use tabs, not spaces.

#### Names
The project naming rules inherit [.NET Naming Guidelines](https://docs.microsoft.com/en-us/dotnet/standard/design-guidelines/naming-guidelines). Nevertheless there'is some distinction with the guidelines as well as additions to the one:
- Use `camelCase` for variables instead of `CamelCase` stated in [Capitalization Conventions](https://docs.microsoft.com/en-us/dotnet/standard/design-guidelines/capitalization-conventions#capitalization-rules-for-identifiers)
- Use `camelCase` for files in `public` directory
- Use `PascalCase` for files in `src` directory

#### Comments
Leave as more comments as you can. Remember: the more detailed documentation your code has the less programmers will curse you in the future

#### Strings
Use "double quotes" wherever it's possible

#### Style
- Prefer to use lambda functions
- Always put curly braces on new lines
    - Wrong:
        ```js
        if (condition) {
            ...
        }
        ```
    - Correct:
        ```js
        if (condition)
        {
            ...
        }
        ```
	> **Note:** For JSON files put opening brace on the same line as the key
- Put spaces between operators, conditionals and loops
    - Wrong:
		```js
        y=k*x+b;
        if(condition) { ... }
		```
    - Correct:
		```js
        y = k * x + b;
        if (condition) { ... }
		```
- Use ternary conditionals wherever it's possible, unless it's too long
    - Wrong:
        ```js
        var s;
        if (condition)
            s = "Life";
        else
            s = "Death";
        ```
    - Correct:
        ```js
		var s = condition ? "Life" : "Death";
		```
- Do not surround loop and conditional bodies with curly braces if they can be avoided
    - Wrong:
        ```js
        if (condition)
        {
            console.log("Hello, World!");
        }
        else
        {
            return;
        }
        ```
    - Correct
        ```js
        if (condition)
            console.log("Hello, World!");
        else
            return;
        ```
- Prefer export modules as default
	- Wrong:
		```js
		export class MyClass { ... }
		```
	- Correct:
		```js
		export default class MyClass { ... }
		```
- Prefer export modules as classes unless it is excessive
	- Wrong:
		```ts
		export function MyFunction1() { ... }
		export function MyFunction2() { ... }
		export default class MyClass2()
		{
			public static GetDate(timestamp: number): Date
			{
				return new Date(timestamp);
			}
		}
		```
	- Correct:
		```js
		export default class MyClass1
		{
			public static MyFunction1() { ... }
			public static MyFunction2() { ... }
		}
		export default GetDate(timestamp: number): Date
		{
			return new Date(timestamp);
		}
		```
- When JSX attributes take too much space, put each attribute on a new line and put additional line before component's content
	- Wrong:
		```tsx
		<HelloWorld attribute1="value" attribute2={ value } attribute3="value">My content here</HelloWorld>
		<HelloWorld attribute1="value"
			attribute2={ value }
			attribute3="value">My content here</HelloWorld>
		<HelloWorld attribute1="value"
					attribute2={ value }
					attribute3="value">
			My content here
		</HelloWorld>
		<HelloWorld
			attribute1="value"
			attribute2={ value }
			attribute3="value">
			My content here
		</HelloWorld>
		```
	- Correct:
		```tsx
		<HelloWorld
			attribute1="value"
			attribute2={ value }
			attribute3="value">

			My content here
		</HelloWorld>
		```
- If JSX component doesn't have content, put space before closing tag
	- Wrong:
		```tsx
		<HelloWorld attribute1="value" attribute2={ value } attribute3="value"/>
		```
	- Correct:
		```tsx
		<HelloWorld attribute1="value" attribute2={ value } attribute3="value" />
		```

### Finding an issue to work on
Check out the [full issues list](https://github.com/XFox111/TabsAsideExtension/issues?utf8=%E2%9C%93&q=is%3Aopen+is%3Aissue) for a list of all potential areas for contributions. **Note** that just because an issue exists in the repository does not mean we will accept a contribution. There are several reasons we may not accept a pull request like:

- Performance - One of Tabs Aside core values is to deliver a lightweight extension, that means it should perform well in both real and test environments.
- User experience - Since we want to deliver a lightweight extension, the UX should feel lightweight as well and not be cluttered. Most changes to the UI should go through the issue owner and project owner (@XFox111).
- Architectural - Project owner needs to agree with any architectural impact a change may make. Such things must be discussed with and agreed upon by the project owner.

To improve the chances to get a pull request merged you should select an issue that is labelled with the `help-wanted` or `bug` labels. If the issue you want to work on is not labelled with `help-wanted` or `bug`, you can start a conversation with the project owner asking whether an external contribution will be considered.

To avoid multiple pull requests resolving the same issue, let others know you are working on it by saying so in a comment.

### Contributing to translations
If you want to help us to translate this extension into other languages, please read [this article](https://developer.chrome.com/extensions/i18n)

**Note** that whatever you want to contribute to the codebase, you should do it only after you got assigned on an issue

### Submitting pull requests
To enable us to quickly review and accept your pull requests, always create one pull request per issue and [link the issue in the pull request](https://github.com/blog/957-introducing-issue-mentions). Never merge multiple requests in one unless they have the same root cause. Be sure to follow our [Coding Guidelines](#coding-guidelines) and keep code changes as small as possible. Avoid pure formatting changes to code that has not been modified otherwise. Pull requests should contain tests whenever possible. Fill pull request content according to its template. Deviations from template are not recommended

#### Spell check errors
Pull requests that fix typos are welcomed but please make sure it doesn't touch multiple feature areas, otherwise it will be difficult to review. Pull requests only fixing spell check errors in source code are not recommended.

## Thank You!
Your contributions to open source, large or small, make great projects like this possible. Thank you for taking the time to contribute.

## Attribution
These Contribution Guidelines are adapted from the [Contributing to VS Code](https://github.com/microsoft/vscode/blob/master/CONTRIBUTING.md)
