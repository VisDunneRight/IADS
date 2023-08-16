import { type Sides, type SidesStart } from './sizing.js';
export type Position = SidesStart;
/** This is a minimal version of DOMRect for our use.
 * We don't use DOMRect constructor because the lack of legacy browsers support (e.g. IE11).
 */
export interface Rect extends Position {
    width: number;
    height: number;
}
type LegacyClientRect = Pick<Readonly<DOMRect>, 'height' | 'width' | 'left' | 'right' | 'top' | 'bottom'>;
/**
 * A legacy-typed safer version of `element.getBoundingClientRect()`,
 *  that also invites minification capabilities (muliply calls can be forward to here, and it's pure).
 * */
export declare const getElementRect: (element: HTMLElement) => LegacyClientRect;
export declare const getBordersSizeOffsets: {
    (computedStyle: CSSStyleDeclaration, calcEnds?: true): Sides;
    (computedStyle: CSSStyleDeclaration, calcEnds: false): SidesStart;
};
/**
 * Computes the position and the dimensions of the element without the border.
 *
 * While `element.getBoundingClientRect()` gives the correct size with the borders, this method method does include the borders.
 *
 * Notice that for calculating the width and the height without the border, we must use this function instead of using
 *  `Element.clientWidth` and `Element.clientHeight`, beacuse they round the sizes of the pixels to be integer.
 */
export declare function elementRectWithoutBorder(element: HTMLElement, computedStyle?: CSSStyleDeclaration): Rect;
/** Get the cursor position relative to some element. */
export declare const positionDiff: (to: Position, from: Position) => Position;
export declare function getGlobalMousePosition(event: MouseEvent | TouchEvent): Position;
export {};
