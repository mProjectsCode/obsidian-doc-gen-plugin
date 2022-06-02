import {FileParser} from './FileParser';

export class TypeScriptFileParser extends FileParser {

	constructor() {
		super();

		this.fileEndings = ['.ts'];
	}
}
