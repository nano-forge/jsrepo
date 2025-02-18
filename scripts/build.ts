import {App} from "./app.ts";

let builder = new App();
builder.modules.forEach(async module => {
	module.generateIndex();
	module.checkDependencies();
});








import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';

interface PackageJSON {
	name: string;
	version: string;
	dependencies?: { [key: string]: string };
}

const rootDir = process.cwd();

const getChangedPackages = (): string[] => {
	const result = execSync('git diff --name-only HEAD^ HEAD').toString();
	const changedFiles = result.split('\n').filter(line => line.endsWith('package.json'));
	return changedFiles.map(file => path.dirname(file));
};

const updateDependencies = (packageDir: string, packagesToUpdate: { [key: string]: string }) => {
	const packageJsonPath = path.join(packageDir, 'package.json');
	const packageJson: PackageJSON = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

	let updated = false;
	if (packageJson.dependencies) {
		for (const [dep, version] of Object.entries(packageJson.dependencies)) {
			if (packagesToUpdate[dep]) {
				packageJson.dependencies[dep] = packagesToUpdate[dep];
				updated = true;
			}
		}
	}

	if (updated) {
		writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
	}
};

const main = () => {
	const changedPackages = getChangedPackages();
	const packagesToUpdate: { [key: string]: string } = {};

	console.log(changedPackages)

	changedPackages.forEach(packageDir => {
		const packageJsonPath = path.join(packageDir, 'package.json');
		const packageJson: PackageJSON = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
		packagesToUpdate[packageJson.name] = packageJson.version;
	});

	const allPackages = execSync('find . -name "package.json"').toString().split('\n').filter(Boolean);
	allPackages.forEach(pkgPath => {
		const pkgDir = path.dirname(pkgPath);
		if (!changedPackages.includes(pkgDir)) {
			updateDependencies(pkgDir, packagesToUpdate);
		}
	});

	console.log('Dependency versions updated successfully.');
};

main();


//
// import { exec } from 'child_process';
//
// interface Change {
// 	status: string;
// 	file: string;
// }
//
// const getGitDiff = (): Promise<Change[]> => {
// 	return new Promise((resolve, reject) => {
// 		exec('git diff --name-status', (err, stdout, stderr) => {
// 			if (err) {
// 				reject(`Error: ${err}`);
// 				return;
// 			}
//
// 			const changes: Change[] = stdout.split('\n').filter(line => line).map(line => {
// 				const [status, file] = line.split('\t');
// 				return { status, file };
// 			});
//
// 			resolve(changes);
// 		});
// 	});
// };
//
// getGitDiff().then(changes => {
// 	const result = {
// 		changes
// 	};
// 	console.log(JSON.stringify(result, null, 2));
// }).catch(error => {
// 	console.error(error);
// });
