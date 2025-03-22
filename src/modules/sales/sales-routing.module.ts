import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SBRouteData } from '@modules/navigation/models';

import { AddSaleComponent } from './add-sale/add-sale.component';
import { SalesModule } from './sales.module';
import { SalesComponent } from './sales/sales.component';

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
    }
];

@NgModule({
    imports: [SalesModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SalesRoutingModule { }
