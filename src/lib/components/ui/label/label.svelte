<script lang="ts">
	import { tv } from "tailwind-variants";
	import { cn } from "$lib/utils";
	import type { HTMLLabelAttributes } from "svelte/elements";

	interface $$Props extends HTMLLabelAttributes {
		class?: string;
	}

	const labelVariants = tv({
		base: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
	});

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<label
	class={cn(labelVariants(), className)}
	{...$$restProps}
	on:mousedown
>
	<slot />
</label>