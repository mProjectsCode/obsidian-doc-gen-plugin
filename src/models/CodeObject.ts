import {CodeObjectType} from '../utils/Utils';

export class CodeObject {
	codeObject: string;
	// lineNumber: string;
	declaration: string;
	codeObjectType: string;

	constructor(obj?: { codeObject: string }) {
		if (obj) {
			this.codeObject = obj.codeObject;
			this.declaration = this.codeObject.replace(/{[\s\S]*}/g, '').trim();
			this.codeObjectType = CodeObjectType.Unknown;
			//this.lineNumber = indexToLineNumber( index)
		}
	}

	getFancyCodeObject(): string {
		return this.declaration;
	}
}
