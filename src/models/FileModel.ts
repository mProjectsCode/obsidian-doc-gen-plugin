export class FileModel {
	path: string;
	name: string;
	content: string;

	constructor(name: string, path: string) {
		this.name = name;
		this.path = path;
	}
}
