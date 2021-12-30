import { SafeResourceUrl } from '@angular/platform-browser';

export interface SafeVideoTag {
  videoUrl: SafeResourceUrl | string | false;
}
