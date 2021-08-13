import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-movie-trailer',
  template: `
    <div class="embedresize">
      <div>
        <iframe
          *ngIf="data.key && url"
          class="iframe"
          loading="lazy"
          width="460"
          height="230"
          [attr.src]="url"
          allowfullscreen
          tabindex="-1"
        ></iframe>
      </div>
    </div>
  `,
  styleUrls: ['./movie-trailer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieTrailerComponent {
  url: string | null | SafeResourceUrl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { key: string },
    private sanitizer: DomSanitizer
  ) {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://youtube.com/embed/${data.key}?autoplay=1&cc_load_policy=1&controls=1&disablekb=0&enablejsapi=0&fs=1&iv_load_policy=1&loop=0&rel=0&showinfo=1&start=0&wmode=transparent&theme=dark`
    );
  }
}
