import {CodeObjectType, indexToLineNumber} from '../../utils/Utils';

export class CodeObject {
	codeObject: string;
	index: number;
	parentName: string;
	parentIndex: number;
	// lineNumber: string;
	declaration: string;
	name: string;
	codeObjectType: string;

	constructor(obj?: {codeObject: string, index: number, parentName?: string, parentIndex?: number}) {
		if (obj) {
			this.codeObject = obj.codeObject;
			this.declaration = this.codeObject.replace(/{[\s\S]*}/g, '').trim();
			this.codeObjectType = CodeObjectType.Unknown;
			this.name = '';
			this.index = obj.index;
			this.parentName = obj.parentName ?? '';
			this.parentIndex = obj.parentIndex ?? -1;
			//this.lineNumber = indexToLineNumber( index)
		}
	}

	getFancyCodeObject(): string {
		if (this.codeObjectType === CodeObjectType.Class) {
			return this.declaration + ' { ... }';
		} else if (this.codeObjectType === CodeObjectType.Interface) {
			return this.declaration + ' { ... }';
		} else if (this.codeObjectType === CodeObjectType.Enum) {
			return this.declaration + ' { ... }';
		} else if (this.codeObjectType === CodeObjectType.Function) {
			return this.declaration + ' { ... }';
		} else if (this.codeObjectType === CodeObjectType.Variable) {
			return this.declaration;
		}

		return this.declaration;
	}
}
