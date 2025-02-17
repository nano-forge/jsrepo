<script lang="ts">

	import {createMapper, type MapperInput} from "../mapper";
	import Switch from "./util/Switch.svelte";

	type Option = { key: string, label: string, selected: boolean };

	let {value = $bindable(), options, columns = false, radio = false}:
		({ value: string, radio: true } | { value: string[], radio?: false }) &
		{ options: MapperInput, columns?: boolean } = $props();


	options = createMapper(options).map as Map<string, string>;

	let values: Option[] = $state([])

	Array.from(options.entries() as [string, string][]).forEach(([key, label]: [string, string]) => {
		values.push({ key, label, selected: value.includes(key) });
	});

	function changed(option: Option) {
		if (option.selected && radio) {
			values.forEach(v => v.selected = v.key === option.key);
		}
	}

	$effect(() => {
		let selectedValues = values.filter(v => v.selected).map(v => v.key);
		value = radio ? selectedValues[0] : selectedValues;
	})
</script>

<main class:columns>
	{#each values as option}
		<label>
			<Switch bind:value={option.selected} onChange={()=>changed(option)}></Switch>
			<span class:selected={option.selected}>{option.label}</span>
		</label>
	{/each}
</main>

<style lang="scss">

	main.columns {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 3px;
		label {
			border: 1px solid #5593;
			border-radius: 30px;
		}
	}
	main:not(.columns) {
		//border: 1px dotted #5596;
		border-radius: 11px;
		overflow: hidden;
		label:not(:last-child) {
			border-bottom: 1px dotted #5593;
		}
	}
	label {
		padding: 5px;
		//margin-bottom: 3px;
		display: flex;
		cursor: pointer;
		transition: all .2s;
		background-color: #fff;
		color: #555599;
		&:hover {
			background-color: #559c;
			color: #fff;
		}
		span {
			line-height: 18px;
			font-size: 12px;
			margin-left: 10px;
			opacity: .6;
			&.selected {
				opacity: 1;
				font-weight: bold;
			}
		}
	}
</style>
