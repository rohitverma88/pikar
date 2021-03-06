import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Input, HostListener } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ResponseCode } from 'src/app/core/dictionary/response-code';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { SspPanelSalesOrderService } from '../../../services/ssp-panel-sales-order.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductToasterService } from 'src/app/core/services/toaster.service';
import { IOption } from 'ng-select';
import { ProductUtilities } from 'src/app/core/utilities/utility';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { isNumeric } from 'rxjs/util/isNumeric';
declare var $:any;
@Component({
  selector: 'app-ace-ssp-sales-order',
  templateUrl: './ace-ssp-sales-order.component.html',
  styleUrls: ['./ace-ssp-sales-order.component.scss']
})
export class AceSspSalesOrderComponent implements OnInit {
  addressRadio: false;
  today: Date;
  maxDate: Date;
  minDate: Date;
  orderDetailsForm: FormGroup;
  addAddressForm: FormGroup;
  submitted = false;
  addresssubmitted = false;
  fileDatacertificate: string [] = [];
  previewUrlcertificate = [];
  typeDropdownData: Array<IOption> = [];
  categoryDropdownData: Array<IOption> = [];
  serviceDropdownData: Array<IOption> = [];
  machineIdDropdownData: Array<IOption> = [];
  completeCartData: any;
  quantity: any;
  disableBtn = false;
  salesOrderObject: any = {
    order_type: '',
    htm_machine_id: [],
    promo_code: '',
    mode_of_payment: '',
    method_of_transaction: '',
    status_of_payment: '',
    order_description: '',
    user_delivery_instructions: ''
  };
  statusOfPaymentDropDownData: Array<IOption> = [
    {
      value: 'PENDING',
      label: 'Payment Not Done'
    },
    {
      value: 'SUCCESS',
      label: 'Payment Done'
    }
  ];
  modeOfPaymentDropDownData: Array<IOption> = [
    // {
    //   value: 'ONLINE',
    //   label: 'Online'
    // },
    {
      value: 'OFFLINE',
      label: 'Offline'
    }
  ];
  methodOfTransactionDropDownData: Array<IOption> = [];
  orderTypeDropdownData: Array<IOption> = [
    {
      value: 'store_pickup',
      label: 'Store Pickup'
    },
    {
      value: 'over_the_counter',
      label: 'Over the Counter'
    },
    {
      value: 'home_delivery',
      label: 'Home Delivery'
    }
  ];
  addressLabelDropdownData: Array<IOption> = [
    {
      value: 'Home',
      label: 'Home'
    },
    {
      value: 'Office',
      label: 'Office'
    },
    {
      value: 'Other',
      label: 'Other'
    }
  ];
  quantityDropdownData: Array<IOption> = [
    {
      value: '1',
      label: '1'
    },
    {
      value: '2',
      label: '2'
    },
    {
      value: '3',
      label: '3'
    },
    {
      value: '4',
      label: '4'
    },
    {
      value: '5',
      label: '5'
    },
    {
      value: '6',
      label: '6'
    },
    {
      value: '7',
      label: '7'
    },
    {
      value: '8',
      label: '8'
    },
    {
      value: '9',
      label: '9'
    },
    {
      value: '10',
      label: '10'
    }
  ];
  dropdownData: any = {};
  sub: any;
  orderDataFormType: string;
  orderId: string;
  pincode_state: any;
  customerSearchForm: FormGroup;
  customerSearchField: FormControl;
  showCustomerSearchDropdown = false;
  productSearchForm: FormGroup;
  productSearchField: FormControl;
  showProductSearchDropdown = false;
  values = '';
  customerSearchResult: any;
  productSearchResult: any;
  customerAllAddresses: any;
  selectedAddressId: any;
  searchResults: any;
  searchcontent: any;
  selectedCustomerData: any;
  selectedProduct: any;
  customerCurrentCart: any = [];
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private ordersService: SspPanelSalesOrderService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ProductToasterService
  ) {
    this.sub = this.route
    .queryParams
    .subscribe(params => {
      this.orderDataFormType = params.type;
      if ( this.orderDataFormType !== 'add') {
        if (!!params.orderId && params.orderId !== '') {
          this.orderId = params.orderId;
          // this.getServiceDropdownData();
          this.getMachineIDDropdown();
        }
      } 
      else {
        this.bindAddForm();
        this.getMachineIDDropdown();
      }
    });
    this.today = new Date();
    this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), 2);
    // Below is for Customer
    this.customerSearchField = new FormControl();
    this.customerSearchForm = formBuilder.group({search: this.customerSearchField});
    this.customerSearchField.valueChanges
    .debounceTime(300).
    switchMap(term => of(term)).subscribe(result => {
    if (!!result) {
      this.customerSearchResult = ['Loading'];
      if (/^ *$/.test(result)) {
        this.customerSearchResult = [{message: 'No Results Found'}];
      } else {
        this.searchcontent = result;
        this.getCustomersearchData(result);
      }
    } else {
    this.customerSearchResult = [];
    // console.log('No Data');
    }
    });
    // End of the above code
    // Below code is for the Product
    this.productSearchField = new FormControl();
    this.productSearchForm = formBuilder.group({search: this.productSearchField});
    this.productSearchField.valueChanges
    .debounceTime(300).
    switchMap(term => of(term)).subscribe(result => {
    if (!!result) {
      this.productSearchResult = ['Loading'];
      if (/^ *$/.test(result)) {
        this.productSearchResult = [{message: 'No Results Found'}];
      } else {
        this.searchcontent = result;
        this.getProductsearchData(result);
      }
    } else {
    this.productSearchResult = [];
    }
    });
    // End of the above code
  }
  ngOnInit() {
  }
  modeOfPaymentChanged(data) {
    if (data === 'ONLINE') {
      this.methodOfTransactionDropDownData = [
        {
          value: 'UPI',
          label: 'UPI'
        },
        {
          value: 'NETBANKING',
          label: 'Net Banking'
        },
        {
          value: 'CARD',
          label: 'Credit / Debit Card'
        }
      ];
    } else {
      this.methodOfTransactionDropDownData = [
        {
          value: 'CASH',
          label: 'Cash'
        },
        {
          value: 'POS',
          label: 'POS'
        }
      ];
    }
  }
  @HostListener('document:click', ['$event']) onDocumentClick(event) {
    this.showCustomerSearchDropdown = false;
    this.showProductSearchDropdown = false;
    // this.customerSearchForm.reset();
  }
  onKey(value: string) {
    this.values += value + ' | ';
    if (!!value) {
      this.showCustomerSearchDropdown = true;
    }
    if (value === '') {
      this.showCustomerSearchDropdown = false;
    }
  }
  getCustomersearchData(result) {
    this.ordersService.customerSearch(result).subscribe(
      res => {
        if (!!res && !!res.success === true) {
          if(res.response.data.length > 0) {
            this.customerSearchResult = res.response.data;
          } else {
            this.customerSearchResult = [];
          }
        } else {
          this.customerSearchResult = null;
        }
      },
      err => {
        console.error(err);
        if (err.status === 500 || err.status === 502) {
          this.customerSearchResult = ['Network Error'];
          this.toastrService.showError('Network Error', 'Please try again later.');
        }
      }
    );
  }
  // Below is for Product
  onProductKey(value: string) {
    this.values += value + ' | ';
    if (!!value) {
      this.showProductSearchDropdown = true;
    }
    if (value === '') {
      this.showProductSearchDropdown = false;
    }
  }
  getProductsearchData(result) {
    this.ordersService.productSearch(result).subscribe(
      res => {
        if (!!res && !!res.success === true) {
          if(res.response.data.length > 0) {
            this.productSearchResult = res.response.data;
          } else {
            this.productSearchResult = [];
          }
        } else {
          this.productSearchResult = null;
        }
        console.log('The Product Data is ', this.productSearchResult);
      },
      err => {
        console.error(err);
        if (err.status === 500 || err.status === 502) {
          this.customerSearchResult = ['Network Error'];
          this.toastrService.showError('Network Error', 'Please try again later.');
        }
      }
    );
  }
  // End of the above code
  selectCustomer(data) {
    this.selectedCustomerData = data;
    if ( this.salesOrderObject.order_type === 'home_delivery') {
      this.ordersService.getCustomerAddressById(this.selectedCustomerData.userId).subscribe(
        res => {
          if (!!res && !!res.success === true) {
            if (res.response.data.length > 0) {
              this.customerAllAddresses = res.response.data;
              // tslint:disable-next-line: prefer-for-of
              for (let i = 0; i < this.customerAllAddresses.length; i++) {
                this.customerAllAddresses[i].isSelected = false;
              }
            } else {
              this.customerAllAddresses = [];
            }
          } else {
            this.toastrService.showError('Error', 'Something went wrong. Please try again later !!!');
            this.customerAllAddresses = null;
          }
        },
        err => {
          console.error(err);
          this.toastrService.showError('Error', 'Something went wrong. Please try again later !!!');
        }
      );
    }
    this.customerSearchForm.reset();
  }
  selectAddress(data) {
    this.selectedAddressId = null;
    this.ordersService.checkAreaServicable(data.pincode).subscribe(
      res => {
        if (!!res && !!res.success === true) {
          if(!!res.response.data && res.response.data.length > 0) {
            this.toastrService.showSuccess('Pincode Serviceable', 'We are available in the given Pincode!');
            this.selectedAddressId = data.addressId;
            // for (let i = 0; i < res.response.data.length; i++) {
            //   if(res.response.data[i].pincode === data.pincode) {
            //     this.toastrService.showSuccess('Pincode Serviceable', 'We are available in the given Pincode!');
            //     this.selectedAddressId = data.addressId;
            //   } else {
            //     this.selectedAddressId = null;
            //     this.toastrService.showWarning('Pincode Not Serviceable', 'We are not available in the given Pincode!');
            //   }
            // }
          } else {
            this.selectedAddressId = null;
            data.isSelected = false;
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < this.customerAllAddresses.length; i++) {
              this.customerAllAddresses[i].isSelected = false;
            }
            this.toastrService.showError('Error', 'Sorry! currently, we are not serviceable in this area');
          }
        } else {
          this.toastrService.showError('Error', 'Something went wrong. Please try again later !!!');
          this.selectedAddressId = null;
        }
        console.log(this.selectedAddressId);
      },
      err => {
        console.error(err);
        this.toastrService.showError('Network Error', 'Please try again later !!!');
      }
    );
  }
  selectProduct(data) {
    this.selectedProduct = null;
    this.selectedProduct = data;
  }
  // Method To Add Product In Cart
  addProductToCart(quantityValue) {
    if (!(!!this.selectedProduct && !!quantityValue)) {
      this.toastrService.showError('Error', 'Please Select Product and Quantity to add the product in cart');
      return false;
    }
    this.customerCurrentCart.push(
      {
        productId: this.selectedProduct.productId,
        productName: this.selectedProduct.productName,
        quantity: +quantityValue,
        category: this.selectedProduct.inventoryType
      }
    );
    this.selectedProduct = null;
    this.productSearchForm.reset();
    this.quantity = null;
    this.getCalculatedCartData();
  }
  addPromoCode(data) {
    this.salesOrderObject.promo_code = data;
    console.log('The Promo Code is ', this.salesOrderObject.promo_code);
    this.getCalculatedCartData();
  }
  getCalculatedCartData () {
    const requestObject = {
      cartItems: this.customerCurrentCart,
      couponCode: this.salesOrderObject.promo_code
    }
    this.ordersService.getCartCalculatedData(requestObject).subscribe(
      res => {
        console.log('The Cart Response is', res );
        if (!!res && !!res.success === true) {
          this.completeCartData = res.response.data;
          console.log('The Complete Cart Data is ', this.completeCartData);
          if(this.salesOrderObject.promo_code !== '') {
            if(this.completeCartData.discountDetails.includes(this.salesOrderObject.promo_code)) {
              this.toastrService.showSuccess('Success', 'Coupon Code Applied Successfully !!!');
            } else {
              this.toastrService.showError('Error', 'No Coupon Code is found in our system. Please check with another one !!!');
              this.salesOrderObject.promo_code = '';
            }
          }
        } else {
          this.toastrService.showError('Error', 'Something went wrong. Please try again later !!!');
          this.customerAllAddresses = null;
        }
      },
      err => {
        console.error(err);
        if (err.status === 400 && err.error.success === false) {
          this.toastrService.showError('Error', err.error.data.error);
          this.completeCartData = null;
        } else {
          this.toastrService.showError('Error', 'Something went wrong. Please try again later !!!');
        }
      }
    );
  }
   // Method to Fetch HTMMachingID Type
   getMachineIDDropdown() {
    this.ordersService.gethtmmachineID().subscribe(
      response => {
        if (!!response && !!response.success && response.success === true && response.response.data.length !== 0 ) {
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < response.response.data.length; i++) {
            this.machineIdDropdownData.push(
              {
                value: response.response.data[i].htmIdentity,
                label: response.response.data[i].htmName
              });
          }
        } else {
          this.machineIdDropdownData = [];
          console.log('No ID Coming from the BE');
        }
      },
      err => {
        this.toastrService.showError('Network Error', 'Please try again later');
        console.error(err);
      }
    );
  }
  orderTypeChanged() {
    this.selectedCustomerData = null;
  }

