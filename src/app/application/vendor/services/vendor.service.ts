import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/app/core/app-settings';
@Injectable({
  providedIn: 'root'
})
export class VendorService {
  baseUrl = AppSettings.API_ENDPOINT;
  constructor(private http: HttpClient) { }
  // Method: declaring api to fetch items for category-listing
  // tslint:disable-next-line: typedef
  getVendorList(queryStr: string) {
    if (!!queryStr) {
        queryStr = '?' + queryStr;
    } else {
        queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'api/vendor/getAllVendors/' + queryStr);
  }
   // Method: getting Type from BE
   gettypeDropdown(queryStr: string) {
    if (!!queryStr) {
        queryStr = '?' + queryStr;
    } else {
        queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'api/commons/getEnumByName' + queryStr);
  }
  // Method: Save Vendor Data from BE
  saveVendorData(data: any) {
    return this.http.post<any>(this.baseUrl + 'api/vendor/addNewVendor/', data);
  }
  // Method: Edit Vendor Data from BE
  editVendorData(data: any) {
    return this.http.post<any>(this.baseUrl + 'api/vendor/updateVendor/', data);
  }
   // Method: declaring api to view item details
  getVendorDetailById(queryStr: string) {
    if (!!queryStr) {
        queryStr = '?' + queryStr;
    } else {
        queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'api/vendor/getVendorDetails' + queryStr);
  }
  // Method: declaring api to view item details
  getpincodedetails(queryStr: string) {
    if (!!queryStr) {
        queryStr = '?' + queryStr;
    } else {
        queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'api/commons/locationByPincode' + queryStr);
  }
   // Method: declaring api to delete items from category-listing
  removeVendor(queryStr: string) {
    if (!!queryStr) {
      queryStr = '?' + queryStr;
    } else {
        queryStr = '';
    }
    return this.http.delete<any>(this.baseUrl + 'api/vendor/removeVendor' + queryStr);
  }
  // End of above code
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
}
 // End of code
