import {App, Modal, Setting, TextComponent} from 'obsidian';

export class ImportModal extends Modal {
	onSubmit: (folderPath: string, fileTypes: string[]) => void;
	folderPath: string;
	fileTypesString: string;

	constructor(app: App, onSubmit: (folderPath: string, fileTypes: string[]) => void) {
		super(app);
		this.onSubmit = onSubmit;
		this.folderPath = '';
		this.fileTypesString = '';
	}

	submit() {
		this.onSubmit(this.folderPath, this.fileTypesString.split(',').map(x => x.trim()));
		this.close();
	}

	onOpen() {
		const {contentEl} = this;

		contentEl.createEl('h2', {text: 'Generate Documentation'});

		const folderPathComponent = new TextComponent(contentEl);
		folderPathComponent.inputEl.style.width = '100%';
		folderPathComponent.setPlaceholder('Path to folder. E.g. \'C:/src/project\'');
		folderPathComponent.onChange(value => this.folderPath = value);
		contentEl.appendChild(folderPathComponent.inputEl);
		folderPathComponent.inputEl.focus();

		contentEl.createEl('div', {cls: 'doc-gen-plugin-modal-spacer'});

		const fileTypeStringComponent = new TextComponent(contentEl);
		fileTypeStringComponent.inputEl.style.width = '100%';
		fileTypeStringComponent.setPlaceholder('Filetypes to process. E.g. \'.ts, .js, .java\'');
		fileTypeStringComponent.onChange(value => this.fileTypesString = value);
		contentEl.appendChild(fileTypeStringComponent.inputEl);

		new Setting(contentEl)
			.addButton(btn => btn.setButtonText('Cancel').onClick(() => this.close()))
			.addButton(btn => btn.setButtonText('Ok').setCta().onClick(this.submit.bind(this)));
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}

}
