import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Input } from '@angular/core';
import { ResponseCode } from 'src/app/core/dictionary/response-code';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { InventoryService } from '../../../services/InventoryService';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductToasterService } from 'src/app/core/services/toaster.service';
import { IOption } from 'ng-select';
import { ProductUtilities } from 'src/app/core/utilities/utility';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { isNumeric } from 'rxjs/util/isNumeric';
@Component({
  selector: 'app-ace-diagnostics',
  templateUrl: './ace-diagnostics.component.html',
  styleUrls: ['./ace-diagnostics.component.scss']
})
export class AceDiagnosticsComponent implements OnInit {
  today: Date;
  maxDate: Date;
  minDate: Date;
  diagnosticdetailsForm: FormGroup;
  submitted = false;
  fileDatadiagnostic: string [] = [];
  previewUrltestimages = [];
  typeDropdownData: Array<IOption> = [];
  vendorListData: Array<IOption> = [];
  categoryDropdownData: Array<IOption> = [];
  serviceDropdownData: Array<IOption> = [];
  dropdownData: any = {};
  sub: any;
  diagnosticDataFormType: string;
  productId: string;
  diagnosticDetails: any;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private inventoryService: InventoryService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ProductToasterService
  ) {
    this.sub = this.route
    .queryParams
    .subscribe(params => {
      this.diagnosticDataFormType = params.type;
      if ( this.diagnosticDataFormType !== 'add') {
        if (!!params.productId && params.productId !== '') {
          this.productId = params.productId;
          this.gettypeDropdown();
          this.getVendorListforDropdown();
        }
      } 
      else {
        this.bindAddForm();
        this.gettypeDropdown();
        this.getVendorListforDropdown();
      }
    });
    this.today = new Date();
    this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), 2);
  }
  ngOnInit() {}
  fileProgressdiagnostic(event) {
    if (event.target.files && event.target.files[0]) {
      for (let i = 0; i < event.target.files.length; i++) {
        var selectedFile = event.target.files[i];
              var reader = new FileReader();
              reader.onload = (event:any) => {
                this.previewUrltestimages.push(event.target.result);
              }
              reader.readAsDataURL(selectedFile);
      }
  }
      for (var i = 0; i < event.target.files.length; i++) { 
        this.fileDatadiagnostic.push(selectedFile);
      }
  }
  removeSelectedFile(index) {
    this.fileDatadiagnostic.splice(index, 1);
    this.previewUrltestimages.splice(index, 1);
   }
  // Method: to bind and map fields data for adding data to category list
  bindAddForm() {
    this.diagnosticdetailsForm = this.formBuilder.group({
      category: ['', Validators.required],
      vendorId: ['', [Validators.required]],
      isAvailable: [null, [Validators.required]],
      testImages: [null],
      mrp: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      discount: ['', [Validators.maxLength(10), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      costToCompany: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      gst: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      totalMargin: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      SS_Margin: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      SSP_Margin: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      sku: ['', [Validators.maxLength(10), Validators.minLength(3), Validators.pattern('^[0-9]*$')]],
      testName: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
      noOfTests: ['', [Validators.maxLength(5), Validators.minLength(1), Validators.pattern('^[0-9]*$')]],
      testCode: ['', [Validators.minLength(2), Validators.maxLength(15), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      resultTime: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9\s-]+$/)]],
      schedule: ['', [Validators.required, Validators.maxLength(1000), Validators.minLength(2)]],
      tags: ['', [Validators.maxLength(1000), Validators.minLength(2)]],
      testIncludedDetails: ['', [Validators.maxLength(1000), Validators.minLength(2)]],
      precautions: ['', [Validators.required, Validators.maxLength(1000), Validators.minLength(2)]],
      sampleType: ['', [Validators.required, Validators.maxLength(1000), Validators.minLength(2)]],
      method: ['', [Validators.maxLength(1000), Validators.minLength(2)]],
    });
  }
  // End of above code
  // Method: to bind and map fields data for adding data to category list
  bindEditForm(data) {

    this.diagnosticdetailsForm = this.formBuilder.group({
      category: [data.category, Validators.required],
      vendorId: [data.vendorId, [Validators.required]],
      isAvailable: [data.isAvailable, [Validators.required]],
      testImages: [null],
      mrp: [data.mrp, [Validators.required, Validators.maxLength(10), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      discount: [data.discount, [Validators.maxLength(10), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      costToCompany: [data.costToCompany, [Validators.required, Validators.maxLength(10), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      gst: [data.gst, [Validators.required, Validators.maxLength(10), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      totalMargin: [data.totalMargin, [Validators.required, Validators.maxLength(10), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      SS_Margin: [data.SS_Margin, [Validators.required, Validators.maxLength(10), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      SSP_Margin: [data.SSP_Margin, [Validators.required, Validators.maxLength(10), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      sku: [data.sku, [Validators.maxLength(10), Validators.minLength(3), Validators.pattern('^[0-9]*$')]],
      testName: [data.testName, [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
      noOfTests: [data.noOfTests, [Validators.maxLength(5), Validators.minLength(1), Validators.pattern('^[0-9]*$')]],
      testCode: [data.testCode, [Validators.minLength(2), Validators.maxLength(15), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      resultTime: [data.resultTime, [Validators.required, Validators.maxLength(15), Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9\s-]+$/)]],
      schedule: [data.schedule, [Validators.required, Validators.maxLength(1000), Validators.minLength(2)]],
      tags: [data.tags, [Validators.maxLength(1000), Validators.minLength(2)]],
      testIncludedDetails: [data.testIncludedDetails, [Validators.maxLength(1000), Validators.minLength(2)]],
      precautions: [data.precautions, [Validators.required, Validators.maxLength(1000), Validators.minLength(2)]],
      sampleType: [data.sampleType, [Validators.required, Validators.maxLength(1000), Validators.minLength(2)]],
      method: [data.method, [Validators.maxLength(1000), Validators.minLength(2)]],
    });
  }
  // End of above code
  // convenience getter for easy access to form fields
  get diagnosticcheckout() { return this.diagnosticdetailsForm.controls; }
  onSubmit(formData) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.diagnosticdetailsForm.invalid) {
      this.toastrService.showWarning('Missing Data', 'Check the entry again!');
      return;
    } else {
      if (!!formData.valid && formData.valid === true) {
        const formData = new FormData();
        for (var i = 0; i < this.fileDatadiagnostic.length; i++) {
          formData.append("testImages", !!this.fileDatadiagnostic[i] ? this.fileDatadiagnostic[i] : null);
        }
        formData.append('vendorId', this.diagnosticdetailsForm.get('vendorId').value);
        formData.append('testName', this.diagnosticdetailsForm.get('testName').value);
        formData.append('resultTime', this.diagnosticdetailsForm.get('resultTime').value);
        formData.append('testCode', this.diagnosticdetailsForm.get('testCode').value);
        formData.append('noOfTests', this.diagnosticdetailsForm.get('noOfTests').value);
        formData.append('schedule', this.diagnosticdetailsForm.get('schedule').value);
        formData.append('precautions', this.diagnosticdetailsForm.get('precautions').value);
        formData.append('tags', this.diagnosticdetailsForm.get('tags').value);
        formData.append('sampleType', this.diagnosticdetailsForm.get('sampleType').value);
        formData.append('method', this.diagnosticdetailsForm.get('method').value);
        formData.append('testIncludedDetails', this.diagnosticdetailsForm.get('testIncludedDetails').value);
        formData.append('mrp', this.diagnosticdetailsForm.get('mrp').value);
        formData.append('discount', this.diagnosticdetailsForm.get('discount').value);
        formData.append('costToCompany', this.diagnosticdetailsForm.get('costToCompany').value);
        formData.append('gst', this.diagnosticdetailsForm.get('gst').value);
        formData.append('totalMargin', this.diagnosticdetailsForm.get('totalMargin').value);
        formData.append('SS_Margin', this.diagnosticdetailsForm.get('SS_Margin').value);
        formData.append('SSP_Margin', this.diagnosticdetailsForm.get('SSP_Margin').value);
        formData.append('sku', this.diagnosticdetailsForm.get('sku').value);
        formData.append('isAvailable', this.diagnosticdetailsForm.get('isAvailable').value);
        formData.append('availabilityStatus', this.diagnosticdetailsForm.get('isAvailable').value === true ? 'Available' : 'Not Available');
        formData.append('category', this.diagnosticdetailsForm.get('category').value);

        if (this.diagnosticDataFormType === 'edit') {
          formData.append('productId', this.productId);
          this.inventoryService.editdiagnosticData(formData).subscribe(
            response => {
              if (!!response && !!response.success && response.success === true) {
                console.log(response);
                this.toastrService.showSuccess('Success', response.response.message);
                this.router.navigate(['/app/inventory/diagnostics'], { queryParams: { currentPage: 1, pageSize: 50}, queryParamsHandling: 'merge' });
              } else {
                this.toastrService.showError('Error', response.response.message);
              }
            },
            err => {
        this.toastrService.showError('Network Error', 'Please try again later');
        console.error(err);
      }
          );
        } else {
          this.inventoryService.saveDiagnosticData(formData).subscribe(
            response => {
              if (!!response && !!response.success && response.success === true) {
                console.log(response);
                this.toastrService.showSuccess('Success', response.response.message);
                this.router.navigate(['/app/inventory/diagnostics'], { queryParams: { currentPage: 1, pageSize: 50}, queryParamsHandling: 'merge' });
              } else {
                this.toastrService.showError('Error', response.response.message);
              }
            },
            err => {
        this.toastrService.showError('Network Error', 'Please try again later');
        console.error(err);
      }
          );
        }
      }
    }
}

onReset() {
    this.submitted = false;
    this.diagnosticdetailsForm.reset();
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
      if ( this.diagnosticDataFormType !== 'add') {
        this.getdiagnosticData(this.productId);
        }
    },
    err => {
        this.toastrService.showError('Network Error', 'Please try again later');
        console.error(err);
      }
  );
}
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
  // Method: to fetch Diagnostic Detail data from BE
  getdiagnosticData(cId) {
    const queryObj = {
      productId: cId
    }
    const diagnosticQueryStr = ProductUtilities.generateQueryString(queryObj);
    this.inventoryService.getDiagnosticDetailById(diagnosticQueryStr).subscribe(
      response => {
        if ( response.success === true) {
          if (!!response.response.data && response.response.data !== null) {
            this.bindEditForm(response.response.data);
            this.diagnosticDetails = response.response.data;
          } else {
            this.toastrService.showError('Error', 'Something went wrong. Please Try again latter');
            this.router.navigate(['/app/inventory/diagnostics/'], { queryParams: {  pageSize: 50, currentPage: 1} });
          }
        }
      },
      err => {
        this.toastrService.showError('Network Error', 'Please try again later');
        console.error(err);
      }
    );
  }
// Method: to Delete Image from BE
deleteImage(url) {
  const queryObj = {
    imageUrl: url,
    productId: this.productId,
    category: 'DIAGNOSTIC'
  }
  const deleteQueryStr = ProductUtilities.generateQueryString(queryObj);
  this.inventoryService.deleteImage(deleteQueryStr).subscribe(
    response => {
      if ( response.success === true) {
        if (!!response.response.data && response.response.data !== null) {
          this.toastrService.showSuccess('Deleted', 'Image Deleted');
          this.getdiagnosticData(this.productId);
        } else {
          this.toastrService.showError('Error', 'Something went wrong. Please Try again latter');
          this.getdiagnosticData(this.productId);
        }
      }
    },
    err => {
      this.toastrService.showError('Error', 'Something went wrong. Please try again later');
      console.error(err);
    }
  );
}
}
