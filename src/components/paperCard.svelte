<script>

	import {
		Content,
		PrimaryAction,
		Media,
		MediaContent,
		Actions,
		ActionButtons,
		ActionIcons
	} from '@smui/card';
	import Snackbar, {  Label } from '@smui/snackbar';
	import IconButton from '@smui/icon-button';

	import  { Icon } from '@smui/button';
	import List, { Item, Separator, Text } from '@smui/list';
	import  { Text } from '@smui/list';
	import Clipboard from 'svelte-clipboard';
	
    import { Wrapper } from '@smui/tooltip';
    import Chip, { Set} from '@smui/chips';
    import { urlParams } from '../urlParamStore';

	import { Card, Button, Toggle, Badge, Modal } from 'flowbite-svelte';
  import { ArrowRightOutline, LinkSolid, CopySolid, LockOpenSolid, LockSolid} from 'flowbite-svelte-icons';
  import { tree } from 'd3';
  import { afterUpdate, beforeUpdate, onMount } from 'svelte';

	

	export let paper;
	export let summaryView;
	export let detailView;
	export let meta;
	

	let snackbarWithClose;

	// let urlParams = new URLSearchParams(window.location.search); 
	let params;
	urlParams.subscribe((value) => {
		params = value;
	});

    
	
	
	
	let modal;
	
	
	let modalState = false;
	


	
	onMount(() => {
		if (params.get('paper') == paper.DOI){
			modalState = true;
			window.history.replaceState(null, null, '?paper=' + paper.DOI);
		} 
	});

	$: if (!modalState){
		console.log('remove')
		window.history.replaceState(null, null, '/');
	} else {
		window.history.replaceState(null, null, '?paper=' + paper.DOI);
	} 
		
</script>


