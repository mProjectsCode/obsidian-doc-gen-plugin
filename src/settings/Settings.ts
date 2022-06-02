import {App, PluginSettingTab} from 'obsidian';
import DocGenPlugin from '../main';


export interface DocGenPluginSettings {

}

export const DEFAULT_SETTINGS: DocGenPluginSettings = {};

export class DocGenSettingTab extends PluginSettingTab {
	plugin: DocGenPlugin;

	constructor(app: App, plugin: DocGenPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Documentation Generator Plugin Settings.'});
	}

}
