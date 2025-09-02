<script lang="ts">
	let count = $state(0);
	const increment = () => count++;
</script>

<button onclick={increment}>
	count is {count}
</button>

<style>
	button {
		font-family: inherit;
		font-size: 1.2em;
		font-weight: 700;
		padding: 0.5em 1em;
		color: var(--color-theme-1);
		background-color: rgba(255, 255, 255, 0.2);
		border-radius: 2em;
		border: 2px solid rgba(255, 255, 255, 0.2);
		cursor: pointer;
	}

	button:hover {
		border-color: var(--color-theme-1);
	}
</style>