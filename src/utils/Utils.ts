import {VaultDirectoryModel} from '../models/VaultDirectoryModel';
import {VaultFileModel} from '../models/VaultFileModel';

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

export function trimCharacters(str: string, char: string): string {
	while (str.startsWith(char)) {
		str = str.substring(char.length);
	}
	while (str.endsWith(char)) {
		str = str.substring(0, str.length - char.length);
	}

	return str;
}

export function indexToLineNumber(str: string, index: number) {
	if (index >= str.length) {
		return 0;
	}

	let linebreaks = 1;

	for (let i = 0; i < index + 1; i++) {
		if (str[i] === '\n') {
			linebreaks += 1;
		}
	}

	return linebreaks;
}

export const codeModifiers = [
	'public',
	'private',
	'protected',
	'virtual',
	'abstract',
	'const',
	'static',
	'override',
];

export enum CodeObjectType {
	Class = 'class',
	Interface = 'interface',
	Enum = 'enum',
	Function = 'function',
	Variable = 'variable',
	Unknown = 'unknown',
}

export function findFiles(vaultDirectoryModel: VaultDirectoryModel, fileName: string): VaultFileModel[] {
	const files: VaultFileModel[] = [];

	for (const file of vaultDirectoryModel.files) {
		if (isPath(fileName)) {
			if (removeFileEnding(file.path) === removeFileEnding(fileName)) {
				files.push(file);
			}
		} else {
			if (getFileName(removeFileEnding(file.name)) === getFileName(removeFileEnding(fileName))) {
				files.push(file);
			}
		}
	}

	for (const subDirectory of vaultDirectoryModel.subDirectories) {
		const fileModels: VaultFileModel[] = this.findFiles(subDirectory, fileName);
		files.push(...fileModels);
	}

	return files;
}

export function findFile(vaultDirectoryModel: VaultDirectoryModel, fileName: string): VaultFileModel {
	const files: VaultFileModel[] = findFiles(vaultDirectoryModel, fileName);

	if (files.length === 0) {
		throw new Error('File not found');
	} else if (files.length === 1) {
		return files[0];
	} else {
		throw new Error('Multiple files found');
	}
}

export function getFileName(path: string) {
	return path.split('/').at(-1);
}

export function isPath(path: string) {
	return path.split('/').length > 1;
}

export function removeFileEnding(fileName: string) {
	const fileNameParts = fileName.split('.');
	if (fileNameParts.length === 1) {
		return fileName;
	} else {
		let newFileName = fileNameParts[0];
		for (let i = 1; i < fileNameParts.length - 1; i++) {
			newFileName += '.' + fileNameParts[i];
		}
		return newFileName;
	}
}
