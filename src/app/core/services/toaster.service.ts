import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})

export class ProductToasterService {
    constructor(private toastr: ToastrService) {}
    showSuccess(title, message) {
        this.toastr.success(message, title);
    }
    showError(title, message) {
        this.toastr.error(message, title);
    }
    showInfo(title, message) {
        this.toastr.info(message, title);
    }
    showWarning(title, message) {
        this.toastr.warning(message, title);
    }
}
// private toastrService: EpharmaToasterService
// import { EpharmaToasterService } from 'src/app/core/services/toaster.service';
// this.toastrService.showSuccess('Hello world!', 'Toastr fun!');
// this.toastrService.showInfo('Hello world!', 'Toastr fun!');
// this.toastrService.showWarning('Hello world!', 'Toastr fun!');
// this.toastrService.showError('Hello world!', 'Toastr fun!');
