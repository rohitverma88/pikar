import { Component, EventEmitter, ElementRef, OnInit, ViewChild } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ResponseCode } from 'src/app/core/dictionary/response-code';
import { SelectionType, ColumnMode } from '@swimlane/ngx-datatable';
import { StockService  } from 'src/app/application/stock/services/stock.service';
import { ProductToasterService } from 'src/app/core/services/toaster.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductUtilities } from 'src/app/core/utilities/utility';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { of } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-stock-listing',
  templateUrl: './stock-listing.component.html',
  styleUrls: ['./stock-listing.component.scss']
})
export class StockListingComponent implements OnInit {
  productTypehead = new EventEmitter<string>();
  serverSideSKUItems = [];
  selectedSKU: any;
  responseCode = ResponseCode;
  SelectionType = SelectionType;
  sub: any;
  selectedProductSKU: any;
  constructor(private stockService: StockService ,
              private toastrService: ProductToasterService,
              private auth: AuthService,
              private fb: FormBuilder,
              private excelformBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) {}
  ngOnInit() {
    this.searchProductSku();
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
    this.stockService.getStockList(str).subscribe(res => {
      this.serverSideSKUItems = res.response.data;
  }, (err) => {
      console.log(err);
      this.serverSideSKUItems = [];
  })
  }
  getSelectedProduct(data) {
    if(!!data && data !== '') {
      let selectedProductObj = {};
      for (let i = 0; i< this.serverSideSKUItems.length ; i++) {
        if(this.serverSideSKUItems[i].productSku === data) {
          selectedProductObj = this.serverSideSKUItems[i];
          break;
        }
      }
      this.selectedProductSKU = selectedProductObj;
      console.log(this.selectedProductSKU);
    } else {
      this.selectedProductSKU = null;
      this.serverSideSKUItems = [];
    }
  }
}
