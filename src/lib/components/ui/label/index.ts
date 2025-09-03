import Label from "./label.svelte";
import { tv, type VariantProps } from "tailwind-variants";
import type { HTMLLabelAttributes } from "svelte/elements";

const labelVariants = tv({
	base: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
});

export interface LabelProps extends HTMLLabelAttributes {
	class?: string;
}

export {
	Label,
	labelVariants,
	type LabelProps
};