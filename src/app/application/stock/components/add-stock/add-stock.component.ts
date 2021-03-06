import { Component, EventEmitter, OnInit, ViewChild, ElementRef, OnDestroy, Input } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ResponseCode } from 'src/app/core/dictionary/response-code';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { StockService } from '../../services/stock.service';
import { ProductToasterService } from 'src/app/core/services/toaster.service';
import { IOption } from 'ng-select';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { of } from 'rxjs';
declare var $:any;
@Component({
  selector: 'app-add-stock',
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.scss']
})
export class AddStockComponent implements OnInit {
  productTypehead = new EventEmitter<string>();
  serverSideSKUItems = [];
  selectedSKU: any;
  providerTypehead = new EventEmitter<string>();
  serverSideproviderItems = [];
  selectedprovider: any;
  addstockForm: FormGroup;
  submitted = false;
  selectedProductSKU: any;
  selectedProviderDetails: any;
  sub: any;
  available_units: any;
  total_unit_sale: any;
  stock: any = [];
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
    this.searchProductSku();
    this.searchProvider();
  }
  // Method: To Search and Fetch SKU
  searchProductSku() {
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
          console.log(res.response.data);
          this.serverSideproviderItems = res.response.data;
      }, (err) => {
          console.log(err);
          this.serverSideproviderItems = [];
      })
  }
  getSelectedProduct(data) {
    if(!!data && data !== '') {
      let selectedProductObj = {};
      for (let i = 0; i< this.serverSideSKUItems.length ; i++) {
        if(this.serverSideSKUItems[i].productId === data) {
          selectedProductObj = this.serverSideSKUItems[i];
          break;
        }
      }
      this.selectedProductSKU = selectedProductObj;
      console.log(this.selectedProductSKU);
    }
  }
  getSelectedprovider(data) {
    console.log(data);
    if(!!data && data !== '') {
      let selectedProviderObj = {};
      for (let i = 0; i< this.serverSideproviderItems.length ; i++) {
        if(this.serverSideproviderItems[i].accountId === data) {
          selectedProviderObj = this.serverSideproviderItems[i];
          break;
        }
      }
      this.selectedProviderDetails = selectedProviderObj;
    } else {
      this.selectedProviderDetails = null;
      this.available_units = '';
      this.total_unit_sale = '';
    }
  }
  getValues() {
    // console.log(this.selectedSKU);
  }
  // Method: to bind and map fields data for adding data to category list
  bindAddForm() {
    this.addstockForm = this.formBuilder.group({
      productSku: ['', Validators.required],
      lastUnitsSell: [{value: '0', disabled: true}],
      lastSoldBy: [''],
      stock: ['', Validators.required]
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
        if (!!this.selectedProviderDetails && this.selectedProviderDetails !== '') {
          if(!(!!this.available_units && this.available_units !== '' && !!this.total_unit_sale && this.total_unit_sale !== '')) {
            this.toastrService.showError('Missing Data', 'Please enter Available Units and Total Units.');
            return;
          } else {
            this.stock.push(
              {
                providerId: this.selectedProviderDetails.accountId,
                providerType: this.selectedProviderDetails.userType,
                available_units: +this.available_units,
                total_unit_sale: +this.total_unit_sale
              }
            );
            console.log(this.stock);
          }
        }
        const requestObj: any = {
          productSku: this.addstockForm.get('productSku').value,
          productCategory: !!this.selectedProductSKU.category && this.selectedProductSKU.category !== '' ? this.selectedProductSKU.category : '',
          lastUnitsSell: +this.addstockForm.get('lastUnitsSell').value,
          lastSoldBy: this.addstockForm.get('lastSoldBy').value,
          stock: JSON.stringify(this.stock)
        }
        console.log(requestObj);
        this.stockService.addStockData(requestObj).subscribe(
          response => {
            if (!!response && !!response.success && response.success === true) {
              console.log(response);
              this.toastrService.showSuccess('Success', response.response.message);
              this.router.navigate(['/app/stock']);
            } else {
              this.toastrService.showError('Error', response.data.message);
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
