import { Component, OnInit } from '@angular/core';
import { ResponseCode } from 'src/app/core/dictionary/response-code';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductToasterService } from 'src/app/core/services/toaster.service';
import { VendorService } from '../../services/vendor.service';
import { ProductUtilities } from 'src/app/core/utilities/utility';
import { ExportPdfFile } from 'src/app/core/utilities/export-pdf';
import { AuthService } from 'src/app/core/auth/auth.service';
@Component({
  selector: 'app-view-vendor',
  templateUrl: './view-vendor.component.html',
  styleUrls: ['./view-vendor.component.scss']
})
export class ViewVendorComponent {
  specificImageData: any;
  sub: any;
  vendorId: string;
  responseCode = ResponseCode;
  vendorDetails: any;
  downloadPdfEntity = new ExportPdfFile(this.auth, this.toastrService);
  constructor(
    private formBuilder: FormBuilder,
    private vendorService: VendorService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private toastrService: ProductToasterService,
  ) {
    this.sub = this.route
    .queryParams
    .subscribe(params => {
      if (!!params.vendorId && params.vendorId !== '') {
      this.vendorId = params.vendorId;
      this.getVendorData(this.vendorId);
      }
    });
  }
  // Method: which is used to export Vendor
  exportVendor(){
    console.log('exportVendor called');
    if (!!this.vendorId && this.vendorId !== '') {
      this.downloadPdfEntity.getPdfData('vendor', 'download', this.vendorId);
    } else {
      this.toastrService.showError('Error', 'Sometime went wrong, Please try again later !!!');
    }
  }
  // End of the above code
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
            this.vendorDetails = response.response.data;
            console.log(this.vendorDetails);
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