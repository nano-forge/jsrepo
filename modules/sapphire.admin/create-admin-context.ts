import {createDialogManager,  createPopupManager, createToastManager, createToolTipManager, Icon} from "@nano-forge/ui-tools";
import {setAuthManager} from "./auth-manager.svelte";
import {setConfig} from "./config-context";
import type {ConfigOptions} from "./config-context";
import {createDrawerManager} from "./drawer/drawer-manager.svelte";
import {createEventManager} from "./event-manager.svelte";
import {createListManager} from "./list-manager.svelte";
import {createScreenManager} from "./screen-manager.svelte";


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