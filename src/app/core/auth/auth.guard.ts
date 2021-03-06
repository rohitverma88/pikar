import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage.service';
import { ProductToasterService } from 'src/app/core/services/toaster.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
              isUserLogin: boolean;
  constructor(private router: Router,
              private storageService: StorageService,
              private toastrService: ProductToasterService) { }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const userData = this.storageService.getData('u_data');
    this.isUserLogin = !!userData && !!userData.isUserLogin ? userData.isUserLogin : false;
    if (this.isUserLogin === true) {
      return true;
    }
    this.toastrService.showError('Error', 'Your session has expired please login again');
    this.router.navigateByUrl('/');
    return false;
  }
}
