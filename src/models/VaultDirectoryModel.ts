import {VaultFileModel} from './VaultFileModel';

export class VaultDirectoryModel {
	subDirectories: VaultDirectoryModel[];
	files: VaultFileModel[];
	name: string;
	path: string;

	constructor(name: string, path: string) {
		this.name = name;
		this.path = path;
		this.files = [];
		this.subDirectories = [];
	}
}
