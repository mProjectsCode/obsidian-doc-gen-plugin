import {VaultDirectoryModel} from '../models/VaultDirectoryModel';
import {DocCommentLinkModel} from '../models/DocCommentLinkModel';
import {FileParser} from './FileParser';

export class InheritanceParser {
	vaultDirectoryModel: VaultDirectoryModel;
	parser: FileParser;

	constructor(vaultDirectoryModel: VaultDirectoryModel, parser: FileParser) {
		this.vaultDirectoryModel = vaultDirectoryModel;
		this.parser = parser;
	}

	parse() {
		this.vaultDirectoryModel = this.parseDirectory(this.vaultDirectoryModel);
	}

	updateDocCommentInheritance() {
		this.vaultDirectoryModel = this.updateDocCommentInheritanceDirectory(this.vaultDirectoryModel);
	}

	private parseDirectory(vaultDirectoryModel: VaultDirectoryModel): VaultDirectoryModel {
		for (const file of vaultDirectoryModel.files) {
			for (const docComment of file.docComments) {
				for (const otherDocComment of file.docComments) {
					if (docComment.parent === otherDocComment.getName()) {
						docComment.parentLink = new DocCommentLinkModel(otherDocComment, file);
						otherDocComment.childLinks.push(new DocCommentLinkModel(docComment, file));
					}
				}
			}
		}

		const newSubDirectories: VaultDirectoryModel[] = [];
		for (const subDirectory of vaultDirectoryModel.subDirectories) {
			newSubDirectories.push(this.parseDirectory(subDirectory));
		}
		vaultDirectoryModel.subDirectories = newSubDirectories;

		return vaultDirectoryModel;
	}

	private updateDocCommentInheritanceDirectory(vaultDirectoryModel: VaultDirectoryModel): VaultDirectoryModel {
		for (const file of vaultDirectoryModel.files) {
			for (const docComment of file.docComments) {
				docComment.parent = docComment.parentLink?.getMarkdownLink() ?? '';
				for (const childLink of docComment.childLinks) {
					docComment.children.push(childLink.getMarkdownLink());
				}
			}
		}

		const newSubDirectories: VaultDirectoryModel[] = [];
		for (const subDirectory of vaultDirectoryModel.subDirectories) {
			newSubDirectories.push(this.parseDirectory(subDirectory));
		}
		vaultDirectoryModel.subDirectories = newSubDirectories;

		return vaultDirectoryModel;
	}
}
