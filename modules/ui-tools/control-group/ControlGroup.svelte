<script lang="ts">

	import type {Snippet} from "svelte";

	let {
		children,
		small = false,
		light = false
	}: {
		children: Snippet<[]>,
		small?: boolean,
		light?: boolean
	} = $props();


</script>
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions, a11y_no_noninteractive_element_interactions -->
<main class:small class:light class="control-group">
	{@render children()}
</main>
<style lang="scss">
	@use "../mixins" as *;

	$var-scope: control-group-dark;
	main {
		@include set-var(background-color, v(background-color, #226));
		@include set-var(border-color, v(border-color, #FFF2));
		@include set-var(button-hover-bg-color, v(button-hover-bg-color, #004));
		@include set-var(button-pressed-bg-color, var(--uitool--control-group-pressed-bg-color, #004));
		@include set-var(button-default-color, v(button-default-color, #FFF));
		@include set-var(input-color, v(input-color, #aae));
		@include set-var(input-placeholder-color, v(input-placeholder-color, #AAEB));
		@include set-var(input-disabled-color, v(input-placeholder-color, #aaed));


		background-color: var(--background-color);
		overflow: hidden;
		border: 1px solid var(--border-color);
		border-radius: 10px;
		display: flex;
		&.small { border-radius: 5px; height: 29px;}
		&.small { --isSmall: 1; --isLarge: 0;}
		&:not(.small) { --isLarge: 1; --isSmall: 0;}
	}

	$var-scope: control-group-light;
	main.light {
		@include set-var(background-color, v(background-color, #fff));
		@include set-var(border-color, v(border-color, #2264));
		@include set-var(button-hover-bg-color, v(button-hover-bg-color, #aae));
		@include set-var(button-pressed-bg-color, v(pressed-bg-color, #99d));
		@include set-var(button-default-color, v(button-default-color, #448));
		@include set-var(input-color, v(input-color, #448));
		@include set-var(input-placeholder-color, v(input-placeholder-color, #448b));
		@include set-var(input-disabled-color, v(input-placeholder-color, #448d));
	}
</style>