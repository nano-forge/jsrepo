import * as fs from 'fs';
import * as path from 'path';

// Get the working directory from the command-line arguments
const baseDir = process.argv[2] || './src'; // Default to './src' if no argument is provided
const outputFile = path.join(baseDir, 'index.ts');

function generateExportStatements(dir: string, baseDir: string): string {
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

		if (rel === "index.ts") return;
		if (fs.lstatSync(filePath).isDirectory()) {
			const folderStatements = generateExportStatements(filePath, baseDir);
			if (folderStatements) {
				dirStatements.push(`\n// ${rel}\n`);
				dirStatements.push(folderStatements);
			}
		} else if (file.endsWith('.svelte')) {
			fileStatements.push(`export {default as ${fileName}} from './${rel}';`);
		} else if (file.endsWith('.ts')) {
			fileStatements.push(`export * from './${rel}';`);
		}
	});

	return [...fileStatements, ...dirStatements].join('\n');
}

const exportStatements = generateExportStatements(baseDir, baseDir);

fs.writeFileSync(outputFile, exportStatements);

console.log(`Export statements generated in ${outputFile}`);
