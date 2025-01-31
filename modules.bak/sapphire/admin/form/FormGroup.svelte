<script lang="ts">

	let {children, label, third, twoThird, half}:
		(
			{ third?: true, twoThird?: false, half?: false } |
			{ third?: false, twoThird?: true, half?: false } |
			{ third?: false, twoThird?: false, half?: true }
			) &
		{
			label?: any,
			children: any
		} = $props();

	let size = "full";
	if (third) size = "third";
	if (twoThird) size = "two-third";
	if (half) size = "half";

</script>
<main class="{size}">
	{#if label}
		<legend>
			{#if typeof label === "string"}
				{label}
			{:else}
				{@render label()}
			{/if}
		</legend>
	{/if}
	{@render children()}
</main>

<style lang="scss">
	main {
		flex-grow: 1;
		flex-shrink: 0;
		//gap: 10px;
		background-color: #5555990c;
		border-radius: 10px;
		&.full { flex-basis: 100%; background-color: transparent}
		&.half { flex-basis: calc(50% - 20px); min-width: 450px;}
		&.third { flex-basis: calc(33.333% - 20px); min-width: 300px; }
		&.two-third { flex-basis: calc(66.666% - 20px); min-width: 600px;}


		//background-color: #f0f0ff;
		//box-shadow: inset 0 -30px 30px -30px #fffa;
		//border-bottom: 1px solid #9A9AC833;

		//border-radius: 5px;
		//border: 1px solid #f0f0ff;
		//box-shadow: 0 0 10px rgba(0, 0, 0, .1);
		//margin-bottom: 20px;
		padding: 10px;
		legend {
			//border: 1px solid #f0f0ff;
			box-shadow: 0 0 10px rgba(0, 0, 0, .1);
			border-radius: 5px;
			background-color: #8b8bc5;
			padding: 5px 10px;
			color: white;
			font-size: 11px;
			font-weight: 800;
			text-transform: uppercase;
			margin: 0 0 10px 0;
		}
	}
</style>
