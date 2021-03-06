import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/app/core/app-settings';
@Injectable({
  providedIn: 'root'
})
export class StockService {
  baseUrl = AppSettings.API_ENDPOINT;
  constructor(private http: HttpClient) { }
  // Method: declaring api to fetch items for category-listing
  // tslint:disable-next-line: typedef
  getStockList(queryStr: string) {
  if (!!queryStr) {
      queryStr = '?sku=' + queryStr;
  } else {
      queryStr = '?sku=';
  }
    return this.http.get<any>(this.baseUrl + 'api/web/stock/get/stockDetails/' + queryStr);
  }
  // Method: Fethc Product SKU
  // tslint:disable-next-line: typedef
  getProductList(queryStr: string) {
    if (!!queryStr) {
        queryStr = '?search=' + queryStr;
    } else {
        queryStr = '?search=';
    }
      return this.http.get<any>(this.baseUrl + 'api/admin/inventory/get/allProducts' + queryStr);
    }
  // Method: declaring api to fetch items for category-listing
  // tslint:disable-next-line: typedef
  getProviderList(queryStr: string) {
    if (!!queryStr) {
        queryStr = '?search=' + queryStr;
    } else {
        queryStr = '?search=';
    }
      return this.http.get<any>(this.baseUrl + 'api/commons/search/clients' + queryStr);
    }
  // Method: Update Stock Item Units
  updateStockItem(data: any) {
    return this.http.post<any>(this.baseUrl + 'api/web/stock/update/stockDetails', data);
  }
  // Method: Update Stock Item Units
  addProvider(data: any) {
    return this.http.post<any>(this.baseUrl + 'api/web/stock/add/providerInStock', data);
  }
  // Method: Save Stock
  addStockData(data: any) {
    return this.http.post<any>(this.baseUrl + 'api/web/stock/add/stockDetails', data);
  }
}
 // End of code
