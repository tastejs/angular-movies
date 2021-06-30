import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

  constructor() { }

  save(key, data) {
    // sessionStorage.setItem(key, this.getSettable(data));
    sessionStorage.setItem(key, data);
  }

  read(key) {
    const value = sessionStorage.getItem(key);
    // return this.getGettable(value);
    return value;
  }

  remove(key) {
    sessionStorage.removeItem(key);
  }

  clear() {
    sessionStorage.clear();
  }

}
