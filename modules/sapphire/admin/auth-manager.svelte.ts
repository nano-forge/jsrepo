import {getContext, setContext} from "svelte";

export interface AuthManagerInterface {
	signIn(...args: any[]): Promise<boolean>;
	whoAmI(): Promise<void>;
	signOut(): Promise<void>;
	hasRole(role: string): Promise<boolean>;
	readonly isSignedIn: boolean;
	readonly user: any;
}

export abstract class AbstractAuthManager implements AuthManagerInterface {
	protected signedInUser: any = $state(undefined);

	get isSignedIn() { return this.signedInUser !== undefined;}
	get user() { return this.signedInUser;}

	abstract signIn(...args: any[]): Promise<boolean>;
	abstract whoAmI(): Promise<void>;
	abstract signOut(): Promise<void>;
	abstract hasRole(role: string): Promise<boolean>;
}

const AUTH_KEY = Symbol("AUTH_KEY");
export function setAuthManager(authManager: AuthManagerInterface) {setContext(AUTH_KEY, authManager);}
export function getAuthManager() { return getContext<AuthManagerInterface>(AUTH_KEY);}