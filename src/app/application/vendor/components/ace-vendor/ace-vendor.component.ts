import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Input } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ResponseCode } from 'src/app/core/dictionary/response-code';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { VendorService } from '../../services/vendor.service';
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
  selector: 'app-ace-vendor',
  templateUrl: './ace-vendor.component.html',
  styleUrls: ['./ace-vendor.component.scss']
})
export class AceVendorComponent implements OnInit {
  today: Date;
  maxDate: Date;
  minDate: Date;
  vendordetailsForm: FormGroup;
  submitted = false;
  fileDatapancard: string [] = [];
  fileDatagst: string [] = [];
  fileDatacertificate: string [] = [];
  fileDataotherdocs: string [] = [];
  previewUrlcertificate = [];
  previewUrlgst = [];
  previewUrlpancard = [];
  previewUrlotherdocs = [];
  typeDropdownData: Array<IOption> = [];
  categoryDropdownData: Array<IOption> = [];
  serviceDropdownData: Array<IOption> = [];
  dropdownData: any = {};
  sub: any;
  vendorDataFormType: string;
  vendorId: string;
  pincode_state: any;
  vendorDetails: any;
  fileDatavendorlogo: File;
  previewUrlvendorlogo: any;
  fileDataprofphoto: File;
  previewUrlprofphoto: any;
  pdfdummyimage = false;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private vendorService: VendorService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ProductToasterService
  ) {
    this.sub = this.route
    .queryParams
    .subscribe(params => {
      this.vendorDataFormType = params.type;
      if ( this.vendorDataFormType !== 'add') {
        if (!!params.vendorId && params.vendorId !== '') {
          this.vendorId = params.vendorId;
          this.getServiceDropdownData();
        }
      } 
      else {
        this.bindAddForm();
        this.gettypeDropdown();
        this.getServiceDropdownData();
      }
    });
    this.today = new Date();
    this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), 2);
  }
  ngOnInit() {
    
  }
