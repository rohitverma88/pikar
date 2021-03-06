import { Component, OnInit } from '@angular/core';
import { ResponseCode } from 'src/app/core/dictionary/response-code';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductToasterService } from 'src/app/core/services/toaster.service';
import { OrderService  } from 'src/app/application/orders/services/orders.service';
import { ProductUtilities } from 'src/app/core/utilities/utility';
import { ExportPdfFile } from 'src/app/core/utilities/export-pdf';
import { AuthService } from 'src/app/core/auth/auth.service';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-complete-sales-order',
  templateUrl: './complete-sales-order.component.html',
  styleUrls: ['./complete-sales-order.component.scss']
})
export class CompleteSalesOrderComponent {
  completeOrderForm: FormGroup;
  submitted = false;
  model: any = {};
  specificImageData: any;
  sub: any;
  orderId: string;
  responseCode = ResponseCode;
  orderDetails: any;
  trackingInformation: any;
  downloadPdfEntity = new ExportPdfFile(this.auth, this.toastrService);
  constructor(
    private formBuilder: FormBuilder,
    private ordersService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private toastrService: ProductToasterService,
  ) {
    this.sub = this.route
    .queryParams
    .subscribe(params => {
      if (!!params.orderId && params.orderId !== '') {
      this.orderId = params.orderId;
      this.getOrderData(this.orderId);
      }
    });
  }
  // End of the above code
  // Method: to fetch Order Detail data from BE
  getOrderData(cId) {
    const queryObj = {
      orderId: cId
    }
    const orderQueryStr = ProductUtilities.generateQueryString(queryObj);
    this.ordersService.getOrderDetailById(orderQueryStr).subscribe(
      response => {
        if ( response.success === true) {
          if (!!response.response.data && response.response.data !== null) {
            this.orderDetails = response.response.data;
            this.bindCompleteForm(this.orderDetails);
          } else {
            this.toastrService.showError('Error', 'Something went wrong. Please Try again latter');
            this.router.navigate(['/app/orders/sales-order/'], { queryParams: {  perPage: 50, currentPage: 1} });
          }
        }
      },
      err => {
        this.toastrService.showError('Network Error', 'Please try again later');
        console.error(err);
      }
    );
  }
  bindCompleteForm(data) {
    this.completeOrderForm = this.formBuilder.group({
      orderId: [{value: data.Order.orderId, disabled: true}, Validators.required],
    });
}
get ordercheckout() { return this.completeOrderForm.controls; }
onSubmit(formData) {
  this.submitted = true;
  // stop here if form is invalid
  if (this.completeOrderForm.invalid) {
    this.toastrService.showWarning('Missing Data', 'Check the entry again!');
    return;
  } else {
    if (!!formData.valid && formData.valid === true) {
      this.toastrService.showSuccess('Success', 'Order Updated');
      const formData = new FormData();
      formData.append('orderId', this.completeOrderForm.get('orderId').value);
      console.log(formData);
    }
  }
}
onReset() {
  this.submitted = false;
  this.completeOrderForm.reset();
  window.history.back();
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