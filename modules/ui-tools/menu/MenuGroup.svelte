<script lang="ts">
	let {children, sub, open}: {
		children: any,
		sub?: boolean,
		open?: boolean
	} = $props();
	sub = sub ?? false;
	open = open ?? false;
</script>

<main class:sub class:open>
	<div style="display: flex;flex-direction: column;">
		{@render children()}
	</div>
</main>

<style lang="scss">
	@use "../mixins" as *;
	$var-scope: menu;

	main {
		display: grid;
		padding-left: 20px;
		position: relative;
		grid-template-rows: 0fr;
		transition: all .3s;
		&.sub {
			&:before {
				position: absolute;
				content: "";
				top: 5px;
				bottom: 5px;
				left: 10px;
				width: 5px;
				border-radius: 3px;
				background-color: v(submenu-marker-color, #FFF2);
			}
		}
		&:not(.sub) { padding: 10px; }
		&.open { grid-template-rows: 1fr;}
		div { overflow: hidden;}
	}
</style>