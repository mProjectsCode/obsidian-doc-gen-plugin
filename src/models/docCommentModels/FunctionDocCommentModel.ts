import {DocCommentModel} from './DocCommentModel';
import {codeModifiers, trimCharacters} from '../../utils/Utils';

export class FunctionDocCommentModel extends DocCommentModel {
	returnValue: {
		type: string,
		description: string,
	};
	parameters: {
		name: string,
		type: string,
		description: string,
	}[];

	constructor(docCommentModel: DocCommentModel) {
		super();

		Object.assign(this, docCommentModel);

		this.extractParametersFromCodeSnippet();
		this.extractFunctionNameAndType();
		this.fillParametersFromAnnotations();
	}

	toString(): string {
		let str = super.toString();

		return ;
	}

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
		if (declarationWithOutParameters.contains(':')) { // modifier name: type
			const functionParts = declarationWithOutParameters.split(':'); // [modifier name, type]
			this.returnValue.type = functionParts[1].trim();
			const typelessFunctionParts = functionParts[0].split(' '); // [modifier, name]
			this.name = typelessFunctionParts[typelessFunctionParts.length - 1];
		} else {
			const functionParts = declarationWithOutParameters.split(' '); // [modifier, type?, name]
			this.name = functionParts[functionParts.length - 1].trim();
			if (functionParts.length >= 2) {
				let returnValueType = functionParts[functionParts.length - 2].trim(); // type or modifier

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

	private fillParametersFromAnnotations() {
		for (const annotation of this.annotations) {
			if (annotation.annotation === '@param' || annotation.annotation === '@params' || annotation.annotation === '@parameter') {
				for (const parameter of this.parameters) {
					if (parameter.name === annotation.value) {
						parameter.description = annotation.description;
					}
				}
			}
			if (annotation.annotation === '@ret' || annotation.annotation === '@return' || annotation.annotation === '@returns') {
				this.returnValue.description = annotation.value;
			}
		}
	}
}
