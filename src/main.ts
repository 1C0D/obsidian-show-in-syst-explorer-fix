import { Plugin } from "obsidian";
import * as path from "path";

declare global {
	interface Window {
		electron: any;
	}
}

export default class MyPlugin extends Plugin {
	async onload() {
		this.addCommand({
			id: "show-in-syst-explorer-fix",
			name: "Show in system explorer fix",
			callback: async () => {
				await openDirectoryInFileManager();
			},
		});
	}
}

async function openDirectoryInFileManager() {
	let shell = window.electron.remote.shell;
	const activeFile = this.app.workspace.getActiveFile();
	if (activeFile) {
		const vaultPath = this.app.vault.adapter.basePath;
		const parentFile = activeFile.parent.path
		const dirPath = path.join(vaultPath, parentFile);
		try {
			await shell.openPath(dirPath);
		} catch (err) {
			console.log(err);
		}
	}
}
