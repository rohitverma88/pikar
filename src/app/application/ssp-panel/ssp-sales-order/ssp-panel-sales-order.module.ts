import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SspsalesOrderListingComponent } from './components/sales-order/ssp-sales-order-listing/ssp-sales-order-listing.component';
import { AceSspSalesOrderComponent } from './components/sales-order/ace-ssp-sales-order/ace-ssp-sales-order.component';
import { Routes, RouterModule } from '@angular/router';
import { SelectModule } from 'ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ViewSspSalesOrderComponent } from './components/sales-order/view-ssp-sales-order/view-ssp-sales-order.component';
import { LabTestListingComponent } from './components/lab-test/lab-test-listing/lab-test-listing.component';
import { AceLabTestComponent } from './components/lab-test/ace-lab-test/ace-lab-test.component';
import { ViewLabTestComponent } from './components/lab-test/view-lab-test/view-lab-test.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

const sspSalesOrderRoutes: Routes = [
  {
    path: 'sales-order', component: SspsalesOrderListingComponent
  },
  {
    path: 'sales-order/ace-ssp-sales-order', component: AceSspSalesOrderComponent
  },
  {
    path: 'sales-order/view-ssp-sales-order', component: ViewSspSalesOrderComponent
  },
  {
    path: 'lab-test', component: LabTestListingComponent
  },
  {
    path: 'lab-test/ace-lab-test', component: AceLabTestComponent
  },
  {
    path: 'lab-test/view-lab-test', component: ViewLabTestComponent
  },
];

@NgModule({
  declarations: [SspsalesOrderListingComponent, AceSspSalesOrderComponent, ViewSspSalesOrderComponent, LabTestListingComponent, AceLabTestComponent, ViewLabTestComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    SelectModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forChild(sspSalesOrderRoutes)
  ]
})

export class SspPanelSalesOrderModule { }
