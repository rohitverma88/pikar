import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import {IOption} from 'ng-select';
import { ResponseCode } from 'src/app/core/dictionary/response-code';
import { SelectionType, ColumnMode } from '@swimlane/ngx-datatable';
import { InventoryService } from '../../../services/InventoryService';
import { ProductToasterService } from 'src/app/core/services/toaster.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductUtilities } from 'src/app/core/utilities/utility';
import { of } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';
import { ExportFile } from 'src/app/core/utilities/export-file';
import { AuthService } from 'src/app/core/auth/auth.service';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
declare var $:any;
@Component({
  selector: 'app-diagnostics-listing',
  templateUrl: './diagnostics-listing.component.html',
  styleUrls: ['./diagnostics-listing.component.scss']
})
export class DiagnosticsListingComponent implements OnInit {
  fileName= 'ExcelSheet.xlsx';
vendorListData: Array<IOption> = [];
typeDropdownData: Array<IOption> = [];
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
    { name: 'Test ID', prop: 'productId'},
    { name: 'Product Name', prop: 'productName' },
    { name: 'Category', prop: 'category'},
    { name: 'Sub Category', prop: 'subcategory' },
    { name: 'Date', prop: 'updatedAt'},
    { name: 'Total Tests', prop: 'noOfTests' },
    { name: 'MRP', prop: 'mrp' },
    { name: 'Stocky Status', prop: 'inStock'},
    { name: 'Availability', prop: 'availabilityStatus'},
  ];
  searchField: FormControl;
  searchForm: FormGroup;
  filterObj = {
    search: '',
    pageSize: 50,
    currentPage: 1,
    sort_by: '',
    sort_type: '',
    category: null,
    date: null,
    start_date: null,
    end_date : null,
    instock : null,
    vendorId: '',
    provider:'',
  };
  LIMITS = [
    { name: '10', id: 10 },
    { name: '25', id: 25 },
    { name: '50', id: 50 },
    { name: '100', id: 100 }
  ];
  limit: number = this.filterObj.pageSize;
  sub: any;
  constructor(private inventoryService: InventoryService,
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
        this.filterObj.start_date = params.start_date || '';
        this.filterObj.end_date = params.end_date || '';
        this.filterObj.instock = params.instock || '';
        this.filterObj.vendorId = params.vendorId || '';
        this.filterObj.provider = params.provider || '',
        this.getDiagnosticListingData();
        this.gettypeDropdown();
        this.getVendorListforDropdown();
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
    const tempLink = '/app/inventory/diagnostics?' + tempUrlQuery;
    this.router.navigateByUrl(tempLink);
  }
  // End of the Above Code
  // Method: which is used to fetch the Diagnostics list from the BE
  getDiagnosticListingData(){
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0);
    });
    const diagnosticQueryStr = ProductUtilities.generateQueryString(this.filterObj);
    this.inventoryService.getDiagnosticsList(diagnosticQueryStr).subscribe(
      response => {
        if (!!response && response.success === true) {
          if (!!response.response.data && response.response.data.length > 0) {
            this.rows = response.response.data;
            console.log(this.rows);
            this.pages = response.response.metadata;
          } else {
            this.rows = [];
            this.pages = {};
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
  viewDiagnostic(data) {
    if (!!data.productId && data.productId !== '') {
      // tslint:disable-next-line: max-line-length
      this.router.navigate(['/app/inventory/diagnostics/view-diagnostics'], { queryParams: { productId: data.productId} });
    } else {
      this.toastrService.showError('Error', 'Something went wrong please try again later');
    }
  }
  editDiagnostic(data) {
    if (!!data.productId && data.productId !== '') {
      // tslint:disable-next-line: max-line-length
      this.router.navigate(['/app/inventory/diagnostics/add-edit-diagnostics'], { queryParams: { productId: data.productId, type: 'edit'}});
    } else {
      this.toastrService.showError('Error', 'Something went wrong please try again later');
    }
  }
  deleteDiagnostic(data) {
    if (!!data && !!data.productId && data.productId !== '') {
      const isConfirmed = confirm('Do you seriously want to delete product having Product ID :' + data.productId);
      if (isConfirmed === true) {
        const request = {
          productId: data.productId
        };
        const removediagnosticQueryStr = ProductUtilities.generateQueryString(request);
        this.inventoryService.removeDiagnosticProduct(removediagnosticQueryStr).subscribe(
          response => {
            if (!!response && response.success === true) {
              this.toastrService.showSuccess('Success', response.response.message);
              this.getDiagnosticListingData();
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
  // Method: used to export the data

  // exportFile() {
  //   const isConfirmed = confirm('Do you want to export the list?');
  //   if (isConfirmed === true) {
  //     const tempUrlQuery = ProductUtilities.generateQueryString(this.filterObj);
  //     this.exportFileEntity.getExportData('inventory/diagnostic', tempUrlQuery);
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
    console.log(this.excelfileName);
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
        formData.append('type', 'DIAGNOSTIC');
        console.log(formData);
        this.inventoryService.importInventorySubmodule(formData).subscribe(
          response => {
            if (!!response && response.success === true) {
              this.toastrService.showSuccess('Success', 'Import Successfull. Please close the popup to see the updated list');
              this.getDiagnosticListingData();
            } else {
              this.toastrService.showError('Error', response.data.message);
            }
          },
          err => {
            console.error(err);
            // tslint:disable-next-line: max-line-length
            this.toastrService.showError('Error', !!err && !!err.error && !!err.error.data && !!err.error.data.message && err.error.data.message !== '' ? err.error.data.message : 'Something went wrong. Please try again later!!!');
          }
        );
      }
    }
  }
  onReset() {
    this.excelUploadForm.reset();
    this.submitted = false;
    $('#uploadexcel').next('label').html('Choose file...');
  }
  // Method to get Category Dropdown
  gettypeDropdown() {
    const typeQueryStr = 'name=DIAGNOSTICS';
    this.inventoryService.gettypeDropdown(typeQueryStr).subscribe(
      response => {
        console.log(response);
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
  getVendorListforDropdown(){
    this.inventoryService.getVendorListForDropdown().subscribe(
      response => {
        if (!!response && !!response.success && response.success === true && response.response.data.length !== 0 ) {
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < response.response.data.length; i++) {
            this.vendorListData.push(
              {
                value: response.response.data[i].vendorId,
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
// Below code is used to submit the Filter
submitFilter(data) {
  if(!(!!data.category || !!data.date || !!data.instock || !!data.vendorId || !!data.provider)) {
    this.toastrService.showError('Error', 'Select at least one Filter');
  } else {
    if (data.category === '' && data.date === null && data.date === undefined && data.date === '') {
      this.toastrService.showError('Error', 'Invalid Date');
      return false;
    }
    let tempCategoryArr = [];
    if(!!data.category && data.category !== '') {
      tempCategoryArr.push(data.category);
    }
    if(!!data.instock) {
      this.filterObj.instock = true;
    }
    this.filterObj.category = !!tempCategoryArr && tempCategoryArr.length  !== 0 ? tempCategoryArr : '';
    this.filterObj.start_date = !!data.date && !!data.date[0] && data.date[0] !== '' ? moment(data.date[0]).format('DD/MM/YYYY') : '';
    this.filterObj.end_date = !!data.date && !!data.date[1] && data.date[1] !== '' ? moment(data.date[1]).format('DD/MM/YYYY') : '';
    this.filterObj.date  = null;
    this.filterObj.vendorId = !!data.vendorId && data.vendorId !== '' ? data.vendorId : '';
    this.filterObj.provider = !!data.provider && data.provider !== '' ? data.provider : '';
    this.navigateUser();
    $('#filterModal').modal('hide');
  }
}
// End of the above code
// Remove Filters Method
removeFilters() {
  this.router.navigate(['app/inventory/diagnostics'], { queryParams: { pageSize: 50, currentPage: 1}});
  this.getDiagnosticListingData();
}
// End of Method
}
