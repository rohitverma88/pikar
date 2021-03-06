import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockListingComponent } from './components/stock-listing/stock-listing.component';
import { AddStockComponent } from './components/add-stock/add-stock.component';
import { AddProviderComponent } from './components/add-provider/add-provider.component';
import { UpdateStockComponent } from './components/update-stock-item/update-stock-item.component';
import { Routes, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { HttpClientModule } from '@angular/common/http';

const stockRoutes: Routes = [
  {
    path: '', component: StockListingComponent
  },
  {
    path: 'add-stock', component: AddStockComponent
  },
  {
    path: 'update-stock-item', component: UpdateStockComponent
  },
  {
    path: 'add-provider', component: AddProviderComponent
  },
  
];

@NgModule({
  declarations: [StockListingComponent, AddStockComponent,AddProviderComponent, UpdateStockComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgSelectModule,
    NgOptionHighlightModule,
    HttpClientModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forChild(stockRoutes)
  ]
})
export class StockModule { }
