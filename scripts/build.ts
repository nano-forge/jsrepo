//
//
import {exec} from 'child_process';
import {App} from "./app.ts";
import {getGitStatus} from "./tools/get-git-status.ts";

let builder = new App();
builder.modules.forEach(async module => {
	module.generateIndex();
	module.checkDependencies();
});

await builder.bumpBuild();
