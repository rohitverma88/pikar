import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SelectModule } from 'ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

const sspPanelRoutes: Routes = [
    // tslint:disable-next-line: max-line-length
    { path: 'ssp-sales-order', loadChildren: () => import('src/app/application/ssp-panel/ssp-sales-order/ssp-panel-sales-order.module').then(m => m.SspPanelSalesOrderModule) },
    { path: 'ssp-inventory', loadChildren: () => import('src/app/application/ssp-panel/ssp-inventory/sspinventory.module').then(m => m.SspInventoryModule) }

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    SelectModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forChild(sspPanelRoutes)
  ]
})
export class SSPPanelModule { }
