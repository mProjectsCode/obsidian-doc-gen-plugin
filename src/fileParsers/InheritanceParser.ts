import {VaultDirectoryModel} from '../models/VaultDirectoryModel';
import {VaultFileModel} from '../models/VaultFileModel';
import {DocCommentLinkModel} from '../models/DocCommentLinkModel';

export class InheritanceParser {
	vaultDirectoryModel: VaultDirectoryModel;


	constructor(vaultDirectoryModel: VaultDirectoryModel) {
		this.vaultDirectoryModel = vaultDirectoryModel;
	}

	parse() {
		this.vaultDirectoryModel = this.parseDirectory(this.vaultDirectoryModel);
	}

	updateDocCommentInheritance() {
		this.vaultDirectoryModel = this.updateDocCommentInheritanceDirectory(this.vaultDirectoryModel);
	}

	findFile(vaultDirectoryModel: VaultDirectoryModel, fileName: string): VaultFileModel {
		for (const file of vaultDirectoryModel.files) {
			if (file.name.split('.')[0] === fileName) {
				return file;
			}
		}

		for (const subDirectory of vaultDirectoryModel.subDirectories) {
			const fileModel = this.findFile(subDirectory, fileName);
			if (fileModel) {
				return fileModel;
			}
		}

		return undefined;
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
