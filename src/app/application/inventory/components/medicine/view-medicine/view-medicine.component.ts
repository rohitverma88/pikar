import { Component, OnInit } from '@angular/core';
import { ResponseCode } from 'src/app/core/dictionary/response-code';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductToasterService } from 'src/app/core/services/toaster.service';
import { InventoryService } from '../../../services/InventoryService';
import { ProductUtilities } from 'src/app/core/utilities/utility';

@Component({
  selector: 'app-view-medicine',
  templateUrl: './view-medicine.component.html',
  styleUrls: ['./view-medicine.component.scss']
})
export class ViewMedicineComponent {
  specificImageData: any;
  sub: any;
  productId: string;
  responseCode = ResponseCode;
  medicineDetails: any;
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
      this.getMedicineData(this.productId);
      }
    });
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
            this.medicineDetails = response.response.data;
            console.log(this.medicineDetails)
          } else {
            this.toastrService.showError('Error', 'Something went wrong. Please try again later!');
            this.router.navigate(['/app/inventory/medicine'], { queryParams: {  perPage: 50, currentPage: 1} });
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
  toasterAlert() {
    this.toastrService.showWarning('Oops!', 'Image not available.');
  }
  backtoListing() {
    window.history.back();
  }
}
 // End of code

