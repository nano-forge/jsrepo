import Drawer from "./Drawer.svelte";
import {type Component, getContext, setContext} from "svelte";

type Drawer = {
	component: Component<any, any, any>,
	data: any,
	resolver: (result: any) => void
}

class DrawerManager {
	drawer: Drawer | undefined = $state(undefined);

	open(drawer: Component<any, any, any>, data?: any) {
		let resolver: (result: any) => void = () => {};
		let promise = new Promise((resolve) => { resolver = resolve;});
		this.drawer = {component: drawer, data: data, resolver};
		return promise;
	}
	close(result?: any) {
		this.drawer?.resolver(result)
		this.drawer = undefined;
	}
}

const KEY = Symbol();
export function setDrawerManager(manager: DrawerManager) { setContext(KEY, manager);}
export function getDrawerManager() { return getContext<DrawerManager>(KEY);}
export function createDrawerManager() {
	let manager = new DrawerManager();
	setDrawerManager(manager);
	return manager;
}