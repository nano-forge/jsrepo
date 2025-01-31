<script lang="ts">
	let {value = $bindable(), type = "select", onChange = () => {}}: { value: boolean, type?: "on-off" | "select", onChange?: () => void } = $props();
</script>

<label>
	<input type="checkbox" bind:checked={value} onchange={()=>onChange()}>
	<main class={type}>
		<div class="dot-wrapper">
			<div class="dot"></div>
		</div>
	</main>
</label>


<style lang="scss">
	$switch-height: 18px;
	$switch-width: calc($switch-height * 2);
	input { display: none;}
	input:checked + main .dot-wrapper {
		transform: translateX(100%);
	}
	input:not(:checked) + main .dot-wrapper {
		transform: translateX(0%);
	}

	input:not(:checked) + main.on-off { background-color: #f43;}
	input:not(:checked) + main.select { background-color: #ccf;}

	label {
		display: inline;
		width: auto;
	}
	main {
		box-shadow: inset 2px 2px 7px 0px rgba(0, 0, 0, 0.3);
		cursor: pointer;
		display: flex;
		width: $switch-width;
		height: $switch-height;
		border-radius: 15px;
		transition: background-color .6s;
		align-items: center;
		&.on-off { background-color: #5b5;}
		&.select { background-color: #559;}

		.dot-wrapper {
			padding: 4px;
			width: $switch-height;
			height: $switch-height;
			transition: all .2s;
			.dot {
				width: 100%;
				height: 100%;
				border-radius: 100%;
				background-color: #fff;
				box-shadow: 2px 2px 7px 0px rgba(0, 0, 0, 0.3);
			}
		}

	}
</style>