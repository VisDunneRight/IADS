<script context="module">export const gatheringKey = {};
</script>

<script>import { setContext } from 'svelte';
setContext(gatheringKey, true);
</script>

<slot />
