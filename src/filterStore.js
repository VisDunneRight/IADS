import { writable } from 'svelte/store';

export const categoryFilters = writable([]);
export const timeFilters = writable({start: 2013, end: 2022})

export const filters = writable({
    searchFilters: "",
    categoryFilters: [],
    timeFilters: {start: 2013, end: 2022}
})


// let prevUrl = undefined;
// setInterval(() => {
//   const currUrl = window.location.href;
//   if (currUrl != prevUrl) {
//     // URL changed
//     prevUrl = currUrl;
//     urlParams.set(new URLSearchParams(window.location.search));
//   }
  
// }, 60);

