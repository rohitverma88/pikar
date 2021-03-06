import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesOrderListingComponent } from './components/sales-order/sales-order-listing/sales-order-listing.component';
import { AceSalesOrderComponent } from './components/sales-order/ace-sales-order/ace-sales-order.component';
import { ViewSalesOrderComponent } from './components/sales-order/view-sales-order/view-sales-order.component';
import { CompleteSalesOrderComponent } from './components/sales-order/complete-sales-order/complete-sales-order.component';
import { Routes, RouterModule } from '@angular/router';
import { SelectModule } from 'ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LabTestListingComponent } from './components/lab-test/lab-test-listing/lab-test-listing.component';
import { AceLabTestComponent } from './components/lab-test/ace-lab-test/ace-lab-test.component';
import { ViewLabTestComponent } from './components/lab-test/view-lab-test/view-lab-test.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

const OrderRoutes: Routes = [
  {
    path: 'sales-order', component: SalesOrderListingComponent
  },
  {
    path: 'sales-order/ace-sales-order', component: AceSalesOrderComponent
  },
  {
    path: 'sales-order/view-sales-order', component: ViewSalesOrderComponent
  },
  {
    path: 'sales-order/complete-sales-order', component: CompleteSalesOrderComponent
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
  declarations: [SalesOrderListingComponent, AceSalesOrderComponent, ViewSalesOrderComponent, CompleteSalesOrderComponent, LabTestListingComponent, AceLabTestComponent, ViewLabTestComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    SelectModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forChild(OrderRoutes)
  ]
})

export class OrderModule { }
