import type {ToString} from "@nano-forge/util";

type Fallback = { icon?: string, family: "regular" | "solid" };

export type IconType = ToString<Icon>

export class Icon {
	public colorStyle: string | undefined = undefined;
	public rotateStyle: string | undefined = undefined;

	static hasPro: boolean = true;
	private withClasses: string | undefined;

	static FW = "fa-fw";
	static ANIM_BEAT = "fa-beat";
	static ANIM_FADE = "fa-fade";
	static ANIM_BEAT_FADE = "fa-beat-fade";
	static ANIM_BOUNCE = "fa-bounce";
	static ANIM_FLIP = "fa-flip";
	static ANIM_SHAKE = "fa-shake";
	static ANIM_SPIN = "fa-spin";
	static ANIM_PULSE = "fa-spin-pulse";
	static ANIM_REVERSE = "fa-spin-reverse";

	static sharp() {
		return {
			solid(icon: string) {return new Icon("solid", icon, true) as ToString<Icon>;},
			regular(icon: string) {return new Icon("regular", icon, true) as ToString<Icon>;},
			light(icon: string, fallback: Fallback = {icon: undefined, family: "regular"}) {return new Icon("light", icon, true, fallback) as ToString<Icon>;},
			thin(icon: string, fallback: Fallback = {icon: undefined, family: "regular"}) {return new Icon("thin", icon, true, fallback) as ToString<Icon>;}
		};
	}
	static forFile(filename: string, type: "solid" | "regular" | "light" | "thin" | "duotone" = "solid", sharp: boolean = false): ToString<Icon> {
		const ext = filename.split(".").pop()!.toLowerCase();
		if (ext === undefined || !extensions.hasOwnProperty(ext)) return new Icon(type, "fa-file", sharp) as ToString<Icon>
		return new Icon(type, extensions[ext], sharp) as ToString<Icon>
	}

	/**
	 * Create a fallback solid icon
	 * @param icon The icon to use as a fallback if the icon is undefined it will use the icon already set
	 */
	static fallbackSolid(icon?: string): Fallback { return {icon, family: "regular"}}
	/**
	 * Create a fallback solid icon
	 * @param icon The icon to use as a fallback if the icon is undefined it will use the icon already set
	 */
	static fallbackRegular(icon?: string): Fallback { return {icon, family: "regular"}}

	static solid(icon: string, fallback: Fallback = {icon: undefined, family: "solid"}) {return new Icon("solid", icon, false, fallback) as ToString<Icon>;}
	static regular(icon: string, fallback: Fallback = {icon: undefined, family: "regular"}) {return new Icon("regular", icon, false, fallback) as ToString<Icon>;}
	static light(icon: string, fallback: Fallback = {icon: undefined, family: "regular"}) {return new Icon("light", icon, false, fallback) as ToString<Icon>;}
	static thin(icon: string, fallback: Fallback = {icon: undefined, family: "regular"}) {return new Icon("thin", icon, false, fallback) as ToString<Icon>;}
	static duotone(icon: string, fallback: Fallback = {icon: undefined, family: "regular"}) {return new Icon("duotone", icon, false, fallback) as ToString<Icon>;}
	static brands(icon: string, fallback: Fallback = {icon: undefined, family: "regular"}) {return new Icon("brands", icon, false, fallback) as ToString<Icon>;}

	constructor(readonly family: string, readonly icon: string, readonly sharp: boolean = false, readonly fallback: Fallback = {icon: undefined, family: "regular"}) {}


	toString(): string {
		let icon: Array<string> = [];
		if (Icon.hasPro) {
			icon.push(this.icon.startsWith("fa-") ? this.icon : "fa-" + this.icon);
			if (this.sharp) icon.push("fa-sharp");
			icon.push("fa-" + this.family);
		} else {
			if (this.fallback.icon) icon.push(this.fallback.icon.startsWith("fa-") ? this.fallback.icon : "fa-" + this.fallback.icon);
			else icon.push(this.icon.startsWith("fa-") ? this.icon : "fa-" + this.icon);
			icon.push("fa-" + this.fallback.family);
		}
		if (this.withClasses) icon.push(this.withClasses);
		if (this.rotateStyle) icon.push("fa-rotate-by");
		return icon.join(" ");
	}
	with(...classes: Array<string>) {
		if (this.withClasses === undefined) this.withClasses = "";
		this.withClasses += classes.join(" ");
		return this as unknown as ToString<Icon>;
	}
	color(color?: string) {
		if (!color) this.colorStyle = "";
		else this.colorStyle = `color:${color};`;
		return this as unknown as ToString<Icon>;
	}
	rotate(angle: number | string) {
		let _angle: string;
		if (typeof angle === "number") _angle = `${angle}deg`;
		else _angle = angle;

		this.rotateStyle = `--fa-rotate-angle: ${_angle};`;
		return this as unknown as ToString<Icon>;
	}

	get class(): string {
		return this.toString();
	}

	get style(): string {
		return `${this.colorStyle || ""}${this.rotateStyle || ""}`
	}
}


const icons = {
	image: 'fa-file-image',
	pdf: 'fa-file-pdf',
	word: 'fa-file-word',
	powerpoint: 'fa-file-powerpoint',
	excel: 'fa-file-excel',
	csv: 'fa-file-csv',
	audio: 'fa-file-audio',
	video: 'fa-file-video',
	archive: 'fa-file-archive',
	code: 'fa-file-code',
	text: 'fa-file-alt',
	file: 'fa-file'
}
const extensions: Record<string, string> = {
	gif: icons.image,
	jpeg: icons.image,
	jpg: icons.image,
	png: icons.image,

	pdf: icons.pdf,

	doc: icons.word,
	docx: icons.word,

	ppt: icons.powerpoint,
	pptx: icons.powerpoint,

	xls: icons.excel,
	xlsx: icons.excel,

	csv: icons.csv,

	aac: icons.audio,
	mp3: icons.audio,
	ogg: icons.audio,

	avi: icons.video,
	flv: icons.video,
	mkv: icons.video,
	mp4: icons.video,

	gz: icons.archive,
	zip: icons.archive,

	css: icons.code,
	html: icons.code,
	js: icons.code,

	txt: icons.text
}