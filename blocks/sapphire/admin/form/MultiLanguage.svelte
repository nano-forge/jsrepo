<script lang="ts">

	import FormGroup from "./FormGroup.svelte";
	import type {Snippet} from "svelte";

	let {
		children,
		languages,
		label
	}: {
		children: Snippet<[string]>
		label?: any
		languages: string[],
	} = $props();

	let inLabel: any = label;
	let selectedLang: string = $state(languages[0]);
</script>

<FormGroup>
	{#snippet label()}
		<div>
			{#if inLabel}
				<span>
					{#if typeof inLabel === "string"}
						{inLabel}
					{:else}
						{@render inLabel()}
					{/if}
				</span>
			{/if}
			{#each languages as lang}
				<button onclick={()=>selectedLang = lang} class:selected={selectedLang===lang}>{lang}</button>
			{/each}
		</div>
	{/snippet}
	{@render children(selectedLang)}
</FormGroup>

<style lang="scss">
	div {
		display: flex;
		gap: 5px;
		align-items: center;
		span {
			flex-grow: 1;
		}
		button {
			font-size: 11px;
			background-color: #3e3e8e;
			border-radius: 3px;
			border: none;
			cursor: pointer;
			color: #8b8bc5;
			padding: 3px 10px;
			&.selected {
				color: white;
				font-weight: 600;
			}
		}
	}
</style>
