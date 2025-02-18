import {exec} from "child_process";

export function getGitStatus(): Promise<Record<string, string>> {
	return new Promise((resolve, reject) => {
		exec('git status --porcelain', (err, stdout, stderr) => {
			if (err) {
				reject(`Error: ${err}`);
				return;
			}
			const changes: Record<string, string> = {};
			stdout.split('\n').filter(line => line).forEach(line => {
				const status = line.slice(0, 2).trim();
				const file = line.slice(3).trim();
				changes[file] = status;
			});
			resolve(changes);
		});
	});
}