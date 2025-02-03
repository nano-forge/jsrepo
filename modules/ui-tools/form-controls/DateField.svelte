<script lang="ts">

	import {Icon} from "../icon";
	import {tooltip} from "../tooltip/tooltip-action.svelte";

	let {value = $bindable()}: {
		value: string | undefined,
	} = $props();


	const pad = (n: number) => n.toString().padStart(2, "0");
	function formatDate(d: string | undefined) {
		if (!d) return undefined;
		const date = new Date(d);
		return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
	}

	function onInput(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		value = (e.target as HTMLInputElement).value;
	}
	function resetValue() {
		value = undefined;
	}

	function setCurrentDate() {
		let now = new Date();
		value = now.toISOString().split('T')[0];
	}
</script>
<main>
	<input type="date" value={formatDate(value)} oninput={onInput}/>
	<button use:tooltip={"Unset"} class="reset" onclick={resetValue}><i class={Icon.solid("times").with(Icon.FW).class}></i></button>
	<button use:tooltip={"Today"} class="date-now" onclick={setCurrentDate}><i class={Icon.regular("calendar-day").with(Icon.FW).class}></i></button>
</main>

<style lang="scss">
	@use "mixins" as *;
	main {
		display: flex;
		gap: 5px;
	}
	input {
		@include input;
		position: relative;
		flex-grow: 1;
		&::-webkit-calendar-picker-indicator {
			position: absolute;
			right: 0;
			width: 100%;
			height: 100%;
			margin: 0;
			padding: 0;
			opacity: 0;
			cursor: pointer;
		}
	}
	button { @include button;}

</style>