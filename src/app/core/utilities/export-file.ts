import { AuthService } from '../auth/auth.service';
import { AppSettings } from '../app-settings';
import { Injectable } from '@angular/core';
import { ProductToasterService } from '../services/toaster.service';
import * as moment from 'moment';
@Injectable({
    providedIn: 'root'
})
export class ExportFile {
    baseUrl = AppSettings.API_ENDPOINT;
    mainUrl = '';
    moduleStr = '';
    constructor(
        public auth: AuthService,
        private toastrService: ProductToasterService
    ) {

    }
    getExportData(moduleName: string, queryStr?: string) {
        this.moduleStr = moduleName;
        if (!!queryStr) {
            queryStr = '?' + queryStr;
        } else {
            queryStr = '';
        }
        if (this.moduleStr === 'inventory/products') {
            queryStr = queryStr + '&type=PRODUCT';
            this.mainUrl = this.baseUrl + 'api/admin/inventory/get/exportInventoryByType' + queryStr;
        }
        if (this.moduleStr === 'inventory/medicine') {
            queryStr = queryStr + '&type=MEDICINE';
            this.mainUrl = this.baseUrl + 'api/admin/inventory/get/exportInventoryByType' + queryStr;
        }
        if (this.moduleStr === 'inventory/diagnostic') {
            queryStr = queryStr + '&type=DIAGNOSTIC';
            this.mainUrl = this.baseUrl + 'api/admin/inventory/get/exportInventoryByType' + queryStr;
        }
        if (this.moduleStr === 'vendor/listing') {
            queryStr = queryStr + '&type=VENDOR&exportAll=true';
            this.mainUrl = this.baseUrl + 'api/vendor/export' + queryStr;
        }
        if (this.moduleStr === 'orders/listing') {
            queryStr = queryStr + '&type=ORDER';
            this.mainUrl = this.baseUrl + 'api/admin/inventory/get/exportInventoryByType' + queryStr;
        }
        if (this.moduleStr === 'ssp-admin/listing') {
            queryStr = queryStr + '&type=SSP';
            this.mainUrl = this.baseUrl + 'api/admin/inventory/get/exportInventoryByType' + queryStr;
        }
        if (this.moduleStr === 'ssp-panel/ssp-inventory/medicine') {
            queryStr = queryStr + '&type=SSP';
            this.mainUrl = this.baseUrl + 'api/admin/inventory/get/exportInventoryByType' + queryStr;
        }
        if (this.moduleStr === 'ssp-pannel-inventory-product') {
            queryStr = queryStr + '&isExport=true';
            this.mainUrl = this.baseUrl + 'api/panel/ssp/get/getInventory' + queryStr;
        }
        if (this.moduleStr === 'ssp-pannel-sales-order') {
            queryStr = queryStr + '&isExport=true';
            this.mainUrl = this.baseUrl + 'api/panel/ssp/get/allOrders' + queryStr;
        }
        const token = 'Bearer ' + this.auth.getToken();
        const request = new XMLHttpRequest();
        const toaster = this.toastrService;
        request.open('GET', this.mainUrl);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.responseType = 'blob';
        request.setRequestHeader('Authorization', token);
        request.onload = function (e) {
            if (request.status === 200) {
                const contentTypeHeader = request.getResponseHeader('Content-Type');
                const file = new Blob([this.response], { type: contentTypeHeader });
                const url = window.URL.createObjectURL(file);
                const a = document.createElement('a');
                document.body.appendChild(a);
                a.href = url;
                a.download = moduleName + '_' + moment().format('DD-MM-YYYY_HH:mm') + '.xls';
                a.click();
            } else {
                toaster.showError('Error', 'Something went wrong, Please try after sometime !!!');
            }
        };
        request.send();
    }
}
