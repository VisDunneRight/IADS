/**
 * A wrapper of `window.getComputedStyle()`,
 *  that also invites minification capabilities (muliply calls can be forward to here, and it's pure).
 * */
export declare const calcComputedStyle: (element: HTMLElement) => CSSStyleDeclaration;
