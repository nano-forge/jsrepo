<script lang="ts">
	import type {AttachmentView} from "@nano-forge/hammer.common";
	import {cssVarsString} from "modules/ui-tools";
	import {innerHeight, innerWidth} from "svelte/reactivity/window";

	type Dimension = {
		width: number;
		height: number;
	};
	type Point = {
		x: number;
		y: number;
	};
	type Rect = Point & Dimension;

	let {metadata = $bindable(), file}: { metadata: Record<string, any>, file: AttachmentView } = $props();

	// let crop = $state(metadata.crop || {x: 0, y: 0, width: metadata.dim.width, height: metadata.dim.height});
	let focus = $state(metadata.focus);

	let img: { width: number, height: number, x: number, y: number, element: HTMLImageElement | null, ratio: number } = $state({
		width: 0,
		height: 0,
		x: 0,
		y: 0,
		ratio: 0,
		element: null
	})

	let rawPreviewRatio = $state(Math.log2(metadata.dim.width / metadata.dim.height));
	let previewRatio = $derived(2 ** rawPreviewRatio);
	let focusDisplay = $derived({
		top: focus.area.y * img.ratio,
		left: focus.area.x * img.ratio,
		width: focus.area.width * img.ratio,
		height: focus.area.height * img.ratio,
		x: focus.point.x * img.ratio,
		y: focus.point.y * img.ratio
	})
	let previewDisplay = $derived(cropCalc(metadata.dim, previewRatio, focus.area, focus.point))

	let moving: string | false = $state(false)
	let focusAreaMinSize = 200;

	fixFocus();

	$effect(() => {
		innerWidth.current;
		innerHeight.current;
		updateImg();
	})

	function updateImg() {
		img.height = img.element!.clientHeight;
		img.width = img.element!.clientWidth;
		img.x = img.element!.getBoundingClientRect().left;
		img.y = img.element!.getBoundingClientRect().top;
		img.ratio = img.width / metadata.dim.width;
	}

	function resizeWidth(offsetX: number) {
		focus.area.width = Math.min(Math.max((offsetX) / img.ratio - focus.area.x, focusAreaMinSize), metadata.dim.width - focus.area.x);
	}
	function resizeHeight(offsetY: number) {
		focus.area.height = Math.min(Math.max((offsetY) / img.ratio - focus.area.y, focusAreaMinSize), metadata.dim.height - focus.area.y);
	}
	function moveTop(offsetY: number, sizing = true) {
		let y = focus.area.y;
		let bottom = focus.area.y + focus.area.height;
		focus.area.y = offsetY / img.ratio;
		if (sizing){
			focus.area.y = Math.min(Math.max(focus.area.y, 0), bottom - focusAreaMinSize);
			focus.area.height += y - focus.area.y;
		}else{
			focus.area.y = Math.min(Math.max(focus.area.y, 0), metadata.dim.height - focus.area.height);
		}
	}
	function moveLeft(offsetX: number, sizing = true) {
		let x = focus.area.x;
		let right = focus.area.x + focus.area.width;
		focus.area.x = offsetX / img.ratio;
		if (sizing){
			focus.area.x = Math.min(Math.max(focus.area.x, 0), right - focusAreaMinSize);
			focus.area.width += x - focus.area.x;
		}else{
			focus.area.x = Math.min(Math.max(focus.area.x, 0), metadata.dim.width - focus.area.width);
		}
	}

	function fixFocus() {
		focus.point.x = Math.min(Math.max(focus.point.x, focus.area.x + focusAreaMinSize / 2), focus.area.x + focus.area.width - focusAreaMinSize / 2);
		focus.point.y = Math.min(Math.max(focus.point.y, focus.area.y + focusAreaMinSize / 2), focus.area.y + focus.area.height - focusAreaMinSize / 2);
		focus.point.x = Math.round(focus.point.x);
		focus.point.y = Math.round(focus.point.y);
		focus.area.width = Math.round(focus.area.width);
		focus.area.height = Math.round(focus.area.height);
		focus.area.x = Math.round(focus.area.x);
		focus.area.y = Math.round(focus.area.y);
		metadata.focus = focus;
	}

	function cropCalc(imgSize: Dimension, cropRatio: number, safeZone: Rect, focusPoint: Point): Rect {
		let horizontal = imgSize.height * cropRatio < imgSize.width;

		let cropArea: Dimension = {
			width: horizontal ? imgSize.height * cropRatio : imgSize.width,
			height: horizontal ? imgSize.height : imgSize.width / cropRatio
		}
		function get2DCrop(size: number, focus: number, crop: number, safe: [number, number]) {
			let optimal = focus - crop / 2;
			let d1 = safe[0] - optimal;
			let d2 = optimal + crop - (safe[0] + safe[1]);
			if (Math.sign(d1) !== Math.sign(d2)) optimal += Math.abs(d1) < Math.abs(d2) ? d1 : -d2;
			if (optimal < 0) optimal = 0;
			if (optimal + crop > size) optimal = size - crop;
			return optimal;
		}
		return {
			x: (horizontal ? get2DCrop(imgSize.width, focusPoint.x, cropArea.width, [safeZone.x, safeZone.width]) : 0) * img.ratio,
			y: (horizontal ? 0 : get2DCrop(imgSize.height, focusPoint.y, cropArea.height, [safeZone.y, safeZone.height]) * img.ratio),
			width: cropArea.width * img.ratio,
			height: cropArea.height * img.ratio
		}
	}

	function moveHandler(e: MouseEvent) {
		if (moving === false) return;

		let offsetX = e.clientX - img.x;
		let offsetY = e.clientY - img.y;

		switch (moving) {
			case "bottom-right":
				resizeWidth(offsetX)
				resizeHeight(offsetY)
				break;
			case "top-left":
				moveLeft(offsetX);
				moveTop(offsetY);
				break;
			case "top-right":
				resizeWidth(offsetX)
				moveTop(offsetY);
				break;
			case "bottom-left":
				moveLeft(offsetX);
				resizeHeight(offsetY)
				break;
			case "focus":
				focus.point.x = offsetX / img.ratio;
				focus.point.y = offsetY / img.ratio;
				break;
			case "move":
				moveLeft(offsetX - moveStartPosition.x, false)
				moveTop(offsetY - moveStartPosition.y, false)
				break;
		}
		fixFocus();
	}

	let moveStartPosition = {x: 0, y: 0};
	function startMove(e: MouseEvent) {
		moving = "move";
		let offsetX = e.clientX - img.x;
		let offsetY = e.clientY - img.y;
		moveStartPosition = {x: offsetX - focusDisplay.left, y: offsetY - focusDisplay.top};
		moveHandler(e);
	}
