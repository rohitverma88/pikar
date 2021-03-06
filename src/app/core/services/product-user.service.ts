import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'app/core/app-settings';

@Injectable({
  providedIn: 'root',
})
export class ProductUserService {
    baseUrl = AppSettings.API_ENDPOINT;
    // baseMedicine = '/';
    constructor(private http: HttpClient) {
    }
    getUserData() {
        return this.http.get<any>(this.baseUrl + 'user-detail/');
    }
}
