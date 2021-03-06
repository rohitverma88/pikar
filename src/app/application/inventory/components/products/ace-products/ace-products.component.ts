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
declare var $: any;
@Component({
  selector: 'app-ace-products',
  templateUrl: './ace-products.component.html',
  styleUrls: ['./ace-products.component.scss']
})
export class AceProductsComponent implements OnInit {
  today: Date;
  maxDate: Date;
  minDate: Date;
  productdetailsForm: FormGroup;
  submitted = false;
  fileDataproductimg: string [] = [];
  previewUrlproductimg = [];
  typeDropdownData: Array<IOption> = [];
  categoryDropdownData: Array<IOption> = [];
  serviceDropdownData: Array<IOption> = [];
  vendorListData: Array<IOption> = [];
  mainCategoryDropdownData: Array<IOption> = [];
  productTargetUserDropDownData: Array<IOption> = [];
  productPackagingTypeDropDownData: Array<IOption> = [];
  dropdownData: any = {};
  sub: any;
  productDataFormType: string;
  productId: string;
  productDetails: any;
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
      this.productDataFormType = params.type;
      if ( this.productDataFormType !== 'add') {
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
  ngOnInit() {
    
  }
  // ngAfterViewInit() {
  //   $(document).ready(function() {
  //     $(document).on('change', '.custom-file-input', function (event) {
  //       $(this).next('.custom-file-label').html('File Uploaded');
  //   })
  //   });
  // }
  fileProgressproducts(event) {
     if (event.target.files && event.target.files[0]) {
       for (let i = 0; i < event.target.files.length; i++) {
              var selectedFile = event.target.files[i];
               var reader = new FileReader();
               reader.onload = (event:any) => {
                 this.previewUrlproductimg.push(event.target.result);
               }
               reader.readAsDataURL(selectedFile);
       }
   }
       for (var i = 0; i < event.target.files.length; i++) { 
         this.fileDataproductimg.push(selectedFile);
       }
  }
  removeSelectedFile(index) {
    this.fileDataproductimg.splice(index, 1);
    this.previewUrlproductimg.splice(index, 1);
   }
  // Method: to bind and map fields data for adding data to category list
  bindAddForm() {
    this.productdetailsForm = this.formBuilder.group({
      vendorId: ['', [Validators.required]],
      category: ['', Validators.required],
      subcategory: [''],
      targetedUser: [''],
      tags: ['', [Validators.required, Validators.maxLength(500), Validators.minLength(3)]],
      vendorSku: ['', [Validators.minLength(2), Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      productShortName: ['', [Validators.maxLength(50), Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9\s-]+$/)]],
      productName: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9\s-]+$/)]],
      brandName: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(2), Validators.pattern(/^[a-zA-Z0-9\s-]+$/)]],
      productImage: [null],
      packagingType: [''],
      packageSize: ['', [Validators.minLength(1), Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9\s.]+$/)]],
      productDescription: ['', [Validators.required, Validators.maxLength(1000), Validators.minLength(3)]],
      weight: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(2), Validators.pattern(/^[0-9\.]+$/)]],
      ingredients: ['', [Validators.required, Validators.maxLength(1000), Validators.minLength(3)]],
      highlights: ['', [Validators.required, Validators.maxLength(1000), Validators.minLength(3)]],
      effect: ['', [Validators.required, Validators.maxLength(1000), Validators.minLength(2)]],
      HSN: [''],
      upc: [''],
      costToCompany: ['', [Validators.pattern(/^[0-9\.]+$/)]],
      mrp: ['', [Validators.required, Validators.pattern(/^[0-9\.]+$/)]],      
      gst: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      totalMargin: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      SS_Margin: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      SSP_Margin: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      isAvailable: [null, [Validators.required]],
      tax_exempt: [false],
      action: ['', [Validators.maxLength(1000), Validators.minLength(3)]],
      direction: ['', [Validators.required, Validators.maxLength(1000), Validators.minLength(3)]],
      indication: ['', [Validators.required, Validators.maxLength(1000), Validators.minLength(3)]],
      variant: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      productusage: ['', [Validators.maxLength(1000), Validators.minLength(3)]],
      vendorStockUnits: ['', [Validators.pattern(/^[0-9]*$/)]],
      localStockUnits: ['', [Validators.pattern(/^[0-9]*$/)]],
    });
  }
  // End of above code
  // Method: to bind and map fields data for adding data to category list
  bindEditForm(data) {
    this.productdetailsForm = this.formBuilder.group({
      vendorId: [data.vendorId.split(','), [Validators.required]],
      category: [data.category, Validators.required],
      subcategory: [!!data && !!data.subcategory && data.subcategory !== '' ? data.subcategory : ''],
      targetedUser: [data.targetedUser],
      tags: [data.tags, [Validators.required, Validators.maxLength(500), Validators.minLength(3)]],
      vendorSku: [data.vendorSku, [Validators.minLength(2), Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      productShortName: [data.productShortName, [Validators.maxLength(50), Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9\s-]+$/)]],
      productName: [data.productName, [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9\s-]+$/)]],
      brandName: [data.brandName, [Validators.required, Validators.maxLength(20), Validators.minLength(2), Validators.pattern(/^[a-zA-Z0-9\s-]+$/)]],
      productImage: [null],
      packagingType: [data.packagingType],
      packageSize: [data.packageSize, [Validators.minLength(1), Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9\s.]+$/)]],
      productDescription: [data.productDescription, [Validators.required, Validators.maxLength(1000), Validators.minLength(3)]],
      weight: [data.weight, [Validators.required, Validators.maxLength(10), Validators.minLength(2), Validators.pattern(/^[0-9\.]+$/)]],
      ingredients: [data.ingredients, [Validators.required, Validators.maxLength(1000), Validators.minLength(3)]],
      highlights: [data.highlights, [Validators.required, Validators.maxLength(1000), Validators.minLength(3)]],
      effect: [data.effect, [Validators.required, Validators.maxLength(1000), Validators.minLength(2)]],
      HSN: [data.HSN],
      upc: [data.UPC],
      costToCompany: [data.costToCompany, [Validators.pattern(/^[0-9\.]+$/)]],
      mrp: [data.mrp, [Validators.required, Validators.pattern(/^[0-9\.]+$/)]],
      gst: [data.gst, [Validators.required, Validators.maxLength(5), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      totalMargin: [data.totalMargin, [Validators.required, Validators.maxLength(5), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      SS_Margin: [data.SS_Margin, [Validators.required, Validators.maxLength(5), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      SSP_Margin: [data.SSP_Margin, [Validators.required, Validators.maxLength(5), Validators.minLength(1), Validators.pattern(/^[0-9\.]+$/)]],
      isAvailable: [data.isAvailable, [Validators.required]],
      action: [data.action, [Validators.maxLength(1000), Validators.minLength(3)]],
      direction: [data.direction, [Validators.required, Validators.maxLength(1000), Validators.minLength(3)]],
      indication: [data.indication, [Validators.required, Validators.maxLength(1000), Validators.minLength(3)]],
      variant: [data.variant, [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      productusage: [data.productusage, [Validators.maxLength(1000), Validators.minLength(3)]],
      vendorStockUnits: [data.vendorStockUnits, [Validators.pattern(/^[0-9]*$/)]],
      localStockUnits: [data.localStockUnits, [Validators.pattern(/^[0-9]*$/)]],
    });
  }
  // End of above code
  // convenience getter for easy access to form fields
  get productcheckout() { return this.productdetailsForm.controls; }
  onSubmit(formData) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.productdetailsForm.invalid) {
      this.toastrService.showWarning('Missing Data', 'Check the entry again!');
      return;
    } else {
      if (!!formData.valid && formData.valid === true) {
        const formData = new FormData();
        for (var i = 0; i < this.fileDataproductimg.length; i++) {
          formData.append('productImage', !!this.fileDataproductimg[i] ? this.fileDataproductimg[i] : null);
        }
        formData.append('category', this.productdetailsForm.get('category').value);
        formData.append('targetedUser', this.productdetailsForm.get('targetedUser').value);
        formData.append('productName', this.productdetailsForm.get('productName').value);
        formData.append('productShortName', this.productdetailsForm.get('productShortName').value);
        formData.append('brandName', this.productdetailsForm.get('brandName').value);
        formData.append('mrp', this.productdetailsForm.get('mrp').value);
        formData.append('weight', this.productdetailsForm.get('weight').value);
        formData.append('productDescription', this.productdetailsForm.get('productDescription').value);
        formData.append('action', this.productdetailsForm.get('action').value);
        formData.append('direction', this.productdetailsForm.get('direction').value);
        formData.append('tags', this.productdetailsForm.get('tags').value);
        formData.append('ingredients', this.productdetailsForm.get('ingredients').value);
        formData.append('highlights', this.productdetailsForm.get('highlights').value);
        formData.append('productusage', this.productdetailsForm.get('productusage').value);
        formData.append('indication', this.productdetailsForm.get('indication').value);
        formData.append('effect', this.productdetailsForm.get('effect').value);
        formData.append('vendorId', this.productdetailsForm.get('vendorId').value);
        formData.append('packageSize', this.productdetailsForm.get('packageSize').value);
        formData.append('HSN', this.productdetailsForm.get('HSN').value);
        formData.append('upc', this.productdetailsForm.get('upc').value);
        formData.append('vendorSku', this.productdetailsForm.get('vendorSku').value);
        formData.append('variant', this.productdetailsForm.get('variant').value);
        formData.append('gst', this.productdetailsForm.get('gst').value);
        formData.append('totalMargin', this.productdetailsForm.get('totalMargin').value);
        formData.append('SSP_Margin', this.productdetailsForm.get('SSP_Margin').value);
        formData.append('SS_Margin', this.productdetailsForm.get('SS_Margin').value);
        formData.append('costToCompany', this.productdetailsForm.get('costToCompany').value);
        formData.append('packagingType', this.productdetailsForm.get('packagingType').value);
        formData.append('isAvailable', this.productdetailsForm.get('isAvailable').value);
        formData.append('vendorStockUnits', this.productdetailsForm.get('vendorStockUnits').value);
        formData.append('localStockUnits', this.productdetailsForm.get('localStockUnits').value);
        formData.append('availabilityStatus', this.productdetailsForm.get('isAvailable').value === true ? 'Available' : 'Not Available');
        if (this.productDataFormType === 'edit') {
          formData.append('productId', this.productId);
          this.inventoryService.editProductData(formData).subscribe(
            response => {
              if (!!response && !!response.success && response.success === true) {
                console.log(response);
                this.toastrService.showSuccess('Success', response.response.message);
                this.router.navigate(['/app/inventory/products'], { queryParams: { currentPage: 1, pageSize: 50}, queryParamsHandling: 'merge' });
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
          this.inventoryService.saveProductData(formData).subscribe(
            response => {
              if (!!response && !!response.success && response.success === true) {
                console.log(response);
                this.toastrService.showSuccess('Success', response.response.message);
                this.router.navigate(['/app/inventory/products'], { queryParams: { currentPage: 1, pageSize: 50}, queryParamsHandling: 'merge' });
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
    this.productdetailsForm.reset();
}
gettypeDropdown() {
  const typeQueryStr = '?name=["PRODUCTS","PRODUCT_TARGET_USER", "PRODUCT_PACKAGING_TYPE"]';
  this.inventoryService.getENUMData(typeQueryStr).subscribe(
    response => {
      if (!!response && !!response.success && response.success === true && response.response.data.length !== 0 ) {
        console.log('The Data in the DropDown is ', response.data);
        // tslint:disable-next-line: prefer-for-of
        for (let j = 0; j < response.response.data.length; j++) {
          if (response.response.data[j].key === 'PRODUCTS') {
            if (response.response.data[j].values.length !== 0) {
              // tslint:disable-next-line: prefer-for-of
              for (let i = 0; i < response.response.data[j].values.length; i++) {
                this.mainCategoryDropdownData.push(
                  {
                    value: response.response.data[j].values[i],
                    label: response.response.data[j].values[i]
                  });
              }
            } else {
              this.mainCategoryDropdownData = [];
            }
          } else if (response.response.data[j].key === 'PRODUCT_TARGET_USER') {
            if (response.response.data[j].values.length !== 0) {
              // tslint:disable-next-line: prefer-for-of
              for (let i = 0; i < response.response.data[j].values.length; i++) {
                this.productTargetUserDropDownData.push(
                  {
                    value: response.response.data[j].values[i],
                    label: response.response.data[j].values[i]
                  });
              }
            } else {
              this.productTargetUserDropDownData = [];
            }
          }  else if (response.response.data[j].key === 'PRODUCT_PACKAGING_TYPE') {
            if (response.response.data[j].values.length !== 0) {
              // tslint:disable-next-line: prefer-for-of
              for (let i = 0; i < response.response.data[j].values.length; i++) {
                this.productPackagingTypeDropDownData.push(
                  {
                    value: response.response.data[j].values[i],
                    label: response.response.data[j].values[i]
                  });
              }
            } else {
              this.productPackagingTypeDropDownData = [];
            }
          }
        }
        // tslint:disable-next-line: prefer-for-of
      } else {
        this.typeDropdownData = [];
        console.log('No Type Coming from the BE');
      }
      if ( this.productDataFormType !== 'add') {
      this.getProductData(this.productId);
      }
    },
    err => {
        this.toastrService.showError('Network Error', 'Please try again later');
        console.error(err);
      }
  );
}
getCategoryByid(data, completeData) {
  this.categoryDropdownData = [...[]];
  let tempDataString = data.replaceAll(' ', '_');
  tempDataString = data.replaceAll('"', '');
  const typeQueryStr = 'name=' + tempDataString;
  this.inventoryService.gettypeDropdown(typeQueryStr).subscribe(
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
  if (!!completeData && completeData !== '') {
    this.bindEditForm(completeData);
  }
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
  // Method: to fetch Vendor Detail data from BE
  getProductData(cId) {
    const queryObj = {
      productId: cId
    }
    const productQueryStr = ProductUtilities.generateQueryString(queryObj);
    this.inventoryService.getProductDetailById(productQueryStr).subscribe(
      response => {
        if ( response.success === true) {
          if (!!response.response.data && response.response.data !== null) {
            this.getCategoryByid(response.response.data.category, response.response.data);
            this.productDetails = response.response.data;
          } else {
            this.toastrService.showError('Error', 'Something went wrong. Please Try again latter');
            this.router.navigate(['/app/inventory/products'], { queryParams: {  pageSize: 50, currentPage: 1} });
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
      category: 'PRODUCT'
    }
    const deleteQueryStr = ProductUtilities.generateQueryString(queryObj);
    this.inventoryService.deleteImage(deleteQueryStr).subscribe(
      response => {
        if ( response.success === true) {
          if (!!response.response.data && response.response.data !== null) {
            this.toastrService.showSuccess('Deleted', 'Image Deleted');
            this.getProductData(this.productId);
          } else {
            this.toastrService.showError('Error', 'Something went wrong. Please Try again latter');
            this.getProductData(this.productId);
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