</script>

<svelte:window onmouseup={()=>moving=false} onmousemove={moveHandler}></svelte:window>
<main>
	<div
		class="editor"
		style={cssVarsString({
		"img-width": img.width,
		"img-height": img.height,

		"focus-top": focusDisplay.top,
		"focus-left": focusDisplay.left,
		"focus-width": focusDisplay.width,
		"focus-height": focusDisplay.height,
		"focus-x": focusDisplay.x,
		"focus-y": focusDisplay.y,

		"preview-left": previewDisplay.x,
		"preview-top": previewDisplay.y,
		"preview-width": previewDisplay.width,
		"preview-height": previewDisplay.height
	})}
	>


		<img class="no-pointer-events" bind:this={img.element} src={file.url} draggable="false" onload={updateImg}>
		<div class="crop-area no-pointer-events"></div>
		<div class="marker" onmousedown={startMove}>
			<div class="marker-mask"></div>
			<svg class="corner bottom-right" onmousedown={(e)=>{moving="bottom-right"; e.stopPropagation()}} width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
				<circle r="4" cx="10" cy="10" fill="red" stroke="black"/>
			</svg>
			<svg class="corner top-left" onmousedown={(e)=>{moving="top-left"; e.stopPropagation()}} width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
				<circle r="4" cx="10" cy="10" fill="red" stroke="black"/>
			</svg>
			<svg class="corner top-right" onmousedown={(e)=>{moving="top-right"; e.stopPropagation()}} width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
				<circle r="4" cx="10" cy="10" fill="red" stroke="black"/>
			</svg>
			<svg class="corner bottom-left" onmousedown={(e)=>{moving="bottom-left"; e.stopPropagation()}} width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
				<circle r="4" cx="10" cy="10" fill="red" stroke="black"/>
			</svg>
			<svg class="corner focus" onmousedown={(e)=>{moving="focus"; e.stopPropagation()}} width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
				<circle r="4" cx="10" cy="10" fill="red" stroke="black"/>
			</svg>
		</div>
	</div>

	<input type="range" min="-3" max="3" step="any" bind:value={rawPreviewRatio} style="width: 100%"><br>
