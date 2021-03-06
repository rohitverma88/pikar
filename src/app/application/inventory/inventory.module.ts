import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SelectModule } from 'ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProductsListingComponent } from './components/products/products-listing/products-listing.component';
import { AceProductsComponent } from './components/products/ace-products/ace-products.component';
import { ViewProductsComponent } from './components/products/view-products/view-products.component';
import { DiagnosticsListingComponent } from './components/diagnostics/diagnostics-listing/diagnostics-listing.component';
import { AceDiagnosticsComponent } from './components/diagnostics/ace-diagnostics/ace-diagnostics.component';
import { ViewDiagnosticsComponent } from './components/diagnostics/view-diagnostics/view-diagnostics.component';
import { MedicineListingComponent } from './components/medicine/medicine-listing/medicine-listing.component';
import { AceMedicineComponent } from './components/medicine/ace-medicine/ace-medicine.component';
import { ViewMedicineComponent } from './components/medicine/view-medicine/view-medicine.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


const inventoryRoutes: Routes = [
  {
    path: 'products', component: ProductsListingComponent
  },
  {
    path: 'products/add-edit-products', component: AceProductsComponent
  },
  {
    path: 'products/view-products', component: ViewProductsComponent
  },
  {
    path: 'diagnostics', component: DiagnosticsListingComponent
  },
  {
    path: 'diagnostics/add-edit-diagnostics', component: AceDiagnosticsComponent
  },
  {
    path: 'diagnostics/view-diagnostics', component: ViewDiagnosticsComponent
  },
  {
    path: 'medicine', component: MedicineListingComponent
  },
  {
    path: 'medicine/add-edit-medicine', component: AceMedicineComponent
  },
  {
    path: 'medicine/view-medicine', component: ViewMedicineComponent
  }
];

@NgModule({
  declarations: [
    ProductsListingComponent,
    AceProductsComponent,
    ViewProductsComponent,
    DiagnosticsListingComponent,
    AceDiagnosticsComponent,
    ViewDiagnosticsComponent,
    MedicineListingComponent,
    AceMedicineComponent,
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
export class InventoryModule { }
