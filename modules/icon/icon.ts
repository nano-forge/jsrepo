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

type Opacity = 0 | 0.05 | 0.1 | 0.15 | 0.2 | 0.25 | 0.3 | 0.35 | 0.4 | 0.45 | 0.5 | 0.55 | 0.6 | 0.65 | 0.7 | 0.75 | 0.8 | 0.85 | 0.9 | 0.95 | 1;

export class Icon {

	[key: string]: any;

	static hasPro = true;
	static colors: Record<string, string> & { primary: string, secondary: string, success: string, danger: string, warning: string, info: string, light: string, dark: string } = {
		primary: "#007bff",
		secondary: "#6c757d",
		success: "#28a745",
		danger: "#dc3545",
		warning: "#ffc107",
		info: "#17a2b8",
		light: "#f8f9fa",
		dark: "#343a40"
	}

	#styles: Record<string, string> = {}

	private constructor(family: string, icon: string, sharp: boolean) {
		icon = icon.startsWith("fa-") ? icon : "fa-" + icon;
		this[icon] = true;
		this["fa-" + family] = true;
	}

	private static create(
		family: string,
		icon: string,
		fallbackFamily: string,
		fallbackIcon: string,
		sharp: boolean = false
	) {
		return Icon.hasPro ? new Icon(family, icon, sharp) : new Icon(fallbackFamily, fallbackIcon, false);
	}

	static solid(icon: string, fallback?: string) { return Icon.create("solid", icon, "solid", fallback || icon, false);}
	static regular(icon: string, fallback?: string) { return Icon.create("regular", icon, "regular", fallback || icon, false);}
	static light(icon: string, fallback?: string) { return Icon.create("light", icon, "regular", fallback || icon, false);}
	static thin(icon: string, fallback?: string) { return Icon.create("thin", icon, "regular", fallback || icon, false);}
	static brands(icon: string) { return Icon.create("brands", icon, "brands", icon, false);}
	static file(filename: string, type: "solid" | "regular" | "light" | "thin") {
		const ext = filename.split(".").pop()!.toLowerCase();
		if (ext === undefined || !extensions.hasOwnProperty(ext)) return Icon[type]("fa-file");
		return Icon[type](extensions[ext]);
	}

	sharp() {
		if (Icon.hasPro) {
			if (this["fa-duotone"]) {
				this["fa-duotone"] = false;
				this["fa-sharp-duotone"] = true;
			} else {
				this["fa-sharp"] = true;
			}
		}
		return this;
	}
	duoTone(options: { swap?: boolean, secondaryOpacity?: Opacity, primaryOpacity?: Opacity, primaryColor?: string, secondaryColor?: string } = {}) {
		if (Icon.hasPro) {
			if (this["fa-sharp"]) {
				this["fa-sharp"] = false;
				this["fa-sharp-duotone"] = true;
			} else {
				this["fa-duotone"] = true;
			}
			if (options.swap) this["fa-duotone-swap"] = true;
			if (options.secondaryOpacity) this.#styles["--fa-secondary-opacity"] = options.secondaryOpacity.toString();
			if (options.primaryOpacity) this.#styles["--fa-primary-opacity"] = options.primaryOpacity.toString();
			if (options.primaryColor) {
				if (Icon.colors.hasOwnProperty(options.primaryColor)) options.primaryColor = Icon.colors[options.primaryColor as keyof typeof Icon.colors];
				this.#styles["--fa-primary-color"] = options.primaryColor;
			}
			if (options.secondaryColor) {
				if (Icon.colors.hasOwnProperty(options.secondaryColor)) options.secondaryColor = Icon.colors[options.secondaryColor as keyof typeof Icon.colors];
				this.#styles["--fa-secondary-color"] = options.secondaryColor;
			}
		}
		return this;
	}

	fw() {
		this["fa-fw"] = true;
		return this;
	}

	anim = {
		beat: () => {
			this["fa-beat"] = true;
			return this;
		},
		fade: () => {
			this["fa-fade"] = true;
			return this;
		},
		beatFade: () => {
			this["fa-beat-fade"] = true;
			return this;
		},
		bounce: () => {
			this["fa-bounce"] = true;
			return this;
		},
		flip: () => {
			this["fa-flip"] = true;
			return this;
		},
		shake: () => {
			this["fa-shake"] = true;
			return this;
		},
		spin: () => {
			this["fa-spin"] = true;
			return this;
		},
		pulse: () => {
			this["fa-spin-pulse"] = true;
			return this;
		},
		reverse: () => {
			this["fa-spin-reverse"] = true;
			return this;
		}
	}

	mirror = {
		horizontal: () => {
			this["fa-mirror-horizontal"] = true;
			return this;
		},
		vertical: () => {
			this["fa-mirror-vertical"] = true;
			return this;
		}
	}

	rotate(angle: number) {
		this["fa-rotate-by"] = true;
		this.#styles["--fa-rotate-angle"] = `${angle}deg`;
		return this;
	}


	size = {
		s: () => {
			this["fa-sm"] = true;
			return this;
		},
		xs: () => {
			this["fa-xs"] = true;
			return this;
		},
		xxs: () => {
			this["fa-2xs"] = true;
			return this;
		},
		l: () => {
			this["fa-lg"] = true;
			return this;
		},
		xl: () => {
			this["fa-xl"] = true;
			return this;
		},
		xxl: () => {
			this["fa-2xl"] = true;
			return this;
		}
	}


	color = {
		primary: () => {
			this.#styles.color = Icon.colors.primary;
			return this;
		},
		secondary: () => {
			this.#styles.color = Icon.colors.secondary;
			return this;
		},
		success: () => {
			this.#styles.color = Icon.colors.success;
			return this;
		},
		danger: () => {
			this.#styles.color = Icon.colors.danger;
			return this;
		},
		warning: () => {
			this.#styles.color = Icon.colors.warning;
			return this;
		},
		info: () => {
			this.#styles.color = Icon.colors.info;
			return this;
		},
		light: () => {
			this.#styles.color = Icon.colors.light;
			return this;
		},
		dark: () => {
			this.#styles.color = Icon.colors.dark;
			return this;
		},
		custom: (color: string) => {
			if (Icon.colors.hasOwnProperty(color)) color = Icon.colors[color as keyof typeof Icon.colors];
			this.#styles.color = color;
			return this;
		}
	}

	with(...classes: Array<string>) {
		classes.forEach((cls) => this[cls] = true);
		return this;
	}

	get style(): string { return Object.entries(this.#styles).map(([key, value]) => `${key}:${value}`).join(";");}

}

