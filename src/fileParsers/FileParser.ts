import {DirectoryModel} from '../models/DirectoryModel';
import {FileModel} from '../models/FileModel';
import {DocCommentModel} from '../models/docCommentModels/DocCommentModel';
import {VaultFileModel} from '../models/VaultFileModel';
import {VaultDirectoryModel} from '../models/VaultDirectoryModel';
import {CodeObjectType, codeModifiers, trimCharacters} from '../utils/Utils';
import {FunctionDocCommentModel} from '../models/docCommentModels/FunctionDocCommentModel';
import {VariableDocCommentModel} from '../models/docCommentModels/VariableDocCommentModel';
import {CodeObject} from '../models/codeObjectModels/CodeObject';
import {FunctionCodeObject} from '../models/codeObjectModels/FunctionCodeObject';

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
			const codeObjectIndex = match.index + textDocComment.length;
			const codeObjectString = this.getCodeObjectAt(fileModel.content, codeObjectIndex);
			const docCommentModel: DocCommentModel = new DocCommentModel({
				comment: textDocComment,
				index: match.index,
				codeObject: codeObjectString,
				codeObjectIndex: codeObjectIndex,
				// codeObjectParentName: '', // TODO: get name
				// codeObjectParentIndex: this.findParentCodeObjectIndex(fileModel, codeObjectIndex),
			});

			docCommentModel.codeObject = this.extractCodeObjectType(docCommentModel.codeObject);
			docCommentModel.codeObject = this.extractCodeObjectName(docCommentModel.codeObject);

			let specificDocCommentModel: DocCommentModel;
			if (docCommentModel.codeObject.codeObjectType === CodeObjectType.Function) {
				let functionCodeObject: FunctionCodeObject = new FunctionCodeObject();
				functionCodeObject = Object.assign(functionCodeObject, docCommentModel.codeObject);
				functionCodeObject = this.extractCodeObjectFunctionParameters(functionCodeObject);
				functionCodeObject = this.extractCodeObjectFunctionReturnType(functionCodeObject);

				specificDocCommentModel = new FunctionDocCommentModel(docCommentModel, functionCodeObject);
			} else if (docCommentModel.codeObject.codeObjectType === CodeObjectType.Variable) {
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

	private extractCodeObjectType(codeObject: CodeObject): CodeObject {
		const codeObjectParts = codeObject.declaration.split(' ');

		if (codeObjectParts.contains(CodeObjectType.Class)) {
			codeObject.codeObjectType = CodeObjectType.Class;
		} else if (codeObjectParts.contains(CodeObjectType.Interface)) {
			codeObject.codeObjectType = CodeObjectType.Interface;
		} else if (codeObjectParts.contains(CodeObjectType.Enum)) {
			codeObject.codeObjectType = CodeObjectType.Enum;
		} else if (codeObjectParts.contains(CodeObjectType.Function)) {
			codeObject.codeObjectType = CodeObjectType.Function;
		} else {
			let declaration = codeObject.declaration.split('=')[0];

			const regExp = new RegExp('\\(.*\\)');
			const matches = declaration.match(regExp);

			if (!matches || matches.length === 0) {
				codeObject.codeObjectType = CodeObjectType.Variable;
			} else if (matches.length === 1) {
				codeObject.codeObjectType = CodeObjectType.Function;
			} else {
				codeObject.codeObjectType = CodeObjectType.Unknown;
			}
		}

		return codeObject;
	}

	private extractCodeObjectName(codeObject: CodeObject): CodeObject {
		let regExp = new RegExp('\\(.*\\)');
		let declarationWithOutParameters = codeObject.declaration.replace(regExp, '').trim(); // remove brackets
		declarationWithOutParameters = declarationWithOutParameters.split('=')[0].trim();
		declarationWithOutParameters = trimCharacters(declarationWithOutParameters, ';');

		const parts = declarationWithOutParameters.split(' '); // [modifier, codeObjectType?, codeObjectName]
		codeObject.name = parts[parts.length - 1].trim();

		return codeObject;
	}

	private extractCodeObjectFunctionReturnType(codeObject: FunctionCodeObject): FunctionCodeObject {
		let regExp = new RegExp('\\(.*\\)');
		let declarationWithOutParameters = codeObject.declaration.replace(regExp, '').trim(); // remove brackets

		codeObject.returnValue = {
			type: '',
			description: '',
		}
		const functionParts = declarationWithOutParameters.split(' '); // [modifier..., codeObjectType?, codeObjectName]
		// this.codeObjectName = functionParts[functionParts.length - 1].trim();

		if (functionParts.length >= 2) {
			let returnValueType = functionParts[functionParts.length - 2].trim(); // codeObjectType or modifier

			if (!codeModifiers.contains(returnValueType)) {
				codeObject.returnValue.type = returnValueType;
			} else {
				codeObject.returnValue.type = 'any';
			}
		} else {
			codeObject.returnValue.type = 'any';
		}

		return codeObject;
	}

	private extractCodeObjectFunctionParameters(codeObject: FunctionCodeObject): FunctionCodeObject {
		const regExp = new RegExp('\\(.*\\)');
		const match = codeObject.declaration.match(regExp);

		let functionParametersString: string = match[0]; // get the first match
		functionParametersString = functionParametersString.substring(1, functionParametersString.length - 1); // remove brackets
		let functionParameters = functionParametersString.split(',');
		functionParameters = functionParameters.map(a => a.trim());

		codeObject.parameters = [];
		for (const functionParameter of functionParameters) {
			let type;
			let name;

			// if (functionParameter.contains(':')) {
			// 	const functionParameterParts = functionParameter.split(':');
			// 	name = functionParameterParts[0].trim();
			// 	type = functionParameterParts[1].trim();
			// } else {
			const functionParameterParts = functionParameter.split(' ');
			name = functionParameterParts[1].trim();
			type = functionParameterParts[0].trim();
			// }

			codeObject.parameters.push({
				name: name,
				type: type,
				description: '',
			});
		}

		return codeObject
	}

	/* DOES NOT WOK YET, FUTURE ME PROBLEM
	private findParentCodeObjectIndex(file: FileModel, codeObjectIndex: number): number {
		let code = file.content;

		let inSingleQuotes = false;
		let inDoubleQuotes = false;
		let inAngledQuotes = false;

		let openingBraces = 0;
		let closingBraces = 0;

		let newLines = 0;

		let i = codeObjectIndex;
		for (; i > 0; i--) {
			const char = code[i];

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

			if (openingBraces > closingBraces) {
				break;
			}
		}

		// const codeObjectString = this.getCodeObjectAt(code, i);
		// return new CodeObject(codeObjectString, i);
		return i;
	}
	*/


}
