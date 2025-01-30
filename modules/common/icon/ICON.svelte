<script lang="ts">
	let {icon, ...rest}:{icon: Icon}=$props()
</script>

<i class={icon} style={icon.style} {...rest}></i>

