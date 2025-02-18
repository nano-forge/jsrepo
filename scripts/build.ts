import {App} from "./app.ts";

let builder = new App();
builder.modules.forEach(async module => {
	module.generateIndex();
	module.checkDependencies();
});


import { exec } from 'child_process';

interface Change {
	status: string;
	file: string;
}

const getGitDiff = (): Promise<Change[]> => {
	return new Promise((resolve, reject) => {
		exec('git diff --name-status', (err, stdout, stderr) => {
			if (err) {
				reject(`Error: ${err}`);
				return;
			}

			const changes: Change[] = stdout.split('\n').filter(line => line).map(line => {
				const [status, file] = line.split('\t');
				return { status, file };
			});

			resolve(changes);
		});
	});
};

getGitDiff().then(changes => {
	const result = {
		changes
	};
	console.log(JSON.stringify(result, null, 2));
}).catch(error => {
	console.error(error);
});
