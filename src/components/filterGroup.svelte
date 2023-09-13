<script>
	import Chip, { Set, Text } from '@smui/chips';
	import { afterUpdate, createEventDispatcher } from 'svelte';
	import Button, { Label } from '@smui/button';
	import { onMount } from 'svelte';
	import { Header, Content } from '@smui-extra/accordion';
	import { filters, categoryFilters } from '../filterStore';
	import difference from 'lodash/difference';
	const dispatch = createEventDispatcher();

	export let name;
	export let selected;
	export let values;
	export let freqGroup;
	

	let listVal = [];
	const sShowCount = 10;
	let showCount = 10;
	let listSelected = [''];

	//listVal = values;
	

	const updateShowCount = (newCount) => {
		const temp = values.sort((a, b) => {
			return freqGroup[b] - freqGroup[a];
		});
		if (newCount > 0) {
			showCount = newCount;
		} else {
			showCount = sShowCount;
		}
		const data = values.slice(0, showCount);
		return freqGroup;
	};

	const updateSelection = (selected) => {
		const re = new RegExp("([0-9]+)")
		
		listSelected.forEach((sel) => {
			let res = re.test(sel) ? sel.split(') ')[1]: sel;
			if(!selected.includes(res))
				selected.push(res)
		});
		
		dispatch('message', { text: selected });
	};
	// function updateSelectedList(selected){
	// 	return [...selected];
	// }
	listSelected = [...selected];

	onMount(async () => {
		listVal = updateShowCount(showCount);
	});

	selected = $filters.categoryFilters
	
</script>

<Header>
	<div class="sizing">
		<div>
			{name}
				<span style="color:gray">
					({$filters.categoryFilters.length - difference($filters.categoryFilters, values).length   })
				</span>
		</div>
	</div>
</Header>

<Content>
	<Set chips={values} let:chip filter 
				bind:selected={$filters.categoryFilters}>
		<Chip {chip} touch>
			<Text>{chip} ({listVal[chip]})</Text>
		</Chip>
	</Set>
	<div>
		{#if showCount > sShowCount}
			<Button on:click={() => updateShowCount(showCount - 10)}>
				<Label>see less</Label>
			</Button>
		{/if}
		{#if showCount <= values.length}
			<Button on:click={() => updateShowCount(showCount + 10)}>
				<Label>see more</Label>
			</Button>
		{/if}
	</div>
</Content>

<style>
	.sizing {
		/* font-size: 10px !important; */
		font-weight: bold !important;
		white-space: normal !important;
	}
</style>
