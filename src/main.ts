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
	let shell = window.electron.shell;
	const activeFile = this.app.workspace.getActiveFile();
	if (activeFile) {
		const vaultPath = this.app.vault.adapter.basePath;
		let activeFilePath = activeFile.path;
		if (activeFilePath.includes("/")) {
			const lastSlashIndex = activeFilePath.lastIndexOf("/");
			activeFilePath = activeFilePath.substring(0, lastSlashIndex);
		} else {
			activeFilePath = "";
		}

		let dirPath;
		if (activeFilePath !== "") {
			dirPath = path.join(vaultPath, activeFilePath);
		} else {
			dirPath = vaultPath;
		}

		try {
			await shell.openExternal(dirPath);
		} catch (err) {
			console.log(err);
		}
	}
}
