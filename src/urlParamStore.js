import { writable } from 'svelte/store';

export const urlParams = writable(new URLSearchParams(window.location.search));


let prevUrl = undefined;
setInterval(() => {
  const currUrl = window.location.href;
  if (currUrl != prevUrl) {
    // URL changed
    prevUrl = currUrl;
    urlParams.set(new URLSearchParams(window.location.search));
  }
}, 60);