<script lang="ts">
	let {page, pages, onChange, count}: { page: number, pages: number, count?: number, onChange: (page: number) => void } = $props();
</script>
<main>
	<div class="pager">
		<button onclick={()=>onChange(page-1)} disabled={page === 0}><i class="fa-fw fas fa-chevron-left"></i></button>
		<div>
			<div class="range">
				<input disabled={pages===1} type="range" min="0" max={pages-1} bind:value={page} onchange={()=>onChange(page)}>
			</div>
			<div class="info">
				{page + 1} of {pages}
				{#if count !== undefined}
					({count} items)
				{/if}
			</div>
		</div>
		<button onclick={()=>onChange(page+1)} disabled={page === pages -1}><i class="fa-fw fas fa-chevron-right"></i></button>
	</div>
	<div class="info">

	</div>
</main>

<style lang="scss">

	@use "../mixins" as *;
	$var-scope: pager;

	main {
		padding: 5px 0;
		div.pager {
			display: flex;
			gap: 10px;
			div {
				flex-grow: 1;
				div.range {
					background-color: v(range-bg-color, #FFF);
					border-radius: 15px;
					padding: 3px;
					input {
						cursor: pointer;
						appearance: none;
						display: flex;
						padding: 0;
						width: 100%;
						margin: 0;
						&::-webkit-slider-runnable-track {
							border-radius: 2rem;
							height: 10px;
						}
						&::-webkit-slider-thumb {
							-webkit-appearance: none;
							background: v(range-thumb-color, #448);
							width: 15px;
							height: 10px;
							border-radius: 10px;
							&:hover {
								background: v(range-thumb-hover-color, #F90);
							}
						}
						&:disabled {
							opacity: v(range-disabled-opacity, 0.4);
						}
					}
				}
				div.info {
					margin-top: 5px;
					width: 100%;
					text-align: center;
					font-size: 12px;
				}
			}
			button {
				border: none;
				outline: none;
				background-color: v(button-bg-color , #448);
				color: v(button-color, white);
				border-radius: 5px;
				padding: 5px 10px;
				cursor: pointer;
				transition: all .2s;
				&:not(:disabled):hover {
					background-color: v(button-hover-bg-color, #66A);
					color: v(button-hover-color, white);
				}
				&:disabled {
					opacity: v(button-disabled-opacity, 0.4);
					cursor: not-allowed;
				}
			}
		}
	}
</style>