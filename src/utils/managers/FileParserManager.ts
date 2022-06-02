import {FileParser} from '../../fileParsers/FileParser';
import {TypeScriptFileParser} from '../../fileParsers/TypeScriptFileParser';

enum FileParserType {
	TypeScript = 'typeScript',
}

export class FileParserManager {
	static createFileParser(fileParserType: FileParserType): FileParser {
		if (fileParserType === FileParserType.TypeScript) {
			return new TypeScriptFileParser();
		}

		return undefined;
	}
}
