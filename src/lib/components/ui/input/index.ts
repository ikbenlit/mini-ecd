import Input from "./input.svelte";
import type { HTMLInputAttributes } from "svelte/elements";

export interface InputProps extends HTMLInputAttributes {
	class?: string;
}

export {
	Input,
	type InputProps
};