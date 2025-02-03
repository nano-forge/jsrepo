<script lang="ts">
	import {getToastManager} from "./toast-manager.svelte";
	import {blur, slide} from "svelte/transition";

	let toastManager = getToastManager();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions, a11y_no_noninteractive_element_interactions -->
<main>
	{#each toastManager.toasts as toast (toast.id)}
		<article in:slide out:blur class={toast.type} onclick={()=>toastManager.close(toast.id)}>
			{#if toast.icon}<i class={toast.icon.toString()}></i>{/if}
			<div>
				<b>{toast.title}</b>
				{toast.details}
			</div>
		</article>
	{/each}
</main>

<style lang="scss">
	@use "../mixins" as *;
	$var-scope: tooltip;

	main {
		z-index: v(z-index, 9999);
		position: fixed;
		bottom: 10px;
		right: 10px;
	}
	article {
		cursor: pointer;
		border: 1px solid v(border-color, #0004);
		border-radius: 5px;
		margin: 10px;
		width: 320px;
		box-shadow: v(shadow, 4px 4px 4px rgba(0, 0, 0, .5));
		display: flex;
		font-size: 11px;
		font-weight: 300;
		&.info { background-color: v(info-bg-color, #49e); color: v(info-text-color, #FFF);
			i {color: v(info-icon-color, #fff);background-color: v(info-icon-bg-color, #0001);}
		}
		&.success { background-color: v(success-bg-color, #5b5); color: v(success-text-color, #FFF);
			i { color: v(success-icon-color, #fff);background-color: v(success-icon-bg-color, #0001);}
		}
		&.warning { background-color: v(warning-bg-color, #f90); color: v(warning-text-color, #FFF);
			i { color: v(warning-icon-color, #fff);background-color: v(warning-icon-bg-color, #0001);}
		}
		&.error { background-color: v(error-bg-color, #f43);color: v(error-text-color, #FFF);
			i { color: v(error-icon-color, #fff);background-color: v(error-icon-bg-color, #0001);}
		}

		i {
			padding: 10px;
			justify-self: stretch;
			font-size: 20px;
		}
		div {
			align-self: center;
			padding: 10px;
			b {
				display: block;
				font-size: 12px;
			}
		}
	}
</style>