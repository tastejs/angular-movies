import { DOCUMENT, ɵDomAdapter as DomAdapter, ɵgetDOM as getDOM } from '@angular/common';
import { Inject, Injectable, ɵɵinject } from '@angular/core';

export type LinkDefinition = {
  charset?: string;
  crossorigin?: 'anonymous' | 'use-credentials';
  disabled?: 'true' | 'false';
  href?: string;
  hreflang?: string;
  media?: string;
  methods?: string;
  rel?: string;
  sizes?: string;
  target?: string;
  type?: string;
  as?: string;
} & { [prop: string]: string };

const LINK_KEYS_MAP: { [prop: string]: string } = {};

@Injectable({ providedIn: 'root', useFactory: createLink, deps: [] })
export class Link {
  private _dom: DomAdapter;
  constructor(@Inject(DOCUMENT) private _doc: Document) {
    this._dom = getDOM();
  }

  addTag(tag: LinkDefinition, forceCreation: boolean = false): HTMLLinkElement | null {
    if (!tag) return null;
    return this._createLinkElement(tag, forceCreation);
  }

  addTags(tags: LinkDefinition[], forceCreation: boolean = false): HTMLLinkElement[] | [] {
    if (!tags) return [];
    return tags.reduce((result: HTMLLinkElement[], tag: LinkDefinition) => {
      if (tag) result.push(this._createLinkElement(tag, forceCreation));
      return result;
    }, []);
  }

  updateTag(tagSelectors: LinkDefinition, tag: LinkDefinition): HTMLLinkElement | null {
    if (!tag) return null;
    const link = this.getTag(tagSelectors);
    if (link) return this._setLinkElementAttributes(tag, link);
    return this._createLinkElement(tag);
  }

  getTag(tagSelectors: LinkDefinition): HTMLLinkElement | null {
    if (!tagSelectors) return null;
    const selectors = this._parseQuerySelectors(tagSelectors);
    return this._doc.querySelector(`link${selectors}`) || null;
  }

  getTags(tagSelectors: LinkDefinition): HTMLLinkElement[] | [] {
    if (!tagSelectors) return [];
    const selectors = this._parseQuerySelectors(tagSelectors);
    const list = this._doc.querySelectorAll(`link${selectors}`);
    return list ? [].slice.call(list) : [];
  }

  removeTag(tag: LinkDefinition): void | null {
    if (!tag) return null;
    this._removeLinkElement(this.getTag(tag));
  }

  removeTags(tags: LinkDefinition[]): void | null {
    if (!tags) return null;
    tags.forEach(tag => this._removeLinkElement(this.getTag(tag)));
  }

  private _removeLinkElement(tag: HTMLLinkElement | null): void {
    this._dom.remove(tag);
  }

  private _createLinkElement(link: LinkDefinition, forceCreation: boolean = false): HTMLLinkElement {
    const linkElement = this.getTag(link);
    if (!forceCreation && linkElement) return linkElement;
    const element = this._dom.createElement('link') as HTMLLinkElement;
    this._setLinkElementAttributes(link, element);
    const head = this._doc.getElementsByTagName('head')[0];
    head.appendChild(element);
    return element;
  }

  private _setLinkElementAttributes(tag: LinkDefinition, el: HTMLLinkElement): HTMLLinkElement {
    Object.keys(tag).forEach((prop: string) => el.setAttribute(this._getLinkKeyMap(prop), tag[prop]));
    return el;
  }

  private _parseQuerySelectors(tag: LinkDefinition): string | null {
    return Object.entries(tag)
      .map(([attr, value]) => `[${attr}="${value}"]`)
      .join('');
  }

  private _getLinkKeyMap(prop: string): string {
    return LINK_KEYS_MAP[prop] || prop;
  }
}

export function createLink() {
  return new Link(ɵɵinject(DOCUMENT));
}
