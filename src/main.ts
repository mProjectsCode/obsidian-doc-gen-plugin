import {Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, DocGenPluginSettings, DocGenSettingTab} from './settings/Settings';
import {TestFileLoader} from './fileLoaders/TestFileLoader';
import {FileParser} from './fileParsers/FileParser';


export default class DocGenPlugin extends Plugin {
	settings: DocGenPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', async (evt: MouseEvent) => {
			const testFileLoader = new TestFileLoader();
			const dirModel = await testFileLoader.load('H:/src/obsidian-doc-gen-plugin/test/txt_test');
			const fileParser = new FileParser();
			const vaultDirModel = await fileParser.parseDirectory(dirModel);
			console.log(vaultDirModel);
		});
		ribbonIconEl.addClass('obsidian-doc-gen-plugin-ribbon-element');

		// register the settings tab
		this.addSettingTab(new DocGenSettingTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
