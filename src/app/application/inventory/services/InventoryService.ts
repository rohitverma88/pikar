import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../../../core/app-settings';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  baseUrl = AppSettings.API_ENDPOINT;
  constructor(private http: HttpClient) { }
  // Method: declaring api to fetch product-listing data
  getProductList(queryStr: string) {
    if (!!queryStr) {
      queryStr = '?' + queryStr;
    } else {
      queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'api/admin/inventory/get/allProducts' + queryStr);
  }
  // Method: declaring api to fetch diagnostic-listing data
  getDiagnosticsList(queryStr: string) {
    if (!!queryStr) {
      queryStr = '?' + queryStr;
    } else {
      queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'api/admin/inventory/get/allDiagnosticProducts' + queryStr);
  }
  // Method: declaring api to fetch diagnostic-listing data
  getMedicineList(queryStr: string) {
    if (!!queryStr) {
      queryStr = '?' + queryStr;
    } else {
      queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'api/admin/inventory/get/allMedicines' + queryStr);
  }

  // Method: Save Product Data to BE
  saveProductData(data: any) {
    return this.http.post<any>(this.baseUrl + 'api/admin/inventory/create/addProduct', data);
  }
  // Method: Save Medicine Data to BE
  saveMedicineData(data: any) {
    return this.http.post<any>(this.baseUrl + 'api/admin/inventory/create/addMedicineProduct', data);
  }
  // Method: Save Diagnostic Data to BE
  saveDiagnosticData(data: any) {
    return this.http.post<any>(this.baseUrl + 'api/admin/inventory/create/addDiagnosticProduct', data);
  }

  // Method: Edit Product Data in BE
  editProductData(data: any) {
    return this.http.post<any>(this.baseUrl + 'api/admin/inventory/update/product', data);
  }
  // Method: Edit Medicine Data in BE
  editMedicineData(data: any) {
    return this.http.post<any>(this.baseUrl + 'api/admin/inventory/update/medicine', data);
  }
  // Method: Edit Diagnostic Data in BE
  editdiagnosticData(data: any) {
    return this.http.post<any>(this.baseUrl + 'api/admin/inventory/update/diagnosticProduct', data);
  }

  // Method: declaring api to view products details
  getProductDetailById(queryStr: string) {
    if (!!queryStr) {
      queryStr = '?' + queryStr;
    } else {
      queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'api/admin/inventory/get/getProductDetails' + queryStr);
  }
  // Method: declaring api to view diagnostic products details
  getDiagnosticDetailById(queryStr: string) {
    if (!!queryStr) {
      queryStr = '?' + queryStr;
    } else {
      queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'api/admin/inventory/get/getDiagnosticProductDetails' + queryStr);
  }
  // Method: declaring api to view diagnostic products details
  getMedicineDetailById(queryStr: string) {
    if (!!queryStr) {
      queryStr = '?' + queryStr;
    } else {
      queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'api/admin/inventory/get/getMedicineDetails' + queryStr);
  }
  // Method: declaring api to Import product
  importInventorySubmodule(data) {
    return this.http.post<any>(this.baseUrl + 'api/admin/inventory/upload/inventoryImportByExcel', data);
  }
  // Method: declaring api to delete product
  removeProduct(queryStr: string) {
    if (!!queryStr) {
      queryStr = '?' + queryStr;
    } else {
      queryStr = '';
    }
    return this.http.delete<any>(this.baseUrl + 'api/admin/inventory/delete/removeProductById' + queryStr);
  }
  // Method: declaring api to delete diagnostic product
  removeDiagnosticProduct(queryStr: string) {
    if (!!queryStr) {
      queryStr = '?' + queryStr;
    } else {
      queryStr = '';
    }
    return this.http.delete<any>(this.baseUrl + 'api/admin/inventory/delete/removeDiagnosticProductById' + queryStr);
  }
  // Method: declaring api to delete medicine
  removeMedicine(queryStr: string) {
    if (!!queryStr) {
      queryStr = '?' + queryStr;
    } else {
      queryStr = '';
    }
    return this.http.delete<any>(this.baseUrl + 'api/admin/inventory/delete/removeMedicine' + queryStr);
  }
  // End of above code
  // End of above cod
  // Method: declaring api to fetch items for type-dropdown
  gettypeDropdown(queryStr: string) {
    if (!!queryStr) {
      queryStr = '?' + queryStr;
    } else {
      queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'api/commons/getEnumByName' + queryStr);
  }
  // Method: for fetching out the vendors data for the dropdown
  getVendorListForDropdown(){
    return this.http.get<any>(this.baseUrl + 'api/vendor/getVendorsDropdownList');
  }
  // Method: getting Array from BE
  getENUMData(queryStr) {
    return this.http.get<any>(this.baseUrl + 'api/commons/getEnumByName' + queryStr);
  }
  // Method: getting State from BE
  getStateList(queryStr: string) {
    if (!!queryStr) {
        queryStr = '/' + queryStr;
    } else {
        queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'api/commons/get/states' + queryStr);
  }
  // Method: getting City from BE
  getcityDropdown(queryStr: string) {
    if (!!queryStr) {
        queryStr = '/' + queryStr;
    } else {
        queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'api/commons/get/cities' + queryStr);
  }
  // Method: declaring api to delete Image
  deleteImage(queryStr: string) {
    if (!!queryStr) {
      queryStr = '?' + queryStr;
    } else {
      queryStr = '';
    }
    return this.http.delete<any>(this.baseUrl + 'api/admin/inventory/deleteImages' + queryStr);
  }
}
