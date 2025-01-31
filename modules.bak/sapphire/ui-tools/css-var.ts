export function cssVar(node: HTMLElement, vars: Record<string, string | number> = {}) {
	Object.keys(vars).forEach(key => node.style.setProperty(`--${key}`, typeof vars[key] === "number" ? vars[key] + "px" : vars[key]))
}

export function cssVarsString(vars: Record<string, string | number> = {}) {
	let result = ""
	Object.keys(vars).forEach(key => { result += `--${key}:` + (typeof vars[key] === "number" ? vars[key] + "px" : `${vars[key]}`) + ";"});
	return result;
}