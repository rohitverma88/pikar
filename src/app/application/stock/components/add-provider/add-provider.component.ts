import { Component, EventEmitter, OnInit, ViewChild, ElementRef, OnDestroy, Input } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ResponseCode } from 'src/app/core/dictionary/response-code';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { StockService } from '../../services/stock.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ProductToasterService } from 'src/app/core/services/toaster.service';
import { IOption } from 'ng-select';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { of } from 'rxjs';
declare var $:any;
@Component({
  selector: 'app-add-provider',
  templateUrl: './add-provider.component.html',
  styleUrls: ['./add-provider.component.scss']
})
export class AddProviderComponent implements OnInit {
  productTypehead = new EventEmitter<string>();
  serverSideSKUItems = [];
  selectedSKU: any;
  providerTypehead = new EventEmitter<string>();
  serverSideproviderItems = [];
  selectedprovider: any;
  addstockForm: FormGroup;
  submitted = false;
  sub: any;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private stockService: StockService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ProductToasterService
  ) {
    this.bindAddForm();
  }
  ngOnInit() {
    this.searchsku();
    this.searchProvider();
  }
  // Method: To Search and Fetch SKU
  searchsku() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0);
    });
    this.productTypehead.pipe(
      distinctUntilChanged(),
      debounceTime(500),
      switchMap(sku => of(sku))
  ).subscribe(res => {
    if(!!res && res !== '') {
      this.getStockList(res);
    }
  });
  }
  getStockList(str) {
    this.stockService.getProductList(str).subscribe(res => {
      this.serverSideSKUItems = res.response.data;
  }, (err) => {
      console.log(err);
      this.serverSideSKUItems = [];
  })
  }
  // Method: To Search and Fetch SKU
  searchProvider() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
    });
    this.providerTypehead.pipe(
        distinctUntilChanged(),
        debounceTime(500),
        switchMap(provider => of(provider))
    ).subscribe(res => {
      if(!!res && res !== '') {
        this.getProviderList(res);
      }
    });
  }
  getProviderList(str){
    this.stockService.getProviderList(str).subscribe(res => {
          this.serverSideproviderItems = res.response.data;
      }, (err) => {
          console.log(err);
          this.serverSideproviderItems = [];
      })
  }
  getValues() {
    console.log(this.selectedprovider);
  }
  // Method: to bind and map fields data for adding data to category list
  bindAddForm() {
    this.addstockForm = this.formBuilder.group({
      providerId: ['', Validators.required],
      sku: ['', Validators.required],
      providerType: ['', [Validators.required]],
      units: ['', Validators.required]
    });
  }
  // End of above code
  // convenience getter for easy access to form fields
  get addStockcheckout() { return this.addstockForm.controls; }
  onSubmit(formData) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addstockForm.invalid) {
      this.toastrService.showError('Missing Data', 'Check the entry again!');
      return;
    } else {
      if (!!formData.valid && formData.valid === true) {
        const requestObj: any = {
          sku: this.addstockForm.get('sku').value,
          providerId: this.addstockForm.get('providerId').value,
          providerType: this.addstockForm.get('providerType').value,
          units: +(this.addstockForm.get('units').value),
        }
        console.log(requestObj);
        this.stockService.addProvider(requestObj).subscribe(
          response => {
            if (!!response && !!response.success && response.success === true) {
              console.log(response);
              this.toastrService.showSuccess('Success', response.response.message);
              this.router.navigate(['/app/stock']);
            } else {
              this.toastrService.showError('Error', response.data.error);
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
onReset() {
    this.submitted = false;
    this.addstockForm.reset();
}
}
