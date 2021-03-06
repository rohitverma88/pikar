import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/app/core/app-settings';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
    baseUrl = AppSettings.API_ENDPOINT + 'api/';
    constructor(private http: HttpClient) {
    }
    loginUser = (data: any) => {
        return this.http.post<any>(this.baseUrl + 'web/auth/login' , data);
    }
    loginUserWithRole = (data: any) => {
      return this.http.post<any>(this.baseUrl + 'web/auth/activateUserRole' , data);
  }
}
