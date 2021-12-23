import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ds-section',
  template: `
    <section class="section">
      <h3>
        <ng-content select="[sectionTitle]"></ng-content>
      </h3>
      <div class="section--content">
        <ng-content select="[sectionContent]"></ng-content>
      </div>
    </section>
  `,
  styleUrls: ['./section.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionComponent {

}