fileProgresscertificate(event) {
  if (event.target.files && event.target.files[0]) {
    for (let i = 0; i < event.target.files.length; i++) {
      var selectedcertFile = event.target.files[i];
            var reader = new FileReader();
            reader.onload = (event:any) => {
              this.previewUrlcertificate.push(event.target.result);
            }
            reader.readAsDataURL(selectedcertFile);
    }
}
    for (var i = 0; i < event.target.files.length; i++) { 
      this.fileDatacertificate.push(selectedcertFile);
    }
}
removeSelectedCertificate(index) {
  this.previewUrlcertificate.splice(index, 1);
  this.fileDatacertificate.splice(index, 1);
}
  // Below code is used for removing the product from the cart
  removeProductFromCart(data) {
    let indexValue = null;
    for (let i = 0; i < this.customerCurrentCart.length; i++) {
      if (this.customerCurrentCart[i].productId === data.productId) {
        indexValue = i;
      }
    }
    this.customerCurrentCart.splice(indexValue, 1);
    this.getCalculatedCartData();
  }
  // End of the above code
  // Method: to bind and map fields data for adding data to category list
  bindAddForm() {
    this.orderDetailsForm = this.formBuilder.group({});
  }
  // End of above code
  // Below is the code which is used to create sales Order
  createSalesOrder() {
    if (!!this.salesOrderObject.order_type && this.salesOrderObject.order_type !== '') {
      console.log(this.salesOrderObject.order_type);
    } else {
      this.toastrService.showError('Error', 'Please Select Order Type.');
      return false;
    }
    if (!(!!this.selectedCustomerData)) {
      this.toastrService.showError('Error', 'Please select Customer !!!');
      return false;
    }
    if (this.salesOrderObject.order_type === 'home_delivery') {
      if (!(!!this.selectedAddressId && this.selectedAddressId !== '')) {
        this.toastrService.showError('Error', 'Please add new address or select servicable address.');
        return false;
      }
    }
    if (this.salesOrderObject.order_type === 'store_pickup') {
      // tslint:disable-next-line: max-line-length
      if (!(!!this.salesOrderObject.htm_machine_id && (this.salesOrderObject.htm_machine_id.length === 0 || this.salesOrderObject.htm_machine_id !== ''))) {
        this.toastrService.showError('Error', 'Please Select HTM Machine !!!');
        return false;
      }
    }
    if (this.customerCurrentCart.length === 0) {
      this.toastrService.showError('Error', 'Please Add product to cart !!!');
      return false;
    }
    if (!!this.fileDatacertificate && this.fileDatacertificate.length === 0) {
      this.toastrService.showError('Error', 'Prescription is required.');
      return false;
    }
    if (!!this.salesOrderObject.mode_of_payment && this.salesOrderObject.mode_of_payment !== '') {
      console.log(this.salesOrderObject.mode_of_payment);
    } else {
      this.toastrService.showError('Error', 'Please select Payment mode.');
      return false;
    }
    if (!!this.salesOrderObject.method_of_transaction && this.salesOrderObject.method_of_transaction !== '') {
      console.log(this.salesOrderObject.method_of_transaction);
    } else {
      this.toastrService.showError('Error', 'Please selection transaction mehtod.');
      return false;
    }
    if (!!this.salesOrderObject.status_of_payment && this.salesOrderObject.status_of_payment !== '') {
      console.log(this.salesOrderObject.status_of_payment);
    } else {
      this.toastrService.showError('Error', 'Please update the status of payment.');
      return false;
    }
    const formData = new FormData();
    let tempOrderCategoryGroup = [];
    // tslint:disable-next-line: prefer-for-of
    for ( let i = 0; i < this.customerCurrentCart.length; i++) {
      if (!(tempOrderCategoryGroup.includes(this.customerCurrentCart[i].category))) {
        tempOrderCategoryGroup.push(this.customerCurrentCart[i].category);
      }
    }
    let tempOrderCart = [];
    // tslint:disable-next-line: prefer-for-of
    for ( let i = 0; i < this.completeCartData.cartItems.length; i++) {
      tempOrderCart.push({
        productName: this.completeCartData.cartItems[i].productName,
        productId: this.completeCartData.cartItems[i].productId,
        productAmount: this.completeCartData.cartItems[i].displayAmount,
        productQuantity: this.completeCartData.cartItems[i].quantity,
        productCategory: this.completeCartData.cartItems[i].category,
      });
    }
    let tempAddressObject = {};
    if (this.salesOrderObject.order_type === 'store_pickup') {
      tempAddressObject = {
        isStoreSelected: true,
        isOtcSelected: false,
        htmStoreId: this.salesOrderObject.htm_machine_id,
        userAddressId: null
      };
    } else if (this.salesOrderObject.order_type === 'over_the_counter') {
      tempAddressObject = {
        isStoreSelected: false,
        isOtcSelected: true,
        htmStoreId: null,
        userAddressId: null
      };
    } else {
      tempAddressObject = {
        isStoreSelected: false,
        isOtcSelected: false,
        htmStoreId: null,
        userAddressId: this.selectedAddressId
      };
    }
    this.disableBtn = true;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.fileDatacertificate.length; i++) {
      formData.append('prescription', !!this.fileDatacertificate[i] ? this.fileDatacertificate[i] : null);
    }
    formData.append('channel', 'SSP');
    formData.append('userId', this.selectedCustomerData.userId);
    formData.append('orderCategory', JSON.stringify(tempOrderCategoryGroup));
    formData.append('orderAmount', this.completeCartData.finalBillDetails.payableAmount);
    formData.append('orderDescription', this.salesOrderObject.order_description);
    formData.append('userDeliveryInstruction', this.salesOrderObject.user_delivery_instructions);
    formData.append('orderedItemCount', this.customerCurrentCart.length);
    formData.append('orderedItems', JSON.stringify(tempOrderCart));
    // tslint:disable-next-line: max-line-length
    formData.append('discountApplied', JSON.stringify(!!this.completeCartData.discountDetails && this.completeCartData.discountDetails.length !== 0 ? this.completeCartData.discountDetails : []));
    formData.append('addressDetails', JSON.stringify(tempAddressObject));
    // tslint:disable-next-line: max-line-length
    formData.append('modeOfPayment', !(this.salesOrderObject.mode_of_payment.length === 0 && this.salesOrderObject.mode_of_payment === '') ? this.salesOrderObject.mode_of_payment : null);
    // tslint:disable-next-line: max-line-length
    formData.append('methodOfTransaction', !(this.salesOrderObject.method_of_transaction.length === 0 && this.salesOrderObject.method_of_transaction === '') ? this.salesOrderObject.method_of_transaction : null);
    // tslint:disable-next-line: max-line-length
    formData.append('statusOfPayment', !(this.salesOrderObject.status_of_payment.length === 0 && this.salesOrderObject.status_of_payment === '') ? this.salesOrderObject.status_of_payment : null);
    this.ordersService.createSalesOrder(formData).subscribe(
      response => {
        if (!!response && !!response.success && response.success === true) {
          this.toastrService.showSuccess('Success', response.response.data.message + 'Order ID:' + response.response.data.orderId);
          this.disableBtn = false;
          this.router.navigate(['/app/ssp-panel/ssp-sales-order/sales-order'], { queryParams: { pageSize: 50, currentPage: 1} });
        } else {
          this.disableBtn = false;
          this.toastrService.showError('Error', response.data.error);
        }
      },
      err => {
        console.error(err);
        this.disableBtn = false;
        this.toastrService.showError('Error', err.error.data.error);
      }
    );
  }
  // End of the above code
