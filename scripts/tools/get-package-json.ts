import fs from "node:fs";
import path from "node:path";

export class PackageJson {
	content: any;

	get name(): string { return this.content.name; }
	get version(): string { return this.content.version; }
	get dependencies(): string[] { return this.content.dependencies; }

	bumpBuild() {
		let [ver, build]: [string, string] = this.content.version.split('+');
		if (build === undefined) build = "0";
		this.content.version = ver + "+" + (parseInt(build) + 1);
		return this;
	}

	constructor(private dir: string) {
		this.content = JSON.parse(fs.readFileSync(path.resolve(dir, "package.json")).toString())
	}

	write() {
		fs.writeFileSync(path.resolve(this.dir, "package.json"), JSON.stringify(this.content, null, 2));
	}

}