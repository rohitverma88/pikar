import { AuthService } from 'src/app/core/auth/auth.service';
import { AppSettings } from 'src/app/core/app-settings';
import { Injectable } from '@angular/core';
import { ProductToasterService } from '../services/toaster.service';
import * as moment from 'moment';
@Injectable({
    providedIn: 'root'
})
export class ExportPdfFile {
    baseUrl = AppSettings.API_ENDPOINT;
    mainUrl = '';
    moduleStr = '';
    constructor(
        public auth: AuthService,
        private toastrService: ProductToasterService
        ) {

    }
    getPdfData(moduleName: string, type: string, id?: any) {
        this.moduleStr = moduleName;
        if (this.moduleStr === 'vendor') {
            this.mainUrl = this.baseUrl + 'api/vendor/export?vendorId=' + id;
        }
        const token = 'Bearer ' + this.auth.getToken();
        const request =  new XMLHttpRequest();
        const toaster = this.toastrService;
        request.open('GET', this.mainUrl);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.responseType = 'blob';
        request.setRequestHeader('Authorization',  token);
        request.onload = function(e) {
            if (request.status === 200) {
                const file = new Blob([this.response] , {type: 'application/pdf'});
                // IE doesn't allow using a blob object directly as link href
                // instead it is necessary to use msSaveOrOpenBlob
                if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                  window.navigator.msSaveOrOpenBlob(file);
                  return;
                }
                // For other browsers:
                // Create a link pointing to the ObjectURL containing the blob.
                const data = window.URL.createObjectURL(file);
                const link = document.createElement('a');
                link.href = data;
                if (type === 'print') {
                    link.target = '_blank';
                } else {
                    link.download = moduleName + '_' + moment().format('DD-MM-YYYY_HH:mm') + '.pdf';
                }
                link.click();
                // tslint:disable-next-line: only-arrow-functions
                setTimeout( function() {
                    // For Firefox it is necessary to delay revoking the ObjectURL
                    window.URL.revokeObjectURL(data);
                }, 10);
            } else {
                toaster.showError('Error', 'Something went wrong, Please try after sometime !!!');
            }
            };
        request.send();
      }
}
