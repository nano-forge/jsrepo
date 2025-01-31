<script lang="ts">
	let {label, onDelete}: {
		label: string,
		onDelete: () => void} = $props();
</script>

<section>
	<span>{label}</span>
	<i class="fa-fw fa-solid fa-xmark" onclick={()=>onDelete()}></i>
</section>

<style lang="scss">
	section {
		height: 24px;
		overflow: hidden;
		display: flex;
		align-items: stretch;
		cursor: pointer;
		background-color: #fff;
		border: 1px solid #5598;
		color: #559;
		border-radius: 4px 18px 18px 4px;
		font-size: 12px;
		margin-bottom: 4px;
		&:not(:last-child) {
			margin-right: 4px;
		}
		span {
			padding: 0 8px 0 8px;
			line-height: 22px;
		}
		i {
			line-height: 22px;
			padding-right: 3px;
			text-align: center;
			width: 24px;
			font-size: 12px;
			border-left: 1px dashed #5595;
			transition: all .2s;
			background-color: #5591;
			&:hover {
				background-color: #559;
				color: white;
			}
		}
	}
</style>