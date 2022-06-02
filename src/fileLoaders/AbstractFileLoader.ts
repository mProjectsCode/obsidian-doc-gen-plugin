import {DirectoryModel} from '../models/DirectoryModel';
import {FileModel} from '../models/FileModel';

export abstract class AbstractFileLoader {
	fs: any;

	constructor() {
		this.fs = require('fs').promises;
	}

	async loadFolder(pathToFolder: string, fileTypes: string[]): Promise<DirectoryModel> {
		try {
			await this.fs.access(pathToFolder);
		} catch (e) {
			return undefined;
		}

		let dirModel = new DirectoryModel('root', pathToFolder);
		dirModel = await this.loadFolderRecursive(dirModel, fileTypes);

		console.log(dirModel);

		return dirModel;
	}

	private async loadFolderRecursive(directoryModel: DirectoryModel, fileTypes: string[]): Promise<DirectoryModel> {
		if (!directoryModel) {
			return undefined;
		}

		try {
			await this.fs.access(directoryModel.path);
		} catch (e) {
			return undefined;
		}

		const files = await this.fs.readdir(directoryModel.path);

		for (const file of files) {
			const filePath = `${directoryModel.path}/${file}`;

			if ((await this.fs.stat(filePath)).isDirectory()) {
				let dirModel = new DirectoryModel(file, filePath);
				dirModel = await this.loadFolderRecursive(dirModel, fileTypes);

				directoryModel.subDirectories.push(dirModel);
			} else if ((await this.fs.stat(filePath)).isFile()) {
				let a = false;
				for (const fileType of fileTypes) {
					if (file.endsWith(fileType)) {
						a = true;
					}
				}
				if (!a) {
					continue;
				}

				const fileModel = new FileModel(file, filePath);
				fileModel.content = (await this.fs.readFile(filePath)).toString();

				directoryModel.files.push(fileModel);
			}
		}

		return directoryModel;
	}
}
