import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from './services/login.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { ProductToasterService } from 'src/app/core/services/toaster.service';
import { Router } from '@angular/router';
import { IOption } from 'ng-select';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup;
  loginTypeFormGroup: FormGroup;
  submitted = false;
  typesubmitted = false;
  checkLoginFormValidation = false;
  checktypeLoginFormValidation = false;
  showloginTypeForm = false;
  rolesDropdownData: Array<IOption> = [];
  responseData: any;
  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private storageService: StorageService,
    private toastrService: ProductToasterService,
    private router: Router
  ) { }
  ngOnInit() {
    this.loginFormGroup = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    this.loginTypeFormGroup = this.formBuilder.group({
      roles: ['', [Validators.required]]
    });
  }
  adminloginForm(){
    return this.loginFormGroup.controls;
  }
  // Below Method is used for login user
  onSubmit = (data: any) => {
    console.log('in OnSubmit the Data is ', data);
    this.submitted = true;
    if (this.loginFormGroup.invalid) {
        return;
    }
    if (this.loginFormGroup.valid) {
      if (data.valid === true) {
        this.loginService.loginUser(this.loginFormGroup.value).subscribe(
          response => {
            if (!!response && !!response.success && response.success === true) {
              this.responseData = response.response.data;
              // console.log(this.responseData.roles);
              this.showloginTypeForm = true;
              if (this.responseData.roles.length !== 0 ) {
                for (let i = 0; i < this.responseData.roles.length; i++) {
                  this.rolesDropdownData.push(
                    {
                      value: this.responseData.roles[i],
                      label: this.responseData.roles[i]
                    });
                }
              } else {
                this.rolesDropdownData = [];
                this.toastrService.showError('Error', 'Something went wrong!');
                console.log('No Role Coming from the BE');
              }
            } else {
              this.toastrService.showError('Error', response.data.error);
            }
          },
          err => {
            console.error(err);
            this.toastrService.showError('Error', err.error.data.error);
              }
          );
      } else {
        this.checkLoginFormValidation = true;
      }
    }
  }
  // End of the above code
  get admintypeloginForm(){
    return this.loginTypeFormGroup.controls;
  }
  // Below Method is used for submitting type of login
  onloginTypeSubmit = (data: any) => {
    this.typesubmitted = true;
    // stop here if form is invalid
    if (this.loginTypeFormGroup.invalid) {
        return false;
    }
    if (this.loginTypeFormGroup.valid) {
      if (data.valid === true) {
        console.log('Submitted Data will be: ', data);
        const requestObject = {
          id : this.responseData.id,
          selectedRole: data.value.roles
        };
        console.log('The Request Data is ', requestObject);
        this.loginService.loginUserWithRole(requestObject).subscribe(
          response => {
            if (!!response && !!response.success && response.success === true) {
              this.toastrService.showSuccess('Success', 'Login SuccessFull !!!');
              const storageObject = {
                token: response.response.data.access_token,
                user_role: data.value.roles
              }
              this.storageService.setData('user_data', storageObject);
              if(storageObject.user_role === 'SSP') {
                // navigate to SSP Order Listing
                this.router.navigate(['/app/ssp-panel/ssp-sales-order/sales-order/'], { queryParams: {  pageSize: 50, currentPage: 1} });
              } else {
                // navigate to Dashboard For Admin User
                this.router.navigate(['/app/dashboard']);
              }
            } else {
              this.toastrService.showError('Error', response.data.message);
            }
          },
          err => {
            console.error(err);
            this.toastrService.showError('Error', err.error.data.message);
            }
          );
      } else {
        this.checktypeLoginFormValidation = true;
      }
    }
  }
  //
}
