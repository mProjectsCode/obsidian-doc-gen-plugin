export class Markdown {
	static h1(content: string): string {
		return `# ${content}`;
	}

	static h2(content: string): string {
		return `## ${content}`;
	}

	static h3(content: string): string {
		return `### ${content}`;
	}

	static h4(content: string): string {
		return `#### ${content}`;
	}

	static h5(content: string): string {
		return `##### ${content}`;
	}

	static h6(content: string): string {
		return `###### ${content}`;
	}

	static bold(content: string): string {
		return `**${content}**`;
	}

	static cursive(content: string): string {
		return `*${content}*`;
	}

	static strikeThrough(content: string): string {
		return `~~${content}~~`;
	}

	static code(content: string): string {
		return `\`${content}\``;
	}

	static codeBlock(content: string): string {
		return `\`\`\`\n${content}\n\`\`\``;
	}

	static highlight(content: string): string {
		return `==${content}==`;
	}

	static blockQuotes(content: string): string {
		return '> ' + content.split('\n').join('\n> ');
	}

	// TODO: implement
	static tables(content: string[][]): string {
		return '';
	}

	static list(content: string[]): string {
		return '- ' + content.join('\n- ');
	}

	static convertHTML(html: string) {
		html = html.replace(/<\/?ul>/g, '');
		html = html.replace(/<li>/g, '- ');
		html = html.replace(/<\/li>/g, '');
		html = html.replace(/<\/?p>/g, '\n');
		html = html.replace(/<\/?code>/g, '\`');
		html = html.replace(/\n\n\n/g, '\n\n');

		return html;
	}
}
