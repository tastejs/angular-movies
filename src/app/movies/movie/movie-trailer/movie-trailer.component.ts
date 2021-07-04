import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-movie-trailer',
  templateUrl: './movie-trailer.component.html',
  styleUrls: ['./movie-trailer.component.scss']
})
export class MovieTrailerComponent {

  url: SafeResourceUrl;

  constructor(
    public dialogRef: MatDialogRef<MovieTrailerComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dom: DomSanitizer ) {
    this.url = this.dom.bypassSecurityTrustResourceUrl(this.data.url);
  }

}
