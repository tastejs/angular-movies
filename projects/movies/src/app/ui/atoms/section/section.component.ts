import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'section[ds-section]',
  template: `
    <h3>
      <ng-content select="[sectionTitle]"></ng-content>
    </h3>
    <div class="section--content">
      <ng-content select="[sectionContent]"></ng-content>
    </div>
  `,
  styleUrls: ['./section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionComponent {

}

