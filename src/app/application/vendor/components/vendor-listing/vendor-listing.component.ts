import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import {IOption} from 'ng-select';
import { ResponseCode } from 'src/app/core/dictionary/response-code';
import { SelectionType, ColumnMode } from '@swimlane/ngx-datatable';
import { VendorService  } from 'src/app/application/vendor/services/vendor.service';
import { ProductToasterService } from 'src/app/core/services/toaster.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductUtilities } from 'src/app/core/utilities/utility';
import { AuthService } from 'src/app/core/auth/auth.service';
import { of } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';
import { ExportFile } from 'src/app/core/utilities/export-file';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
declare var $: any;
@Component({
  selector: 'app-vendor-listing',
  templateUrl: './vendor-listing.component.html',
  styleUrls: ['./vendor-listing.component.scss']
})
export class VendorListingComponent implements OnInit {
  fileName= 'ExcelSheet.xlsx';
maxDate: Date;
minDate: Date;
exportFileEntity = new ExportFile(this.auth, this.toastrService);
excelUploadForm: FormGroup;
excelfileName: any;
submitted = false;
typeDropdownData: Array<IOption>;
categoryDropdownData: Array<IOption>;
stateDropdownData: Array<IOption>;
cityDropdownData: Array<IOption>;
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
    { name: 'S No', prop: 'id' },
    { name: 'Vendor ID', prop: 'category_name'},
    { name: 'Vendor Name', prop: 'short_description' },
    { name: 'Contact Number', prop: 'popularity' },
    { name: 'State/City', prop: 'type' },
    { name: 'Type', prop: 'parent_category' },
    { name: 'Category', prop: 'image_url'},
    { name: 'Sub Category', prop: 'image_url'},
    { name: 'Date of Start', prop: 'image_url'},
    { name: 'Product Listed (Count)', prop: 'image_url'},
    { name: 'Sale Amt.', prop: 'image_url'},
    { name: 'Sales No.', prop: 'image_url'},
    { name: 'Outstanding Amt.', prop: 'image_url'},
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
    totalSaleAmount: '',
    outstandingAmount: '',
    state: '',
    city: null
  };
  LIMITS = [
    { name: '10', id: 10 },
    { name: '25', id: 25 },
    { name: '50', id: 50 },
    { name: '100', id: 100 }
  ];
  limit: number = this.filterObj.pageSize;
  sub: any;
  constructor(private vendorService: VendorService ,
              private toastrService: ProductToasterService,
              private auth: AuthService,
              private fb: FormBuilder,
              private excelformBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) {
                this.searchField = new FormControl();
                this.searchForm = fb.group({search: this.searchField});
                this.searchField.valueChanges
                .pipe(
                  debounceTime(400),
                  distinctUntilChanged(),
                ).switchMap(term => of(term)).subscribe(result => {
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
        this.filterObj.totalSaleAmount = params.totalSaleAmount || '';
        this.filterObj.outstandingAmount = params.outstandingAmount || '';
        this.filterObj.state = params.state || '';
        this.filterObj.city = params.city || '';
        this.getVendorListingData();
        this.getTypeDropdown();
        this.getStateData();
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
    const tempLink = '/app/vendor?' + tempUrlQuery;
    this.router.navigateByUrl(tempLink);
  }
  // End of the Above Code
  // Method: used to export the data


  // exportFile() {
  //   const isConfirmed = confirm('Do you want to export the list?');
  //   if (isConfirmed === true) {
  //     const tempUrlQuery = ProductUtilities.generateQueryString(this.filterObj);
  //     this.exportFileEntity.getExportData('vendor/listing', tempUrlQuery);
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

  // Method: which is used to fetch the vendor list from the BE
  getVendorListingData(){
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0);
    });
    const vendorQueryStr = ProductUtilities.generateQueryString(this.filterObj);
    this.vendorService.getVendorList(vendorQueryStr).subscribe(
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
  viewVendor(data) {
    if (!!data.vendorId && data.vendorId !== '') {
      // tslint:disable-next-line: max-line-length
      this.router.navigate(['/app/vendor/view-vendor'], { queryParams: { vendorId: data.vendorId} });
    } else {
      this.toastrService.showError('Error', 'Something went wrong please try again later');
    }
  }
  editVendor(data) {
    if (!!data.vendorId && data.vendorId !== '') {
      // tslint:disable-next-line: max-line-length
      this.router.navigate(['/app/vendor/add-edit-vendor'], { queryParams: { vendorId: data.vendorId, type: 'edit'}});
    } else {
      this.toastrService.showError('Error', 'Something went wrong please try again later');
    }
  }
  deleteVendor(data) {
    if (!!data && !!data.vendorId && data.vendorId !== '') {
      const isConfirmed = confirm('Do you seriously want to delete vendor having Vendor ID :' + data.vendorId);
      if (isConfirmed === true) {
        const request = {
          vendorId: data.vendorId
        };
        const removeVendorQueryStr = ProductUtilities.generateQueryString(request);
        this.vendorService.removeVendor(removeVendorQueryStr).subscribe(
          response => {
            if (!!response && response.success === true) {
              this.toastrService.showSuccess('Success', response.response.message);
              this.getVendorListingData();
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
  onReset() {
    this.excelUploadForm.reset();
    this.submitted = false;
    $('#uploadexcel').next('label').html('Choose file...');
  }
  // Below Method is used to get vendor type dropdown of for filters
  getTypeDropdown() {
    const typeQueryStr = 'name=VENDOR_TYPES';
    this.vendorService.gettypeDropdown(typeQueryStr).subscribe(
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
    this.vendorService.gettypeDropdown(typeQueryStr).subscribe(
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
    if(!(!!data.category || !!data.type || !!data.date || !!data.outstandingAmount || !!data.totalSaleAmount || !!data.city || !!data.state)) {
      this.toastrService.showError('Error', 'Select At Least One Filter');
      if (data.category === '' && data.type === '' && data.date === null && data.date === undefined && data.date === '') {
        return false;
      }
    } else {
      let tempCategoryArr = [];
      if(!!data.category && data.category !== '') {
        tempCategoryArr.push(data.category);
      }
      let tempTypeArr = [];
      if(!!data.type && data.type !== '') {
        tempTypeArr.push(data.type);
      }
      let tempCityArr = [];
      if(!!data.city && data.city !== '') {
        tempCityArr.push(data.city);
      }
      this.filterObj.type = !!tempTypeArr && tempTypeArr.length  !== 0 ? tempTypeArr : '';
      this.filterObj.category = !!tempCategoryArr && tempCategoryArr.length  !== 0 ? tempCategoryArr : '';
      this.filterObj.start_date = !!data.date && !!data.date[0] && data.date[0] !== '' ? moment(data.date[0]).format('DD/MM/YYYY') : '';
      this.filterObj.end_date = !!data.date && !!data.date[1] && data.date[1] !== '' ? moment(data.date[1]).format('DD/MM/YYYY') : '';
      this.filterObj.date  = null;
      this.filterObj.totalSaleAmount = !!data.totalSaleAmount && data.totalSaleAmount !== '' ? data.totalSaleAmount : '';
      this.filterObj.outstandingAmount = !!data.outstandingAmount && data.outstandingAmount !== '' ? data.outstandingAmount : '';
      this.filterObj.state = !!data.state && data.state !== '' ? data.state : '';
      this.filterObj.city = !!tempCityArr && tempCityArr.length  !== 0 ? tempCityArr : '';
      this.navigateUser();
      $('#filterModal').modal('hide');
    }
  }
    // Below Method is used to get State List
    getStateData() {
      const typeQueryStr = 'India';
      this.vendorService.getStateList(typeQueryStr).subscribe(
        response => {
          if (!!response && !!response.success && response.success === true && response.response.data.length !== 0 ) {
            this.stateDropdownData = [];
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < response.response.data.length; i++) {
              this.stateDropdownData.push(
                {
                  value: response.response.data[i].state_name,
                  label: response.response.data[i].state_name
                });
            }
          } else {
            this.stateDropdownData = [];
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
    // Below method is used to get City List
    getCityByState(data) {
      if(!!data && data !== '') {
        const typeQueryStr = data;
        this.vendorService.getcityDropdown(typeQueryStr).subscribe(
          response => {
            if (!!response && !!response.success && response.success === true && response.response.data.length !== 0 ) {
              this.cityDropdownData = [];
              console.log(response);
              // tslint:disable-next-line: prefer-for-of
              for (let i = 0; i < response.response.data.length; i++) {
                this.cityDropdownData.push(
                  {
                    value: response.response.data[i].city_name,
                    label: response.response.data[i].city_name
                  });
              }
            } else {
              this.cityDropdownData = [];
              console.log('No Category Coming from the BE');
            }
          },
          err => {
            this.toastrService.showError('Network Error', 'Please try again later');
            console.error(err);
          }
        );
      }
    }
  // End of the above code
  removeFilters() {
    this.router.navigate(['/app/vendor'], { queryParams: { pageSize: 50, currentPage: 1}});
    this.getVendorListingData();
  }
}
