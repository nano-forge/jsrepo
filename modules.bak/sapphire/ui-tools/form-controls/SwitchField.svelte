<script lang="ts">
	import Switch from "./util/Switch.svelte";

	let {value = $bindable(), yes = "yes", no = "no"}: {
		value: boolean,
		yes?: string,
		no?: string
	} = $props();


</script>

<label>
	<Switch bind:value={value}/>
	<span class:selected={value}>{value ? yes : no}</span>
</label>

<style lang="scss">
	label {
		display: flex;
		gap: 5px;
		font-size: 12px;
		border: 1px solid #5593;
		border-radius: 30px;
		padding: 5px;
		//margin-bottom: 3px;
		cursor: pointer;
		transition: all .2s;
		background-color: #fff;
		color: #559;
		&:hover {
			background-color: #559c;
			color: #fff;
		}
		span {
			line-height: 18px;
			font-size: 12px;
			margin-left: 10px;
			opacity: 1;
			&.selected {
				font-weight: bold;
			}
		}
	}
</style>