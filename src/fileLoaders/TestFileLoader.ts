import {AbstractFileLoader} from './AbstractFileLoader';
import {DirectoryModel} from '../models/DirectoryModel';

export class TestFileLoader extends AbstractFileLoader {
	async load(path: string): Promise<DirectoryModel> {
		return await this.loadFolder(path, ['.txt']);
	}
}
