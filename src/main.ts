import {Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, DocGenPluginSettings, DocGenSettingTab} from './settings/Settings';
import {TestFileLoader} from './fileLoaders/TestFileLoader';
import {FileParser} from './fileParsers/FileParser';
import {VaultDirectoryModel} from './models/VaultDirectoryModel';
import {VaultFileModel} from './models/VaultFileModel';


export default class DocGenPlugin extends Plugin {
	settings: DocGenPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', async (evt: MouseEvent) => {
			await this.runTests();
		});
		ribbonIconEl.addClass('obsidian-doc-gen-plugin-ribbon-element');

		// register the settings tab
		this.addSettingTab(new DocGenSettingTab(this.app, this));
	}

	async runTests() {
		const testFileLoader = new TestFileLoader();
		const dirModel = await testFileLoader.load('H:/src/obsidian-doc-gen-plugin/testData/txt_test');
		const fileParser = new FileParser();
		const vaultDirModel = await fileParser.parseDirectory(dirModel);
		console.log(vaultDirModel);

		await this.createNotes(vaultDirModel);
	}

	async createNotes(vaultDirModel: VaultDirectoryModel) {
		for (const file of vaultDirModel.files) {
			await this.createFile(file);
		}

		for (const subDirectory of vaultDirModel.subDirectories) {
			await this.createNotes(subDirectory);
		}
	}

	async createFile(vaultFileModel: VaultFileModel) {
		try {
			await this.app.vault.createFolder(vaultFileModel.getFolderPath());
		} catch (e) {
			// TODO: handle error
		}

		let fileName = vaultFileModel.getMdFileName();
		if (fileName.startsWith('/')) {
			fileName = fileName.substring(1);
		}
		const oldFile = this.app.vault.getAbstractFileByPath(fileName);
		if (oldFile) {
			await this.app.vault.delete(oldFile, true);
		}
		const file = await this.app.vault.create(fileName, vaultFileModel.getContent());
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
