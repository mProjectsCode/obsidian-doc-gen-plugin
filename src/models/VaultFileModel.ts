import {DocCommentModel} from './DocCommentModel';

export class VaultFileModel {
	path: string;
	name: string;
	docComments: DocCommentModel[];

	constructor(name: string, path: string) {
		this.name = name;
		this.path = path;
		this.docComments = [];
	}

	getContent(): string {
		let content = `# ${this.name}\n\n`;

		for (const docComment of this.docComments) {
			content += docComment.toString() + '\n\n';
		}

		return content;
	}

	getFileName() {
		return this.name.split('.')[0];
	}

	getMdFileName() {
		return this.path.split('.')[0] + '.md';
	}

	getFolderPath() {
		return this.path.split('/').slice(0, -1).join('/');
	}


}
