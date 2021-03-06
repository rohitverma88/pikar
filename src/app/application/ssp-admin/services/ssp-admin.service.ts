import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/app/core/app-settings';
@Injectable({
  providedIn: 'root'
})
export class sspAdminService {
  baseUrl = AppSettings.API_ENDPOINT;
  constructor(private http: HttpClient) { }
  // Method: declaring api to fetch items for SSP-listing
  // tslint:disable-next-line: typedef
  getSSPList(queryStr: string) {
    if (!!queryStr) {
        queryStr = '?' + queryStr;
    } else {
        queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'api/web/ssp/get/getSsPartners' + queryStr);
  }
// Method: declaring api to view item details
getSSPDetailById(queryStr: string) {
  if (!!queryStr) {
      queryStr = '?' + queryStr;
  } else {
      queryStr = '';
  }
  return this.http.get<any>(this.baseUrl + 'api/web/ssp/get/sspDetails' + queryStr);
}
// Method: Update Status of SSP from BE
changestatus(queryStr: string, data: any) {
  if (!!queryStr) {
    queryStr = '?' + queryStr;
  } else {
      queryStr = '';
  }
  return this.http.put<any>(this.baseUrl + 'api/web/ssp/update/changeSspAccountStatus' + queryStr , data);
}
// Method: Save SSP Data from BE
saveSSPData(data: any) {
  return this.http.post<any>(this.baseUrl + 'api/web/ssp/create/addNewSsPartner', data);
}
// Method: Edit SSP Data from BE
editSSPData(data: any) {
  return this.http.post<any>(this.baseUrl + 'api/web/ssp/update/sspDetails', data);
}
// Method: declaring api to delete SSP
removeSSP(queryStr: string) {
  if (!!queryStr) {
    queryStr = '?' + queryStr;
  } else {
      queryStr = '';
  }
  return this.http.delete<any>(this.baseUrl + 'api/web/ssp/delete/ssp' + queryStr);
}
// Method: getting HTM Machine ID from BE
gethtmmachineID() {
  return this.http.get<any>(this.baseUrl + 'api/commons/get/allHtms');
}

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
   // Method: getting Type from BE
   gettypeDropdown(queryStr: string) {
    if (!!queryStr) {
        queryStr = '?' + queryStr;
    } else {
        queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'api/commons/getEnumByName' + queryStr);
  }
  // Method: declaring api to view item details
  getpincodedetails(queryStr: string) {
    if (!!queryStr) {
        queryStr = '?' + queryStr;
    } else {
        queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'api/commons/get/locationByPincode' + queryStr);
  }
  // End of above code
}
 // End of code
