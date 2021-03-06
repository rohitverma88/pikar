import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import {IOption} from 'ng-select';
import { ResponseCode } from 'src/app/core/dictionary/response-code';
import { SelectionType, ColumnMode } from '@swimlane/ngx-datatable';
import { InventoryService } from '../../../services/sspInventoryService';
import { ProductToasterService } from 'src/app/core/services/toaster.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductUtilities } from 'src/app/core/utilities/utility';
import 'rxjs/Rx';
import { of } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';
import { ExportFile } from 'src/app/core/utilities/export-file';
import { AuthService } from 'src/app/core/auth/auth.service';
import * as moment from 'moment';
declare var $:any;
@Component({
  selector: 'app-medicine-listing',
  templateUrl: './medicine-listing.component.html',
  styleUrls: ['./medicine-listing.component.scss']
})
export class MedicineListingComponent implements OnInit {
maxDate: Date;
minDate: Date;
typeDropdownData: Array<IOption> = [];
stateDropdownData: Array<IOption>;
cityDropdownData: Array<IOption>;
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
    { name: 'Product ID', prop: 'productId'},
    { name: 'Product Name', prop: 'productName' },
    { name: 'Category', prop: 'category'},
    { name: 'Sub Category', prop: 'subcategory' },
    { name: 'Precription', prop: 'prescriptionRequired'},
    { name: 'MRP', prop: 'mrp' },
    { name: 'Stocky Status', prop: 'inStock'},
    { name: 'Availability', prop: 'availabilityStatus'},
  ];
  searchField: FormControl;
  searchForm: FormGroup;
  filterObj = {
    inventoryType: 'MEDICINE',
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
    stock_units: '',
    vendorId : '',
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
        this.filterObj.inventoryType = 'MEDICINE';
        this.filterObj.search = params.search || '';
        this.filterObj.pageSize = params.pageSize || '',
        this.filterObj.currentPage = params.currentPage || '';
        this.filterObj.sort_by = params.sort_by || '';
        this.filterObj.sort_type = params.sort_type || '';
        this.filterObj.category = params.category || '';
        this.filterObj.start_date = params.start_date || '';
        this.filterObj.end_date = params.end_date || '';
        this.filterObj.instock = params.instock || '';
        this.filterObj.stock_units = params.stock_units || '';
        this.filterObj.vendorId = params.vendorId || '';
        this.filterObj.state = params.state || '';
        this.filterObj.city = params.city || '';
        // this.getMedicineListingData();
        this.gettypeDropdown();
        this.getInventoryListData();
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
    const tempLink = '/app/ssp-panel/ssp-inventory/medicine?' + tempUrlQuery;
    this.router.navigateByUrl(tempLink);
  }
  // End of the Above Code
  getInventoryListData() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0);
    });
    const medicineQueryStr = ProductUtilities.generateQueryString(this.filterObj);
    this.inventoryService.getInventoryList(medicineQueryStr).subscribe(
      response => {
        if (!!response && response.success === true) {
          if (!!response.response.data && response.response.data.length > 0) {
            this.rows = response.response.data;
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
  viewMedicine(data) {
    if (!!data.productId && data.productId !== '') {
      this.router.navigate(['/app/ssp-panel/ssp-inventory/medicine/view-medicine'], { queryParams: { productId: data.productId} });
    } else {
      this.toastrService.showError('Error', 'Something went wrong please try again later');
    }
  }
  editMedicine(data) {
    if (!!data.productId && data.productId !== '') {
      this.router.navigate(['/app/inventory/medicine/add-edit-medicine'], { queryParams: { productId: data.productId, type: 'edit'}});
    } else {
      this.toastrService.showError('Error', 'Something went wrong please try again later');
    }
  }
  deleteMedicine(data) {
    if (!!data && !!data.productId && data.productId !== '') {
      const isConfirmed = confirm('Do you seriously want to delete product having Product ID :' + data.productId);
      if (isConfirmed === true) {
        const request = {
          productId: data.productId
        };
        const removemedicineQueryStr = ProductUtilities.generateQueryString(request);
        this.inventoryService.removeMedicine(removemedicineQueryStr).subscribe(
          response => {
            if (!!response && response.success === true) {
              this.toastrService.showSuccess('Success', response.response.message);
              this.getInventoryListData();
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
        formData.append('type', 'MEDICINE');
        console.log(formData);
        this.inventoryService.importInventorySubmodule(formData).subscribe(
          response => {
            if (!!response && response.success === true) {
              this.toastrService.showSuccess('Success', 'Import Successfull. Please close the popup to see the updated list');
              this.getInventoryListData();
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
  // Method: used to export the data
  exportFile() {
    const isConfirmed = confirm('Do you want to export the list?');
    if (isConfirmed === true) {
      const tempUrlQuery = ProductUtilities.generateQueryString(this.filterObj);
      this.exportFileEntity.getExportData('/ssp-panel/ssp-inventory/medicine', tempUrlQuery);
    }
  }
// Below code will fetch the Category Dropdown Data
gettypeDropdown() {
  const typeQueryStr = 'name=MEDICINES';
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
// Below code is used to submit the Filter
submitFilter(data) {
  if(!(!!data.category || !!data.date || !!data.instock || !!data.stock_units || !!data.vendorId || !!data.city || !!data.state)) {
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
    let tempCityArr = [];
    if(!!data.city && data.city !== '') {
      tempCityArr.push(data.city);
    }
    this.filterObj.category = !!tempCategoryArr && tempCategoryArr.length  !== 0 ? tempCategoryArr : '';
    this.filterObj.start_date = !!data.date && !!data.date[0] && data.date[0] !== '' ? moment(data.date[0]).format('DD/MM/YYYY') : '';
    this.filterObj.end_date = !!data.date && !!data.date[1] && data.date[1] !== '' ? moment(data.date[1]).format('DD/MM/YYYY') : '';
    this.filterObj.date  = null;
    this.filterObj.stock_units = !!data.stock_units && data.stock_units !== '' ? data.stock_units : '';
    this.filterObj.vendorId = !!data.vendorId && data.vendorId !== '' ? data.vendorId : '';
    this.filterObj.state = !!data.state && data.state !== '' ? data.state : '';
    this.filterObj.city = !!tempCityArr && tempCityArr.length  !== 0 ? tempCityArr : '';
    this.navigateUser();
    $('#filterModal').modal('hide');
  }
}
// End of the above code
// Below Method is used to get State List
getStateData() {
  const typeQueryStr = 'India';
  this.inventoryService.getStateList(typeQueryStr).subscribe(
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
      this.inventoryService.getcityDropdown(typeQueryStr).subscribe(
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
// Remove All Filters
removeFilters() {
  this.router.navigate(['/app/ssp-panel/ssp-inventory/medicine'], { queryParams: { pageSize: 50, currentPage: 1}});
  this.getInventoryListData();
}
// End of Code
}