</main>

<style lang="scss">

	main {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	div.editor { position: relative; margin: 20px;}
	.user-select-none { user-select: none;}
	.no-pointer-events { pointer-events: none;}
	.crop-area {
		top: 0;
		left: 0;
		width: var(--img-width);
		height: var(--img-height);
		position: absolute;
		border-style: solid;
		border-color: #000c;
		border-top-width: var(--preview-top);
		border-left-width: var(--preview-left);
		border-right-width: calc(var(--img-width) - var(--preview-width) - var(--preview-left));
		border-bottom-width: calc(var(--img-height) - var(--preview-height) - var(--preview-top));
	}
	.marker-mask {
		position: absolute;
		top: calc(0px - var(--focus-top));
		left: calc(0px - var(--focus-left));
		width: var(--img-width);
		height: var(--img-height);
		pointer-events: none;
		border-style: solid;
		border-color: #0005;
		border-top-width: var(--focus-top);
		border-left-width: var(--focus-left);
		border-right-width: calc(var(--img-width) - var(--focus-width) - var(--focus-left));
		border-bottom-width: calc(var(--img-height) - var(--focus-height) - var(--focus-top));
		opacity: 0;
		transition: opacity .2s;
	}


	.corner {
		filter: drop-shadow(0 0 2px #fff);
		position: absolute;
		width: 20px;
		height: 20px;
		&.focus {
			top: calc(var(--focus-y) - var(--focus-top) - 10px);
			left: calc(var(--focus-x) - var(--focus-left) - 10px);
			cursor: move;
		}
		&.bottom-right {
			right: -10px;
			bottom: -10px;
			cursor: nwse-resize;
		}
		&.top-right {
			right: -10px;
			top: -10px;
			cursor: nesw-resize;
		}
		&.bottom-left {
			left: -10px;
			bottom: -10px;
			cursor: nesw-resize;
		}
		&.top-left {
			cursor: nwse-resize;
			top: -10px;
			left: -10px;
		}
	}

	div.marker {
		border: 1px dashed #fffc;
		outline: 1px dashed #000c;
		position: absolute;
		border-radius: 5px;
		top: var(--focus-top);
		left: var(--focus-left);
		width: var(--focus-width);
		height: var(--focus-height);
		transition: box-shadow 0.2s;
		&:hover {
			box-shadow: 0 0 15px #0007;
			.marker-mask {
				opacity: 1;
			}
		}
	}

	img {
		max-height: 50vh;
		max-width: 50vw;
		user-select: none;
	}

	.rotating-border {
		width: max-content;
		background: linear-gradient(90deg, #000c 50%, #fffc 50%), linear-gradient(90deg, #000c 50%, #fffc 50%), linear-gradient(0deg, #000c 50%, #fff8 50%), linear-gradient(0deg, #000c 50%, #fffc 50%);
		background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
		background-size: 15px 2px, 15px 2px, 2px 15px, 2px 15px;
		padding: 1px;
		animation: border-dance 14s infinite linear;
	}

	@keyframes border-dance {
		0% {
			background-position: 0 0, 100% 100%, 0 100%, 100% 0;
		}
		100% {
			background-position: 100% 0, 0 100%, 0 0, 100% 100%;
		}
	}
</style>