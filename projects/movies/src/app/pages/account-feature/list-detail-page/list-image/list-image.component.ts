import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { trackByProp } from '../../../../shared/cdk/track-by';
import { ListDetailAdapter, ListPoster } from '../list-detail-page.adapter';
import { RxFor } from '@rx-angular/template/for';
import { GridListComponent } from '../../../../ui/component/grid-list/grid-list.component';
import {
  IMAGE_LOADER,
  ImageLoaderConfig,
  NgOptimizedImage,
} from '@angular/common';
import { POSTER_FALLBACK } from 'projects/movies/src/app/constants';
import { W342H200 } from '../../../../data-access/images/image-sizes';

@Component({
  standalone: true,
  imports: [RxFor, GridListComponent, NgOptimizedImage],
  selector: 'ct-list-image',
  providers: [
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        if (!config.width) {
          config.width = W342H200.WIDTH;
        }
        if (config.src === POSTER_FALLBACK) {
          return POSTER_FALLBACK;
        }

        return `https://image.tmdb.org/t/p/w${config.width}${config.src}`;
      },
    },
  ],
  templateUrl: './list-image.component.html',
  styleUrls: ['./list-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListImageComponent {
  public adapter = inject(ListDetailAdapter);

  trackByPosterId = trackByProp<ListPoster>('id');
}
