import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  NgModule,
} from '@angular/core';

@Component({
  selector: 'app-backdrop',
  template: ``,
  styles: [
    `
      :host {
        visibility: hidden;
        opacity: 0;
        position: fixed;
        z-index: var(--theme-backdrop-zIndex);
        display: flex;
        align-items: center;
        justify-content: center;
        right: 0;
        bottom: 0;
        top: 0;
        left: 0;
        background-color: var(--palette-background-backdrop);
        -webkit-tap-highlight-color: transparent;
        transition: opacity var(--theme-anim-duration-leavingScreen)
          var(--theme-anim-easing-easeInOut) 0ms;
      }
      :host.opened {
        visibility: visible;
        opacity: 1;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackdropComponent {
  @HostBinding('class.opened')
  @Input()
  opened = false;
}

@NgModule({
  imports: [],
  exports: [BackdropComponent],
  declarations: [BackdropComponent],
})
export class BackdropComponentModule {}
