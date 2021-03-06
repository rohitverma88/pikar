import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from './../../../core/app-settings';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
    baseUrl = AppSettings.API_ENDPOINT;
    constructor(private http: HttpClient) {
    }
}
