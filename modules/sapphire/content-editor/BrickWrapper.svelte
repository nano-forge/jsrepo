<script lang="ts">
	import {createMapper} from "@nano-forge/util";
	import {dragHandle} from "svelte-dnd-action";
	import {CG_Select, getPopupManager, Icon} from "../ui-tools";
	import AddPopup from "./AddPopup.svelte";
	import {Brick} from "./content-manager.svelte";

	let {brick}: { brick: Brick } = $props();
	let Component = brick.brickDef.component;
	const contentManager = brick.contentManager;
	const popupManager = getPopupManager();

	async function add(brick: Brick, event: MouseEvent) {
		const res = await popupManager.open(AddPopup, {bank: contentManager.bank}, event);
		brick.insertAfter({value: res.defaultValue}, res.type);
	}
</script>


<main>
	<div class="main">
		<div class="handle">
			<i class={Icon.light("grip-dots")} use:dragHandle></i>
			<div>
				<i class={brick.brickDef.icon.with(Icon.FW)}></i>
				<b>{brick.brickDef.label}</b>
			</div>
			{#if brick.brickDef.modifiers}
				<CG_Select bind:value={brick.value.mod} options={createMapper(brick.brickDef.modifiers.join(',')).map} placeholder="Select a modifier"/>
			{/if}
			<i class={Icon.light("times")} class:button={true} onclick={()=>brick.remove()}></i>
		</div>
		<div class="content">
			<Component brick={brick}/>
		</div>
	</div>
	<div class="add" onclick={(event)=>add(brick, event)}>
		<i class={Icon.solid("plus")}></i>
	</div>
</main>

<style lang="scss">
	main {
		border-radius: 10px;
		position: relative;
		&:hover:not(#dnd-action-dragged-el) div.add {
			opacity: 1;
			left: -15px;
		}
		div.add {
			border: 2px solid #fff;
			z-index: 10;
			opacity: 0;
			left: -0px;
			bottom: -11px;
			position: absolute;
			width: 20px;
			height: 20px;
			border-radius: 100px 100px 0 100px;
			rotate: -45deg;
			background-color: #99d;
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: pointer;
			box-shadow: 0 5px 5px #5597;
			i {
				color: white;
				font-size: 10px;
				rotate: 45deg;
			}
			transition: all 0.5s;
			&:hover { background-color: #555599;}
		}

		div.main {
			background-color: #e5e5ff;
			border-radius: 6px;
			overflow: hidden;
			display: flex;
			align-items: stretch;
			flex-direction: column;
			div.content { padding: 5px;}
			div.handle {
				position: relative;
				background-color: #5592;
				color: #559;
				font-size: 12px;
				padding: 3px;
				display: flex;
				div {
					flex-grow: 1;
				}
				i {
					cursor: pointer;
					padding: 5px;
					border-radius: 3px;
					&.button:hover {
						background-color: #fff3;
						color: #000;
					}
				}
			}
		}
	}
</style>