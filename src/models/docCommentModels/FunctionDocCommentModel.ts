import {DocCommentModel} from './DocCommentModel';
import {codeAttributes} from '../../utils/Utils';

export class FunctionDocCommentModel extends DocCommentModel {
	name: string;
	type: string;
	parameters: {
		name: string,
		type: string,
		description: string,
	}[];

	constructor(docCommentModel: DocCommentModel) {
		super();

		Object.assign(this, docCommentModel);

		this.extractParametersFromCodeSnippet()
		this.extractFunctionNameAndType()
	}

    override analyzeCodeSnippet(): void {

    }

	private extractParametersFromCodeSnippet() {
		const regExp = new RegExp('\\(.*\\)');
		const match = this.codeSnippet.match(regExp);

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
			})
		}
	}

	private extractFunctionNameAndType() {
		let regExp = new RegExp('\\(.*\\)');
		let declarationWithOutParameters = this.codeSnippet.replace(regExp, '').trim();
		regExp = new RegExp('{.*');
		declarationWithOutParameters = declarationWithOutParameters.replace(regExp, '').trim();

		if (declarationWithOutParameters.contains(':')) { // modifier name: type
			const functionParts = declarationWithOutParameters.split(':'); // [modifier name, type]
			this.type = functionParts[1].trim();
			const typelessFunctionParts = functionParts[0].split(' '); // [modifier, name]
			this.name = typelessFunctionParts[typelessFunctionParts.length - 1];
		} else {
			const functionParts = declarationWithOutParameters.split(' '); // [modifier, type?, name]
			this.name = functionParts[functionParts.length - 1].trim();
			if (functionParts.length >= 2) {
				let type = functionParts[functionParts.length - 2].trim(); // type or modifier

				if (!codeAttributes.contains(type)) {
					this.type = type;
				} else {
					this.type = 'any';
				}
			} else {
				this.type = 'any';
			}
		}

	}
}
