<script>
	import Textfield from '@smui/textfield';
	import Button, { Label } from '@smui/button';
	import MultiCombo from './multiCombo.svelte';
	import Clipboard from 'svelte-clipboard';
  import { Modal } from 'flowbite-svelte';
  import newGithubIssueUrl from 'new-github-issue-url';


	let stitle = '';
	let title = '';
	let authors = '';
	let bibtex = '';
	let year = 2023;
	let doi = '';
	let json = '';
	export let detailView = [];
	export let freq = {};
	export let addEntryInfo;
	export let scrollingModal;
	let categories = [];

	detailView.forEach((cate) => {
		if (cate in freq) {
			const temp = { name: cate, value: [] };
			let items = [];
			Object.keys(freq[cate]).forEach((prop) => {
				items.push({ value: prop, label: prop });
			});
			temp['choices'] = items;
			categories.push(temp);
		} else {
			categories.push({ name: cate, value: '' });
		}
	});

	const reset = () => {
		stitle = '';
		title = '';
		authors = '';
		bibtex = '';
		year = 2023;
		doi = '';
		json = '';
		categories.forEach((cate) => {
			if (Array.isArray(cate.value)) {
				cate.value = [];
			} else {
				cate.value = '';
			}
		});
	};
	const generateJson = () => {
		const paper = {
			shortTitle: stitle,
			title: title,
			authors: authors,
			bibtex: bibtex,
			year: year
		};
		categories.forEach((cate) => {
			if (Array.isArray(cate.value)) {
				let lst = [];
				cate.value.forEach((entry) => {
					lst.push(entry.value);
				});
				paper[cate.name] = lst;
			} else {
				paper[cate.name] = cate.value;
			}
		});
		json = JSON.stringify(paper);
	};

	const updateCategory = (res) => {
		categories.forEach((cate) => {
			if (cate.name === res.detail.name) {
				cate.value = res.detail.prop;
				return;
			}
		});
		generateJson();
	};

	$: url = newGithubIssueUrl({
	user: 'VisDunneRight',
	repo: 'IADesign.Space',
	labels: ['New Paper'],
	title: "New Paper: " + stitle,
	body: json
});
</script>


<Modal size="xl" title="Contribute a New Paper" bind:open={scrollingModal} outsideclose>
<div>
	{#each addEntryInfo.description as para}
		<p class="mdc-typography--body1">
			{para}
		</p>
	{/each}
	<!-- <p class="mdc-typography--body1">
		If you are an author of a peer-reviewed published work on Immersive Analytics that presents a
		contribution missing in our browser, please feel free to submit an entry. Filling out the form
		below will create a json entry that can be added as an issue to the github together with a
		100x100px PNG thumbail.
	</p>
	<p class="mdc-typography--body1">
		The URL provided in the form should point to a DOI. Also, please acknowledge the fact that by
		submitting an entry, you provide us with permissions to use your image on this resource and in
		related publications.
	</p> -->
	<p class="mdc-typography--body1">
		<strong>Note:</strong> if you would like to update an entry, click on the 3 dots found on the entry
		you wish to update.
	</p>
	<div class="entry-content">
		<div class="entry-row">
			<div class="title-text mdc-typography--body1"><strong>Short Title:</strong></div>
			<div class="text-field">
				<Textfield
					style="width: 100%; height:40px"
					helperLine$style="width: 100%;"
					variant="outlined"
					on:change={generateJson}
					bind:value={stitle}
					label="e.g., ex-Short Title"
				/>
			</div>
		</div>
		<div class="entry-row">
			<div class="title-text mdc-typography--body1"><strong>Title:</strong></div>
			<div class="text-field">
				<Textfield
					style="width: 100%; height:40px"
					helperLine$style="width: 100%;"
					variant="outlined"
					on:change={generateJson}
					bind:value={title}
					label="e.g., Longest Title of a Paper: The Story"
				/>
			</div>
		</div>
		<div class="entry-row">
			<div class="title-text mdc-typography--body1"><strong>Year:</strong></div>
			<div class="text-field">
				<Textfield
					style="width: 100%; height:40px"
					helperLine$style="width: 100%;"
					variant="outlined"
					on:change={generateJson}
					bind:value={year}
					label="e.g., 2023"
				/>
			</div>
		</div>
		<div class="entry-row">
			<div class="title-text mdc-typography--body1"><strong>Authors:</strong></div>
			<div class="text-field">
				<Textfield
					style="width: 100%; height:40px"
					helperLine$style="width: 100%;"
					variant="outlined"
					on:change={generateJson}
					bind:value={authors}
					label="e.g., John Doe, Jane Doe, Jack Doe"
				/>
			</div>
		</div>
		<div class="entry-row" >
			<div class="title-text mdc-typography--body1"><strong>Categories:</strong></div>
			<div class="catagory-field">
				{#each categories as category}
					<div class="title-cate mdc-typography--body1">
						<strong>{category.name}:</strong>
						{#if 'choices' in category}
							<MultiCombo
								items={category.choices}
								name={category.name}
								on:message={updateCategory}
							/>
						{:else}
							<div class="text-field">
								<Textfield
									style="width: 100%; height:40px; "
									helperLine$style="width: 100%; background-color: black;"
									variant="outlined"
									on:change={generateJson}
									bind:value={category.value}
									label={category.label}
								/>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
		<div class="entry-row">
			<div class="title-text mdc-typography--body1"><strong>BibTex:</strong></div>
			<div class="text-field">
				<Textfield
					style="width: 100%;"
					helperLine$style="width: 100%;"
					textarea
					on:change={generateJson}
					bind:value={bibtex}
					label="copy and paste BibTex"
				/>
			</div>
		</div>
		<div class="entry-row">
			<div class="title-text mdc-typography--body1"><strong>DOI:</strong></div>
			<div class="text-field">
				<Textfield
					style="width: 100%; height:40px"
					helperLine$style="width: 100%;"
					variant="outlined"
					on:change={generateJson}
					bind:value={doi}
					label="e.g., https://doi.org/0"
				/>
			</div>
		</div>
	</div>
	
</div>
<svelte:fragment slot="footer">
	<div style="width: 100%; display:flex; justify-content:space-between; ">
		<div>
			<Button style="color: white" on:click={() => reset}>
				<Label>Reset</Label>
			</Button>
		</div>
		<div>
			<Clipboard
				text={json}
				let:copy
				on:copy={() => {
					console.log(json);
				}}
			>
				<Button style="color: white" on:click={copy}>
					<Label>Copy to Clipboard</Label>
				</Button>
			</Clipboard>
			{#if addEntryInfo.github}
				<Button style="color: white" on:click={() => window.open(url, '_blank')}>
					<Label>Open Issue</Label>
				</Button>
			{:else if addEntryInfo.email}
				<Button on:click={() => window.open(addEntryInfo.email, '_blank')}>
					<Label>Copy</Label>
				</Button>
			{/if}
		</div>
	</div>
  </svelte:fragment>
</Modal>

<style>
	.title-cate {
		padding: 5px 10px;
	}
	.catagory-field {
		width: 100%;
		border: lightgray solid 1px;
		border-radius: 5px;
	}
	.title-text {
		width: 100px;
		text-align: right;
		padding-right: 10px;
	}
	.entry-row {
		display: flex;
		flex-direction: row;
		padding: 10px 10px 10px 0px;
		align-items: center;
		width: 100%;
	}
	* :global(.text-field) {
		width: 100%;
	}
</style>
