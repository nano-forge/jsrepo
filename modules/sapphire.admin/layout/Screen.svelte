<script lang="ts">
	import {Screen, setScreen} from "../screen.svelte";

	let {screen}: { screen: Screen } = $props();
	setScreen(screen)

	let Component = screen.screenType.component

</script>

<main data-component="Screen" hidden={!screen.selected}>
	<Component/>
</main>

<style lang="scss">
	main {height: 100%; overflow: hidden;border-radius: 10px;}
</style>
