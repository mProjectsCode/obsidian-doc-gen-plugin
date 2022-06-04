import {codeModifiers, CodeObjectType} from '../../utils/Utils';
import {Markdown} from '../../utils/Markdown';
import {CodeObject} from '../codeObjectModels/CodeObject';

export class DocCommentModel {
	originalComment: string;
	cleanedComment: string;
	commentIndex: number;
	annotations: {
		annotation: string,
		value: string,
		description: string,
	}[];

	codeObject: CodeObject;

	hasError: boolean;
	errorMessage: string;


	constructor(comment?: {comment: string, index: number, codeObject: string, codeObjectIndex: number, codeObjectParentName?: string, codeObjectParentIndex?: number}) {
		if (comment) {
			this.originalComment = comment.comment;
			this.codeObject = new CodeObject({codeObject: comment.codeObject, index: comment.codeObjectIndex, parentName: comment.codeObjectParentName, parentIndex: comment.codeObjectParentIndex});
			this.commentIndex = comment.index;

			this.cleanDocComment();
			this.extractAnnotationsFromComment();
		}
	}

	analyzeCodeObject() {
	};

	toString(): string {
		const heading = Markdown.h3(this.codeObject.name || Markdown.code(this.codeObject.getFancyCodeObject()));

		const body = Markdown.codeBlock(this.codeObject.getFancyCodeObject()) + '\n\n'
		    + Markdown.blockQuotes(this.getDescriptionFromCleanedComment()) + '\n\n'
			+ `**Type**: ${this.codeObject.codeObjectType}\n`;

		return `${heading}\n${body}`;
	}

	private cleanDocComment(): void {
		let docComment = this.originalComment.substring(3); // remove the '/**'
		const regExp = new RegExp('\\n *\\* ?', 'g');
		docComment = docComment.replace(regExp, '\n'); // remove the ' * ' prefix for all lines

		// remove the end slash and everything thereafter
		let j = docComment.length - 1;
		for (let i = docComment.length - 1; i >= 0; i--) {
			if (docComment[i] === '/') {
				j = i;
				break;
			}
		}
		docComment = docComment.substring(0, j);

		if (docComment.startsWith('\n')) {
			docComment = docComment.substring(1);
		}

		docComment = docComment.trim();
		this.cleanedComment = Markdown.convertHTML(docComment);
	}

	/*
	private extractModifiers(): void {
		const codeObjectParts = this.codeObjectDeclaration.split(' ');

		for (const codeObjectPart of codeObjectParts) {
			if (codeModifiers.contains(codeObjectPart)) {
				this.codeObjectModifiers.push(codeObjectPart);
			}
		}
	}
	*/

	private extractAnnotationsFromComment(): void {
		const commentLines = this.cleanedComment.split('\n');

		this.annotations = [];
		for (const commentLine of commentLines) {
			if (commentLine.startsWith('@')) {
				const commentLineParts = commentLine.replace(/ +/g, ' ').split(' ');
				let annotation = commentLineParts[0];
				let value = commentLineParts[1] ?? '';
				let description = '';
				for (let i = 2; i < commentLineParts.length; i++) {
					description += commentLineParts[i] + ' ';
				}

				this.annotations.push({
					annotation: annotation,
					value: value,
					description: description.trim(),
				});
			} else {
				if (this.annotations.length > 0) {
					this.annotations[this.annotations.length - 1].description += ' ' + commentLine.trim();
				}
			}

		}
	}

	private getDescriptionFromCleanedComment(): string {
		let description: string[] = [];

		for (const cleanedCommentLine of this.cleanedComment.split('\n')) {
			if (cleanedCommentLine.startsWith('@')) {
				break;
			}
			description.push(cleanedCommentLine);
		}

		return description.join('\n');
	}
}
