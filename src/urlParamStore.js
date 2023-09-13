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

// const observeUrlChange = () => {
//   let oldHref = document.location.href;
//   const body = document.querySelector("body");
//   const observer = new MutationObserver(mutations => {
//     if (oldHref !== document.location.href) {
//       oldHref = document.location.href;
//       console.log(new URLSearchParams(window.location.search).toString())
//       urlParams.set(new URLSearchParams(window.location.search));

//     }
//   });
//   observer.observe(body, { childList: true, subtree: true });
// };

// window.onload = observeUrlChange;
