<script>
// @ts-nocheck

	import Clipboard from 'svelte-clipboard';

	import PaperDetail from './paperDetail.svelte';

    import { Wrapper } from '@smui/tooltip';
    import { urlParams } from '../urlParamStore';
	import { Card, Button, Toggle, Badge, Modal } from 'flowbite-svelte';
	import {  LinkSolid, CopySolid, LockOpenSolid, LockSolid} from 'flowbite-svelte-icons';
	import {onMount } from 'svelte';
    import { Media } from '@smui/card';
	

	export let paper;
	export let summaryView;
	export let detailView;
	export let meta;
	let menu;
	let snackbarWithClose;

	// let urlParams = new URLSearchParams(window.location.search); 
	let params;
	urlParams.subscribe((value) => {
		params = value;
	});
    
	
	let modalState = false;
	
	
	onMount(() => {
		if (params.get('paper') == paper.DOI){
			modalState = true;
			window.history.replaceState(null, null, '?paper=' + paper.DOI);
		} 
	});

	$: if (!modalState){
		window.history.replaceState(null, null, '/');
	} else {
		window.history.replaceState(null, null, '?paper=' + paper.DOI);
	} 
		
</script>




	<Modal title="Paper Details" size='lg' id='modal'  bind:open={modalState} outsideclose>
		<PaperDetail {paper} {detailView} {meta} />
	</Modal>


	<Card on:click={() => {modalState = true; window.history.replaceState(null, null, '?paper=' + paper.DOI);}} class="w-max m-1 relative dark:bg-[#212125] dark:border-slate-800 dark:shadow-xl" padding="none">
	<Media class="card-media-16x9" aspectRatio="16x9" style="background-image: url(/images/{paper.img}); height: 200px" />
		<h5 class="pl-1 pt-1 pr-1 text-md font-bold tracking-tight text-white">{paper.Name}</h5>
		<p class="pl-1 mb-14 font-normal text-gray-400 leading-tight">{paper.Year}</p>
		<div style="position: absolute; bottom: 0; width: 100%; display:flex; justify-content: space-between; align-items: center;">
			<div>
				<Badge class='ml-0.5' rounded>{paper.Opportunity}</Badge>
				<Badge class='ml-0'  rounded>{paper["Contribution Type"]}</Badge>
			</div>
			<div>
				<Button on:click={(event) => {event.stopPropagation(); window.open('https://doi.org/' + paper.DOI);}} outline={true} size='xs' pill={true} class="!p-2 mb-2 mr-0.5 border-0"><LinkSolid class="w-4 h-4" /></Button>
				{#if paper["Open Access"] == "na"}
				<Button disabled outline={true} size='xs' pill={true} class="!p-2 mb-2  mr-0.5 border-0"><LockSolid class="w-4 h-4" /></Button>
				{:else}
				<Button on:click={(event) => {event.stopPropagation(); window.open(paper['Open Access']);}} outline={true} size='xs' pill={true} class="!p-2 mb-2  mr-0.5 border-0"><LockOpenSolid class="w-4 h-4" /></Button>
				{/if}
					<Clipboard
					text={paper.Bibtex}
					let:copy
					on:copy={() => {
						snackbarWithClose.open();
					}}>
					
					<Button on:click={(event) => {event.stopPropagation(); copy;}} outline={true} size='xs' pill={true} class="!p-2 mb-2  mr-1 border-0"><CopySolid class="w-4 h-4" /></Button>
				</Clipboard>
			
			</div>
    	</div>
	</Card>
	


			 
	

<style>
	
	.multi-select {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-wrap: wrap;
		align-content: flex-start;
	}
	.close-button {
		position: absolute;
		top: 0px;
		right: 0px;
	}
	* :global(.card-image) {
		width: 400px;
		margin: 4px;
	}
	* :global(.card-text) {
		margin: 10px;
	}

	* :global(.card-media-16x9) {
    	background-image: url(https://placehold.co/320x180?text=16x9);
  	}
</style>

