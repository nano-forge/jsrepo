import * as fs from 'fs';
import * as path from 'path';

export function readTreeSync(dir: string): string[] {
	let results: string[] = [];

	function readDir(currentDir: string) {
		const items = fs.readdirSync(currentDir);

		for (let item of items) {
			const fullPath = path.join(currentDir, item);

			if (fs.statSync(fullPath).isDirectory()) {
				results.push(fullPath);
				readDir(fullPath); // Recursively read directories
			}
		}
	}
	readDir(dir);
	return results;
}
