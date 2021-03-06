import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorListingComponent } from './components/vendor-listing/vendor-listing.component';
import { AceVendorComponent } from './components/ace-vendor/ace-vendor.component';
import { Routes, RouterModule } from '@angular/router';
import { SelectModule } from 'ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ViewVendorComponent } from './components/view-vendor/view-vendor.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

const vendorRoutes: Routes = [
  {
    path: '', component: VendorListingComponent
  },
  {
    path: 'add-edit-vendor', component: AceVendorComponent
  },
  {
    path: 'view-vendor', component: ViewVendorComponent
  },

];

@NgModule({
  declarations: [VendorListingComponent, AceVendorComponent, ViewVendorComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    SelectModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forChild(vendorRoutes)
  ]
})
export class VendorModule { }