</script>


	<!-- <Snackbar bind:this={snackbarWithClose}>

		<Label>Copied bibtex.</Label>
		<Actions>
			<IconButton class="material-icons" title="Dismiss">close</IconButton>
		</Actions>
	</Snackbar>

	<Dialog bind:open  aria-describedby="sheet-content" style="z-index:20"  on:SMUIDialog:closed={() => { window.history.replaceState(null, null, '/')}}>
		<Content id="sheet-content">
			<PaperDetail {paper} {detailView} {meta} />
			<div class="close-button">
				<IconButton on:click={() => {window.history.replaceState(null, null, '/');} } class="material-icons">close</IconButton>
			</div>
		</Content>
	</Dialog> -->


	<!-- <Button on:click={() => (defaultModal = true)}>Default modal</Button> -->
	
	<Modal size='lg' bind:this={modal} id='modal' title="Terms of Service" bind:open={modalState} outsideclose>
		<PaperDetail {paper} {detailView} {meta} />
	<!-- <svelte:fragment slot="footer">
			<Button on:click={() => alert('Handle "success"')}>I accept</Button>
			<Button color="alternative">Decline</Button>
		</svelte:fragment> -->
	</Modal>

	<Card on:click={() => {modalState = true; window.history.replaceState(null, null, '?paper=' + paper.DOI);}} class="w-full m-1 relative" padding="none">
	<Media class="card-media-16x9" aspectRatio="16x9" style="background-image: url(/images/{paper.img}); height: 200px" />
		<h5 class="pl-1 pt-1 pr-1 text-md font-bold tracking-tight text-gray-900 dark:text-white">{paper.Name}</h5>
		<p class="pl-1 mb-14 font-normal text-gray-700 dark:text-gray-400 leading-tight">{paper.Year}</p>
		<div style="position: absolute; bottom: 0; width: 100%; display:flex; justify-content: space-between; align-items: center;">
			<div>
				<Badge class='m-1' color='dark' rounded>{paper.Opportunity}</Badge>
				<Badge class='m-1' color='dark' rounded>{paper.Contribution}</Badge>
			</div>
			<div>
				<Button on:click={() => window.open('https://doi.org/' + paper.DOI)} outline={true} size='xs' pill={true} class="!p-2 mb-2 mr-0.5 border-0"><LinkSolid class="w-4 h-4" /></Button>
				{#if paper["Open Access"] == "na"}
				<Button disabled outline={true} size='xs' pill={true} class="!p-2 mb-2  mr-0.5 border-0"><LockSolid class="w-4 h-4" /></Button>
				{:else}
				<Button on:click={() => window.open(paper['Open Access'])} outline={true} size='xs' pill={true} class="!p-2 mb-2  mr-0.5 border-0"><LockOpenSolid class="w-4 h-4" /></Button>
				{/if}
				<Wrapper>
					<Clipboard
					text={paper.Bibtex}
					let:copy
					on:copy={() => {
						snackbarWithClose.open();
					}}>
					<Button on:click={copy} outline={true} size='xs' pill={true} class="!p-2 mb-2  mr-1 border-0"><CopySolid class="w-4 h-4" /></Button>
				</Clipboard>
				</Wrapper>
			</div>
    	</div>
	

	</Card>


		<PrimaryAction on:click={() => {window.history.replaceState(null, null, '?paper=' + paper.DOI);}}>
		  	<Media class="card-media-16x9" aspectRatio="16x9" style="background-image: url(/images/{paper.img}); height: 200px" />
			<Content class="mdc-typography--body2">
			<h2 class="mdc-typography--headline6" style="margin: 0; font-size: 15px; line-height: 18px; ">
				{paper.Name}
			</h2>
			<h3
				class="mdc-typography--subtitle2"
				style="margin: 0 0 10px; color: #888;"
			>
				{paper.Year}
			</h3>
				{				  
					paper.Authors
				}
			</Content>
		</PrimaryAction>
		
				<Actions >
				 <ActionButtons style="position: absolute; bottom: 0;">
				<Set chips={[paper.Opportunity, paper["Contribution Type"]]} let:chip nonInteractive>
					<Chip {chip}>
						<Text>{chip}</Text>
					</Chip>
					</Set>
				  </ActionButtons>
				  <ActionIcons style="position: absolute; bottom: 0; right: 0">
					<Wrapper>
					<IconButton
					  class="material-icons"
					  on:click={() => window.open('https://doi.org/' + paper.DOI)}>
					  link
					</IconButton> -->
					<!-- <Tooltip  xPos="center" yPos="above">Digital Library Link</Tooltip> -->
					<!-- </Wrapper>
					<Wrapper>
					{#if paper["Open Access"] == "na"}
					<IconButton
						disabled
						class="material-icons"
						on:click>
						lock
					</IconButton>
					{:else}
					<IconButton
						class="material-icons"
						on:click={() => window.open(paper['Open Access'])}>
						lock_open
					</IconButton>
					{/if} -->
					<!-- <Tooltip  xPos="center" yPos="above">Open Access Link</Tooltip> -->
					<!-- </Wrapper>
					<Wrapper>
						<Clipboard
						text={paper.Bibtex}
						let:copy
						on:copy={() => {
							snackbarWithClose.open();
						}}>
					<IconButton
						class="material-icons"
						on:click={copy}>
						content_copy

					</IconButton>
					 -->

					<!-- <Tooltip  xPos="center" yPos="above">Copy BibTex</Tooltip> -->
				<!-- </Clipboard>
					</Wrapper> -->
					<!-- <Wrapper>
						<IconButton
							class="material-icons"
							on:click={() => clicked++}>
							edit
						</IconButton>
						<Tooltip  xPos="center" yPos="above">Tooltip.</Tooltip>
					</Wrapper> -->
					<!-- <IconButton
					  class="material-icons"
					  on:click={() => menu.setOpen(true)}
					  title="More options">more_vert
					  <Menu bind:this={menu}>
						<List>
							<Clipboard
										text={paper.Bibtex}
										let:copy
										on:copy={() => {
											snackbarWithClose.open();
										}}
									>
								<Item on:SMUI:action={copy}>
								<Icon class="material-icons">download</Icon>
								<Text>BibTex</Text>
								</Item>
							</Clipboard>
							<Item on:SMUI:action={() => console.log("work in progress")}>
								<Text>Update Entry</Text>
							</Item>
						</List>
					</Menu>
					</IconButton> -->
				  <!-- </ActionIcons>
				</Actions>
			  </Card> -->

			 
	
	<!-- <Card class={summaryView.view === "image" ? 'card-image' : 'card-text'} style="width: 400px; height: 400px; flex-grow: 1; margin: 10px">
		<PrimaryAction on:click={() => (open = true)}>
			{#if summaryView.showImg} -->
				<!-- <Media class="card-media-square" aspectRatio="square" src={paper.img ? paper.img : "/images/defaultImage.png"} /> -->
			<!-- {/if}
			<Content class="mdc-typography--body5" style={"display:flex"}>
				{#if summaryView.showImg}
					<div style={"padding-right:10px"}>
							<img src={paper.image ? paper.image : "/images/defaultImage.png"} 
									width="200" height=200
									alt={paper.altImage ? paper.altImage: "Image from the paper"}
									/>
					</div>
				{/if}
				<div>
					<h2 class="mdc-typography--headline6" style="margin: 0;">{paper.Name} ({paper.Year})</h2>
					<h3 class="mdc-typography--subtitle2" style="margin: 0 0 10px; color: #888;">
						by {paper.Authors}
					</h3>
					{#each summaryView.show as prop}
						{#if meta[prop].type === 'String'}
							<div class="string-select">
								<div class="mdc-typography--body1"><strong>{prop}:&nbsp;</strong></div>
								<div class="mdc-typography--body1">{paper[prop]}</div>
							</div>
						{:else if meta[prop].type === 'MultiSelect'}
							<div class="multi-select">
								<div class="mdc-typography--body1"><strong>{prop}:</strong></div>
								{#if paper[prop].length > 0 && paper[prop][0] !== ''}
									<Multiselect list={paper[prop]} />
								{/if}
							</div>
						{/if}
					{/each}
				</div>
			</Content>
		</PrimaryAction>
		<div style={"z-index:2;"}>
			<Actions style="padding-left:15px"> -->
				<!-- Added by: Tarik Crnovrsanin. -->
				<!-- <ActionButtons> -->
					<!-- <Button on:click={() => clicked++}>
						<Label>new Window</Label>
					</Button> -->
				<!-- </ActionButtons>
				<ActionIcons>
					<div class="menu-loc">
						<IconButton class="material-icons" 
							on:click={() => menu.setOpen(true)} title="More options"
							>more_vert</IconButton
						>
						<Menu bind:this={menu}>
							<List>
								<Clipboard
											text={paper.Bibtex}
											let:copy
											on:copy={() => {
												snackbarWithClose.open();
											}}
										>
									<Item on:SMUI:action={copy}>
									<Icon class="material-icons">download</Icon>
									<Text>BibTex</Text>
									</Item>
								</Clipboard>
								<Item on:SMUI:action={() => console.log("work in progress")}>
									<Text>Update Entry</Text>
								</Item>
							</List>
						</Menu>
					</div>
				</ActionIcons>
			</Actions>
		</div>
	</Card> --> 

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
