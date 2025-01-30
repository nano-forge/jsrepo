import * as fs from 'fs';
import * as path from 'path';

const modulesDirectory = fs.realpathSync("modules");

fs.readdirSync(modulesDirectory).forEach(module => {
	if (fs.lstatSync(`${modulesDirectory}/${module}`).isDirectory()) {
		fs.readdirSync(`${modulesDirectory}/${module}`).forEach(submodule => {
			if (fs.lstatSync(`${modulesDirectory}/${module}/${submodule}`).isDirectory()) {
				buildModule(`${modulesDirectory}/${module}/${submodule}`);
			}
		})
	}
});

function buildModule(path: string) {
	let module = path.replace(modulesDirectory, "").replace(/^\//, "");
	console.log(`Building module ${module}`);
	generateExportStatements(path);
	collectImports(path)
	console.log(`done`);
}

function generateExportStatements(dir: string,): void {
	const exportStatements = generateExportStatementsRecursive(dir, dir);
	fs.writeFileSync(`${dir}/index.ts`, exportStatements);
}
function generateExportStatementsRecursive(dir: string, baseDir: string): string {
	const files = fs.readdirSync(dir);
	const fileStatements: string[] = [];
	const dirStatements: string[] = [];

	files.sort((a, b) => {
		if (a.endsWith('.svelte') && !b.endsWith('.svelte')) return 1;
		if (!a.endsWith('.svelte') && b.endsWith('.svelte')) return -1;
		return a.localeCompare(b);
	});

	files.forEach(file => {
		const filePath = path.join(dir, file);
		const fileName = path.basename(file, path.extname(file));
		const rel = filePath.replace(baseDir, '').replace(/^\//, "");

		if (rel === "index.ts" || rel.startsWith("~")) return;

		if (fs.lstatSync(filePath).isDirectory()) {
			const folderStatements = generateExportStatementsRecursive(filePath, baseDir);
			if (folderStatements) {
				dirStatements.push(`\n// ${rel}\n`);
				dirStatements.push(folderStatements);
			}
		} else if (file.endsWith('.svelte')) {
			fileStatements.push(`export {default as ${fileName}} from './${rel}';`);
			fileStatements.push(`export * from './${rel}';`);
		} else if (file.endsWith('.ts')) {
			fileStatements.push(`export * from './${rel.replace(/.ts$/, "")}';`);
		}
	});

	return [...fileStatements, ...dirStatements].join('\n');
}

function collectImports(dir: string): void {
	const collectedImports = traverseDirectory(dir, dir);
	const uniqueImports = Array.from(new Set(collectedImports));

	const importStatements = uniqueImports.sort()
		.map(importPath => `${importPath}`)
		.join('\n');

	fs.writeFileSync(path.join(dir, "imports.txt"), importStatements);
}
function findImports(filePath: string, rootDir: string): string[] {
	const content = fs.readFileSync(filePath, 'utf-8');
	const importRegex = /import\s+.*\s+from\s+['"](.*)['"]/g;
	const imports: string[] = [];
	let match;

	while ((match = importRegex.exec(content)) !== null) {
		const importPath = match[1];
		const absoluteImportPath = path.resolve(path.dirname(filePath), importPath);
		if (!importPath.startsWith('.')) imports.push('npm: ' + importPath);
		else if (path.relative(rootDir, absoluteImportPath).startsWith('..')) {
			imports.push('@gm: ' + path.relative(modulesDirectory, absoluteImportPath));
		}
	}

	return imports;
}
function traverseDirectory(dir: string, rootDir: string): string[] {
	const files = fs.readdirSync(dir);
	const fileStatements: string[] = [];
	const dirStatements: string[] = [];

	files.forEach(file => {
		const filePath = path.join(dir, file);
		if (fs.lstatSync(filePath).isDirectory()) {
			const folderStatements = traverseDirectory(filePath, rootDir);
			if (folderStatements.length > 0) {
				dirStatements.push(...folderStatements);
			}
		} else if (file.endsWith('.ts') || file.endsWith('.svelte')) {
			fileStatements.push(...findImports(filePath, rootDir));
		}
	});

	return [...fileStatements, ...dirStatements];
}