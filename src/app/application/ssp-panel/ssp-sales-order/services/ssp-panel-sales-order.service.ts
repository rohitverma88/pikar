import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/app/core/app-settings';
@Injectable({
  providedIn: 'root'
})
export class SspPanelSalesOrderService {
  baseUrl = AppSettings.API_ENDPOINT;
  constructor(private http: HttpClient) { }

  // Method: declaring api to fetch items for category-listing
  // tslint:disable-next-line: typedef
  getOrderList(queryStr: string) {
    if (!!queryStr) {
        queryStr = '?' + queryStr;
    } else {
        queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'api/panel/ssp/get/allOrders' + queryStr);
  }
  // Method to Add Address
  addAddress(data: any) {
    return this.http.post<any>(this.baseUrl + 'api/user/address', data);
  }

  customerSearch(queryStr: string) {
    if (!!queryStr) {
        queryStr = '?search=' + queryStr;
    } else {
        queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'api/user/customer/search' + queryStr);
  }
  getCustomerAddressById(queryStr: string) {
    if (!!queryStr) {
      queryStr = '?active=false&userId=' + queryStr;
    } else {
        queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'api/user/get/address' + queryStr);
  };

  checkAreaServicable(queryStr: string) {
    if (!!queryStr) {
      queryStr = '?pincode=' + queryStr;
    } else {
        queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'public/api/get/checkPincodeServicesStatus' + queryStr);
  };

  getCartCalculatedData(data) {
    return this.http.post<any>(this.baseUrl + 'api/web/orders/calculateCart', data);
  };
  // Method: getting HTM Machine ID from BE
  gethtmmachineID() {
    return this.http.get<any>(this.baseUrl + 'api/commons/get/allHtms');
  }

  productSearch(queryStr: string) {
    if (!!queryStr) {
        queryStr = '?search=' + queryStr;
    } else {
        queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'admin/web/inventory/api/get/searchInInventory' + queryStr);
  }
  // Method: declaring api to fetch diagnostic-listing data
  getDiagnosticsList(queryStr: string) {
    if (!!queryStr) {
      queryStr = '?search=' + queryStr;
    } else {
      queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'api/admin/inventory/get/allDiagnosticProducts' + queryStr);
  }
  // Method: declaring api to view order details
  getOrderDetailById(queryStr: string) {
    if (!!queryStr) {
        queryStr = '?' + queryStr;
    } else {
        queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'api/panel/ssp/get/orderDetails' + queryStr);
  }
  // Method: declaring api to delete order from listing
   removeOrder(queryStr: string) {
    if (!!queryStr) {
      queryStr = '?' + queryStr;
    } else {
        queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'api/panel/ssp/cancelOrder' + queryStr);
  }
  // Method: Create Sales Order
  createSalesOrder(data: any) {
    return this.http.post<any>(this.baseUrl + 'api/web/orders/create/generateOrder', data);
  }
  // Method: Create Lab Order
  createBooking(data: any) {
    return this.http.post<any>(this.baseUrl + 'api/web/orders/create/booking', data);
  }
  // Method: View Lab test Details
  getLabTestDetailsById(queryStr: string) {
    if (!!queryStr) {
        queryStr = '?' + queryStr;
    } else {
        queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'api/web/orders/get/bookingDetails' + queryStr);
  }
  // Method: for fetching out the vendors data for the dropdown
  getVendorListForDropdown(queryStr: string){
    if (!!queryStr) {
      queryStr = '?' + queryStr;
  } else {
      queryStr = '';
  }
  return this.http.get<any>(this.baseUrl + 'api/vendor/getVendorsDropdownList' + queryStr);
  }
  // Method: declaring api to raise refund for order from listing
  raiserefund(queryStr: string, data: any) {
    if (!!queryStr) {
      queryStr = '?' + queryStr;
    } else {
        queryStr = '';
    }
    return this.http.put<any>(this.baseUrl + 'api/web/orders/raiseRefundRequest' + queryStr , data);
  }
  // Method: declaring api to raise refund for order from listing
  returnreplace(queryStr: string, data: any) {
    if (!!queryStr) {
      queryStr = '?' + queryStr;
    } else {
        queryStr = '';
    }
    return this.http.put<any>(this.baseUrl + 'api/web/orders/raiseReturnReplaceRequest' + queryStr , data);
  }
  sendinvoice(queryStr: string) {
    if (!!queryStr) {
        queryStr = '?' + queryStr;
    } else {
        queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'api/web/orders/send/invoiceToUser' + queryStr);
  }
  // Method to get the list of Status based on Track ID
  getstatusDropdown(queryStr: string) {
    if (!!queryStr) {
        queryStr = '?' + queryStr;
    } else {
        queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'api/web/orders/get/supportedStatusByTrack' + queryStr);
  }
  // Method: Edit Vendor Data from BE
  changestatus(data: any) {
    return this.http.post<any>(this.baseUrl + 'api/web/orders/update/changeOrderStatus', data);
  }
  // Method: declaring api to fetch vendor list for dropdown
  getVendorDropdownData() {
    return this.http.get<any>(this.baseUrl + 'api/vendor/getVendorsDropdownList');
  }
  // Method: to reassign Vendor
  reassignVendor(queryStr: string, data: any) {
    if (!!queryStr) {
      queryStr = '?' + queryStr;
    } else {
        queryStr = '';
    }
    return this.http.put<any>(this.baseUrl + 'api/web/orders/update/orderVendorReassign' + queryStr , data);
  }
  getitemtrackingstatus(queryStr: string) {
    if (!!queryStr) {
      queryStr = '?' + queryStr;
    } else {
        queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'api/web/orders/get/orderDetails' + queryStr);
  };
  // Method: declaring api to fetch items for category-listing
  // tslint:disable-next-line: typedef
  getVendorList(queryStr: string) {
    if (!!queryStr) {
        queryStr = '?' + queryStr;
    } else {
        queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'admin/api/vendor/getAllVendors/' + queryStr);
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
    return this.http.post<any>(this.baseUrl + 'admin/api/vendor/addNewVendor/', data);
  }
  // Method: Edit Vendor Data from BE
  editVendorData(data: any) {
    return this.http.post<any>(this.baseUrl + 'admin/api/vendor/updateVendor/', data);
  }
   // Method: declaring api to view item details
  getVendorDetailById(queryStr: string) {
    if (!!queryStr) {
        queryStr = '?' + queryStr;
    } else {
        queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'admin/api/vendor/getVendorDetails' + queryStr);
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
   // Method to Get the List of LabTest Details
   getLabTestList(queryStr: string) {
    if (!!queryStr) {
        queryStr = '?' + queryStr;
    } else {
        queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'api/web/orders/get/allBookings' + queryStr);
  }
  // Method: to cancl booking
  canceBooking(queryStr: string) {
    if (!!queryStr) {
      queryStr = '?' + queryStr;
    } else {
        queryStr = '';
    }
    return this.http.get<any>(this.baseUrl + 'api/web/orders/cancel/booking' + queryStr);
  }
}
 // End of code
