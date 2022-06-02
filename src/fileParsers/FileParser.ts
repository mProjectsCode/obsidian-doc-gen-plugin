import {DirectoryModel} from '../models/DirectoryModel';
import {FileModel} from '../models/FileModel';
import {DocCommentModel} from '../models/docCommentModels/DocCommentModel';
import {VaultFileModel} from '../models/VaultFileModel';
import {VaultDirectoryModel} from '../models/VaultDirectoryModel';
import {CodeElementType} from '../utils/Utils';
import {FunctionDocCommentModel} from '../models/docCommentModels/FunctionDocCommentModel';
import {VariableDocCommentModel} from '../models/docCommentModels/VariableDocCommentModel';

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
		const vaultFileModel = new VaultFileModel(fileModel.name, `${localPath}/${fileModel.name}`);

		const commentRegExp = new RegExp('\\/\\*\\*[\\s\\S]*?\\*\\/', 'g');
		const commentMatches = [...fileModel.content.matchAll(commentRegExp)];
		if (!commentMatches) {
			return vaultFileModel;
		}

		for (const match of commentMatches) {
			console.log(match);
			const textDocComment = match[0];
			const codeObject = this.getCodeObjectAt(fileModel.content, match.index + textDocComment.length);
			const docCommentModel: DocCommentModel = new DocCommentModel(textDocComment, codeObject);
			let specificDocCommentModel: DocCommentModel;

			if (docCommentModel.type === CodeElementType.Function) {
				specificDocCommentModel = new FunctionDocCommentModel(docCommentModel);
			} else if (docCommentModel.type === CodeElementType.Variable) {
				specificDocCommentModel = new VariableDocCommentModel(docCommentModel);
			} else {
				specificDocCommentModel = docCommentModel;
			}

			vaultFileModel.docComments.push(specificDocCommentModel);
		}

		return vaultFileModel;
	}

	getCodeObjectAt(code: string, index: number) {
		code = code.substring(index + 1);

		let inSingleQuotes = false;
		let inDoubleQuotes = false;
		let inAngledQuotes = false;

		let openingBraces = 0;
		let closingBraces = 0;

		let newLines = 0;

		let i = 0;
		for (const char of code) {
			if (char === ';' && openingBraces === 0) {
				break;
			}

			if (char == '\'' && !inDoubleQuotes && !inAngledQuotes) {
				inSingleQuotes = !inSingleQuotes;
			}
			if (char == '\"' && !inSingleQuotes && !inAngledQuotes) {
				inDoubleQuotes = !inDoubleQuotes;
			}
			if (char == '\`' && !inSingleQuotes && !inDoubleQuotes) {
				inAngledQuotes = !inAngledQuotes;
			}

			if (char == '{' && !inSingleQuotes && !inDoubleQuotes && !inAngledQuotes) {
				openingBraces += 1;
			}

			if (char == '}' && !inSingleQuotes && !inDoubleQuotes && !inAngledQuotes) {
				closingBraces += 1;
			}

			i += 1;

			if (openingBraces > 0 && openingBraces === closingBraces) {
				break;
			}
		}

		// console.log(openingBraces, closingBraces);

		return code.substring(0, i);
	}


}
