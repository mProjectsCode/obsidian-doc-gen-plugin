import {CodeObject} from './CodeObject';

export class FunctionCodeObject extends CodeObject {
	returnValue: {
		type: string,
		description: string,
	};
	parameters: {
		name: string,
		type: string,
		description: string,
	}[];


	constructor() {
		super();
	}

}
