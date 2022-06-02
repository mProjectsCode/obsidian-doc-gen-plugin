import {codeAttributes, CodeElementType} from '../../utils/Utils';

export class DocCommentModel {
	originalComment: string;
	cleanedComment: string;
	codeSnippet: string;
	codeAttributes: string[];
	type: string;

	constructor(comment?: string) {
		if (comment) {
			this.originalComment = comment;
			this.codeAttributes = [];
			this.type = 'unknown';

			this.cleanDocComment();
			this.extractCodeSnippet();
			this.extractCodeAttributes();
			this.extractType();
		}
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

	private extractCodeSnippet(): void {
		let j = this.originalComment.length - 1;
		for (let i = this.originalComment.length - 1; i >= 0; i--) {
			if (this.originalComment[i] === '\n') {
				j = i;
				break;
			}
		}

		let codeSnippet = this.originalComment.substring(j, this.originalComment.length);

		this.codeSnippet = codeSnippet.trim();
	}

	private extractCodeAttributes () {
		const codeSnippetParts = this.codeSnippet.split(' ');

		for (const codeSnippetPart of codeSnippetParts) {
			if (codeAttributes.contains(codeSnippetPart)) {
				this.codeAttributes.push(codeSnippetPart);
			}
		}
	}

	private extractType() {
		const codeSnippetParts = this.codeSnippet.split(' ');

		if (codeSnippetParts.contains(CodeElementType.Class)) {
			this.type = CodeElementType.Class;
		} else if (codeSnippetParts.contains(CodeElementType.Interface)) {
			this.type = CodeElementType.Interface;
		} else if (codeSnippetParts.contains(CodeElementType.Enum)) {
			this.type = CodeElementType.Enum;
		} else if (codeSnippetParts.contains(CodeElementType.Function)) {
			this.type = CodeElementType.Function;
		} else {
			let declaration = this.codeSnippet.split('=')[0];

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

	analyzeCodeSnippet() { };

	toString() {
		return this.cleanedComment;
	}
}
