<!--@internal-->
<script lang="ts">
	import type {Snippet} from "svelte";
	import {slide} from "svelte/transition";
	import {ZodError, type ZodType} from "zod";


	let {
		children,
		Info,
		label,
		value,
		zod,
		noBorder = false,
		column = false
	}:
		{
			column?: boolean
			children: Snippet
			Info?: Snippet | string
			label?: string
			zod?: ZodType<any>
			value?: any
			noBorder?: boolean,
		} = $props();

	const orientation = column ? "column" : "row";

	let valid: boolean = $state(true);

	let messages: string[] = $state([]);

	$effect(() => {
		if (zod) {
			try {
				valid = zod.parse(value);
				messages = [];
			} catch (e) {
				if (e instanceof ZodError) {
					messages = e.errors.map((error) => error.message);
					valid = false;
				}
			}
		}
	});
</script>

<main class:no-border={noBorder} class:invalid={!valid} data-orientation={orientation} class:row={orientation==="row"} class:column={orientation === "column"}>
	{#if label}
		<div class="label">
			{label}
		</div>
	{/if}
	<div class="control">
		{@render children()}
		{#if Info}
			<p class="info">
				{#if typeof Info === "string"}
					{Info}
				{:else}
					{@render Info()}
				{/if}
			</p>
		{/if}
		{#each messages as message (message)}
			<p transition:slide class="message">
				{message}
			</p>
		{/each}
	</div>
</main>
<!--<hr>-->

<style lang="scss">
	$label-width: var(--label-width, 100px);
	main {
		border: 1px solid transparent;
		transition: all .2s;
		display: flex;
		gap: 5px;

		padding: 10px 0;
		border-bottom: 1px dotted #5593;
		border-radius: 0;


		div.label {
			padding: 5px 0;
			font-size: 12px;
			border-radius: 3px;
			align-self: flex-start;
			font-weight: bold;
			color: #6a6a8d;
		}
		&.column {
			flex-direction: column;
			div.label { min-width: $label-width;}
		}
		&.row {
			flex-direction: row;
			div.label {
				width: $label-width;
				flex-shrink: 0;
			}
		}
		div.control {flex-grow: 1;}
		//&:hover { background-color: #f0f0ff;}
		&.invalid div.label {
			color: red;
		}
		p.info {
			font-size: 11px;
			padding: 0;
			margin: 5px 0;
			color: #6a6a8d;
		}
		p.message {
			font-size: 11px;
			padding: 0;
			margin: 5px 0;
			color: red;
			&:before {
				content: "- "
			}
		}
		&:last-child, &.no-border {
			border-bottom: 0;
		}
	}
</style>