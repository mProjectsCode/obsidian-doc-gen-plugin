import {DocCommentModel} from './DocCommentModel';
import {codeModifiers, trimCharacters} from '../../utils/Utils';

export class VariableDocCommentModel extends DocCommentModel {
	valueType: string;

	constructor(docCommentModel: DocCommentModel) {
		super();

		Object.assign(this, docCommentModel);

		this.extractVariableNameAndType();
	}

	private extractVariableNameAndType() {
		let regExp = new RegExp('=.*');
		let declarationWithOutParameters = this.codeObjectDeclaration.replace(regExp, '').trim();
		declarationWithOutParameters = trimCharacters(declarationWithOutParameters, ';');

		if (declarationWithOutParameters.contains(':')) { // modifier name: type
			const functionParts = declarationWithOutParameters.split(':'); // [modifier name, type]
			this.valueType = functionParts[1].trim();
			const typelessFunctionParts = functionParts[0].split(' '); // [modifier, name]
			this.name = typelessFunctionParts[typelessFunctionParts.length - 1];
		} else {
			const functionParts = declarationWithOutParameters.split(' '); // [modifier, type?, name]
			this.name = functionParts[functionParts.length - 1].trim();
			if (functionParts.length >= 2) {
				let valueType = functionParts[functionParts.length - 2].trim(); // type or modifier

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
}
