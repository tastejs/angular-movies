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
  Renderer2
} from '@angular/core';
import { Subscription } from 'rxjs';
import { IconCache } from './icon-registry.service';
import { isPlatformServer } from '@angular/common';
import { SuspenseIcon } from './suspense-icon.token';
import { IconProvider } from './icon-provider.token';
import { CreateIcon } from './create-icon.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'fast-icon',
  template: `
    <!-- CSR
    We use an img element here to leverage the browsers native features:
    - lazy loading (loading="lazy") to only load the icons that are actually visible
    - priority hints to down prioritize the fetch avoid delaying LCP img faster

    After the image is loaded we remove it from the DOM. (IMG load event)

    When the new icon arrives we append it to the (already empty) template

    Note: SSR trigger is in the class
    -->
    <img
      *ngIf="!isSSR"
      width="0"
      height="0"
      style="visibility: hidden"
      loading="lazy"
      fetchpriority="lowest"
      [src]="url"
      (load)="notifySvgLoaded()"
    />
    <!-- a fallback icon is inserted below at bootstrap time -->
  `,
  styles: [
      `
      :host {
        display: inline-block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FastIconComponent implements OnInit, OnDestroy {
  isSSR = isPlatformServer(this.platform);

  @Input()
  name: string = '';

  get url() {
    return this.registry.iconProvider.url(this.name);
  }

  notifySvgLoaded = () => {
    this.registry.storeIconName(this.name, this.url);
  };

  @HostBinding('style.width')
  @HostBinding('style.height')
  @Input()
  size: string = this.registry.iconProvider.defaultSize + 'px';

  private sub = new Subscription();

  constructor(
    @Inject(PLATFORM_ID)
    private platform: Object,
    @Inject(SuspenseIcon)
    private suspenseIcon: CreateIcon,
    private registry: IconCache,
    private renderer: Renderer2,
    private element: ElementRef<HTMLElement>
  ) {
  }

  ngOnInit() {
    if (!this.name) {
      throw new Error('icon component needs a name to operate');
    }
    const elem = this.element.nativeElement;
    this.handleFallbackIcon(elem);

    // if SSR load icons on server => HTTP transfer state
    //
    // Note: CSR trigger is in the template
    this.isSSR && this.registry.loadIconOverHttp(this.name);

    // listen to loads - CSR & SSR
    this.sub.add(
      this.registry.getIcon(this.name).subscribe((icon) => {
        elem.innerHTML = '';
        this.applySize(icon);
        this.renderer.appendChild(elem, icon);
      })
    );
  }

  handleFallbackIcon(view: HTMLElement) {
    if (!this.suspenseIcon) {
      return;
    }
    const icon = this.suspenseIcon();
    this.applySize(icon);
    this.renderer.appendChild(view, icon);
  }

  applySize(icon: HTMLElement) {
    if (this.size) {
      icon.setAttribute('width', this.size);
      icon.setAttribute('height', this.size);
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
