export class Multiselect {
	protected selected: Array<any> = $state([])
	protected idField: string;
	protected list: Array<any>;
	constructor(list: Array<any>, idField: string) {
		this.list = list;
		this.idField = idField;
	}

	isSelected(id: any) {return this.selected.includes(id) ? this.selected.length : 0}

	updateList(list: Array<any>) {
		this.list = list;
		this.reset();
	}

	reset() { this.selected = [];}

	getSelectedList() { return this.list.filter((item: any) => this.selected.includes(item[this.idField])); }

	select(event: MouseEvent, id?: any) {
		event.stopPropagation();
		if (!id) {
			this.selected = [];
			return;
		}

		if (event.ctrlKey || event.metaKey) {
			if (!this.selected.includes(id)) this.selected.push(id);
			else this.selected = this.selected.filter((f) => f !== id);
		} else if (event.shiftKey && this.selected.length) {
			let lastSelected = this.selected[this.selected.length - 1];
			if (lastSelected === id) return;
			let inRange = false;

			for (let item of this.list) {
				if (item[this.idField] === lastSelected || item[this.idField] === id) {
					inRange = !inRange;
					if (!this.selected.includes(item[this.idField])) this.selected.push(item[this.idField]);
				}
				if (inRange && !this.selected.includes(item[this.idField])) {
					this.selected.push(item[this.idField]);
				}
			}
		} else {
			this.selected = [id];
		}
	}
}