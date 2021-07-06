import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { StorageService } from '../shared/service/storage/storage.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {
  languages = [
    { value: 'en-US', viewValue: 'English' },
    { value: 'fr-FR', viewValue: 'French' }
  ];
  lang: string;
  adult: string = this.storageService.read('adult');

  constructor(
    private storageService: StorageService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.lang = this.storageService.read('language');
    if (!this.adult) {
      this.storageService.save('adult', false);
    }
  }

  languageChange(event: MatSelectChange) {
    this.storageService.save('language', event.value);
    this.translateService.use(event.value);
  }

  adultChange(event: MatSlideToggleChange) {
    if (event.checked === true) {
      this.storageService.save('adult', true);
    } else {
      this.storageService.save('adult', false);
    }
  }

}
