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
declare var $:any;
@Component({
  selector: 'app-ace-medicine',
  templateUrl: './ace-medicine.component.html',
  styleUrls: ['./ace-medicine.component.scss']
})
export class AceMedicineComponent implements OnInit {
  medicinedetailsForm: FormGroup;
  submitted = false;
  fileDataimages: string [] = [];
  previewUrlmedicine = [];
  typeDropdownData: Array<IOption> = [];
  serviceDropdownData: Array<IOption> = [];
  vendorListData: Array<IOption> = [];
  dropdownData: any = {};
  sub: any;
  medicineDataFormType: string;
  productId: string;
  medicineDetails: any;
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
      this.medicineDataFormType = params.type;
      if ( this.medicineDataFormType !== 'add') {
        if (!!params.productId && params.productId !== '') {
          this.productId = params.productId;
          this.getVendorListforDropdown();
          this.gettypeDropdown();
        }
      } 
      else {
        this.bindAddForm();
        this.gettypeDropdown();
        this.getVendorListforDropdown();
      }
    });
  }
  ngOnInit() {
    
  }
//   ngAfterViewInit() {
//     $(document).ready(function() {
//       $(document).on('change', '.custom-file-input', function (event) {
//         $(this).next('.custom-file-label').html(event.target.files[0].name);
//     })
//     });
// }
  fileProgressmedicineimage(event) {
    if (event.target.files && event.target.files[0]) {
      for (let i = 0; i < event.target.files.length; i++) {
        var selectedFile = event.target.files[i];
              var reader = new FileReader();
              reader.onload = (event:any) => {
                this.previewUrlmedicine.push(event.target.result);
              }
              reader.readAsDataURL(selectedFile);
      }
  }
      for (var i = 0; i < event.target.files.length; i++) { 
        this.fileDataimages.push(selectedFile);
      }
  }
  removeSelectedFile(index) {
    this.fileDataimages.splice(index, 1);
    this.previewUrlmedicine.splice(index, 1);
   }
  // Method: to bind and map fields data for adding data to category list
  bindAddForm() {
    this.medicinedetailsForm = this.formBuilder.group({
      vendorId: ['', [Validators.required]],
      vendorSku: ['', [Validators.maxLength(30), Validators.minLength(2), Validators.pattern('^[0-9]*$')]],
      itemName: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9\s.]+$/)]],
      packing: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      batchId: ['', [Validators.minLength(2), Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      saltName: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      companyName: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9\s.]+$/)]],
      mrp: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      costToCompany: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      gst: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      totalMargin: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      SS_Margin: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      SSP_Margin: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      medicineImages: [null],
      prescriptionRequired: [null, [Validators.required]],
      isAvailable: [null, [Validators.required]],
      category: ['', Validators.required],
    });
  }
  // End of above code
  // Method: to bind and map fields data for adding data to category list
  bindEditForm(data) {
    this.medicinedetailsForm = this.formBuilder.group({
      vendorId: [data.vendorId, [Validators.required]],
      vendorSku: [data.vendorSku, [Validators.maxLength(30), Validators.minLength(2), Validators.pattern('^[0-9]*$')]],
      itemName: [data.itemName, [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9\s.]+$/)]],
      packing: [data.packing, [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      batchId: [data.batchId, [Validators.minLength(2), Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      saltName: [data.saltName, [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      companyName: [data.companyName, [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9\s.]+$/)]],
      mrp: [data.mrp, [Validators.required,, Validators.maxLength(10), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      costToCompany: [data.costToCompany, [Validators.required, Validators.maxLength(10), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      gst: [data.gst, [Validators.required, Validators.maxLength(10), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      totalMargin: [data.totalMargin, [Validators.required, Validators.maxLength(10), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      SS_Margin: [data.SS_Margin, [Validators.required, Validators.maxLength(10), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      SSP_Margin: [data.SSP_Margin, [Validators.required, Validators.maxLength(10), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      medicineImages: [null],
      prescriptionRequired: [data.prescriptionRequired, [Validators.required]],
      isAvailable: [data.isAvailable, [Validators.required]],
      category: [data.category, Validators.required],
    });
  }
  // End of above code
  // convenience getter for easy access to form fields
  get medicinecheckout() { return this.medicinedetailsForm.controls; }
  onSubmit(formData) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.medicinedetailsForm.invalid) {
      this.toastrService.showWarning('Missing Data', 'Check the entry again!');
      return;
    } else {
      if (!!formData.valid && formData.valid === true) {
        const formData = new FormData();
        for (var i = 0; i < this.fileDataimages.length; i++) {
          formData.append('medicineImages', !!this.fileDataimages[i] ? this.fileDataimages[i] : null);
        }
        formData.append('vendorId', this.medicinedetailsForm.get('vendorId').value);
        formData.append('vendorSku', this.medicinedetailsForm.get('vendorSku').value);
        formData.append('itemName', this.medicinedetailsForm.get('itemName').value);
        formData.append('packing', this.medicinedetailsForm.get('packing').value);
        formData.append('batchId', this.medicinedetailsForm.get('batchId').value);
        formData.append('saltName', this.medicinedetailsForm.get('saltName').value);
        formData.append('companyName', this.medicinedetailsForm.get('companyName').value);
        formData.append('mrp', this.medicinedetailsForm.get('mrp').value);
        formData.append('costToCompany', this.medicinedetailsForm.get('costToCompany').value);
        formData.append('gst', this.medicinedetailsForm.get('gst').value);
        formData.append('totalMargin', this.medicinedetailsForm.get('totalMargin').value);
        formData.append('SS_Margin', this.medicinedetailsForm.get('SS_Margin').value);
        formData.append('SSP_Margin', this.medicinedetailsForm.get('SSP_Margin').value);
        formData.append('prescriptionRequired', this.medicinedetailsForm.get('prescriptionRequired').value);
        formData.append('isAvailable', this.medicinedetailsForm.get('isAvailable').value);
        formData.append('availabilityStatus', this.medicinedetailsForm.get('isAvailable').value === true ? 'Available' : 'Not Available');
        formData.append('category', this.medicinedetailsForm.get('category').value);
        if (this.medicineDataFormType === 'edit') {
          formData.append('productId', this.productId);
          this.inventoryService.editMedicineData(formData).subscribe(
            response => {
              if (!!response && !!response.success && response.success === true) {
                console.log(response);
                this.toastrService.showSuccess('Success', response.response.message);
                this.router.navigate(['/app/inventory/medicine'], { queryParams: { currentPage: 1, pageSize: 50}, queryParamsHandling: 'merge' });
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
          this.inventoryService.saveMedicineData(formData).subscribe(
            response => {
              if (!!response && !!response.success && response.success === true) {
                console.log(response);
                this.toastrService.showSuccess('Success', response.response.message);
                this.router.navigate(['/app/inventory/medicine'], { queryParams: { currentPage: 1, pageSize: 50}, queryParamsHandling: 'merge' });
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
    this.medicinedetailsForm.reset();
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
      if ( this.medicineDataFormType !== 'add') {
        this.getMedicineData(this.productId);
        }
    },
    err => {
        this.toastrService.showError('Network Error', 'Please try again later');
        console.error(err);
      }
  );
}
gettypeDropdown() {
  const typeQueryStr = 'name=MEDICINES';
  this.inventoryService.gettypeDropdown(typeQueryStr).subscribe(
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
  // Method: to fetch Vendor Detail data from BE
  getMedicineData(cId) {
    const queryObj = {
      productId: cId
    }
    const medicineQueryStr = ProductUtilities.generateQueryString(queryObj);
    this.inventoryService.getMedicineDetailById(medicineQueryStr).subscribe(
      response => {
        if ( response.success === true) {
          if (!!response.response.data && response.response.data !== null) {
            this.bindEditForm(response.response.data);
            this.medicineDetails = response.response.data;
          } else {
            this.toastrService.showError('Error', 'Something went wrong. Please Try again latter');
            this.router.navigate(['/app/inventory/medicine'], { queryParams: {  pageSize: 50, currentPage: 1} });
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
    category: 'MEDICINE'
  }
  const deleteQueryStr = ProductUtilities.generateQueryString(queryObj);
  this.inventoryService.deleteImage(deleteQueryStr).subscribe(
    response => {
      if ( response.success === true) {
        if (!!response.response.data && response.response.data !== null) {
          this.toastrService.showSuccess('Deleted', 'Image Deleted');
          this.getMedicineData(this.productId);
        } else {
          this.toastrService.showError('Error', 'Something went wrong. Please Try again latter');
          this.getMedicineData(this.productId);
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
