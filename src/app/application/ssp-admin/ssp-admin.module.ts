import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SspAdminListingComponent } from './components/ssp-admin-listing/ssp-admin-listing.component';
import { AceSspAdminComponent } from './components/ace-ssp-admin/ace-ssp-admin.component';
import { Routes, RouterModule } from '@angular/router';
import { SelectModule } from 'ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ViewSSPAdminComponent } from './components/view-ssp-admin/view-ssp-admin.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

const sspAdminRoutes: Routes = [
  {
    path: '', component: SspAdminListingComponent
  },
  {
    path: 'add-edit-ssp-admin', component: AceSspAdminComponent
  },
  {
    path: 'view-ssp-admin', component: ViewSSPAdminComponent
  },

];

@NgModule({
  declarations: [SspAdminListingComponent, AceSspAdminComponent, ViewSSPAdminComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    SelectModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forChild(sspAdminRoutes)
  ]
})
export class SSPAdminModule { }
