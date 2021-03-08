import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import {IOption} from 'ng-select';
import { ResponseCode } from 'src/app/core/dictionary/response-code';
import { SelectionType, ColumnMode } from '@swimlane/ngx-datatable';
import { ProductToasterService } from 'src/app/core/services/toaster.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductUtilities } from 'src/app/core/utilities/utility';
import { AuthService } from 'src/app/core/auth/auth.service';
import 'rxjs/Rx';
import { of } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';
import { ExportFile } from 'src/app/core/utilities/export-file';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { sspAdminService } from '../../services/ssp-admin.service';
declare var $:any;
@Component({
  selector: 'app-ssp-admin-listing',
  templateUrl: './ssp-admin-listing.component.html',
  styleUrls: ['./ssp-admin-listing.component.scss']
})
export class SspAdminListingComponent implements OnInit {
  fileName= 'ExcelSheet.xlsx';
maxDate: Date;
minDate: Date;
exportFileEntity = new ExportFile(this.auth, this.toastrService);
excelUploadForm: FormGroup;
excelfileName: any;
submitted = false;
stateDropdownData: Array<IOption>;
cityDropdownData: Array<IOption>;
changestatusForm: FormGroup;
chngstatsubmitted = false;
availableStatus: Array<string> = ["ACTIVE", "INACTIVE", "DISPOSED", "ON_HOLD", "VERIFIED", "UNVERIFIED", "CANCELLED","DEFAULTED"];
statusDropdownData: Array<IOption> = [];
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
    { name: 'SSP ID', prop: 'sspId' },
    { name: 'SSP Name', prop: 'name' },
    { name: 'Mobile No.', prop: 'mobile' },
    { name: 'State/City', prop: 'city' },
    { name: 'Outstanding Amount', prop: 'outstandingAmount' },
    { name: 'Reg. Date', prop: 'registrationDate'},
    { name: 'Total Sale Amt.', prop: 'totalSaleAmount'},
    { name: 'Total Sale Count', prop: 'TotalSaleCount'},
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
    city_name: null,
    state_name: '',
    totalSaleAmount: '',
    outstandingAmount: ''
  };
  LIMITS = [
    { name: '10', id: 10 },
    { name: '25', id: 25 },
    { name: '50', id: 50 },
    { name: '100', id: 100 }
  ];
  limit: number = this.filterObj.pageSize;
  sub: any;
  constructor(private sspService: sspAdminService ,
              private toastrService: ProductToasterService,
              private auth: AuthService,
              private fb: FormBuilder,
              private excelformBuilder: FormBuilder,
              private formBuilder: FormBuilder,
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
        this.filterObj.city_name = params.city_name || '';
        this.filterObj.state_name = params.state_name || '';
        this.filterObj.totalSaleAmount = params.totalSaleAmount || '';
        this.filterObj.outstandingAmount = params.outstandingAmount || '';
        this.getSSPListingData();
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
    const tempLink = '/app/ssp-admin?' + tempUrlQuery;
    this.router.navigateByUrl(tempLink);
  }
  // End of the Above Code
  // Method: used to export the data

  // exportFile() {
  //   const isConfirmed = confirm('Do you want to export the list?');
  //   if (isConfirmed === true) {
  //     const tempUrlQuery = ProductUtilities.generateQueryString(this.filterObj);
  //     this.exportFileEntity.getExportData('ssp-admin/listing', tempUrlQuery);
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
  getSSPListingData(){
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0);
    });
    const sspQueryStr = ProductUtilities.generateQueryString(this.filterObj);
    this.sspService.getSSPList(sspQueryStr).subscribe(
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
  viewSSP(data) {
    if (!!data.sspId && data.sspId !== '') {
      // tslint:disable-next-line: max-line-length
      this.router.navigate(['/app/ssp-admin/view-ssp-admin'], { queryParams: { sspId: data.sspId} });
    } else {
      this.toastrService.showError('Error', 'Something went wrong please try again later');
    }
  }
  editSSP(data) {
    if (!!data.sspId && data.sspId !== '') {
      // tslint:disable-next-line: max-line-length
      this.router.navigate(['/app/ssp-admin/add-edit-ssp-admin'], { queryParams: { sspId: data.sspId, type: 'edit'}});
    } else {
      this.toastrService.showError('Error', 'Something went wrong please try again later');
    }
  }
  deleteSSP(data) {
    if (!!data && !!data.sspId && data.sspId !== '') {
      const isConfirmed = confirm('Do you seriously want to delete SSP having SSP ID :' + data.sspId);
      if (isConfirmed === true) {
        const request = {
          sspId: data.sspId
        };
        const removesspQueryStr = ProductUtilities.generateQueryString(request);
        this.sspService.removeSSP(removesspQueryStr).subscribe(
          response => {
            if (!!response && response.success === true) {
              this.toastrService.showSuccess('Success', response.response.message);
              this.getSSPListingData();
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
  // Below Method is used to get State List
  getStateData() {
    const typeQueryStr = 'India';
    this.sspService.getStateList(typeQueryStr).subscribe(
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
      this.sspService.getcityDropdown(typeQueryStr).subscribe(
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
  // Below code is used to submit the Filter
  submitFilter(data) {
    if(!(!!data.state_name || !!data.city_name || !!data.date || !!data.totalSaleAmount || !!data.outstandingAmount)) {
      this.toastrService.showError('Error', 'Select At Least One Filter');
      if (data.state_name === '' && data.city_name === '' && data.totalSaleAmount === '' && data.outstandingAmount !=='' && data.date === null && data.date === undefined && data.date === '') {
        return false;
      }
    } else {
      let tempCityArr = [];
      if(!!data.city_name && data.city_name !== '') {
        tempCityArr.push(data.city_name);
      }
      this.filterObj.city_name = !!tempCityArr && tempCityArr.length  !== 0 ? tempCityArr : '';
      this.filterObj.state_name = !!data.state_name && data.state_name !== '' ? data.state_name : '';
      this.filterObj.start_date = !!data.date && !!data.date[0] && data.date[0] !== '' ? moment(data.date[0]).format('DD/MM/YYYY') : '';
      this.filterObj.end_date = !!data.date && !!data.date[1] && data.date[1] !== '' ? moment(data.date[1]).format('DD/MM/YYYY') : '';
      this.filterObj.date  = null;
      this.filterObj.totalSaleAmount = !!data.totalSaleAmount && data.totalSaleAmount !== '' ? data.totalSaleAmount : '',
      this.filterObj.outstandingAmount = !!data.outstandingAmount && data.outstandingAmount !== '' ? data.outstandingAmount : '',
      this.navigateUser();
      $('#filterModal').modal('hide');
    }
  }
  // End of the above code
  removeFilters() {
    this.router.navigate(['/app/ssp-admin'], { queryParams: { pageSize: 50, currentPage: 1}});
    this.getSSPListingData();
  }
  // Method to Update Status
  changeStatus(data) {
    if (!!data && !!data.sspId && data.sspId !== '') {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.availableStatus.length; i++) {
        this.statusDropdownData.push(
          {
            value: this.availableStatus[i],
            label: this.availableStatus[i]
          });
      }
      this.bindChangeStatusForm(data);
    }
      else {
      this.statusDropdownData = [];
      this.toastrService.showError('Error', 'No Status Available.');
      console.log('No Sub Category Coming from the BE');
    }
  }
  bindChangeStatusForm(data){
    if (!!data) {
       this.changestatusForm = this.formBuilder.group({
        sspId: [{value: data.sspId, disabled: true}],
        status: [null, [Validators.required]]
       });
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
          sspId: this.changestatusForm.get('sspId').value,
          status: this.changestatusForm.get('status').value,
         }
         const changestatusQueryStr = ProductUtilities.generateQueryString(requestObj);
         this.sspService.changestatus(changestatusQueryStr, requestObj).subscribe(
           response => {
             if (!!response && response.success === true) {
               this.toastrService.showSuccess('Information!', response.response.data.message);
               $('#changeStatusModal').modal('hide');
               this.getSSPListingData();
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
