import {getContext, setContext} from "svelte";
import type {AuthManagerInterface} from "./auth-manager.svelte";

let defaultConfig = {
	listSize: 50,
	fontawesomePro: false,
	immersiveMode: "always",
}

export type ConfigOptions = {
	apiErrorClass: any,
	authManager: AuthManagerInterface,
	listSize?: number,
	fontawesomePro?: boolean,
	immersiveMode?: "always" | "never" | "auto"
} & Record<string, any>;

type Config = {
	apiErrorClass: any,
	authManager: AuthManagerInterface,
	listSize: number,
	fontawesomePro: boolean,
	immersiveMode: "always" | "never" | "auto",
} & Record<string, any>;


const key = Symbol("CONFIG")
export function setConfig(config: ConfigOptions) {
	setContext(key, {...defaultConfig, ...config})
}
export function getConfig() {
	let c = getContext<Config>(key)
	if (!c) throw new Error(`Could not find config: ${String(key)}`);
	return c;
}