onReset() {
    this.orderDetailsForm.reset();
}
gettypeDropdown() {
  const typeQueryStr = 'name=VENDOR_TYPES';
  this.ordersService.gettypeDropdown(typeQueryStr).subscribe(
    response => {
      if (!!response && !!response.success && response.success === true && response.response.data.length !== 0 ) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < response.response.data.length; i++) {
          this.typeDropdownData.push(
            {
              value: response.response.data[i],
              label: response.response.data[i]
            });
        }
      } else {
        this.typeDropdownData = [];
        console.log('No Type Coming from the BE');
      }
    },
    err => {
        this.toastrService.showError('Network Error', 'Please try again later');
        console.error(err);
      }
  );
}
getCategoryByid(data) {
  this.categoryDropdownData = [...[]];
  let tempDataString = data.replaceAll(' ', '_');
  tempDataString = data.replaceAll('"', '');
  const typeQueryStr = 'name=' + tempDataString;
  this.ordersService.gettypeDropdown(typeQueryStr).subscribe(
    response => {
      if (!!response && !!response.success && response.success === true && response.response.data.length !== 0 ) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < response.response.data.length; i++) {
          this.categoryDropdownData.push(
            {
              value: response.response.data[i],
              label: response.response.data[i]
            });
        }
      } else {
        this.categoryDropdownData = [];
        console.log('No Category Coming from the BE');
      }
    },
    err => {
        this.toastrService.showError('Network Error', 'Please try again later');
        console.error(err);
      }
  );
}
  // Method: to fetch Pincode Detail data from BE
  getpincodeData(enteredpincode) {
    const queryObj = {
      pincode: enteredpincode
    }
    const pincodeQueryStr = ProductUtilities.generateQueryString(queryObj);
    this.ordersService.getpincodedetails(pincodeQueryStr).subscribe(
      response => {
        if ( response.success === true) {
          if (!!response.response.data && response.response.data !== null) {
            this.pincode_state = response.response.data.state;
          } else {
            this.toastrService.showError('Error', 'Something went wrong. Please Try again latter');
          }
        }
      },
      err => {
        this.toastrService.showError('Network Error', 'Please try again later');
        console.error(err);
      }
    );
  }
  triggerAddressForm(){
       this.addAddressForm = this.formBuilder.group({
        addressLabel: ['', [Validators.required]],
        state: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
        city: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
        country: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
        pincode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^[1-9][0-9]{5}$/)]],
        street_address_1: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
        landmark: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
       });
   }
   get addresscheckout() { return this.addAddressForm.controls; }
   addressSubmit(data: any){
     this.addresssubmitted = true;
     // stop here if form is invalid
     if (this.addAddressForm.invalid) {
       this.toastrService.showWarning('Missing Data', 'Check the entry again!');
       return;
     } else {
       if (!!data.valid && data.valid === true) {
         const requestObj: any = {
          addressLabel: this.addAddressForm.get('addressLabel').value,
          state: this.addAddressForm.get('state').value,
          city: this.addAddressForm.get('city').value,
          pincode: this.addAddressForm.get('pincode').value,
          country: this.addAddressForm.get('country').value,
          address: this.addAddressForm.get('street_address_1').value,
          landmark: this.addAddressForm.get('landmark').value,
          isActive: true,
          userId: this.selectedCustomerData.userId
         };
         this.ordersService.addAddress(requestObj).subscribe(
           response => {
             if (!!response && response.success === true) {
               this.toastrService.showSuccess('Information!', response.response.message);
               this.ordersService.getCustomerAddressById(this.selectedCustomerData.userId).subscribe(
                res => {
                  console.log('The Customer Address Response is', res );
                  if (!!res && !!res.success === true) {
                    if(res.response.data.length > 0) {
                      this.customerAllAddresses = res.response.data;
                      $('#addAddressModal').modal('hide');
                    } else {
                      this.customerAllAddresses = [];
                    }
                  } else {
                    this.toastrService.showError('Error', 'Something went wrong. Please try again later !!!');
                    this.customerAllAddresses = null;
                  }
                },
                err => {
                  console.error(err);
                  this.toastrService.showError('Error', 'Something went wrong. Please try again later !!!');
                }
              );
             } else {
               this.toastrService.showError('Error', 'Something went wrong. Please try again later !!!');
             }
           },
           err => {
             console.error(err);
             this.toastrService.showError('Error', 'Something went wrong. Please try again later !!!');
           }
         );
       }
     }
   }
}
