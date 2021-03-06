import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SspPanelSalesOrderService } from '../../../services/ssp-panel-sales-order.service';
import { ExportPdfFile } from 'src/app/core/utilities/export-pdf';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ResponseCode } from 'src/app/core/dictionary/response-code';
import { ProductToasterService } from 'src/app/core/services/toaster.service';
import { ProductUtilities } from 'src/app/core/utilities/utility';
@Component({
  selector: 'app-view-lab-test',
  templateUrl: './view-lab-test.component.html',
  styleUrls: ['./view-lab-test.component.scss']
})
export class ViewLabTestComponent {
  model: any = {};
  specificImageData: any;
  sub: any;
  bookingId: string;
  responseCode = ResponseCode;
  orderDetails: any;
  downloadPdfEntity = new ExportPdfFile(this.auth, this.toastrService);
  constructor(
    private formBuilder: FormBuilder,
    private ordersService: SspPanelSalesOrderService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private toastrService: ProductToasterService,
  ) {
    this.sub = this.route
    .queryParams
    .subscribe(params => {
      if (!!params.bookingId && params.bookingId !== '') {
      this.bookingId = params.bookingId;
      this.getOrderData(this.bookingId);
      }
    });
  }
  // Method: to fetch Order Detail data from BE
  getOrderData(cId) {
    const queryObj = {
      bookingId: cId
    }
    const orderQueryStr = ProductUtilities.generateQueryString(queryObj);
    this.ordersService.getLabTestDetailsById(orderQueryStr).subscribe(
      response => {
        if ( response.success === true) {
          if (!!response.response.data && response.response.data !== null) {
            this.orderDetails = response.response.data;
          } else {
            this.toastrService.showError('Error', 'Something went wrong. Please Try again latter');
            this.router.navigate(['/app/ssp-panel/sales-order'], { queryParams: {  perPage: 50, currentPage: 1} });
          }
        }
      },
      err => {
        this.toastrService.showError('Network Error', 'Please try again later');
        console.error(err);
      }
    );
  }
  onNavigate(data) {
    console.log(data);
    if (!!data) {
      const url = '' + data;
      window.open(url, '_blank');
    } else {
      this.toastrService.showError('Error', 'Something went wrong, Please try again later !!!');
    }
}
toasterAlert() {
  this.toastrService.showWarning('Oops!', 'Image not available.');
}
backtoListing() {
  window.history.back();
}
}
 // End of code