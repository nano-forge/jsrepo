import * as process from "node:process";
import {Module} from "./module.ts";
import {getGitStatus} from "./tools/get-git-status.ts";
import {PackageJson} from "./tools/get-package-json.ts";


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

		for (const module of this.modules) {
			Object.keys(module.pkg.dependencies).forEach((dep) => {
				let depModule = this.module(dep);
				if (depModule) {
					//@ts-ignore
					module.pkg.dependencies[dep] = depModule.pkg.version;
				}
			})
			module.pkg.write();
		}
	}
}
