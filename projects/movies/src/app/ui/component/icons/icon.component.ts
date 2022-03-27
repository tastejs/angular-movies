import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { IconRegistry } from './icon-registry.service';
import { isPlatformServer } from '@angular/common';

// credits go here: https://github.com/czeckd/angular-svg-icon/blob/bbd269df33fe74f7b474c1eb6322de432890c2d4/projects/angular-svg-icon/src/lib/svg-icon.component.ts

/**
 * a very simple component to render svgs from the registry.
 * it cannot react to changes of inputs, it will render whatever you will put in first
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'svg-icon',
  template: `
    <!-- fetch over Browser - CSR -->
    <img
      *ngIf="!isSSR"
      width="0"
      height="0"
      class="loader-img"
      loading="lazy"
      [src]="url"
      (load)="notifySvgLoaded()"
    />
    <!-- fallback icon -->
    <svg
      class="fallback-icon"
      id="sad"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <circle cx="15.5" cy="9.5" r="1.5" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path
        d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-6c-2.33 0-4.32 1.45-5.12 3.5h1.67c.69-1.19 1.97-2 3.45-2s2.75.81 3.45 2h1.67c-.8-2.05-2.79-3.5-5.12-3.5z"
      />
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-block;
        width: 24px;
        height: 24px;
      }

      .loader-img {
        width: 0px;
        height: 0px;
        visibility: hidden;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgIconComponent implements OnInit, OnDestroy {
  isSSR = isPlatformServer(this.platform);

  notifySvgLoaded = () => {
    this.registry.storeIconName(this.name, this.url);
  };

  get url(): string {
    return this.registry.defaultProvider(this.name);
  }

  @Input()
  name: string = '';

  @HostBinding('style.width')
  @HostBinding('style.height')
  @Input()
  size?: string;

  private sub = new Subscription();

  constructor(
    @Inject(PLATFORM_ID)
    private platform: Object,
    private registry: IconRegistry,
    private renderer: Renderer2,
    private element: ElementRef<HTMLElement>
  ) {}

  ngOnInit() {
    if (!this.name) {
      throw new Error('svg-icon component needs a name to operate');
    }
    // id SSR load icons on server => HTTP transfere state
    this.isSSR && this.registry.loadIconOverHttp(this.name);
    // listen to loads - CSR
    this.sub.add(
      this.registry.getIcon(this.name).subscribe((icon) => {
        const elem = this.element.nativeElement;
        elem.innerHTML = '';
        this.renderer.appendChild(elem, icon);
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
