import {VaultDirectoryModel} from '../models/VaultDirectoryModel';
import {DocCommentLinkModel} from '../models/DocCommentLinkModel';
import {findFile, trimCharacters} from '../utils/Utils';
import {VaultFileModel} from '../models/VaultFileModel';

export class LinkParser {
	vaultDirectoryModel: VaultDirectoryModel;

	constructor(vaultDirectoryModel: VaultDirectoryModel) {
		this.vaultDirectoryModel = vaultDirectoryModel;
	}

	// {file#objectName}
	// {path/to/file#objectName}
	// {objectName}
	parseLink(link: string, file: VaultFileModel): DocCommentLinkModel {
		if (!link) {
			return;
		}

		link = link.trim();
		link = trimCharacters(link, '{');
		link = trimCharacters(link, '}');

		const linkParts = link.split('#');
		if (linkParts.length === 1) {
			return new DocCommentLinkModel(file.getDocCommentByName(link), file);
		} else if (linkParts.length === 2) {
			const linkToFile = findFile(this.vaultDirectoryModel, linkParts[0]);
			return new DocCommentLinkModel(linkToFile.getDocCommentByName(link[1]), linkToFile);
		} else {
			throw new Error('invalid link');
		}

	}
}
