import {DocCommentModel} from './DocCommentModel';
import {VariableCodeObject} from '../codeObjectModels/VariableCodeObject';

export class VariableDocCommentModel extends DocCommentModel {
	codeObject: VariableCodeObject;

	constructor(docCommentModel: DocCommentModel) {
		super();

		Object.assign(this, docCommentModel);

		// this.extractVariableNameAndType();
	}

	/*
	private extractVariableNameAndType() {
		let regExp = new RegExp('=.*');
		let declarationWithOutParameters = this.codeObjectDeclaration.replace(regExp, '').trim();
		declarationWithOutParameters = trimCharacters(declarationWithOutParameters, ';');

		if (declarationWithOutParameters.contains(':')) { // modifier codeObjectName: codeObjectType
			const functionParts = declarationWithOutParameters.split(':'); // [modifier codeObjectName, codeObjectType]
			this.valueType = functionParts[1].trim();
			const typelessFunctionParts = functionParts[0].split(' '); // [modifier, codeObjectName]
			this.codeObjectName = typelessFunctionParts[typelessFunctionParts.length - 1];
		} else {
			const functionParts = declarationWithOutParameters.split(' '); // [modifier, codeObjectType?, codeObjectName]
			this.codeObjectName = functionParts[functionParts.length - 1].trim();
			if (functionParts.length >= 2) {
				let valueType = functionParts[functionParts.length - 2].trim(); // codeObjectType or modifier

				if (!codeModifiers.contains(valueType)) {
					this.valueType = valueType;
				} else {
					this.valueType = 'any';
				}
			} else {
				this.valueType = 'any';
			}
		}

	}
	*/
}
