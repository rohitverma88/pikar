import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import {IOption} from 'ng-select';
import { SelectionType, ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';
import { of } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';
import { ExportFile } from 'src/app/core/utilities/export-file';
import * as moment from 'moment';
import { ResponseCode } from 'src/app/core/dictionary/response-code';
import { ProductToasterService } from 'src/app/core/services/toaster.service';
import { ProductUtilities } from 'src/app/core/utilities/utility';
import { SspPanelSalesOrderService } from '../../../services/ssp-panel-sales-order.service';
declare var $:any;
@Component({
  selector: 'app-ssp-sales-order-listing',
  templateUrl: './ssp-sales-order-listing.component.html',
  styleUrls: ['./ssp-sales-order-listing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SspsalesOrderListingComponent implements OnInit {
@ViewChild('myTable') table: any;
maxDate: Date;
minDate: Date;
exportFileEntity = new ExportFile(this.auth, this.toastrService);
excelUploadForm: FormGroup;
excelfileName: any;
submitted = false;
retrepsubmitted = false;
chngstatsubmitted = false;
revendorsubmitted = false;
typeDropdownData: Array<IOption>;
categoryDropdownData: Array<IOption>;
statusDropdownData: Array<IOption> = [];
vendorListDropdownData: Array<IOption> = [];
orderTrackSubIdDropdownData: Array<IOption> = [];
returnrequestForm: FormGroup;
changestatusForm: FormGroup;
reassignVendorForm: FormGroup;
changestatus_userId: any;
changestatus_channel: any;
current_status: any;
dateRangePickerRange = {
  'Today': [moment(), moment()],
  'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
  'Last 7 Days': [moment().subtract(6, 'days'), moment()], 'Last 30 Days': [moment().subtract(29, 'days'), moment()],
  'This Month': [moment().startOf('month'), moment().endOf('month')],
  'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
};
selectService: string[];
  display = 'none';
  responseCode = ResponseCode;
  SelectionType = SelectionType;
  enableSummary = true;
  summaryPosition = 'top';
  pages: any;
  rows: any;
  selected = [];
  ColumnMode = ColumnMode;
  // object: for mapping label with api fields
  columns = [
    { name: 'S No', prop: 's_no' },
    { name: 'Order ID', prop: 'orderId'},
    { name: 'SSP ID', prop: 'sspId' },
    { name: 'User ID', prop: 'userId' },
    { name: 'Order Date', prop: 'orderDateTime' },
    { name: 'Channel', prop: 'channel' },
    { name: 'Amount', prop: 'amount'},
    { name: 'Category', prop: 'orderCategory'},
    { name: 'Order Status', prop: 'orderStatus'},
    { name: 'Available Actions', prop: 'availableActions'},
  ];
  productCategoryDropdown: Array<IOption> = [
    {
      value: 'MEDICINE',
      label: 'MEDICINE'
    },
    {
      value: 'PRODUCT',
      label: 'PRODUCT'
    }
  ];
  orderStatusData: Array<IOption> = [
    {
      value: 'ACTIVE',
      label: 'ACTIVE'
    },
    {
      value: 'CANCELLED',
      label: 'CANCELLED'
    },
    {
      value: 'DELIVERED',
      label: 'DELIVERED'
    },
    {
      value: 'UNDER REVIEW',
      label: 'UNDER REVIEW'
    },
    {
      value: 'UNDER PROCESS',
      label: 'UNDER PROCESS'
    },
    {
      value: 'UNDER REVIEW',
      label: 'UNDER REVIEW'
    }
  ];
  orderChannelData: Array<IOption> = [
    {
      value: 'MA',
      label: 'MA'
    },
    {
      value: 'SSP',
      label: 'SSP'
    }
  ];
  modeOfPaymentDropDownData: Array<IOption> = [
    {
      value: 'ONLINE',
      label: 'Online'
    },
    {
      value: 'OFFLINE',
      label: 'Offline'
    }
  ];
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
  searchField: FormControl;
  searchForm: FormGroup;
  filterObj = {
    search: '',
    pageSize: 50,
    currentPage: 1,
    sort_by: '',
    sort_type: '',
    type: null,
    category: null,
    date: null,
    start_date: null,
    end_date : null,
    orderStatus : '',
    orderCategory: null,
    channel: '',
    mode_of_payment : '',
    status_of_payment : '',
  };
  LIMITS = [
    { name: '10', id: 10 },
    { name: '25', id: 25 },
    { name: '50', id: 50 },
    { name: '100', id: 100 }
  ];
  limit: number = this.filterObj.pageSize;
  sub: any;
  constructor(private ordersService: SspPanelSalesOrderService,
              private formBuilder: FormBuilder,
              private toastrService: ProductToasterService,
              private auth: AuthService,
              private fb: FormBuilder,
              private excelformBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) {
                this.searchField = new FormControl();
                this.searchForm = fb.group({search: this.searchField});
                this.searchField.valueChanges
                  .debounceTime(400)
                  .switchMap(term => of(term)).subscribe(result => {
                    this.filterObj.search = result;
                    this.navigateUser();
                  });
                this.minDate = new Date();
                this.maxDate = new Date();
                this.minDate.setDate(this.minDate.getDate());
                this.maxDate.setDate(this.maxDate.getDate());
              }
  ngOnInit() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        this.filterObj.search = params.search || '';
        this.filterObj.pageSize = params.pageSize || '',
        this.filterObj.currentPage = params.currentPage || '';
        this.filterObj.sort_by = params.sort_by || '';
        this.filterObj.sort_type = params.sort_type || '';
        this.filterObj.category = params.category || '';
        this.filterObj.type = params.type || '';
        this.filterObj.start_date = params.start_date || '';
        this.filterObj.end_date = params.end_date || '';
        this.filterObj.channel = params.channel || '';
        this.filterObj.mode_of_payment = params.mode_of_payment || '';
        this.filterObj.status_of_payment = params.status_of_payment || '';
        this.filterObj.orderCategory = params.orderCategory || '';
        this.filterObj.orderStatus = params.orderStatus || '';
        this.getOrderListingData();
        this.getTypeDropdown();
      });
  }
  ngAfterViewInit() {
    $(document).ready(function() {
      $(document).on('change', '.custom-file-input', function (event) {
        $(this).next('.custom-file-label').html(event.target.files[0].name);
    })
    });
  }
  // Method: is used to Navigate user to a desired filter Page
   navigateUser() {
    const tempUrlQuery = ProductUtilities.generateQueryString(this.filterObj);
    const tempLink = '/app/ssp-panel/ssp-sales-order/sales-order?' + tempUrlQuery;
    this.router.navigateByUrl(tempLink);
  }
  // End of the Above Code
  // Method: used to export the data
  exportFile() {
    const isConfirmed = confirm('Do you want to export the list?');
    if (isConfirmed === true) {
      const tempUrlQuery = ProductUtilities.generateQueryString(this.filterObj);
      this.exportFileEntity.getExportData('ssp-pannel-sales-order', tempUrlQuery);
    }
  }
  // Method: which is used to fetch the vendor list from the BE
  getOrderListingData(){
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0);
    });
    const ordersQueryStr = ProductUtilities.generateQueryString(this.filterObj);
    this.ordersService.getOrderList(ordersQueryStr).subscribe(
      response => {
        if (!!response && response.success === true) {
          if (!!response.response.data && response.response.data.length > 0) {
            this.rows = response.response.data;
            this.pages = response.response.metadata;
          } else {
            this.rows = [];
            this.pages = {};
          }
          if (!!this.filterObj.start_date && this.filterObj.start_date !== '' && !!this.filterObj.end_date && this.filterObj.end_date !== '') {
            this.filterObj.date = [moment(this.filterObj.start_date), moment(this.filterObj.end_date)];
          }
        } else {
          this.toastrService.showError('Error', 'Something went wrong. Please try again later');
        }
      },
      err => {
        this.toastrService.showError('Error', 'Something went wrong. Please try again later');
        console.error(err);
      }
      // display error
    );
  }
  // End of the above code
  viewOrder(data) {
    if (!!data.orderId && data.orderId !== '') {
      // tslint:disable-next-line: max-line-length
      this.router.navigate(['/app/ssp-panel/ssp-sales-order/sales-order/view-ssp-sales-order'], { queryParams: { orderId: data.orderId} });
    } else {
      this.toastrService.showError('Error', 'Something went wrong please try again later');
    }
  }
  editOrder(data) {
    if (!!data.orderId && data.orderId !== '') {
      // tslint:disable-next-line: max-line-length
      this.router.navigate(['/app/ssp-panel/ssp-sales-order/sales-order/ace-ssp-sales-order'], { queryParams: { orderId: data.orderId, type: 'edit'}});
    } else {
      this.toastrService.showError('Error', 'Something went wrong please try again later');
    }
  }
  cancelOrder(data) {
    if (!!data && !!data.orderId && data.orderId !== '') {
      const isConfirmed = confirm('Do you seriously want to delete order having Order ID :' + data.orderId);
      if (isConfirmed === true) {
        const request = {
          orderId: data.orderId,
          channel: data.channel
        };
        const removeordersQueryStr = ProductUtilities.generateQueryString(request);
        this.ordersService.removeOrder(removeordersQueryStr).subscribe(
          response => {
            if (!!response && response.success === true) {
              this.toastrService.showSuccess('Success', response.response.message);
              this.getOrderListingData();
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
    } else {
      this.toastrService.showError('Error', 'Something went wrong. Please try again later!!!');
    }
  }
  // Method : to raise Refund
  raiseRefund(data) {
    if (!!data && !!data.orderId && data.orderId !== '') {
      const isConfirmed = confirm('You want to raise refund for Order ID :' + data.orderId + '?');
      if (isConfirmed === true) {
        const request = {
          orderId: data.orderId,
          channel: data.channel
        };
        const refundordersQueryStr = ProductUtilities.generateQueryString(request);
        this.ordersService.raiserefund(refundordersQueryStr, request).subscribe(
          response => {
            if (!!response && response.success === true) {
              this.toastrService.showWarning('Information!', response.response.data.message);
              this.getOrderListingData();
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
    } else {
      this.toastrService.showError('Error', 'Something went wrong. Please try again later!!!');
    }
  }
// Initialize Return/Replace Request Form
returreplaceRequest(data) {
  if (!!data && !!data.orderId && data.orderId !== '') {
    this.returnrequestForm = this.formBuilder.group({
      orderId: [{value: data.orderId, disabled: true}],
      channel: [{value: data.channel, disabled: true}],
      requestType: [null, [Validators.required]],
      remark: ['', [Validators.required]],
    });
  } else {
    this.toastrService.showError('Error', 'Something went wrong. Please try again later!!!');
  }
}
get returnreplacecheckout() { return this.returnrequestForm.controls; }
// Method : to raise return/replace request
returnreplaceSubmit(data: any) {
  this.retrepsubmitted = true;
  // stop here if form is invalid
  if (this.returnrequestForm.invalid) {
    this.toastrService.showWarning('Missing Data', 'Check the entry again!');
    return;
  } else {
    if (!!data.valid && data.valid === true) {
      const requestObj: any = {
        orderId: this.returnrequestForm.get('orderId').value,
        channel: this.returnrequestForm.get('channel').value,
        requestType: !!data.value.requestType && data.value.requestType === true ? 'RETURN' : 'REPLACEMENT',
        remark: this.returnrequestForm.get('remark').value,
      }
      const returnreplaceQueryStr = ProductUtilities.generateQueryString(requestObj);
      this.ordersService.returnreplace(returnreplaceQueryStr, requestObj).subscribe(
        response => {
          if (!!response && response.success === true) {
            this.toastrService.showWarning('Information!', response.response.data.message);
            $('#returnreplaceModal').modal('hide');
            this.getOrderListingData();
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
  // Method to Update Status
  changeStatus(data, rowdata) {
    if (!!data && !!data.orderTrackSubId && data.orderTrackSubId !== '') {
      const queryObj = {
        vendorMappingId: data.orderTrackSubId,
        channel: rowdata.channel
      }
      this.changestatus_userId = rowdata.userId;
      this.changestatus_channel = rowdata.channel;
      const statuschangeQueryStr = ProductUtilities.generateQueryString(queryObj);
      this.ordersService.getstatusDropdown(statuschangeQueryStr).subscribe(
        response => {
          if ( !!response && response.success === true) {
            if (response.response.data.availableStatus.length !== 0 ) {
              // tslint:disable-next-line: prefer-for-of
              for (let i = 0; i < response.response.data.availableStatus.length; i++) {
                this.statusDropdownData.push(
                  {
                    value: response.response.data.availableStatus[i],
                    label: response.response.data.availableStatus[i]
                  });
              }
            } else {
              this.statusDropdownData = [];
              this.toastrService.showError('Error', 'No Status Available.');
              console.log('No Sub Category Coming from the BE');
            }
            this.bindChangeStatusForm(response.response.data);
          } else {
            this.toastrService.showError('Error', response.data.error);
          }
        },
        err => {
          console.error(err);
          this.toastrService.showError('Error!', 'Something went wrong. Please try again later !!!');
        }
      );
    } else {
      this.toastrService.showError('Error', 'Something went wrong. Please try again later!!!');
    }
  }
  bindChangeStatusForm(data){
   if (!!data) {
      this.changestatusForm = this.formBuilder.group({
        orderId: [{value: data.orderId, disabled: true}],
        vendorMappingId: [{value: data.trackId, disabled: true}],
        channel: [{value: this.changestatus_channel, disabled: true}],
        userId: [{value: this.changestatus_userId, disabled: true}],
        status: [data.currentStatus, [Validators.required]]
      });
      this.current_status = data.currentStatus;
    } else {
      this.toastrService.showError('Error', 'Something went wrong. Please try again later!!!');
    }
  }
  get changestatuscheckout() { return this.changestatusForm.controls; }
  changeStatusSubmit(data: any){
    this.chngstatsubmitted = true;
    // stop here if form is invalid
    if (this.changestatusForm.invalid) {
      this.toastrService.showWarning('Missing Data', 'Check the entry again!');
      return;
    } else {
      if (!!data.valid && data.valid === true) {
        const requestObj: any = {
          orderId: this.changestatusForm.get('orderId').value,
          channel: this.changestatusForm.get('channel').value,
          userId: this.changestatusForm.get('userId').value,
          vendorMappingId: this.changestatusForm.get('vendorMappingId').value,
          status: this.changestatusForm.get('status').value,
        }
        this.ordersService.changestatus(requestObj).subscribe(
          response => {
            if (!!response && response.success === true) {
              this.toastrService.showSuccess('Information!', response.response.data.message);
              $('#changeStatusModal').modal('hide');
              this.getOrderListingData();
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
  // Method to get Vendor Dropdown list
  reassignVendor(data) {
    console.log(data);
    if (!!data && !!data.orderId && data.orderId !== '') {
      this.getVendorDropdownData();
      if (data.orderStatus.length !== 0 ) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < data.orderStatus.length; i++) {
          this.orderTrackSubIdDropdownData.push(
            {
              value: data.orderStatus[i].orderTrackSubId,
              label: data.orderStatus[i].orderTrackSubId
            });
        }
      } else {
        this.orderTrackSubIdDropdownData = [];
        this.toastrService.showError('Error', 'No Tracking IDs Found.');
      }
      this.bindreassignVendorForm(data);
    } else {
      this.toastrService.showError('Error', 'Something went wrong. Please try again later!!!');
    }
  }
  //Method to get Vendor Dropdown Data
  getVendorDropdownData() {
    this.ordersService.getVendorDropdownData().subscribe(
      response => {
        if ( !!response && response.success === true) {
          if (response.response.data.length !== 0 ) {
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < response.response.data.length; i++) {
              this.vendorListDropdownData.push(
                {
                  value: response.response.data[i].vendorId,
                  label: response.response.data[i].vendorName
                });
            }
          } else {
            this.vendorListDropdownData = [];
            this.toastrService.showError('Error', 'No Vendors Found.');
            console.log('No Vendors Coming from the BE');
          }
        } else {
          this.toastrService.showError('Error', response.data.error);
        }
      },
      err => {
        console.error(err);
        this.toastrService.showError('Error!', 'Something went wrong. Please try again later !!!');
      }
    );
  }
  bindreassignVendorForm(data){
    if (!!data) {
       this.reassignVendorForm = this.formBuilder.group({
         orderId: [{value: data.orderId, disabled: true}],
         vendorMappingId: [null, [Validators.required]],
         newVendorId: [null, [Validators.required]]
       });
     } else {
       this.toastrService.showError('Error', 'Something went wrong. Please try again later!!!');
     }
   }
get reassignvendorcheckout() { return this.reassignVendorForm.controls; }
//Method to Submit Vendor
reassignVendorSubmit(data: any) {
  this.revendorsubmitted = true;
  // stop here if form is invalid
  if (this.reassignVendorForm.invalid) {
    this.toastrService.showWarning('Missing Data', 'Check the entry again!');
    return;
  } else {
    if (!!data.valid && data.valid === true) {
      const requestObj: any = {
        orderId: this.reassignVendorForm.get('orderId').value,
        vendorMappingId: this.reassignVendorForm.get('vendorMappingId').value,
        newVendorId: this.reassignVendorForm.get('newVendorId').value,
      }
      const reassignVendorQueryStr = ProductUtilities.generateQueryString(requestObj);
      this.ordersService.reassignVendor(reassignVendorQueryStr, requestObj).subscribe(
        response => {
          if (!!response && response.success === true) {
            this.toastrService.showSuccess('Information!', response.response.data.message);
            $('#reassignVendorModal').modal('hide');
            this.getOrderListingData();
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
  // Method : to set pagination for list items
  setPage(event) {
    this.filterObj.currentPage = event.page;
    this.navigateUser();
  }
  // End of the Above code
  // Method: used to import the data
  importFile() {
    this.excelUploadForm = this.excelformBuilder.group({
      file: [null, [Validators.required]],
      mainFile: [null]
    });
  }
  get excelcheckout() { return this.excelUploadForm.controls; }
  // Method: Used to map the data of file from the file object called on onChange
  onSelectedFile(event) {
    this.excelUploadForm.get('mainFile').setValue(event.target.files[0]);
    this.excelfileName = this.excelUploadForm.get('mainFile').value.name;
  }
  onSubmit(formData) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.excelUploadForm.invalid) {
      this.toastrService.showWarning('Missing Data', 'Please upload again!');
      return;
    } else {
      if (!!formData.valid && formData.valid === true) {
        const formData = new FormData();
        formData.append('file', this.excelUploadForm.get('mainFile').value);
      }
    }
  }
  onReset() {
    this.excelUploadForm.reset();
    this.submitted = false;
    $('#uploadexcel').next('label').html('Choose file...');
  }
  // Below Method is used to get vendor type dropdown of for filters
  getTypeDropdown() {
    const typeQueryStr = 'name=VENDOR_TYPES';
    this.ordersService.gettypeDropdown(typeQueryStr).subscribe(
      response => {
        if (!!response && !!response.success && response.success === true && response.response.data.length !== 0 ) {
          this.typeDropdownData = [];
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
  // End of the above code
  // Below method is used to get the category dropdown
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
  // End of the above code
  // Below code is used to submit the Filter
  submitFilter(data) {
    console.log(data);
    if(!(!!data.orderCategory || !!data.orderStatus || !!data.date || !!data.channel || !!data.mode_of_payment || !!data.status_of_payment)) {
      this.toastrService.showError('Error', 'Select At Least One Filter');
      if (data.orderCategory === '' && data.orderStatus === '' && data.channel === '' && data.mode_of_payment === '' && data.status_of_payment === '' && data.date === null && data.date === undefined && data.date === '') {
        return false;
      }
    } else {
      let tempCategoryArr = [];
      if(!!data.orderCategory && data.orderCategory !== '') {
        tempCategoryArr.push(data.orderCategory);
      }
      this.filterObj.start_date = !!data.date && !!data.date[0] && data.date[0] !== '' ? moment(data.date[0]).format('DD/MM/YYYY') : '';
      this.filterObj.end_date = !!data.date && !!data.date[1] && data.date[1] !== '' ? moment(data.date[1]).format('DD/MM/YYYY') : '';
      this.filterObj.date  = null;
      this.filterObj.orderStatus = !!data.orderStatus && data.orderStatus !== '' ? data.orderStatus : '';
      this.filterObj.orderCategory = !!tempCategoryArr && tempCategoryArr.length  !== 0 ? tempCategoryArr : '';
      this.filterObj.channel = !!data.channel && data.channel !== '' ? data.channel : '';
      this.filterObj.mode_of_payment = !!data.mode_of_payment && data.mode_of_payment !== '' ? data.mode_of_payment : '';
      this.filterObj.status_of_payment = !!data.status_of_payment && data.status_of_payment !== '' ? data.status_of_payment : '';
      this.navigateUser();
      $('#filterModal').modal('hide');
    }
  }
  // End of the above code
  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }
  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }
  removeFilters() {
    this.router.navigate(['/app/ssp-panel/ssp-sales-order/sales-order'], { queryParams: { pageSize: 50, currentPage: 1}});
    this.getOrderListingData();
  }
}
