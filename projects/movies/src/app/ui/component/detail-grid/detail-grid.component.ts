import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  standalone: true,
  selector: 'ui-detail-grid',
  template: `
    <div class="grid--item gradient">
      <ng-container
        #detailGridMediaOutlet
        [ngTemplateOutlet]="detailGridMediaRef"
      ></ng-container>
    </div>
    <div class="grid--item media">
      <ng-container [ngTemplateOutlet]="detailGridDescription"></ng-container>
    </div>
  `,
  styleUrls: ['./detail-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  imports: [NgTemplateOutlet],
})
export class DetailGridComponent implements OnChanges {
  @ContentChild('detailGridMedia', { read: TemplateRef })
  detailGridMediaRef!: TemplateRef<unknown>;
  @ContentChild('detailGridDescription', { read: TemplateRef })
  detailGridDescription!: TemplateRef<unknown>;

  /**
   * Each time a new value is set to the input rerenderDetailGridMedia (any type), rerender the block `detailGridMedia` (usually the img)
   * Hacky way to solve issue https://github.com/angular/angular/issues/47813
   */
  @Input() rerenderDetailGridMedia: unknown;
  @ViewChild('detailGridMediaOutlet', { read: ViewContainerRef })
  outletRef!: ViewContainerRef;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['rerenderDetailGridMedia'] &&
      !changes['rerenderDetailGridMedia'].isFirstChange()
    ) {
      this.doRerenderDetailGridMedia();
    }
  }

  private doRerenderDetailGridMedia(): void {
    if (!this.outletRef) {
      return;
    }

    this.outletRef.clear();
    this.outletRef.createEmbeddedView(this.detailGridMediaRef);
  }
}
