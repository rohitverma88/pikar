import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { StorageService } from 'src/app/core/services/storage.service';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    token = '';
  constructor(private storageService: StorageService, public auth: AuthService) {
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const data = this.storageService.getData('u_data');
    if ( !!data && !!data.userData && !!data.userData.token && data.userData.token !== '') {
      const tempHeader = {
        Authorization: `Bearer ${this.auth.getToken()}`,
        // authkey: 'pikarhealthtech@123',
        // 'Access-Control-Allow-Origin': '*'
      };
        request = request.clone({
            setHeaders: tempHeader
        });
    } else {
      const tempHeader = {
        Authorization: `Bearer ${this.auth.getToken()}`,
        // authkey: 'pikarhealthtech@123',
        // 'Access-Control-Allow-Origin': '*'
      };
      request = request.clone({
        setHeaders: tempHeader
    });
    }
    return next.handle(request);
  }
}
