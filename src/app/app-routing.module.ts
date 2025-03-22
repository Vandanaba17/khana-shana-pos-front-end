import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/auth/login',
    },
    {
        path: 'sales',
        loadChildren: () =>
            import('modules/sales/sales-routing.module').then(m => m.SalesRoutingModule),
    },
    {
        path: 'catalog',
        loadChildren: () =>
            import('modules/catalog/catalog-routing.module').then(m => m.CatalogRoutingModule),
    },
    {
        path: 'customer_management',
        loadChildren: () =>
            import('modules/customer-management/customer-management-routing.module').then(m => m.CustomerManagementRoutingModule),
    },
    {
        path: 'pos',
        loadChildren: () =>
            import('modules/pos/pos-routing.module').then(m => m.PosRoutingModule),
    },
    {
        path: 'item_groups',
        loadChildren: () =>
            import('modules/item-groups/item-groups-routing.module').then(m => m.ItemGroupsRoutingModule),
    },
    {
        path: 'items',
        loadChildren: () =>
            import('modules/items/items-routing.module').then(m => m.ItemsRoutingModule),
    },
    {
        path: 'purchase_orders',
        loadChildren: () =>
            import('modules/purchase-orders/purchase-orders-routing.module').then(m => m.PurchaseOrdersRoutingModule),
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
