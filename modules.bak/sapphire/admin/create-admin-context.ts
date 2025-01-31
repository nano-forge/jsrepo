import {createDialogManager, createDrawerManager, createPopupManager, createToastManager, createToolTipManager, Icon} from "modules/ui-tools";
import {setAuthManager} from "./auth-manager.svelte.ts";
import {setConfig} from "./config-context.ts";
import type {ConfigOptions} from "./config-context.ts";
import {createEventManager} from "./event-manager.svelte.ts";
import {createListManager} from "./list-manager.svelte.ts";
import {createScreenManager} from "./screen-manager.svelte.ts";


export function createAdminContext(config:ConfigOptions){
	let eventManager = createEventManager()
	createListManager(eventManager)
	createScreenManager(eventManager)
	createDialogManager();
	createToastManager();
	createToolTipManager();
	createPopupManager();
	createDrawerManager();
	setConfig(config);
	setAuthManager(config.authManager);
	Icon.hasPro = config.fontawesomePro || false;
}