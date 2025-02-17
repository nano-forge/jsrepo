import {GmBuilder} from "./gm-builder.ts";

let builder = new GmBuilder();
builder.modules.forEach(async module => {
	module.generateIndex();
	module.checkDependencies();
	module.bumpBuild();
});