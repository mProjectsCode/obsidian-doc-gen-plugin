import {AbstractFileLoader} from './AbstractFileLoader';
import {DirectoryModel} from '../models/DirectoryModel';

export class FileLoader extends AbstractFileLoader {
	async load(path: string, fileTypes: string[]): Promise<DirectoryModel> {
		return await this.loadFolder(path, fileTypes);
	}
}
