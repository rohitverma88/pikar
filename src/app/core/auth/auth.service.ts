import { Injectable } from '@angular/core';
import { StorageService } from 'src/app/core/services/storage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private storageService: StorageService) {
    }

  public getToken(): string {
    if(!!this.storageService.getData('user_data')) {
      const data = this.storageService.getData('user_data');
      return data.token;
    }
  }
}
