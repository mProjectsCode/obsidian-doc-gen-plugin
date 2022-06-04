import {DocCommentModel} from './DocCommentModel';
import {codeModifiers, trimCharacters} from '../../utils/Utils';
import {FunctionCodeObject} from '../codeObjectModels/FunctionCodeObject';

export class FunctionDocCommentModel extends DocCommentModel {
	codeObject: FunctionCodeObject;

	constructor(docCommentModel: DocCommentModel, codeObject: FunctionCodeObject) {
		super();

		Object.assign(this, docCommentModel);

		this.codeObject = codeObject;

		// this.extractParametersFromCodeSnippet();
		// this.extractFunctionNameAndType();
		this.fillParametersFromAnnotations();
	}

	toString(): string {
		let str = super.toString();

		return str;
	}

	/*
	private extractParametersFromCodeSnippet() {
		const regExp = new RegExp('\\(.*\\)');
		const match = this.codeObject.match(regExp);

		let functionParametersString: string = match[0];
		functionParametersString = functionParametersString.substring(1, functionParametersString.length - 1);
		let functionParameters = functionParametersString.split(',');
		functionParameters = functionParameters.map(a => a.trim());

		this.parameters = [];
		for (const functionParameter of functionParameters) {
			let type;
			let name;

			if (functionParameter.contains(':')) {
				const functionParameterParts = functionParameter.split(':');
				name = functionParameterParts[0].trim();
				type = functionParameterParts[1].trim();
			} else {
				const functionParameterParts = functionParameter.split(' ');
				name = functionParameterParts[1].trim();
				type = functionParameterParts[0].trim();
			}

			this.parameters.push({
				name: name,
				type: type,
				description: '',
			});
		}
	}

	private extractFunctionNameAndType() {
		let regExp = new RegExp('\\(.*\\)');
		let declarationWithOutParameters = this.codeObjectDeclaration.replace(regExp, '').trim();
		regExp = new RegExp('{.*');
		declarationWithOutParameters = declarationWithOutParameters.replace(regExp, '').trim();
		declarationWithOutParameters = trimCharacters(declarationWithOutParameters, ';');

		this.returnValue = {
			type: '',
			description: '',
		}
		if (declarationWithOutParameters.contains(':')) { // modifier codeObjectName: codeObjectType
			const functionParts = declarationWithOutParameters.split(':'); // [modifier codeObjectName, codeObjectType]
			this.returnValue.type = functionParts[1].trim();
			const typelessFunctionParts = functionParts[0].split(' '); // [modifier, codeObjectName]
			this.codeObjectName = typelessFunctionParts[typelessFunctionParts.length - 1];
		} else {
			const functionParts = declarationWithOutParameters.split(' '); // [modifier, codeObjectType?, codeObjectName]
			this.codeObjectName = functionParts[functionParts.length - 1].trim();
			if (functionParts.length >= 2) {
				let returnValueType = functionParts[functionParts.length - 2].trim(); // codeObjectType or modifier

				if (!codeModifiers.contains(returnValueType)) {
					this.returnValue.type = returnValueType;
				} else {
					this.returnValue.type = 'any';
				}
			} else {
				this.returnValue.type = 'any';
			}
		}

	}
	*/

	private fillParametersFromAnnotations() {
		for (const annotation of this.annotations) {
			if (annotation.annotation === '@param' || annotation.annotation === '@params' || annotation.annotation === '@parameter') {
				for (const parameter of this.codeObject.parameters) {
					if (parameter.name === annotation.value) {
						parameter.description = annotation.description;
					}
				}
			}
			if (annotation.annotation === '@ret' || annotation.annotation === '@return' || annotation.annotation === '@returns') {
				this.codeObject.returnValue.description = annotation.value;
			}
		}
	}

}
