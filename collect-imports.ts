import * as fs from 'fs';
import * as path from 'path';



// Get the root directory from the command-line arguments
const rootDir = process.argv[2] || './src'; // Default to './src' if no argument is provided
const outputFile = path.join(rootDir, '~imports.ts');

function findImports(filePath: string): string[] {
	const content = fs.readFileSync(filePath, 'utf-8');
	const importRegex = /import\s+.*\s+from\s+['"](.*)['"]/g;
	const imports: string[] = [];
	let match;

	while ((match = importRegex.exec(content)) !== null) {
		const importPath = match[1];
		const absoluteImportPath = path.resolve(path.dirname(filePath), importPath);
		console.log(path.relative(rootDir, absoluteImportPath), importPath)
		if(!importPath.startsWith('.'))imports.push(importPath);

		else if (path.relative(rootDir, absoluteImportPath).startsWith('..')) {
			imports.push(path.relative(rootDir, absoluteImportPath));
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
			if (folderStatements.length > 0) dirStatements.push(...folderStatements);
		} else {
			fileStatements.push(...findImports(filePath));
		}
	});

	return [...fileStatements, ...dirStatements];
}

const collectedImports = traverseDirectory(rootDir, rootDir);
const uniqueImports = Array.from(new Set(collectedImports));

const importStatements = uniqueImports
	.map(importPath => `import '${importPath}';`)
	.join('\n');

fs.writeFileSync(outputFile, importStatements);

console.log(`Collected imports written to ${outputFile}`);
