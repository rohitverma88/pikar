import { Component, OnInit } from '@angular/core';
import { ResponseCode } from 'src/app/core/dictionary/response-code';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductToasterService } from 'src/app/core/services/toaster.service';
import { InventoryService } from '../../../services/InventoryService';
import { ProductUtilities } from 'src/app/core/utilities/utility';

@Component({
  selector: 'app-view-diagnostics',
  templateUrl: './view-diagnostics.component.html',
  styleUrls: ['./view-diagnostics.component.scss']
})
export class ViewDiagnosticsComponent {
  specificImageData: any;
  sub: any;
  productId: string;
  responseCode = ResponseCode;
  diagnosticDetails: any;
  constructor(
    private formBuilder: FormBuilder,
    private inventoryService: InventoryService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ProductToasterService,
  ) {
    this.sub = this.route
    .queryParams
    .subscribe(params => {
      if (!!params.productId && params.productId !== '') {
      this.productId = params.productId;
      this.getdiagnosticData(this.productId);
      }
    });
  }
  // Method: to fetch Vendor Detail data from BE
  getdiagnosticData(cId) {
    const queryObj = {
      productId: cId
    }
    const diagnosticQueryStr = ProductUtilities.generateQueryString(queryObj);
    this.inventoryService.getDiagnosticDetailById(diagnosticQueryStr).subscribe(
      response => {
        if ( response.success === true) {
          if (!!response.response.data && response.response.data !== null) {
            this.diagnosticDetails = response.response.data;
            console.log(this.diagnosticDetails);
          } else {
            this.toastrService.showError('Error', 'Something went wrong. Please Try again latter');
            this.router.navigate(['/app/inventory/diagnostics'], { queryParams: {  perPage: 50, currentPage: 1} });
          }
        }
      },
      err => {
        this.toastrService.showError('Network Error', 'Please try again later');
        console.error(err);
      }
    );
  }
  openSpecificImage(data: any) {
    this.specificImageData = data;
  }
  viewPDF(url) {
    window.open(url, '_blank');
  }
  toasterAlert() {
    this.toastrService.showWarning('Oops!', 'Image not available.');
  }
  backtoListing() {
    window.history.back();
  }
}
 // End of code

