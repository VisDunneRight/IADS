<script>
  import {Pane, Splitpanes} from 'svelte-splitpanes';
	import IconButton from '@smui/icon-button';
	import PaperCard from './components/paperCard.svelte';
	import FilterPanel from './filterPanel.svelte';
	import SearchField from './components/searchField.svelte';
	import Timeline from './components/timeline.svelte';
  import Header from "./header.svelte";
  import Vis from "./vis.svelte";
	import structure from './data/survey-config.json';
	import dataMeta from './data/survey-data.json';
	import AddEntry from './components/addEntry.svelte';
	import { filters, categoryFilters, timeFilters } from './filterStore';
	import { onMount } from 'svelte';


	
	import { Alert } from 'flowbite-svelte';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, ImagePlaceholder, Skeleton, TextPlaceholder } from 'flowbite-svelte';
	import { Modal, Drawer, Button, CloseButton, Sidebar, SidebarBrand, SidebarCta, SidebarDropdownItem, SidebarDropdownWrapper, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
  import { sineIn } from 'svelte/easing';
  import { FilterSolid } from 'flowbite-svelte-icons';
  import flatten from 'lodash/flatten';
  import loFilter from 'lodash/filter';
  import difference from 'lodash/difference';
  import Fuse from 'fuse.js'

	let innerHeight = 0;
	let innerWidth = 0;

	let showImg = false;
	let showVis = true;
	//let filteredData = [];
	let meta = {};
	let freq = {};
	let filteredFreq = {};
	let selectTopics = [];
	let filter = {
		searchWord: '',
		yearRange: [-1, -1]
	};

	//Restructuring parts of the data passed in
	dataMeta.meta.forEach((prop) => {
		meta[prop.name] = prop;
	});

	let filterBy = structure.filterBy;
	filterBy.forEach((prop) => {
		if(prop.values){
			if (prop.name in meta && meta[prop.name].type === 'MultiSelect'){
				prop.selected = [];
			}
		} else {
			prop.categories.forEach((option) => {
				if (option.name in meta && meta[option.name].type === 'MultiSelect'){
					option.selected = [];
				}
			})
		}
		 
	});
	addMissingValues();

	function freqCount(prop, arrValue, freqDict) {
		if (prop in meta && meta[prop].type === 'MultiSelect') {
			if (arrValue.length == 1 && arrValue[0] === '') {
				return;
			}
			arrValue.forEach((value) => {
				if (prop in freq) {
					freqDict[prop][value] ? freqDict[prop][value]++ : (freqDict[prop][value] = 1);
				} else {
					freqDict[prop] = {};
					freqDict[prop][value] = 1;
				}
			});
		}
	}

	dataMeta.data.forEach((paper) => {
		Object.entries(paper).forEach(([prop, arrValue]) => {
			freqCount(prop, arrValue, freq);
		});
		paper['categories'] = flatten(Object.values(paper))
		paper['selected'] = false;
	});
	function addMissingValues(){
		filterBy.forEach((group)=>{
			if("groupName" in group){
				group['categories'].forEach((cate)=>{
					if(!("values" in cate)){
						const topics = new Set();
						dataMeta.data.forEach((paper) => {
							if(cate['name'] in paper){
								paper[cate['name']].forEach((word)=>{
									topics.add(word);
								});
							}
						});
						cate['values'] = [...topics]
					}
				})

			} else {
				if(!("values" in group)){
					const topics = new Set();
					dataMeta.data.forEach((paper) => {
						if(group['name'] in paper){
							paper[group['name']].forEach((word)=>{
								topics.add(word);
							});
						}
					});
					group['values'] = [...topics]
				}
			}
		});
	}


	function setVis() {
		showVis = !showVis;
	}

	function updateSearchResults(search) {
		filter.searchWord = search.detail.text;
		//applyFilters();
	}
	function updateTimeRange(ranges) {
		filter.yearRange[0] = ranges.detail.start;
		filter.yearRange[1] = ranges.detail.end;
		//applyFilters();
	}


  let transitionParams = {
    x: -320,
    duration: 10,
    easing: sineIn
  };

  $: condition = innerWidth < 800;

  let navHeight;
  let sidebarWidth;
  let open = true;



  $: {
	if (condition === true){
		sidebarWidth = 0;
	} else {
		sidebarWidth = 320
	} 

	}

	$: drawer = open && condition
	
	let scrollingModal = false;

  	let detailView = structure.detailView.show;
  
  	let filteredData = dataMeta.data;
  
	console.log(Object.keys(dataMeta.data[0]))

	const fuse = new Fuse(dataMeta.data, {
		keys: Object.keys(dataMeta.data[0])
	})

	let filtersStore = filters.subscribe((value) => {
		if (value.searchFilters.length >= 2){
			filteredData = fuse.search(value.searchFilters).map((n) => n.item);
		} else {
			filteredData = dataMeta.data
		}
		filteredData = loFilter(filteredData, function(o) {return o.Year >= value.timeFilters.start && o.Year <= value.timeFilters.end });
		if (value.categoryFilters.length !== 0){
			filteredData = loFilter(filteredData, function(o) {return difference(value.categoryFilters, o.categories).length === 0});
		}
	});
	

</script>

<svelte:window bind:innerHeight bind:innerWidth />

<Navbar bind:clientHeight={navHeight}  fluid=true navDivClass="mx-0 flex justify-between" navClass=" px-2 sm:px-4 py-2.5 sticky top-0 z-20" let:hidden let:toggle>
	{#if condition}
	<Button class="!p-2" on:click={() => open = !open}><FilterSolid class="w-5 h-5" /></Button>
	{/if}
	<NavBrand href="/">
	<!-- <img src="/images/flowbite-svelte-icon-logo.svg" class="mr-3 h-6 sm:h-9" alt="Flowbite Logo" /> -->
	<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">IADesign.Space</span>
	</NavBrand>
	<Button size='sm' on:click={() => (scrollingModal = true)} >Contribute</Button>
</Navbar>

	<AddEntry {detailView} {freq} addEntryInfo={structure.topView.addEntry} bind:scrollingModal={scrollingModal}/>



	<Drawer transitionType="fly" transitionParams={transitionParams} leftOffset='top-[{navHeight}px]' width='[{sidebarWidth}px]' activateClickOutside={false} backdrop={false}  divClass='z-20 overflow-y-auto bg-white dark:bg-gray-800' bind:hidden={drawer} id="sidebar2">
	<Sidebar asideClass="fixed w-80 overflow-x-scroll h-screen">
		<SidebarWrapper divCass="max-h-10 w-full">
		  <SidebarGroup>
			
				<div class="num-papers">
					<div class="mdc-typography--headline6">Number of papers:</div>
					<div class="mdc-typography--headline6">{filteredData.length}/{dataMeta.data.length}</div>
				</div>
			
				<SearchField on:message={updateSearchResults} />
	
				<Timeline {filteredData} data={dataMeta.data} on:message={updateTimeRange} />
			<FilterPanel {filterBy} {freq} {filteredFreq} {selectTopics} />
		  </SidebarGroup>
		</SidebarWrapper>
	  </Sidebar>
  </Drawer>


<Splitpanes  theme="default-theme" style="width: {innerWidth - sidebarWidth - 17}px; margin-left: {sidebarWidth}px">
	<Pane>
		<div class="card-container">
			{#each filteredData as paper}
				<PaperCard
					{paper}
					summaryView={structure.summaryView}
					detailView={structure.detailView}
					{meta}
				/>
			{/each}
		</div>
		{#if !showVis}
			<div class="hide-button">
				<IconButton class="material-icons" on:click={setVis}
					>keyboard_double_arrow_left</IconButton
				>
			</div>
		{/if}
	</Pane >
	{#if showVis}
		<Pane size={30}>
			
			<div class="show-button">
				<IconButton class="material-icons" on:click={setVis}>
					keyboard_double_arrow_right
				</IconButton>
			</div>
				<Vis data={filteredData} filterBy={filterBy}/>
		</Pane>
	{/if}
</Splitpanes>


<style>
	.card-container {
		background-color: rgb(240, 240, 240);
		padding-right: 0px;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-evenly;
		overflow-x: hidden;
	}

	.show-button {
		position: fixed;
		top: 80px;
		z-index: 1;
	}
	.hide-button {
		position: fixed;
		right: 0px;
		top: 80px;
	}
	.num-papers {
		padding: 15px 15px;
		display: flex;
		justify-content: space-between;
	}
	.demo-cell {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 10px;
		border: 1px;
		border-style: solid;
		border-color: var(--mdc-theme-secondary, #333);
		color: var(--mdc-theme-secondary, rgb(15, 9, 9));
	}
</style>
