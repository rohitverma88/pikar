import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ProductLayoutModule } from '../../layouts/product-layout/product-layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

const dashboardRoutes: Routes = [
  {
    path: '', component: DashboardComponent
  }
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    ProductLayoutModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forChild(dashboardRoutes)
  ]
})
export class DashboardModule { }

