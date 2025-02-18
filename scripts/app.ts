import * as fs from "node:fs";
import * as path from "node:path";
import * as process from "node:process";
import {getGitStatus} from "./tools/get-git-status.ts";
import {PackageJson} from "./tools/get-package-json.ts";
import {readTreeSync} from "./tools/read-tree-sync.ts";


class Module {
	name: any;
	fileExtensions: string[] = [".ts", ".svelte"];
	pkg: PackageJson;

	constructor(public dir: string) {
		this.pkg = new PackageJson(dir);
		this.name = this.pkg.content.name;
	}

	generateIndex() {
		const dirs = [this.dir, ...readTreeSync(this.dir)].sort();

		let output = ""

		dirs.forEach(dir => {
			output += `// ${path.relative(this.dir, dir) || this.name}` + "\n\n";
			fs.readdirSync(dir)
				.map(file => path.resolve(dir, file))
				.filter(file => !fs.lstatSync(file).isDirectory())
				.filter(file => this.fileExtensions.includes(path.extname(file)))
				.sort((a, b) => {
					if (a.endsWith('.svelte') && !b.endsWith('.svelte')) return 1;
					if (!a.endsWith('.svelte') && b.endsWith('.svelte')) return -1;
					return a.localeCompare(b);
				})
				.map(file => "./" + path.relative(this.dir, file).replaceAll("\\", "/"))
				.filter(file => file !== "./index.ts")
				.forEach((file) => {
					if (file.endsWith('.svelte')) {
						output += `export {default as ${path.basename(file, path.extname(file))}} from '${file}';` + "\n";
						output += `export * from '${file}';` + "\n";
					}
					if (file.endsWith('.ts')) {
						output += `export * from '${file.replace(/.ts$/, "")}';` + "\n";
					}
				})
			output += "\n\n";
		});

		fs.writeFileSync(`${this.dir}/index.ts`, output);
	}
	checkDependencies() {
		const dirs = [this.dir, ...readTreeSync(this.dir)];

		dirs.forEach(dir => {
			fs.readdirSync(dir)
				.map(file => path.resolve(dir, file))
				.filter(file => !fs.lstatSync(file).isDirectory())
				.map(file => {
					fs.readFileSync(file, 'utf-8')
						.matchAll(/import\s+.*\s+from\s+['"](.*)['"]/g)
						.map((match) => match[1])
						.map((importPath) => {
							return importPath.startsWith(".")
								? "./" + path.relative(this.dir, path.resolve(dir, importPath)).replaceAll("\\", "/")
								: importPath.startsWith("@")
									? importPath.split("/").slice(0, 2).join("/")
									: importPath.split("/")[0];
						})
						.forEach((dep) => {
							const f = path.relative(this.dir, file)
							if (dep.startsWith(".")) {
								const absoluteImportPath = path.resolve(this.dir, dep);
								if (!absoluteImportPath.startsWith(path.resolve(this.dir))) {
									console.error(`[WARNING!] Import statement "${dep}" in ${f} is out of module directory`);
								}
							} else if (!this.pkg.content.dependencies[dep]) {
								console.error(`[WARNING!] Dependency ${dep} in ${f} not found.`);
							}
						})
				});
		});
	}
	bumpBuild() {this.pkg.bumpBuild().write();}
}

export class App {
	modules: Module[] = []
	root: string;
	pkg: PackageJson;
	localDependencies: Record<string, string[]> = {};
	localDependants: Record<string, string[]> = {};
	buildOrder: string[] = [];

	constructor() {
		this.root = process.cwd();
		this.pkg = new PackageJson(this.root)
		Object.keys(this.pkg.content.devDependencies).forEach((modKey: string) => {
			const modDef = this.pkg.content.devDependencies[modKey];
			if (modDef.startsWith("workspace:")) {
				const modPath = modDef.replace("workspace:", "");
				const module = new Module(modPath);
				this.modules.push(module);
			}
		});
		this.createLocalDependencies();
		this.calculateLocalDependants();
		this.createBuildOrder();
	}

	createLocalDependencies() {
		let modules = this.modules.map(module => module.pkg.content.name);
		for (const module of this.modules) {
			this.localDependencies[module.name] = [];
			Object.keys(module.pkg.dependencies).forEach((dep) => {
				if (modules.includes(dep)) this.localDependencies[module.name].push(dep);
			});
		}

	}
	createBuildOrder() {
		const visited = new Set<string>();
		const result: string[] = [];
		const visit = (node: string) => {
			if (visited.has(node)) return;
			visited.add(node);
			const dependencies = this.localDependencies[node] || [];
			dependencies.forEach(visit);
			result.push(node);
		};
		Object.keys(this.localDependencies).forEach(module => visit(module));
		this.buildOrder = result;
	}
	calculateLocalDependants() {
		const reversed: Record<string, string[]> = {};

		Object.keys(this.localDependencies).forEach(module => {reversed[module] = [];});
		Object.entries(this.localDependencies).forEach(([module, dependencies]) => {
			dependencies.forEach(dependency => {reversed[dependency].push(module);});
		});

		this.localDependants = reversed;
	}

	module(name: string): Module | undefined { return this.modules.find(mod => mod.name === name);}

	async getChangedModules() {
		let markedModules: Set<string> = new Set();
		let changes = Object.keys(await getGitStatus());
		for (const name of this.buildOrder) {
			const module = this.module(name);
			if (module) for (const changed of changes) if (changed.startsWith(module.dir)) markedModules.add(name);
		}
		for (const name of this.buildOrder) {
			if (markedModules.has(name)) {
				for (const dep of this.localDependants[name]) markedModules.add(dep);
			}
		}
		return Array.from(markedModules);
	}

	async bumpBuild() {
		let changedModules = await this.getChangedModules();
		if (changedModules.length > 0) {
			this.pkg.bumpBuild().write();
			for (const name of changedModules) {
				this.module(name)?.bumpBuild();
			}
		}
	}
}
