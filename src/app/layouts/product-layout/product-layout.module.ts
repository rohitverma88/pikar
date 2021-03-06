import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { ProductLayoutComponent } from './product-layout.component';
import { ProductFooterComponent } from './components/product-footer/product-footer.component';
import { ProductHeaderComponent } from './components/product-header/product-header.component';
import { ProductSidebarComponent } from './components/product-sidebar/product-sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    FormsModule,
    RouterModule
  ],
  declarations: [
    ProductLayoutComponent,
    ProductFooterComponent,
    ProductHeaderComponent,
    ProductSidebarComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})

export class ProductLayoutModule {}
