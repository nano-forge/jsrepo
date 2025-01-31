<script lang="ts">
	import type {Icon} from "./icon.ts";
	let {icon, ...rest}:{icon: Icon}=$props()
</script>

<i class={icon} style={icon.style} {...rest}></i>

