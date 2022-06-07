import {DocCommentModel} from './DocCommentModel';
import {VaultFileModel} from './VaultFileModel';

export class DocCommentLinkModel {
	docComment: DocCommentModel;
	file: VaultFileModel;


	constructor(docComment: DocCommentModel, file: VaultFileModel) {
		this.docComment = docComment;
		this.file = file;
	}

	getMarkdownLink() {
		return `[[${this.file.getFileName()}#${this.docComment.getName()}|${this.docComment.getName()}]]`;
	}
}
