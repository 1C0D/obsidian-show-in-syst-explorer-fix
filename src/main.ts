import { Plugin } from "obsidian";
import { DEFAULT_SETTINGS, MyPluginSettings } from "./types";
import { confirm } from "./modal";
import {
	initializeI18next,
	t,
	translationLanguage,
	translations,
} from "./i18n/i18next";
import { debug, log } from "./logs";

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		// i18
		initializeI18next(translationLanguage, translations);

		debug("result: ", t("secret") as string);

		// log
		const variable = 2;
		log({ variable }, "tututut"); // variable: 2
		// tututut
		debug({ variable }, "tututut");

		await this.loadSettings();

		// this.addSettingTab(new SampleSettingTab(this.app, this));

		// const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
		// 	new SampleModal(this.app).open();
		// });

		const ribbonIconEl = this.addRibbonIcon(
			"aperture",
			"Sample Plugin",
			async (evt: MouseEvent) => {
				const confirmed = await confirm("are you sure ?", 200);
				if (confirmed) {
					log("confirmed");
				} else log("nop");
			}
		);
	}

	async loadSettings() {
		this.settings = { ...DEFAULT_SETTINGS, ...(await this.loadData()) };
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
