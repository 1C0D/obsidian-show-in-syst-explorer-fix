import { App, TFile, ViewState, WorkspaceLeaf, getLinkpath } from "obsidian";
import { log } from "./logs";

const infos = `
in VSC install the extension show functions
to see the list of functions below

in docstrings can use
 * @see {@link removeYAML} // ctrl click to follow the link
 * @see {@link module:utils/processFrontmatter} // between modules
`;

/**
 * Converts a number to a string representation with a 'k' suffix
 * if the number is greater than or equal to 1000.
 * @param number - The number to convert.
 * @returns The string representation of the number.
 * @example
 * const result = numberToK(2500);
 * console.log(result); // Output: '2.5k'
 */
export function numberToK(number: number): string {
	if (number >= 1000) {
		return (number / 1000).toFixed(1) + "k";
	} else {
		return number.toString();
	}
}

/**
 * Removes YAML content from the given string.
 * @param content - The string containing YAML content.
 * @returns The string with YAML content removed. *
 * @example
 * const yamlContent = `
 * ---
 * title: Example YAML
 * ---
 *
 * This is the content of the YAML file.
 * `;
 * const updatedContent = removeYAML(yamlContent);
 * console.log(updatedContent); // Output: "This is the content of the YAML file."
 */
export function removeYAML(content: string) {
	// Remove YAML content using regular expression
	const newContent = content.replace(/---(.|\n)*---/, "");
	return newContent;
}

/**
 * Retrieves the frontmatter from the metadata cache for the given path.
 * If the frontmatter is not found in the cache, it returns null.
 *
 * @param path - The path to the file.
 * @returns The frontmatter object or null if not found in the cache.
 * @see {@link removeYAML} // just for demo
 */
export function getFrontmatter(path: string = "") {
	// Retrieve the metadata cache for the given path
	const cache = this.app.metadataCache.getCache(path);
	// Check if the frontmatter is already in the cache
	if (cache.hasOwnProperty("frontmatter")) {
		return cache.frontmatter;
	}
	return null;
}

/**
 * Retrieves the path of a wikilinked file from the active leaf.
 *
 * @param activeLeaf - The active workspace leaf.
 * @returns The path of the wikilinked file, or an empty string if the file is unlinked.
 * @see [from](https://github.com/Vinzent03/find-unlinked-files/blob/1c1907bd7bba2355f2dc1b7d9712073f1d20ba97/src/main.ts#L232C1-L239C18)
 */
export function getWikilinkPath(activeLeaf: WorkspaceLeaf) {
	const file = (activeLeaf as any).view.file;
	const meta = this.app.metadataCache.getFileCache(file);

	if (meta && meta.links) {
		for (const metalink of meta.links) {
			const source = this.app.metadataCache.getFirstLinkpathDest(
				getLinkpath(metalink.link),
				file.path
			);

			if (source === null) {
				// unlinked file
				return "";
			} else {
				const realPath = source?.path;
				return realPath;
			}
		}
	}
}

/**
 * Create a folder if don't exist
 **/
export async function createFolder(folder: string, app: App): Promise<void> {
	const folderExists = await app.vault.adapter.exists(folder);
	if (!folderExists) {
		await this.app.vault.createFolder(folder);
	}
}

/**
 * Create a file with the given file path and content.
 * If the directory of the file don't exist,
 * create the directory.
 *
 * @param filePath - The path of the file to create.
 * @param fileContent - The content of the file.
 * @param app - The application instance.
 * @returns The created file object.
 */
export async function createFileWithInput(
	filePath: string,
	fileContent: string,
	app: App
): Promise<TFile> {
	// Extract the directory name from the file path
	const dirMatch = filePath.match(/(.*)[\/\\]/);
	let dirName = "";
	if (dirMatch) dirName = dirMatch[1];
	// If the directory exists, create the file
	if (await app.vault.adapter.exists(dirName)) {
		return await app.vault.create(filePath, fileContent);
	} else {
		// If the directory does not exist, create it
		await createFolder(dirName, app);
		return await this.vault.create(filePath, fileContent);
	}
}

// to see ------------

type NewTabDirection = any;
type FileViewMode = any;
export async function openFile(
	app: App,
	file: TFile,
	optional?: {
		openInNewTab?: boolean;
		direction?: NewTabDirection;
		mode?: FileViewMode;
		focus?: boolean;
	}
) {
	let leaf: WorkspaceLeaf;

	if (optional?.openInNewTab && optional?.direction) {
		leaf = app.workspace.splitActiveLeaf(optional.direction);
	} else {
		// leaf = app.workspace.getUnpinnedLeaf(); /deprecated
		leaf = app.workspace.getLeaf(false);
	}

	await leaf.openFile(file);

	if (optional?.mode || optional?.focus) {
		await leaf.setViewState(
			{
				...leaf.getViewState(),
				state:
					optional.mode && optional.mode !== "default"
						? { ...leaf.view.getState(), mode: optional.mode }
						: leaf.view.getState(),
				popstate: true,
			} as ViewState,
			{ focus: optional?.focus }
		);
	}
}
