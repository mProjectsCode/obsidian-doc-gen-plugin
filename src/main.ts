import {Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, DocGenPluginSettings, DocGenSettingTab} from './settings/Settings';
import {TestFileLoader} from './fileLoaders/TestFileLoader';
import {FileParser} from './fileParsers/FileParser';
import {VaultDirectoryModel} from './models/VaultDirectoryModel';
import {VaultFileModel} from './models/VaultFileModel';
import {ImportModal} from './modals/ImportModal';
import {FileLoader} from './fileLoaders/FileLoader';


export default class DocGenPlugin extends Plugin {
	settings: DocGenPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('book', 'Generate Documentation', async (evt: MouseEvent) => {
			new ImportModal(app, async (folderPath: string, fileTypes: string[]) => {
				const fileLoader = new FileLoader();
				const dirModel = await fileLoader.load(folderPath, fileTypes);
				const fileParser = new FileParser(dirModel, this);
				let vaultDirModel = await fileParser.parse();

				await this.createNotes(vaultDirModel);
			}).open();
		});
		ribbonIconEl.addClass('obsidian-doc-gen-plugin-ribbon-element');

		this.addCommand({
			id: 'run-doc-gen-tests',
			name: 'Run doc gen tests. WARNING WILL NOT WORK ON YOUR PC!',
			callback: async () => await this.runTests(),
		});

		// register the settings tab
		this.addSettingTab(new DocGenSettingTab(this.app, this));
	}

	async runTests() {
		const testFileLoader = new TestFileLoader();
		const dirModel = await testFileLoader.load('H:/src/obsidian-doc-gen-plugin/testData/txt_test');
		const fileParser = new FileParser(dirModel, this);
		let vaultDirModel = await fileParser.parse();

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
