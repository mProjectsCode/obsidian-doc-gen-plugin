import {DirectoryModel} from '../models/DirectoryModel';
import {FileModel} from '../models/FileModel';
import {DocCommentModel} from '../models/DocCommentModel';
import {VaultFileModel} from '../models/VaultFileModel';
import {VaultDirectoryModel} from '../models/VaultDirectoryModel';

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
		fileModel.content = fileModel.content.replace(/\n[ 	]+/g, '\n'); // remove indentation

		const vaultFileModel = new VaultFileModel(fileModel.name, `${localPath}/${fileModel.name}`);

		const commentRegExp = new RegExp('\\/\\*\\*[\\s\\S]*?\\*\\/', 'g');
		const commentMatches = [...fileModel.content.matchAll(commentRegExp)];
		if (!commentMatches) {
			return vaultFileModel;
		}

		for (const match of commentMatches) {
			// console.log(match);
			const textDocComment = match[0];
			const codeObjectIndex = match.index + textDocComment.length;
			const codeObjectString = this.getCodeObjectAt(fileModel.content, codeObjectIndex);
			const docCommentModel: DocCommentModel = new DocCommentModel({
				comment: textDocComment,
				index: match.index,
				codeObject: codeObjectString,
			});

			vaultFileModel.docComments.push(docCommentModel);
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
		for (; i < code.length; i++) {
			const char = code[i];
			const prevChar = code[i];

			if (char === '\'' && !inDoubleQuotes && !inAngledQuotes) {
				inSingleQuotes = !inSingleQuotes;
			}
			if (char === '\"' && !inSingleQuotes && !inAngledQuotes) {
				inDoubleQuotes = !inDoubleQuotes;
			}
			if (char === '\`' && !inSingleQuotes && !inDoubleQuotes) {
				inAngledQuotes = !inAngledQuotes;
			}
			let notInQuotes = !inSingleQuotes && !inDoubleQuotes && !inAngledQuotes;

			if (char == '\n' && notInQuotes) {
				newLines += 1;
			}
			if (char === '{' && notInQuotes) {
				openingBraces += 1;
			}
			if (char === '}' && notInQuotes) {
				closingBraces += 1;
			}

			if (char === ';') {
				break;
			}
			if (char === '\n' && prevChar === '\n' && notInQuotes) {
				i -= 1;
				break;
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
