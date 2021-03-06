import { Component, OnInit } from '@angular/core';
import { ResponseCode } from 'src/app/core/dictionary/response-code';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductToasterService } from 'src/app/core/services/toaster.service';
import { sspAdminService } from '../../services/ssp-admin.service';
import { ProductUtilities } from 'src/app/core/utilities/utility';
import { ExportPdfFile } from 'src/app/core/utilities/export-pdf';
import { AuthService } from 'src/app/core/auth/auth.service';
@Component({
  selector: 'app-view-ssp-admin',
  templateUrl: './view-ssp-admin.component.html',
  styleUrls: ['./view-ssp-admin.component.scss']
})
export class ViewSSPAdminComponent {
  specificImageData: any;
  sub: any;
  sspId: string;
  responseCode = ResponseCode;
  sspDetails: any;
  downloadPdfEntity = new ExportPdfFile(this.auth, this.toastrService);
  constructor(
    private formBuilder: FormBuilder,
    private vendorService: sspAdminService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private toastrService: ProductToasterService,
  ) {
    this.sub = this.route
    .queryParams
    .subscribe(params => {
      if (!!params.sspId && params.sspId !== '') {
      this.sspId = params.sspId;
      this.getSSPData(this.sspId);
      }
    });
  }
  // Method: which is used to export Vendor
  exportSSP(){
    if (!!this.sspId && this.sspId !== '') {
      this.downloadPdfEntity.getPdfData('ssp-admin', 'download', this.sspId);
    } else {
      this.toastrService.showError('Error', 'Sometime went wrong, Please try again later !!!');
    }
  }
  // End of the above code
  // Method: to fetch SSP Detail data from BE
  getSSPData(cId) {
    const queryObj = {
      sspId: cId
    }
    const sspQueryStr = ProductUtilities.generateQueryString(queryObj);
    this.vendorService.getSSPDetailById(sspQueryStr).subscribe(
      response => {
        if ( response.success === true) {
          if (!!response.response.data && response.response.data !== null) {
            this.sspDetails = response.response.data;
            console.log(this.sspDetails);
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