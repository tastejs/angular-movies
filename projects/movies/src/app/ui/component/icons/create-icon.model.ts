/**
 * @description
 * A function that returs a deep cloned instance of a DOM node (`.cloneNode(true)`).
 * This is important as otherwise we produce side effects across the app when mutating the icons
 */
export type CreateIcon = () => HTMLElement;
