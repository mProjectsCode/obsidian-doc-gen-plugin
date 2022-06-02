import {DocCommentModel} from './docCommentModels/DocCommentModel';

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


}
