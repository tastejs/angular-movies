import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ListDetailAdapter } from '../list-detail-page.adapter';

// TODO
@Component({
  selector: 'ct-list-share',
  templateUrl: './list-share.component.html',
  styleUrls: ['./list-share.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListShareComponent implements OnInit, OnDestroy {
  private body = document.body;

  listRef = location.href;
  constructor(public adapter: ListDetailAdapter) {}
  ngOnInit(): void {
    this.body.classList.add('modal-visible');
  }
  ngOnDestroy(): void {
    this.body.classList.remove('modal-visible');
  }
}
