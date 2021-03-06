import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() {}

  setData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  getData(key) {
    return JSON.parse(localStorage.getItem(key));
  }
  removeData(key) {
    localStorage.removeItem(key);
  }
  clear() {
    localStorage.clear();
  }
}
