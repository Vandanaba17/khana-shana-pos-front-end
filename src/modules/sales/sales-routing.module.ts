import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SBRouteData } from '@modules/navigation/models';

import { AddSaleComponent } from './add-sale/add-sale.component';
import { EditSaleComponent } from './edit-sale/edit-sale.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { OrdersComponent } from './orders/orders.component';
import { RefundsComponent } from './refunds/refunds.component';
import { SalesModule } from './sales.module';
import { SalesComponent } from './sales/sales.component';
import { ShipmentComponent } from './shipment/shipment.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'sales',
    },
    {
        path: 'sales',
        canActivate: [],
        component: SalesComponent,
        data: {
            title: 'Sales',
            activeTopNav: 'Sales'
        } as SBRouteData,
    },
    {
        path: 'add_sale',
        canActivate: [],
        component: AddSaleComponent,
        data: {
            title: 'Add Sale',
            activeTopNav: 'Sales'
        } as SBRouteData,
    },
    {
        path: 'edit_sale/:id',
        canActivate: [],
        component: EditSaleComponent,
        data: {
            title: 'Edit Sale',
            activeTopNav: 'Sales'
        } as SBRouteData,
    }
];

@NgModule({
    imports: [SalesModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SalesRoutingModule { }
