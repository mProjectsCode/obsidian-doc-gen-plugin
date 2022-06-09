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

	static table(content: string[][]): string {
		let rows = content.length;
		if (rows === 0) {
			return '';
		}

		let columns = content[0].length;
		if (columns === 0) {
			return '';
		}
		for (const row of content) {
			if (row.length !== columns) {
				return '';
			}
		}

		let longestStringInColumns = [];

		for (let i = 0; i < columns; i++) {
			let longestStringInColumn = 0;
			for (const row of content) {
				if (row[i].length > longestStringInColumn) {
					longestStringInColumn = row[i].length;
				}
			}

			longestStringInColumns.push(longestStringInColumn);
		}

		let table = '';

		for (let i = 0; i < rows; i++) {
			table += '|';
			for (let j = 0; j < columns; j++) {
				let element = content[i][j];
				element += ' '.repeat(longestStringInColumns[j] - element.length);
				table += ' ' + element + ' |';
			}
			table += '\n';
			if (i === 0) {
				table += '|';
				for (let j = 0; j < columns; j++) {
					table += ' ' + '-'.repeat(longestStringInColumns[j]) + ' |';
				}
				table += '\n';
			}
		}

		return table;
	}

	static list(content: string[]): string {
		return '- ' + content.join('\n- ') + '\n';
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
