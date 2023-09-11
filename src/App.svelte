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

	import { beforeUpdate, onMount } from 'svelte';
    import { urlParams } from './urlParamStore';

	
	import { Alert } from 'flowbite-svelte';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, ImagePlaceholder, Skeleton, TextPlaceholder } from 'flowbite-svelte';
	import { Modal, Drawer, Button, CloseButton, Sidebar, SidebarBrand, SidebarCta, SidebarDropdownItem, SidebarDropdownWrapper, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
  import { sineIn } from 'svelte/easing';
  import { FilterSolid } from 'flowbite-svelte-icons';


	let innerHeight = 0;
	let innerWidth = 0;

	let showImg = false;
	let showVis = true;
	let filteredData = [];
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

	onMount(async () => {
		applyFilters();
	});

	function applyFilters() {
		console.log("ApplyFilters:", filterBy);
		//This is a shallow copy, we only interested in the order
		let startingPoint = [...dataMeta.data];

		//Filter by search bar
		if (filter.searchWord !== '') {
			startingPoint = startingPoint.filter((paper) =>
				paper.Name.toLowerCase().includes(filter.searchWord.toLowerCase())
			);
		}
		if (filter.yearRange[0] > 0)
			startingPoint = startingPoint.filter(
				(paper) => filter.yearRange[0] <= +paper.Year && +paper.Year <= filter.yearRange[1]
			);

			const re = new RegExp("([0-9]+)")
		//Filter by categories
		filterBy.forEach((group) => {
			if(group.values){
				if (group.selected && group.selected.length > 0) {
					const selected = group.selected.map((sel) => {
						return re.test(sel) ? sel.split(') ')[1]: sel;
					});
					let res = [];
					startingPoint.forEach((paper) => {
						let found = false;
						if (Array.isArray(paper[group.name])) {
							const listCate = paper[group.name];
							found = true;
							selected.forEach((prop) => {
								if (listCate.includes(prop) === false) {
									found = false;
									return;
								}
							});
						} else if (typeof paper[group.name] === 'string') {
							found = selected.includes(paper[group.name]);
						}

						if (found) {
							res.push(paper);
						}
					});
					startingPoint = res;
				}
			} else {
				group.categories.forEach((option)=>{
					if (option.selected && option.selected.length > 0) {
					const selected = option.selected.map((sel) => {
						return re.test(sel) ? sel.split(') ')[1]: sel;
					});
					let res = [];
					startingPoint.forEach((paper) => {
						let found = false;
						if (Array.isArray(paper[option.name])) {
							const listCate = paper[option.name];
							found = true;
							selected.forEach((prop) => {
								if (listCate.includes(prop) === false) {
									found = false;
									return;
								}
							});
						} else if (typeof paper[option.name] === 'string') {
							found = selected.includes(paper[option.name]);
						}
						if (found) {
							res.push(paper);
						}
					});
					startingPoint = res;
				}
				})
			}
		});
		Object.entries(startingPoint).forEach(([prop, arrValue]) => {
			freqCount(prop, arrValue, filteredFreq);
		});
		filteredData = startingPoint.sort((p1, p2) => {
			if(Number(p1.Year) < Number(p2.Year)){
				return 1;
			} else {
				return -1;
			}
		});

		selectTopics = [];
		filterBy.forEach((filter)=>{
			if('groupName' in filter){
				filter.categories.forEach((cate)=>{
					selectTopics = selectTopics.concat(cate.selected);
				})
			} else {
				selectTopics = selectTopics.concat(filter.selected);
			}
		})
		filterBy = [...filterBy];
	}

	function setVis() {
		showVis = !showVis;
	}

	function updateSearchResults(search) {
		filter.searchWord = search.detail.text;
		applyFilters();
	}
	function updateTimeRange(ranges) {
		filter.yearRange[0] = ranges.detail.start;
		filter.yearRange[1] = ranges.detail.end;
		applyFilters();
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

</script>

<svelte:window bind:innerHeight bind:innerWidth />
<!-- <Header detailView={structure.detailView.show} topView={structure.topView} {freq} /> -->



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



	<Drawer transitionType="fly" transitionParams={transitionParams} leftOffset='top-[{navHeight}px]' width='[{sidebarWidth}px]' activateClickOutside={true} backdrop={false}  divClass='z-20 overflow-y-auto bg-white dark:bg-gray-800' bind:hidden={drawer} id="sidebar2">
	<Sidebar asideClass="fixed w-80 overflow-x-scroll h-screen">
		<SidebarWrapper divCass="max-h-10 w-full">
		  <SidebarGroup>
			
				<div class="num-papers">
					<div class="mdc-typography--headline6">Number of papers:</div>
					<div class="mdc-typography--headline6">{filteredData.length}/{dataMeta.data.length}</div>
				</div>
			
				<SearchField on:message={updateSearchResults} />
	
				<Timeline {filteredData} data={dataMeta.data} on:message={updateTimeRange} />
			<FilterPanel {filterBy} {freq} {filteredFreq} {selectTopics} on:message={applyFilters} />
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
					{showImg}
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
				<Vis data={dataMeta.data} filterBy={filterBy} on:message={applyFilters}/>
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
		justify-content: center;
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