fileProgressgst(event) {
  if (event.target.files && event.target.files[0]) {
    for (let i = 0; i < event.target.files.length; i++) {
      var selectedgstFile = event.target.files[i];
            var reader = new FileReader();
            reader.onload = (event:any) => {
              this.previewUrlgst.push(event.target.result);
            }
            reader.readAsDataURL(selectedgstFile);
    }
}
    for (var i = 0; i < event.target.files.length; i++) { 
      this.fileDatagst.push(selectedgstFile);
    }
}
removeSelectedGSTFile(index) {
  this.previewUrlgst.splice(index, 1);
  this.fileDatagst.splice(index, 1);
}
fileProgresscertificate(event) {
  if (event.target.files && event.target.files[0]) {
    for (let i = 0; i < event.target.files.length; i++) {
      var selectedcertFile = event.target.files[i];
            var reader = new FileReader();
            reader.onload = (event:any) => {
              this.previewUrlcertificate.push(event.target.result);
            }
            reader.readAsDataURL(selectedcertFile);
    }
}
    for (var i = 0; i < event.target.files.length; i++) { 
      this.fileDatacertificate.push(selectedcertFile);
    }
}
removeSelectedCertificate(index) {
  this.previewUrlcertificate.splice(index, 1);
  this.fileDatacertificate.splice(index, 1);
}
fileProgresspancard(event) {
  if (event.target.files && event.target.files[0]) {
    for (let i = 0; i < event.target.files.length; i++) {
      var selectedpancardFile = event.target.files[i];
            var reader = new FileReader();
            reader.onload = (event:any) => {
              this.previewUrlpancard.push(event.target.result);
            }
            reader.readAsDataURL(selectedpancardFile);
    }
}
    for (var i = 0; i < event.target.files.length; i++) { 
      this.fileDatapancard.push(selectedpancardFile);
    }
}
removeSelectedPancard(index) {
  this.previewUrlpancard.splice(index, 1);
  this.fileDatapancard.splice(index, 1);
}
fileProgressotherdoc(event) {
  if (event.target.files && event.target.files[0]) {
    for (let i = 0; i < event.target.files.length; i++) {
      var selectedotherFile = event.target.files[i];
            var reader = new FileReader();
            reader.onload = (event:any) => {
              this.previewUrlotherdocs.push(event.target.result);
            }
            reader.readAsDataURL(selectedotherFile);
    }
}
    for (var i = 0; i < event.target.files.length; i++) { 
      this.fileDataotherdocs.push(selectedotherFile);
    }
}
removeSelectedOtherdoc(index) {
  this.previewUrlotherdocs.splice(index, 1);
  this.fileDataotherdocs.splice(index, 1);
}
  fileProgressvendorlogo(fileInput: any) {
    this.fileDatavendorlogo = <File>fileInput.target.files[0];
    const mimeType = this.fileDatavendorlogo.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(this.fileDatavendorlogo);
    reader.onload = (_event) => {
      this.previewUrlvendorlogo = reader.result;
    }
  }
  removeSelectedvendorlogo() {
    this.previewUrlvendorlogo = '';
    this.fileDatavendorlogo = null;
  }
  fileProgressvendorprofphoto(fileInput: any) {
    this.fileDataprofphoto = <File>fileInput.target.files[0];
    const mimeType = this.fileDataprofphoto.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(this.fileDataprofphoto);
    reader.onload = (_event) => {
      this.previewUrlprofphoto = reader.result;
    }
  }
  removeSelectedprofphoto() {
    this.previewUrlprofphoto = '';
    this.fileDataprofphoto = null;
  }
  // Method: to bind and map fields data for adding data to category list
  bindAddForm() {
    this.vendordetailsForm = this.formBuilder.group({
      type: ['', Validators.required],
      category: ['', Validators.required],
      services: ['', Validators.required],
      vendorName: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
      landlineContactNumber: ['', [Validators.pattern(/^[0-9]\d{2,4}-\d{6,8}$/)]],
      contactPersonName: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      mobile: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[6-9]\\d{9}')]],
      secondaryMobile: ['', [Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[6-9]\\d{9}')]],
      officialEmail: ['', [Validators.required, Validators.email]],
      personalEmail: ['', [Validators.email]],
      country: [{value: 'India', disabled: true}, Validators.required],
      state: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      city: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      pincode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^[1-9][0-9]{5}$/)]],
      street_address_1: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      street_address_2: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      latlong: [{value: null, disabled: true}, Validators.required],
      gstNumber: ['', [Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      certificationNumber: ['', Validators.required],
      certificationAuthorties: ['', Validators.required],
      certificationDate: ['', Validators.required],
      panCard: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      bankName: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      branchName: ['', Validators.required],
      branchcity: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      accountNumber: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(2), Validators.pattern('^[0-9]*$')]],
      ifsc: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      holderName: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      UPIId: [''],
      defaultDiscountPercentage: ['', [Validators.pattern(/^[0-9\.]+$/)]],
      panelRequired: [false],
      pancardFile: [null],
      regCertificateFile: [null],
      gstDocumentFile: [null],
      otherDocs: [null],
      vendorLogo: [null],
      profilePhoto: [null],
    });
    // this.vendordetailsForm.controls['pincode'].valueChanges.debounceTime(200).switchMap(term => of(term)).subscribe(change => {
    //   if (this.vendordetailsForm.controls['pincode'].valid) {
    //     this.getpincodeData(this.vendordetailsForm.controls['pincode'].value);
    //   } else {
    //     console.log('Invalid Pincode.');
    //   }
    // });
  }
  // End of above code
  // Method: to bind and map fields data for adding data to category list
  bindEditForm(data) {
    this.getCategoryByid(data.type);
    this.vendordetailsForm = this.formBuilder.group({
      type: [data.type, Validators.required],
      category: [data.category, Validators.required],
      services: [data.services, Validators.required],
      vendorName: [data.vendorName, [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
      landlineContactNumber: [data.landlineContactNumber, [Validators.pattern(/^[0-9]\d{2,4}-\d{6,8}$/)]],
      contactPersonName: [data.contactPersonName, [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      mobile: [data.mobile, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[6-9]\\d{9}')]],
      secondaryMobile: [data.secondaryMobile, [Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[6-9]\\d{9}')]],
      officialEmail: [data.officialEmail, [Validators.required, Validators.email]],
      personalEmail: [data.personalEmail, [Validators.email]],
      country: [{value: 'India', disabled: true}, Validators.required],
      state: [data.location.state, [Validators.required, Validators.maxLength(20), Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      city: [data.location.city, [Validators.required, Validators.maxLength(20), Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      pincode: [data.location.pincode, [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^[1-9][0-9]{5}$/)]],
      street_address_1: [data.location.street_address_1, [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      street_address_2: [data.location.street_address_2, [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      latlong: [{value: null, disabled: true}, Validators.required],
      gstNumber: [data.gstNumber, [Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      certificationNumber: [data.certificationNumber, Validators.required],
      certificationAuthorties: [data.certificationAuthorties, Validators.required],
      certificationDate: [data.certificationDate, Validators.required],
      panCard: [data.panCard, [Validators.required, Validators.minLength(10), Validators.maxLength(15), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      bankName: [data.financialDetails.bankName, [Validators.required, Validators.maxLength(20), Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      branchName: [data.financialDetails.branchName, Validators.required],
      branchcity: [data.financialDetails.city , [Validators.required, Validators.maxLength(20), Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      accountNumber: [data.financialDetails.accountNumber, [Validators.required, Validators.maxLength(20), Validators.minLength(2), Validators.pattern('^[0-9]*$')]],
      ifsc: [data.financialDetails.ifsc, [Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      holderName: [data.financialDetails.holderName, [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      UPIId: [data.financialDetails.UPI],
      defaultDiscountPercentage: [data.defaultDiscountPercentage, [Validators.pattern(/^[0-9\.]+$/)]],
      panelRequired: [data.panelRequired],
      pancardFile: [null],
      regCertificateFile: [null],
      gstDocumentFile: [null],
      otherDocs: [null],
      vendorLogo: [null],
      profilePhoto: [null],
    });
  }
  // End of above code
  // convenience getter for easy access to form fields
  get vendorcheckout() { return this.vendordetailsForm.controls; }
  onSubmit(formData) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.vendordetailsForm.invalid) {
      this.toastrService.showWarning('Missing Data', 'Check the entry again!');
      return;
    } else {
      if (!!formData.valid && formData.valid === true) {
        const formData = new FormData();
        for (var i = 0; i < this.fileDatapancard.length; i++) {
          formData.append("pancardFile", !!this.fileDatapancard[i] ? this.fileDatapancard[i] : null);
        }
        for (var i = 0; i < this.fileDatacertificate.length; i++) {
          formData.append("regCertificateFile", !!this.fileDatacertificate[i] ? this.fileDatacertificate[i] : null);
        }
        for (var i = 0; i < this.fileDatagst.length; i++) {
          formData.append("gstDocumentFile", !!this.fileDatagst[i] ? this.fileDatagst[i] : null);
        }
        for (var i = 0; i < this.fileDataotherdocs.length; i++) {
          formData.append("otherDocs", !!this.fileDataotherdocs[i] ? this.fileDataotherdocs[i] : null);
        }
        if (!!this.fileDatavendorlogo) {
          formData.append('vendorLogo', !!this.fileDatavendorlogo ? this.fileDatavendorlogo : null);
        }
        if (!!this.fileDataprofphoto) {
          formData.append('profilePhoto', !!this.fileDataprofphoto ? this.fileDataprofphoto : null);
        }
        formData.append('type', this.vendordetailsForm.get('type').value);
        formData.append('category', this.vendordetailsForm.get('category').value);
        formData.append('services', JSON.stringify(this.vendordetailsForm.get('services').value));
        formData.append('vendorName', this.vendordetailsForm.get('vendorName').value);
        formData.append('landlineContactNumber', this.vendordetailsForm.get('landlineContactNumber').value);
        formData.append('contactPersonName', this.vendordetailsForm.get('contactPersonName').value);
        formData.append('mobile', this.vendordetailsForm.get('mobile').value);
        formData.append('secondaryMobile', this.vendordetailsForm.get('secondaryMobile').value);
        formData.append('officialEmail', this.vendordetailsForm.get('officialEmail').value);
        formData.append('personalEmail', this.vendordetailsForm.get('personalEmail').value);
        const tempLocation = {
          country: this.vendordetailsForm.get('country').value,
          state: this.vendordetailsForm.get('state').value,
          city: this.vendordetailsForm.get('city').value,
          street_address_1: this.vendordetailsForm.get('street_address_1').value,
          street_address_2: this.vendordetailsForm.get('street_address_2').value,
          pincode: this.vendordetailsForm.get('pincode').value,
          latlong: null,
        };
        formData.append('location', JSON.stringify(tempLocation));
        const tempFinancial = {
          bankName: this.vendordetailsForm.get('bankName').value,
          branchName: this.vendordetailsForm.get('branchName').value,
          city: this.vendordetailsForm.get('branchcity').value,
          accountNumber: this.vendordetailsForm.get('accountNumber').value,
          holderName: this.vendordetailsForm.get('holderName').value,
          ifsc: this.vendordetailsForm.get('ifsc').value,
          UPI: this.vendordetailsForm.get('UPIId').value
        };
        formData.append('financialDetails', JSON.stringify(tempFinancial));
        formData.append('gstNumber', this.vendordetailsForm.get('gstNumber').value);
        formData.append('certificationNumber', this.vendordetailsForm.get('certificationNumber').value);
        formData.append('certificationAuthorties', this.vendordetailsForm.get('certificationAuthorties').value);
        // var pipe = new DatePipe('en-US');
        formData.append('certificationDate', this.vendordetailsForm.get('certificationDate').value);
        formData.append('panCard', this.vendordetailsForm.get('panCard').value);
        formData.append('defaultDiscountPercentage', this.vendordetailsForm.get('defaultDiscountPercentage').value);
        formData.append('panelRequired', this.vendordetailsForm.get('panelRequired').value);
        if (this.vendorDataFormType === 'edit') {
          formData.append('vendorId', this.vendorId);
          this.vendorService.editVendorData(formData).subscribe(
            response => {
              if (!!response && !!response.success && response.success === true) {
                console.log(response);
                this.toastrService.showSuccess('Success', response.response.message);
                this.router.navigate(['/app/vendor'], { queryParams: { pageSize: 50, currentPage: 1} });
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
          this.vendorService.saveVendorData(formData).subscribe(
            response => {
              if (!!response && !!response.success && response.success === true) {
                console.log(response);
                this.toastrService.showSuccess('Success', response.response.message);
                this.router.navigate(['/app/vendor'], { queryParams: { pageSize: 50, currentPage: 1} });
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
    this.vendordetailsForm.reset();
}
gettypeDropdown() {
  const typeQueryStr = 'name=VENDOR_TYPES';
  this.vendorService.gettypeDropdown(typeQueryStr).subscribe(
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
      if ( this.vendorDataFormType !== 'add') {
      this.getVendorData(this.vendorId);
      }
    },
    err => {
        this.toastrService.showError('Network Error', 'Please try again later');
        console.error(err);
      }
  );
}
getCategoryByid(data) {
  this.categoryDropdownData = [...[]];
  let tempDataString = data.replaceAll(' ', '_');
  tempDataString = (data.replaceAll('"', '')).toUpperCase();
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
getServiceDropdownData() {
  const typeQueryStr = 'name=VENDOR_SERVICES';
  this.vendorService.gettypeDropdown(typeQueryStr).subscribe(
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
      if ( this.vendorDataFormType !== 'add') {
      this.gettypeDropdown();
      }
    },
    err => {
        this.toastrService.showError('Network Error', 'Please try again later');
        console.error(err);
      }
  );
}
  // Method: to fetch Vendor Detail data from BE
  getVendorData(cId) {
    const queryObj = {
      vendorId: cId
    }
    const vendorQueryStr = ProductUtilities.generateQueryString(queryObj);
    this.vendorService.getVendorDetailById(vendorQueryStr).subscribe(
      response => {
        if ( response.success === true) {
          if (!!response.response.data && response.response.data !== null) {
            this.bindEditForm(response.response.data);
            this.vendorDetails = response.response.data;
            this.previewUrlvendorlogo = response.response.data.vendorLogoUrl;
            this.previewUrlprofphoto = response.response.data.vendorProfileUrl;
          } else {
            this.toastrService.showError('Error', 'Something went wrong. Please Try again latter');
            this.router.navigate(['/app/vendor/'], { queryParams: {  perPage: 50, currentPage: 1} });
          }
        }
      },
      err => {
        this.toastrService.showError('Network Error', 'Please try again later');
        console.error(err);
      }
    );
  }
  // Method: to fetch Pincode Detail data from BE
  getpincodeData(enteredpincode) {
    const queryObj = {
      pincode: enteredpincode
    }
    const pincodeQueryStr = ProductUtilities.generateQueryString(queryObj);
    this.vendorService.getpincodedetails(pincodeQueryStr).subscribe(
      response => {
        if ( response.success === true) {
          if (!!response.response.data && response.response.data !== null) {
            console.log(response.response.data);
            this.pincode_state = response.response.data.state;
          } else {
            this.toastrService.showError('Error', 'Something went wrong. Please Try again latter');
          }
        }
      },
      err => {
        this.toastrService.showError('Network Error', 'Please try again later');
        console.error(err);
      }
    );
  }
}
