import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Input, HostListener } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { OrderService } from '../../../services/orders.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IOption } from 'ng-select';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ResponseCode } from 'src/app/core/dictionary/response-code';
import { ProductToasterService } from 'src/app/core/services/toaster.service';
import { ProductUtilities } from 'src/app/core/utilities/utility';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { isNumeric } from 'rxjs/util/isNumeric';
declare var $:any;
@Component({
  selector: 'app-ace-lab-test',
  templateUrl: './ace-lab-test.component.html',
  styleUrls: ['./ace-lab-test.component.scss']
})
export class AceLabTestComponent implements OnInit {
  addressRadio: false;
  model: any = {};
  flagbookingfor: any;
  selectedVendorID: any;
  bsValue = new Date();
  minDate: Date;
  maxDate: Date;
  orderDetailsForm: FormGroup;
  addAddressForm: FormGroup;
  submitted = false;
  addresssubmitted = false;
  previewUrlcertificate = [];
  typeDropdownData: Array<IOption> = [];
  categoryDropdownData: Array<IOption> = [];
  serviceDropdownData: Array<IOption> = [];
  machineIdDropdownData: Array<IOption> = [];
  vendorListData: Array<IOption> = [];
  completeCartData: any;
  quantity: any;
  disableBtn = false;
  bookingSchedule: any = {
    date: '',
    time: ''
  }
  salesOrderObject: any = {
    order_type: '',
    htm_machine_id: '',
    promo_code: '',
    mode_of_payment: [],
    method_of_transaction: [],
    status_of_payment: [],
    instructionsForCollectionAgent: '',
    remark: ''
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
      label: 'Drop at Outlet'
    },
    {
      value: 'home_delivery',
      label: 'Home Collection'
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
  // tslint:disable-next-line: variable-name
  pincode_state: any;
  orderDetails: any;
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
    private ordersService: OrderService,
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
          this.getVendorListforDropdown();
        }
      }
      else {
        this.bindAddForm();
        // this.gettypeDropdown();
        // this.getServiceDropdownData();
        this.getMachineIDDropdown();
        this.getVendorListforDropdown();
      }
    });
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
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + 0);
    this.maxDate.setDate(this.maxDate.getDate() + 15);
  }
  ngOnInit() {
    this.flagbookingfor = 0;
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
    this.ordersService.getDiagnosticsList(result).subscribe(
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
      },
      err => {
        console.error(err);
        this.toastrService.showError('Network Error', 'Please try again later !!!');
      }
    );
  }
  addProductToCart(data) {
    if (!!data) {
      this.customerCurrentCart.push(
        {
          productId: data.productId,
          productName: data.productName,
          quantity: 1,
          category: 'DIAGNOSTIC'
        }
      );
      this.selectedProduct = null;
      this.productSearchForm.reset();
      this.getCalculatedCartData();
    } else {
      this.toastrService.showError('Error', 'Please Select Test!');
      return false;
    }
  }
  addPromoCode(data) {
    this.salesOrderObject.promo_code = data;
    this.getCalculatedCartData();
  }
  getCalculatedCartData () {
    const requestObject = {
      cartItems: this.customerCurrentCart,
      couponCode: this.salesOrderObject.promo_code
    }
    this.ordersService.getCartCalculatedData(requestObject).subscribe(
      res => {
        if (!!res && !!res.success === true) {
          this.completeCartData = res.response.data;
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
  vendorChanged(data) {
    if (!!data && data !== '') {
      this.selectedVendorID = data;
    }
  }
  // Method: to bind and map fields data for adding data to category list
  bindAddForm() {
    this.orderDetailsForm = this.formBuilder.group({});
  }
  // End of above code
  // Method: to bind and map fields data for adding data to category list
  bindEditForm(data) {
    this.orderDetailsForm = this.formBuilder.group({});
  }
  // End of above code
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
  // Below is the code which is used to create sales Order
  createSalesOrder() {
    if (!!this.salesOrderObject.order_type && this.salesOrderObject.order_type !== '') {
      console.log(this.salesOrderObject.order_type);
    } else {
      this.toastrService.showError('Error', 'Please Select Lab Test Type.');
      return false;
    }
    // this.disableBtn = true;
    if (!(!!this.selectedCustomerData && this.selectedCustomerData !== '')) {
      console.log(this.selectedCustomerData.userId);
      this.toastrService.showError('Error', 'Please select Customer.');
      // this.disableBtn = false;
      return false;
    }
    if (!(!!this.selectedVendorID && this.selectedVendorID !== '')) {
      this.toastrService.showError('Error', 'Please Select Vendor.');
      return false;
    }
    if (!!this.salesOrderObject.order_type && this.salesOrderObject.order_type !== '' && this.salesOrderObject.order_type === 'home_delivery') {
      if (!(!!this.selectedAddressId && this.selectedAddressId !== '')) {
        this.toastrService.showError('Error', 'Please add new address or select servicable address.');
        return false;
      }
    }
    if (!!this.salesOrderObject.order_type && this.salesOrderObject.order_type !== '' && this.salesOrderObject.order_type === 'store_pickup') {
      // tslint:disable-next-line: max-line-length
      if (!(!!this.salesOrderObject.htm_machine_id && this.salesOrderObject.htm_machine_id !== '')) {
        this.toastrService.showError('Error', 'Please Select HTM Machine ID.');
        return false;
      } else {
        console.log(this.salesOrderObject.htm_machine_id);
      }
    }
    if (this.customerCurrentCart.length === 0) {
      this.toastrService.showError('Error', 'Please Add product to cart !!!');
      return false;
    }
    if (!(!!this.bookingSchedule && !!this.bookingSchedule.date && this.bookingSchedule.date !== '' && !!this.bookingSchedule.time && this.bookingSchedule.time !== '')) {
      this.toastrService.showError('Error', 'Please select Date and Time.');
      return false;
    }
    if ((this.salesOrderObject.mode_of_payment.length === 0 && this.salesOrderObject.mode_of_payment === '') ||
    (this.salesOrderObject.method_of_transaction.length === 0 && this.salesOrderObject.method_of_transaction === '') ||
    (this.salesOrderObject.status_of_payment.length === 0 && this.salesOrderObject.status_of_payment === '')) {
      this.toastrService.showError('Error', 'Please Add Payment Details !!!');
      return false;
    }
    let tempbookingforStr= '';
    let temppatientDetails = {
      name: '',
      relation: '',
      gender: '',
      age: '',
      email: '',
      phone: ''
    };
    if(!!this.flagbookingfor && this.flagbookingfor === 1) {
      tempbookingforStr = 'OTHERS';
      if(!!this.model.name && this.model.name !== '' && !!this.model.relation && this.model.relation !== '' && !!this.model.gender && this.model.gender !== '' && !!this.model.email && this.model.email !== '' && !!this.model.phone && this.model.phone !== '' && !!this.model.age && this.model.age !== '') {
        temppatientDetails = {
          name: this.model.name,
          relation: this.model.relation,
          gender: this.model.gender,
          age: this.model.age,
          email: this.model.email,
          phone: this.model.phone
        }
      } else {
        this.toastrService.showError('Error', 'Please fill all the details in case booking for others');
        return false;
      }
    } else {
      tempbookingforStr = 'SELF';
      temppatientDetails = null;
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
    } else {
      tempAddressObject = {
        isStoreSelected: false,
        isOtcSelected: false,
        htmStoreId: null,
        userAddressId: this.selectedAddressId
      };
    }
    const finalRequestObj = {
      channel: 'WP',
      vendorId: this.selectedVendorID,
      bookingType: 'diagnostics',
      userId: this.selectedCustomerData.userId,
      bookingSchedule: JSON.stringify(this.bookingSchedule),
      instructionsForCollectionAgent: this.salesOrderObject.instructionsForCollectionAgent,
      remark: this.salesOrderObject.remark,
      bookingfor: tempbookingforStr,
      patientDetails: !!temppatientDetails ? JSON.stringify(temppatientDetails) : null,
      bookingAmount: this.completeCartData.finalBillDetails.payableAmount,
      bookingItemCount: this.customerCurrentCart.length,
      bookingItems: JSON.stringify(tempOrderCart),
      discountApplied: JSON.stringify(!!this.completeCartData.discountDetails && this.completeCartData.discountDetails.length !== 0 ? this.completeCartData.discountDetails : []),
      pickUpAddress: JSON.stringify(tempAddressObject),
      orderCategory: tempOrderCategoryGroup[0],
      modeOfPayment: !(this.salesOrderObject.mode_of_payment.length === 0 && this.salesOrderObject.mode_of_payment === '') ? this.salesOrderObject.mode_of_payment : null,
      methodOfTransaction: !(this.salesOrderObject.method_of_transaction.length === 0 && this.salesOrderObject.method_of_transaction === '') ? this.salesOrderObject.method_of_transaction : null,
      statusOfPayment: !(this.salesOrderObject.status_of_payment.length === 0 && this.salesOrderObject.status_of_payment === '') ? this.salesOrderObject.status_of_payment : null
    };
    this.ordersService.createBooking(finalRequestObj).subscribe(
      response => {
        if (!!response && !!response.success && response.success === true) {
          this.disableBtn = true;
          this.toastrService.showSuccess('Success', response.response.data.message + ' Order ID:' + response.response.data.bookingId);
          this.router.navigate(['/app/ssp-panel/ssp-sales-order/lab-test'], { queryParams: { pageSize: 50, currentPage: 1} });
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
getServiceDropdownData() {
  const typeQueryStr = 'name=VENDOR_SERVICES';
  this.ordersService.gettypeDropdown(typeQueryStr).subscribe(
    response => {
      if (!!response && !!response.success && response.success === true && response.response.data.length !== 0 ) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < response.response.data.length; i++) {
          this.serviceDropdownData.push(
            {
              value: response.response.data[i],
              label: response.response.data[i]
            });
        }
      } else {
        this.serviceDropdownData = [];
        console.log('No Sub Category Coming from the BE');
      }
      if ( this.orderDataFormType !== 'add') {
      this.gettypeDropdown();
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
        country: [{value: 'India', disabled: true}, Validators.required],
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
   getVendorListforDropdown(){
    const typeQueryStr = 'vendorType=DIAGNOSTICS';
    this.ordersService.getVendorListForDropdown(typeQueryStr).subscribe(
      response => {
        if (!!response && !!response.success && response.success === true && response.response.data.length !== 0 ) {
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < response.response.data.length; i++) {
            this.vendorListData.push(
              {
                value: response.response.data[i].accountId,
                label: response.response.data[i].vendorName
              });
          }
        } else {
          this.vendorListData = [];
          console.log('No Type Coming from the BE');
        }
      },
      err => {
        this.toastrService.showError('Network Error', 'Please try again later');
        console.error(err);
      }
    );
  }
}
