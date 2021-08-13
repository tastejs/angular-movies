import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  save(key: string, data: string): void {
    sessionStorage.setItem(key, data);
  }

  read(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  remove(key: string) {
    sessionStorage.removeItem(key);
  }

  clear(): void {
    sessionStorage.clear();
  }
}
