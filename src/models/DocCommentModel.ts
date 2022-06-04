import {Markdown} from '../utils/Markdown';
import {CodeObject} from './CodeObject';

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

	name: string;
	description: string;
	deprecated: boolean;
	authors: string[];
	parameters: {
		name: string,
		description: string,
	}[];
	returns: string;
	exceptions: {
		name: string,
		description: string,
	}[];
	since: string;
	parent: string;
	children: string[];
	extends: string[];
	implements: string[];

	otherAnnotations: {
		annotation: string,
		value: string,
		description: string,
	}[];

	hasError: boolean;
	errorMessage: string;


	constructor(comment?: { comment: string, index: number, codeObject: string }) {
		if (comment) {
			this.originalComment = comment.comment;
			this.codeObject = new CodeObject({codeObject: comment.codeObject});
			this.commentIndex = comment.index;

			this.cleanDocComment();
			this.extractAnnotationsFromComment();
			this.initAnnotationData();
			this.extractDataFromAnnotations();
		}
	}

	private static getAnnotationValueAndDescription(annotation: { annotation: string, value: string, description: string, }) {
		return `${annotation.value} ${annotation.description}`;
	}

	analyzeCodeObject() {
	};

	toString(): string {
		const heading = Markdown.h3(this.name || Markdown.code(this.codeObject.getFancyCodeObject()));

		const body = Markdown.codeBlock(this.codeObject.getFancyCodeObject()) + '\n\n'
			+ (this.deprecated ? '> [!WARNING] Deprecated\n\n' : '')
			+ (this.description ? Markdown.blockQuotes(this.description) + '\n\n' : '')
			+ (this.authors.length !== 0 ? `**Authors:** ${this.authors.join(', ')}\n` : '')
			+ (this.since ? `**Since:** ${this.since}\n` : '')
			+ (this.exceptions.length !== 0 ? `**Exceptions:** \n\n${this.getExceptionsAsTable()}\n` : '')
			+ (this.parameters.length !== 0 ? `**Parameters:** \n\n${this.getParametersAsTable()}\n` : '')
			+ (this.returns ? `**Returns:** ${this.returns}\n` : '')
			+ (this.extends.length !== 0 ? `**Extends:** ${this.extends.join(', ')}\n` : '')
			+ (this.implements.length !== 0 ? `**Implements:** ${this.implements.join(', ')}\n` : '')
			+ (this.otherAnnotations.length !== 0 ? `**Other Annotations:** \n\n${this.getOtherAnnotationsAsTable()}\n` : '');

		// console.log(body);

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

	private extractDescriptionFromCleanedComment() {
		let description: string[] = [];

		for (const cleanedCommentLine of this.cleanedComment.split('\n')) {
			if (cleanedCommentLine.startsWith('@')) {
				break;
			}
			description.push(cleanedCommentLine);
		}

		this.description = description.join('\n');
	}

	private initAnnotationData() {
		this.name = '';
		this.description = '';
		this.authors = [];
		this.parameters = [];
		this.returns = '';
		this.exceptions = [];
		this.since = '';
		this.deprecated = false;
		this.parent = '';
		this.children = [];
		this.extends = [];
		this.implements = [];
	}

	private extractDataFromAnnotations() {
		this.extractDescriptionFromCleanedComment();
		this.otherAnnotations = [];

		for (const annotation of this.annotations) {
			if (annotation.annotation === '@name') {
				this.name = annotation.value;
			} else if (annotation.annotation === '@author') {
				this.authors.push(DocCommentModel.getAnnotationValueAndDescription(annotation));
			} else if (annotation.annotation === '@param' || annotation.annotation === '@parameter') {
				this.parameters.push({name: annotation.value, description: annotation.description});
			} else if (annotation.annotation === '@return' || annotation.annotation === '@returns') {
				this.returns = DocCommentModel.getAnnotationValueAndDescription(annotation);
			} else if (annotation.annotation === '@exception' || annotation.annotation === '@throws') {
				this.exceptions.push({name: annotation.value, description: annotation.description});
			} else if (annotation.annotation === '@since') {
				this.since = annotation.value;
			} else if (annotation.annotation === '@deprecated') {
				this.deprecated = true;
			} else if (annotation.annotation === '@parent') {
				this.parent = annotation.value;
			} else if (annotation.annotation === '@extends') {
				this.extends.push(annotation.value);
			} else if (annotation.annotation === '@implements') {
				this.implements.push(annotation.value);
			} else {
				this.otherAnnotations.push(annotation);
			}
		}
	}

	private getParametersAsTable() {
		let parameterArray: string[][] = [];
		parameterArray.push(['Name', 'Description']);
		for (const parameter of this.parameters) {
			parameterArray.push([parameter.name, parameter.description]);
		}
		return Markdown.table(parameterArray);
	}

	private getExceptionsAsTable() {
		let exceptionArray: string[][] = [];
		exceptionArray.push(['Name', 'Description']);
		for (const exception of this.exceptions) {
			exceptionArray.push([exception.name, exception.description]);
		}
		return Markdown.table(exceptionArray);
	}

	private getOtherAnnotationsAsTable() {
		let otherAnnotationArray: string[][] = [];
		otherAnnotationArray.push(['Annotation', 'Value', 'Description']);
		for (const otherAnnotation of this.otherAnnotations) {
			otherAnnotationArray.push([otherAnnotation.annotation, otherAnnotation.value, otherAnnotation.description]);
		}
		return Markdown.table(otherAnnotationArray);
	}
}
