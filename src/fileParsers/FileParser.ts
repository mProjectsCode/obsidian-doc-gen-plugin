import {DirectoryModel} from '../models/DirectoryModel';
import {FileModel} from '../models/FileModel';
import {DocCommentModel} from '../models/docCommentModels/DocCommentModel';
import {VaultFileModel} from '../models/VaultFileModel';
import {VaultDirectoryModel} from '../models/VaultDirectoryModel';
import {CodeElementType} from '../utils/Utils';
import {FunctionDocCommentModel} from '../models/docCommentModels/FunctionDocCommentModel';

export class FileParser {
	fileEndings: string[];

	async parseDirectory(directoryModel: DirectoryModel, localPath: string = ''): Promise<VaultDirectoryModel> {
		const vaultDirectoryModel = new VaultDirectoryModel(directoryModel.name, `${localPath}/${directoryModel.name}`);

		for (const file of directoryModel.files) {
			vaultDirectoryModel.files.push(await this.parseFile(file, `${localPath}/${directoryModel.name}`));
		}

		for (const subDirectory of directoryModel.subDirectories) {
			vaultDirectoryModel.subDirectories.push(await this.parseDirectory(subDirectory, `${localPath}/${directoryModel.name}`));
		}

		return vaultDirectoryModel;
	}

	async parseFile(fileModel: FileModel, localPath: string): Promise<VaultFileModel> {
		const vaultFileModel = new VaultFileModel(fileModel.name, `${localPath}/${fileModel.name}`)

		const commentRegExp = new RegExp('\\/\\*\\*[\\s\\S]*?\\*\\/(\\n.*)?', 'g');
		const textDocComments = fileModel.content.match(commentRegExp);
		if (!textDocComments) {
			return vaultFileModel;
		}

		for (const textDocComment of textDocComments) {
			const docCommentModel: DocCommentModel = new DocCommentModel(textDocComment)
			let specificDocCommentModel: DocCommentModel;

			if (docCommentModel.type === CodeElementType.Function) {
				specificDocCommentModel = new FunctionDocCommentModel(docCommentModel);
			} else {
				specificDocCommentModel = docCommentModel;
			}

			vaultFileModel.docComments.push(specificDocCommentModel);
		}

		return vaultFileModel;
	}


}
