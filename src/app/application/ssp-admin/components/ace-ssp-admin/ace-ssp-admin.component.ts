import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Input } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ResponseCode } from 'src/app/core/dictionary/response-code';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { sspAdminService } from '../../services/ssp-admin.service';
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
  selector: 'app-ace-ssp-admin',
  templateUrl: './ace-ssp-admin.component.html',
  styleUrls: ['./ace-ssp-admin.component.scss']
})
export class AceSspAdminComponent implements OnInit {
  today: Date;
  maxDate: Date;
  minDate: Date;
  sspdetailsForm: FormGroup;
  submitted = false;
  fileDataidentity: string [] = [];
  fileDatagst: string [] = [];
  fileDatacheque: string [] = [];
  previewUrlcheque = [];
  previewUrlgst = [];
  previewUrlidentity = [];
  typeDropdownData: Array<IOption> = [];
  machineIdDropdownData: Array<IOption> = [];
  identityTypeList: Array<string> = ["PanCard", "AdhaarCard", "VoterID", "Driving License", "Passport", "Other"];
  identityDropdownData: Array<IOption> = [];
  marginTypeData: any;
  marginArrData = [];
  dropdownData: any = {};
  sub: any;
  sspDataFormType: string;
  sspId: string;
  pincode_state: any;
  sspDetails: any;
  pdfdummyimage = false;
  tempaccountType = true;
  temphtmMachineId: any;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private sspService: sspAdminService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ProductToasterService
  ) {
    this.sub = this.route
    .queryParams
    .subscribe(params => {
      this.sspDataFormType = params.type;
      if ( this.sspDataFormType !== 'add') {
        if (!!params.sspId && params.sspId !== '') {
          this.sspId = params.sspId;
          this.getSSPData(this.sspId);
          this.gettypeDropdown();
          this.getMachineIDDropdown();
          this.selectIdentity();
        }
      } 
      else {
        this.bindAddForm();
        this.gettypeDropdown();
        this.getMachineIDDropdown();
        this.selectIdentity();
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
fileProgressCheque(event) {
  if (event.target.files && event.target.files[0]) {
    for (let i = 0; i < event.target.files.length; i++) {
      var selectedchequeFile = event.target.files[i];
            var reader = new FileReader();
            reader.onload = (event:any) => {
              this.previewUrlcheque.push(event.target.result);
              console.log(this.previewUrlcheque);
            }
            reader.readAsDataURL(selectedchequeFile);
    }
}
    for (var i = 0; i < event.target.files.length; i++) { 
      this.fileDatacheque.push(selectedchequeFile);
    }
}
removeSelectedCheque(index) {
  this.previewUrlcheque.splice(index, 1);
  this.fileDatacheque.splice(index, 1);
}
fileProgressidentity(event) {
  if (event.target.files && event.target.files[0]) {
    for (let i = 0; i < event.target.files.length; i++) {
      var selectedidentityFile = event.target.files[i];
            var reader = new FileReader();
            reader.onload = (event:any) => {
              this.previewUrlidentity.push(event.target.result);
            }
            reader.readAsDataURL(selectedidentityFile);
    }
}
    for (var i = 0; i < event.target.files.length; i++) { 
      this.fileDataidentity.push(selectedidentityFile);
    }
}
removeSelectedPancardIdentity(index) {
  this.previewUrlidentity.splice(index, 1);
  this.fileDataidentity.splice(index, 1);
}
  // Method: to bind and map fields data for adding data to category list
  bindAddForm() {
    this.temphtmMachineId = 'Select Identity Type';
    this.sspdetailsForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      lastName: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      mobile: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[6-9]\\d{9}')]],
      secondaryMobile: ['', [Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[6-9]\\d{9}')]],
      email: ['', [Validators.required, Validators.email]],
      alternateEmail: ['', [Validators.email]],
      companyName: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      dob: ['', Validators.required],
      htmMachineId: ['', [Validators.required]],
      country: [{value: 'India', disabled: true}, Validators.required],
      state: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      city: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      pincode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^[1-9][0-9]{5}$/)]],
      street_address_1: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      street_address_2: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      latlong: [{value: null, disabled: true}],
      bankName: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      branchName: ['', Validators.required],
      cancelledCheque: ['', [Validators.maxLength(20), Validators.minLength(2)]],
      accountNumber: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(2), Validators.pattern('^[0-9]*$')]],
      ifsc: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      accountHolderName: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      accountType: [null, [Validators.required]],
      gstNumber: ['', [Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      gstDocument: [null],
      cancelledChequeFile: [null],
      identity: [null],
      identityNumber: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/), Validators.minLength(5), Validators.maxLength(20)]],
      identityType: [null, Validators.required],
      marginValue: ['', [Validators.pattern(/^[0-9\.]+$/)]],
      marginType: ['', Validators.required],
      landlineContactNumber: ['', [Validators.pattern(/^[0-9]\d{2,4}-\d{6,8}$/)]],
    });
    this.sspdetailsForm.controls['pincode'].valueChanges.debounceTime(200).switchMap(term => of(term)).subscribe(change => {
      if (this.sspdetailsForm.controls['pincode'].valid) {
        this.getpincodeData(this.sspdetailsForm.controls['pincode'].value);
      } else {
        console.log('Invalid Pincode.');
      }
    });
  }
  // End of above code
  // Method: to bind and map fields data for adding data to category list
  bindEditForm(data) {
    if (data.financialDetails.accountType === 'SAVINGS') {
      this.tempaccountType = true;
    } else {
      this.tempaccountType = false;
    }
    this.temphtmMachineId = data.htmMachineId;
    this.sspdetailsForm = this.formBuilder.group({
      firstName: [data.firstName, [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      lastName: [data.lastName, [Validators.required, Validators.maxLength(50), Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      mobile: [data.mobile, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[6-9]\\d{9}')]],
      secondaryMobile: [data.secondaryMobile, [Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[6-9]\\d{9}')]],
      email: [data.email, [Validators.required, Validators.email]],
      alternateEmail: [data.alternateEmail, [Validators.email]],
      companyName: [data.companyName, [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      dob: [data.dob, Validators.required],
      htmMachineId: [data.htmMachineId, [Validators.required]],
      country: [{value: 'India', disabled: true}, Validators.required],
      state: [data.address.state, [Validators.required, Validators.maxLength(20), Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      city: [data.address.city, [Validators.required, Validators.maxLength(20), Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      pincode: [data.address.pincode, [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^[1-9][0-9]{5}$/)]],
      street_address_1: [data.address.street_address_1, [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      street_address_2: [data.address.street_address_2, [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      latlong: [{value: null, disabled: true}],
      bankName: [data.financialDetails.bankName, [Validators.required, Validators.maxLength(20), Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      branchName: [data.financialDetails.branchName, Validators.required],
      cancelledCheque: [data.financialDetails.cancelledCheque , [Validators.maxLength(20), Validators.minLength(2)]],
      accountNumber: [data.financialDetails.accountNumber, [Validators.required, Validators.maxLength(20), Validators.minLength(2), Validators.pattern('^[0-9]*$')]],
      ifsc: [data.financialDetails.ifsc, [Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      accountHolderName: [data.financialDetails.accountHolderName, [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      accountType: [this.tempaccountType, [Validators.required]],
      gstNumber: [data.gstNumber, [Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      gstDocument: [null],
      cancelledChequeFile: [null],
      identity: [null],
      identityNumber: [null, [Validators.pattern(/^[a-zA-Z0-9]*$/), Validators.minLength(5), Validators.maxLength(20)]],
      identityType: [null],
      marginValue: [data.marginValue, [Validators.pattern(/^[0-9\.]+$/)]],
      marginType: [data.type],
      landlineContactNumber: [data.landlineContactNumber, [Validators.pattern(/^[0-9]\d{2,4}-\d{6,8}$/)]],
    });
  }
  // End of above code
  // convenience getter for easy access to form fields
  get sspcheckout() { return this.sspdetailsForm.controls; }
  onSubmit(formData) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.sspdetailsForm.invalid) {
      this.toastrService.showWarning('Missing Data', 'Check the entry again!');
      return;
    } else {
      if (!!formData.valid && formData.valid === true) {
        const formData = new FormData();
        for (var i = 0; i < this.fileDatagst.length; i++) {
          formData.append("gstDocument", !!this.fileDatagst[i] ? this.fileDatagst[i] : null);
        }
        for (var i = 0; i < this.fileDatacheque.length; i++) {
          formData.append("cancelledChequeFile", !!this.fileDatacheque[i] ? this.fileDatacheque[i] : null);
        }
        for (var i = 0; i < this.fileDataidentity.length; i++) {
          formData.append("identity", !!this.fileDataidentity[i] ? this.fileDataidentity[i] : null);
        }
        formData.append('firstName', this.sspdetailsForm.get('firstName').value);
        formData.append('lastName', this.sspdetailsForm.get('lastName').value);
        formData.append('mobile', this.sspdetailsForm.get('mobile').value);
        formData.append('secondaryMobile', this.sspdetailsForm.get('secondaryMobile').value);
        formData.append('email', this.sspdetailsForm.get('email').value);
        formData.append('alternateEmail', this.sspdetailsForm.get('alternateEmail').value);
        formData.append('companyName', this.sspdetailsForm.get('companyName').value);
        // var pipe = new DatePipe('en-US');
        formData.append('dob', this.sspdetailsForm.get('dob').value);
        formData.append('htmMachineId', this.sspdetailsForm.get('htmMachineId').value);
        formData.append('gstNumber', this.sspdetailsForm.get('gstNumber').value);
        const tempLocation = {
          country: this.sspdetailsForm.get('country').value,
          state: this.sspdetailsForm.get('state').value,
          city: this.sspdetailsForm.get('city').value,
          street_address_1: this.sspdetailsForm.get('street_address_1').value,
          street_address_2: this.sspdetailsForm.get('street_address_2').value,
          pincode: this.sspdetailsForm.get('pincode').value,
          latlong: null,
        };
        formData.append('address', JSON.stringify(tempLocation));
        const tempFinancial = {
          accountHolderName: this.sspdetailsForm.get('accountHolderName').value,
          accountNumber: this.sspdetailsForm.get('accountNumber').value,
          ifsc: this.sspdetailsForm.get('ifsc').value,
          bankName: this.sspdetailsForm.get('bankName').value,
          branchName: this.sspdetailsForm.get('branchName').value,
          cancelledCheque: this.sspdetailsForm.get('cancelledCheque').value,
          accountType: this.sspdetailsForm.get('accountType').value === true ? 'SAVINGS' : 'CURRENT',
        };
        formData.append('financialDetails', JSON.stringify(tempFinancial));
        formData.append('margin', JSON.stringify(this.marginArrData));
        if(this.sspdetailsForm.get('identityNumber').value !== null) {
          formData.append('identityNumber', this.sspdetailsForm.get('identityNumber').value);
        }
        if(this.sspdetailsForm.get('identityType').value !== null) {
          formData.append('identityType', this.sspdetailsForm.get('identityType').value);
        }
        formData.append('landlineContactNumber', this.sspdetailsForm.get('landlineContactNumber').value);
        if (this.sspDataFormType === 'edit') {
          formData.append('sspId', this.sspId);
          this.sspService.editSSPData(formData).subscribe(
            response => {
              if (!!response && !!response.success && response.success === true) {
                console.log(response);
                this.toastrService.showSuccess('Success', response.response.message);
                this.router.navigate(['/app/ssp-admin'], { queryParams: { pageSize: 50, currentPage: 1} });
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
          this.sspService.saveSSPData(formData).subscribe(
            response => {
              if (!!response && !!response.success && response.success === true) {
                console.log(response);
                this.toastrService.showSuccess('Success', response.response.message);
                this.router.navigate(['/app/ssp-admin'], { queryParams: { pageSize: 50, currentPage: 1} });
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
    this.sspdetailsForm.reset();
}
// Method: to fetch SSP Detail data from BE
getSSPData(cId) {
  const queryObj = {
    sspId: cId
  }
  const sspQueryStr = ProductUtilities.generateQueryString(queryObj);
  this.sspService.getSSPDetailById(sspQueryStr).subscribe(
    response => {
      if ( response.success === true) {
        if (!!response.response.data && response.response.data !== null) {
          this.sspDetails = response.response.data;
          this.bindEditForm(response.response.data);
          this.marginArrData = response.response.data.margin;
        } else {
          this.toastrService.showError('Error', 'Something went wrong. Please Try again latter');
          this.router.navigate(['/app/ssp-admin/'], { queryParams: {  perPage: 50, currentPage: 1} });
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
    this.sspService.getpincodedetails(pincodeQueryStr).subscribe(
      response => {
        if ( response.success === true) {
          if (!!response.response.data && response.response.data !== null) {
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
  // Method to Fetch Margin Type
  gettypeDropdown() {
    const typeQueryStr = 'name=VENDOR_TYPES';
    this.sspService.gettypeDropdown(typeQueryStr).subscribe(
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
        if ( this.sspDataFormType !== 'add') {
        this.getSSPData(this.sspId);
        }
      },
      err => {
        this.toastrService.showError('Network Error', 'Please try again later');
        console.error(err);
      }
    );
  }
  // Method to Fetch HTMMachingID Type
  getMachineIDDropdown() {
    this.sspService.gethtmmachineID().subscribe(
      response => {
        if (!!response && !!response.success && response.success === true && response.response.data.length !== 0 ) {
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < response.response.data.length; i++) {
            this.machineIdDropdownData.push(
              {
                value: response.response.data[i].htmIdentity,
                label: response.response.data[i].htmIdentity
              });
          }
        } else {
          this.machineIdDropdownData = [];
          console.log('No ID Coming from the BE');
        }
        if ( this.sspDataFormType !== 'add') {
        this.getSSPData(this.sspId);
        }
      },
      err => {
        this.toastrService.showError('Network Error', 'Please try again later');
        console.error(err);
      }
    );
  }
  // Method to Update Status
  selectIdentity() {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.identityTypeList.length; i++) {
      this.identityDropdownData.push(
        {
          value: this.identityTypeList[i],
          label: this.identityTypeList[i]
        });
    }
  }
// Method: to add items to Margin list table
AddToMarginList(marginTypeData, marginValueData) {
  if (!!marginTypeData && !!marginValueData) {
    if (this.marginArrData.length !== 0) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.marginArrData.length; i++) {
        if (this.marginArrData[i] === marginTypeData) {
          this.toastrService.showError('Error', 'Already Added In List');
          return false;
        }
      }
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.typeDropdownData.length; i++) {
        if (this.typeDropdownData[i].value === marginTypeData ) {
          marginTypeData = this.typeDropdownData[i].label;
          break;
        }
      }
      this.marginArrData.push({
        marginType: marginTypeData,
        marginValue: marginValueData
      });
    } else {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.typeDropdownData.length; i++) {
        if (this.typeDropdownData[i].value === marginTypeData ) {
          marginTypeData = this.typeDropdownData[i].label;
          break;
        }
      }
      this.marginArrData.push({
        marginType: marginTypeData,
        marginValue: marginValueData
      });
    }
  } else {
    this.toastrService.showError('Error', 'Data is needed.');
  }
}
// Method: to delete items from Margin list table
deleteMargin(data) {
if (this.marginArrData.length <= 1) {
  this.marginArrData = [];
  this.toastrService.showWarning('Warning', 'Please add margin.');
  console.log(this.sspdetailsForm.value.marginType);
  console.log(this.sspdetailsForm.value.marginValue);
} else {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.typeDropdownData.length; i++) {
      if (this.typeDropdownData[i].value === data) {
        data = this.typeDropdownData[i].label;
        break;
      }
    }
  this.marginArrData.pop();
}
}
}
