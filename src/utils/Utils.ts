export const pluginName: string = 'obsidian-doc-gen-plugin';
export const contactEmail: string = 'm.projects.code@gmail.com';
export const mediaDbTag: string = 'docGen';
export const mediaDbVersion: string = '0.0.1';
export const debug: boolean = true;

export function wrapAround(value: number, size: number): number {
	return ((value % size) + size) % size;
}

export function debugLog(o: any): void {
	if (debug) {
		console.log(o);
	}
}

export function replaceIllegalFileNameCharactersInString(string: string): string {
	return string.replace(/[\\,#%&{}/*<>$"@.?]*/g, '').replace(/:+/g, ' -');
}

export const codeAttributes = [
	'public',
	'private',
	'protected',
	'virtual',
	'abstract',
	'const',
	'static',
	'override',
];

export enum CodeElementType {
	Class = 'class',
	Interface = 'interface',
	Enum = 'enum',
	Function = 'function',
	Variable = 'variable',
	Unknown = 'unknown',
}
