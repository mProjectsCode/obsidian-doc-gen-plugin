import {FileModel} from './FileModel';

export class DirectoryModel {
	subDirectories: DirectoryModel[];
	files: FileModel[];
	name: string;
	path: string;

	constructor(name: string, path: string) {
		this.name = name;
		this.path = path;
		this.files = [];
		this.subDirectories = [];
	}
}
