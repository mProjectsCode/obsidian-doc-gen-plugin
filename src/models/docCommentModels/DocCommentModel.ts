import {codeModifiers, CodeElementType} from '../../utils/Utils';
import {Markdown} from '../../utils/Markdown';

export class DocCommentModel {
	originalComment: string;
	cleanedComment: string;
	codeObject: string;
	codeObjectDeclaration: string;
	modifiers: string[];
	type: string;
	name: string;
	annotations: {
		annotation: string,
		value: string,
		description: string,
	}[];

	constructor(comment?: string, codeObject?: string) {
		if (comment) {
			this.originalComment = comment;
			this.modifiers = [];
			this.type = 'unknown';
			this.name = '';
			this.codeObject = codeObject ?? '';
			this.codeObjectDeclaration = this.codeObject.replace(/{[\s\S]*}/g, '').trim();

			this.cleanDocComment();
			// this.extractCodeObject();
			this.extractModifiers();
			this.extractType();
			this.extractAnnotationsFromComment();
		}
	}

	analyzeCodeObject() {
	};

	toString(): string {
		const heading = Markdown.h3(this.name || Markdown.code(this.getFancyCodeObject()));

		const body = Markdown.codeBlock(this.getFancyCodeObject()) + '\n\n'
		    + Markdown.blockQuotes(this.getCleanedCommentWithOutAnnotations()) + '\n\n'
			+ `**Type**: ${this.type}\n`;

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

		this.cleanedComment = docComment.trim();
	}

	/*
	private extractCodeObject(): void {
		let j = this.originalComment.length - 1;
		for (let i = this.originalComment.length - 1; i >= 0; i--) {
			if (this.originalComment[i] === '\n') {
				j = i;
				break;
			}
		}

		let codeObject = this.originalComment.substring(j, this.originalComment.length);

		this.codeObject = codeObject.trim();
	}
	*/

	private extractModifiers(): void {
		const codeObjectParts = this.codeObjectDeclaration.split(' ');

		for (const codeObjectPart of codeObjectParts) {
			if (codeModifiers.contains(codeObjectPart)) {
				this.modifiers.push(codeObjectPart);
			}
		}
	}

	private extractType(): void {
		const codeObjectParts = this.codeObjectDeclaration.split(' ');

		if (codeObjectParts.contains(CodeElementType.Class)) {
			this.type = CodeElementType.Class;
		} else if (codeObjectParts.contains(CodeElementType.Interface)) {
			this.type = CodeElementType.Interface;
		} else if (codeObjectParts.contains(CodeElementType.Enum)) {
			this.type = CodeElementType.Enum;
		} else if (codeObjectParts.contains(CodeElementType.Function)) {
			this.type = CodeElementType.Function;
		} else {
			let declaration = this.codeObjectDeclaration.split('=')[0];

			const regExp = new RegExp('\\(.*\\)');
			const matches = declaration.match(regExp);

			if (!matches || matches.length === 0) {
				this.type = CodeElementType.Variable;
			} else if (matches.length === 1) {
				this.type = CodeElementType.Function;
			} else {
				this.type = CodeElementType.Unknown;
			}
		}
	}

	private extractAnnotationsFromComment(): void {
		const commentLines = this.cleanedComment.split('\n');

		this.annotations = [];
		for (const commentLine of commentLines) {
			if (!commentLine.startsWith('@')) {
				continue;
			}

			const commentLineParts = commentLine.split(' ');
			this.annotations.push({
				annotation: commentLineParts[0],
				value: commentLineParts[1] ?? '',
				description: commentLineParts[2] ?? '',
			});
		}
	}

	private getCleanedCommentWithOutAnnotations(): string {
		let cleanedCommentWithOutAnnotations = [];

		for (const cleanedCommentLine of this.cleanedComment.split('\n')) {
			if (cleanedCommentLine.startsWith('@')) {
				continue;
			}
			cleanedCommentWithOutAnnotations.push(cleanedCommentLine);
		}

		return cleanedCommentWithOutAnnotations.join('\n');
	}

	private getFancyCodeObject(): string {
		if (this.type === CodeElementType.Class) {
			return this.codeObjectDeclaration + ' { ... }';
		} else if (this.type === CodeElementType.Interface) {
			return this.codeObjectDeclaration + ' { ... }';
		} else if (this.type === CodeElementType.Enum) {
			return this.codeObjectDeclaration + ' { ... }';
		} else if (this.type === CodeElementType.Function) {
			return this.codeObjectDeclaration + ' { ... }';
		} else if (this.type === CodeElementType.Variable) {
			return this.codeObjectDeclaration;
		}

		return this.codeObjectDeclaration;
	}
}
