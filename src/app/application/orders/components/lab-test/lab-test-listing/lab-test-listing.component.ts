import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import {IOption} from 'ng-select';
import { SelectionType, ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// tslint:disable-next-line: import-blacklist
import 'rxjs/Rx';
import { of } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';
import * as moment from 'moment';
import { ExportFile } from 'src/app/core/utilities/export-file';
import { ExportPdfFile } from 'src/app/core/utilities/export-pdf';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ResponseCode } from 'src/app/core/dictionary/response-code';
import { ProductToasterService } from 'src/app/core/services/toaster.service';
import { ProductUtilities } from 'src/app/core/utilities/utility';
import { OrderService } from '../../../services/orders.service';
import * as XLSX from 'xlsx';
declare var $: any;
@Component({
  selector: 'app-lab-test-listing',
  templateUrl: './lab-test-listing.component.html',
  styleUrls: ['./lab-test-listing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LabTestListingComponent implements OnInit {
  fileName= 'ExcelSheet.xlsx';
@ViewChild('myTable') table: any;
maxDate: Date;
minDate: Date;
exportFileEntity = new ExportFile(this.auth, this.toastrService);
excelUploadForm: FormGroup;
excelfileName: any;
submitted = false;

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
    { name: 'Booking ID', prop: 'bookingId'},
    { name: 'Booking Type', prop: 'bookingType' },
    { name: 'Vendor ID', prop: 'vendorId' },
    { name: 'Booking Date', prop: 'bookingDate' },
    { name: 'Amount', prop: 'amount'},
    { name: 'Status', prop: 'status'},
    { name: 'Available Actions', prop: 'actions'},
  ];
  orderStatusData: Array<IOption> = [
    {
      value: 'BOOKED',
      label: 'BOOKED'
    },
    {
      value: 'CANCELLED',
      label: 'CANCELLED'
    }
  ];
  orderChannelData: Array<IOption> = [
    {
      value: 'WP',
      label: 'Admin'
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
    bookingType: null,
    category: null,
    date: null,
    start_date: null,
    end_date : null,
    status: '',
    channel: '',
    mode_of_payment : '',
    status_of_payment : ''
  };
  LIMITS = [
    { name: '10', id: 10 },
    { name: '25', id: 25 },
    { name: '50', id: 50 },
    { name: '100', id: 100 }
  ];
  limit: number = this.filterObj.pageSize;
  sub: any;
  constructor(private ordersService: OrderService,
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
        this.filterObj.bookingType = params.bookingType || '';
        this.filterObj.start_date = params.start_date || '';
        this.filterObj.end_date = params.end_date || '';
        this.filterObj.status = params.status || '';
        this.filterObj.channel = params.channel || '';
        this.filterObj.mode_of_payment = params.mode_of_payment || '';
        this.filterObj.status_of_payment = params.status_of_payment || '';
        this.getLabTestBookingListData();
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
    const tempLink = '/app/orders/lab-test?' + tempUrlQuery;
    this.router.navigateByUrl(tempLink);
  }
  // End of the Above Code
  // Method: used to export the data

  // exportFile() {
  //   const isConfirmed = confirm('Do you want to export the list?');
  //   if (isConfirmed === true) {
  //     const tempUrlQuery = ProductUtilities.generateQueryString(this.filterObj);
  //     this.exportFileEntity.getExportData('ssp-pannel-lab-test', tempUrlQuery);
  //   }
  // }


  exportFile() {
    const isConfirmed = confirm('Do you want to export the list?');
    if (isConfirmed === true) {
      // const tempUrlQuery = ProductUtilities.generateQueryString(this.filterObj);
      // this.exportFileEntity.getExportData('inventory/products', tempUrlQuery);
      // console.log(this.filterObj)

  /* table id is passed over here */   
  let element = document.getElementById('excel-table'); 
  const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
  

  /* generate workbook and add the worksheet */
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
  /* save to file */
  XLSX.writeFile(wb, this.fileName);

    }
  }


  // Method: which is used to fetch the Lab Test booking list from the BE
  getLabTestBookingListData() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0);
    });
    const ordersQueryStr = ProductUtilities.generateQueryString(this.filterObj);
    this.ordersService.getLabTestList(ordersQueryStr).subscribe(
      response => {
        if (!!response && response.success === true) {
          if (!!response.response.data && response.response.data.length > 0) {
            this.rows = response.response.data;
            console.log(this.rows)
            this.pages = response.response.metadata;
          } else {
            this.rows = [];
            this.pages = {};
          }
          // tslint:disable-next-line: max-line-length
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
  // tslint:disable-next-line: typedef
  viewOrder(data) {
    if (!!data && !!data.bookingId && data.bookingId !== '') {
      // tslint:disable-next-line: max-line-length
      this.router.navigate(['/app/orders/lab-test/view-lab-test'], { queryParams: { bookingId: data.bookingId} });
    } else {
      this.toastrService.showError('Error', 'Something went wrong please try again later');
    }
  }
  // tslint:disable-next-line: typedef
  editOrder(data) {
    if (!!data.bookingId && data.bookingId !== '') {
      // tslint:disable-next-line: max-line-length
      this.router.navigate(['/app/orders/lab-test/ace-lab-test'], { queryParams: { bookingId: data.bookingId, type: 'edit'}});
    } else {
      this.toastrService.showError('Error', 'Something went wrong please try again later');
    }
  }
  cancelBooking(data) {
    if (!!data && !!data.bookingId && data.bookingId !== '') {
      const isConfirmed = confirm('Do you seriously want to cancel the Booking ID :' + data.bookingId);
      if (isConfirmed === true) {
        const request = {
          bookingId: data.bookingId
        };
        const cancelorderQueryStr = ProductUtilities.generateQueryString(request);
        this.ordersService.canceBooking(cancelorderQueryStr).subscribe(
          response => {
            if (!!response && response.success === true) {
              this.toastrService.showSuccess('Success', response.response.message);
              this.getLabTestBookingListData();
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
// Below code is used to submit the Filter
submitFilter(data) {
  if(!(!!data.status || !!data.channel || !!data.date || !!data.mode_of_payment || !!data.status_of_payment)) {
    this.toastrService.showError('Error', 'Select At Least One Filter');
    if (data.status === '' && data.channel === '' && data.mode_of_payment === '' && data.status_of_payment === '' && data.date === null && data.date === undefined && data.date === '') {
      return false;
    }
  } else {
    this.filterObj.status = !!data.status && data.status !== '' ? data.status : '';
    this.filterObj.channel = !!data.channel && data.channel !== '' ? data.channel : '';
    this.filterObj.start_date = !!data.date && !!data.date[0] && data.date[0] !== '' ? moment(data.date[0]).format('DD/MM/YYYY') : '';
    this.filterObj.end_date = !!data.date && !!data.date[1] && data.date[1] !== '' ? moment(data.date[1]).format('DD/MM/YYYY') : '';
    this.filterObj.date  = null;
    this.filterObj.mode_of_payment = !!data.mode_of_payment && data.mode_of_payment !== '' ? data.mode_of_payment : '';
    this.filterObj.status_of_payment = !!data.status_of_payment && data.status_of_payment !== '' ? data.status_of_payment : '';
    this.navigateUser();
    $('#filterModal').modal('hide');
  }
}
  onReset() {
    this.excelUploadForm.reset();
    this.submitted = false;
    $('#uploadexcel').next('label').html('Choose file...');
  }
  // End of the above code
  removeFilters() {
    this.router.navigate(['/app/orders/lab-test'], { queryParams: { pageSize: 50, currentPage: 1}});
    this.getLabTestBookingListData();
  }
}
