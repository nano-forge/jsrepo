<script lang="ts">
	let {errors}: { errors: Record<string, Array<{ message: string }>> | undefined } = $props();
	import {Icon} from "../../ui-tools";
	import {slide} from "svelte/transition";

	let open: boolean = $state(true);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions, a11y_no_noninteractive_element_interactions -->
{#if errors}
	<main transition:slide>
		<div class="details">
			{#if open}
				<div class="errors">
					{#each Object.entries(errors) as [field, messages]}
						<div>
							<b>{field}</b>:
							{#each messages as message}{message.message}{/each}
						</div>
					{/each}
				</div>
			{:else }
				<div class="errors">
					Errors ({Object.keys(errors).length})
				</div>
			{/if}
			<button><i class={open ? Icon.light("times").class : Icon.light("chevron-left").class} onclick={()=>open = !open}></i></button>
		</div>
	</main>
{/if}

<style lang="scss">
	main {
		color: orangered;
		font-size: 12px;
		background-color: #337;
		div.details {
			margin: 0 10px 10px 10px;
			padding: 10px;
			border-radius: 5px;
			background-color: white;
			display: flex;
			flex-direction: row;
			div.errors {
				flex-grow: 1;
			}
			button {
				align-self: flex-start;
				background-color: transparent;
				border: none;
				cursor: pointer;
			}
		}
	}
</style>