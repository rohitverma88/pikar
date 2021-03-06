import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SelectModule } from 'ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProductsListingComponent } from './components/products/products-listing/products-listing.component';
import { ViewProductsComponent } from './components/products/view-products/view-products.component';
import { MedicineListingComponent } from './components/medicine/medicine-listing/medicine-listing.component';
import { ViewMedicineComponent } from './components/medicine/view-medicine/view-medicine.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

const inventoryRoutes: Routes = [
  {
    path: 'products', component: ProductsListingComponent
  },
  {
    path: 'products/view-products', component: ViewProductsComponent
  },
  {
    path: 'medicine', component: MedicineListingComponent
  },
  {
    path: 'medicine/view-medicine', component: ViewMedicineComponent
  }
];

@NgModule({
  declarations: [
    ProductsListingComponent,
    ViewProductsComponent,
    MedicineListingComponent,
    ViewMedicineComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    SelectModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forChild(inventoryRoutes)
  ]
})
export class SspInventoryModule { }
