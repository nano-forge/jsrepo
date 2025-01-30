<script lang="ts">
	import {getDialogManager} from "./dialog-manager.svelte.js";

	let {title, children, buttons, closeable = true, onCloseData}: { title?: string, children?: any, buttons?: any, closeable?: boolean, onCloseData?: any } = $props();

	let dialogManager = getDialogManager();

</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions, a11y_no_noninteractive_element_interactions -->
<div class="wrapper" onclick={()=>closeable && dialogManager.close(onCloseData)}>
	<main onclick={e=>e.stopPropagation()}>
		{#if title}
			<header>
				<span>{title}</span>
				{#if closeable}
					<i class="close fa-fw fas fa-times" onclick={() => dialogManager.close(onCloseData)}></i>
				{/if}
			</header>
		{/if}
		<article onclick={e=>e.stopPropagation()}>
			{#if children}
				{@render children()}
			{/if}
		</article>
		{#if buttons}
			<footer onclick={e=>e.stopPropagation()}>
				{@render buttons()}
			</footer>
		{/if}
	</main>
</div>

<style lang="scss">
	@use "../mixins" as *;
	$var-scope: dialog;

	.wrapper {
		position: fixed;
		top: 10px;
		left: 10px;
		right: 10px;
		bottom: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: v(z-index, 9000);
	}
	main {
		min-width: v(min-width, 400px);
		max-height: 100%;
		background-color: transparent;
		padding: 0;
		border: 0;
		outline: 0;
		transform: scale(1);
		opacity: 1;
		transition: all .3s;
		border-radius: 10px;
		box-shadow: v(shadow, 0 0 20px rgba(0, 0, 0, .4));

		display: flex;
		flex-direction: column;
		overflow: hidden;

		header {
			background-color: v(header-bg-color, #99D);
			font-size: 16px;
			font-weight: 300;
			text-align: left;
			display: flex;
			border-bottom: 1px solid v(header-bottom-border-color, #0002);
			padding: 5px 20px;

			span {
				font-size: 14px;
				color: v(header-color, #FFF);
				font-weight: 400;
				flex-grow: 1;
				align-self: center;
			}
			i.close {
				align-self: center;
				cursor: pointer;
				font-size: 16px;
				color: v(header-close-icon-color, #FFF);
				padding: 10px;
				transition: all .3s;
				opacity: .6;
				&:hover {
					opacity: 1;
				}
			}
		}
		article {
			background: v(body-bg-color, #FFF);
			font-weight: 300;
			font-size: 14px;
			flex-grow: 1;
			overflow: auto;
			position: relative;
		}
		footer {
			color: v(footer-color, #FFF);
			font-size: 16px;
			font-weight: 300;
			text-align: right;
			display: flex;
			border-top: 1px solid v(footer-top-border-color, #ddf);

			:global(button) {
				flex-grow: 1;
				padding: 15px 10px;
				background-color: v(footer-button-bg-color, #FFF);
				color: v(footer-button-color, #337);
				text-transform: v(footer-button-text-transform, uppercase);
				letter-spacing: .5px;
				font-weight: 600;
				font-size: 11px;
				outline: none;
				border: none;
				cursor: pointer;
				transition: all .3s;
				&:not(:last-child) {
					border-right: 1px solid v(footer-button-separator-color, #ddf);
				}
				&:hover {
					background-color: v(footer-button-hover-bg-color, #337);
					color: v(footer-button-hover-color, #EEE);
				}
			}
		}
	}


</style>