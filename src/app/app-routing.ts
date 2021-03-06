import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProductLayoutComponent } from './layouts/product-layout/product-layout.component';
export const AppRoutes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    { path: 'app', component: ProductLayoutComponent,
        children: [
            // tslint:disable-next-line: max-line-length
            { path: 'dashboard', loadChildren: () => import('src/app/application/dashboard/dashboard.module').then(m => m.DashboardModule) },
            { path: 'vendor', loadChildren: () => import('src/app/application/vendor/vendor.module').then(m => m.VendorModule) },
            { path: 'stock', loadChildren: () => import('src/app/application/stock/stock.module').then(m => m.StockModule) },
            // tslint:disable-next-line: max-line-length
            { path: 'inventory', loadChildren: () => import('src/app/application/inventory/inventory.module').then(m => m.InventoryModule) },
            { path: 'orders', loadChildren: () => import('src/app/application/orders/orders.module').then(m => m.OrderModule) },
            { path: 'ssp-admin', loadChildren: () => import('src/app/application/ssp-admin/ssp-admin.module').then(m => m.SSPAdminModule) },
            { path: 'ssp-panel', loadChildren: () => import('src/app/application/ssp-panel/ssp-panel.module').then(m => m.SSPPanelModule) }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];

