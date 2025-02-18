import {App} from "./app.ts";

let builder = new App();
builder.modules.forEach(async module => {
	module.generateIndex();
	module.checkDependencies();
});

await builder.bumpBuild();