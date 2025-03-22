import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { NavigationModule } from '@modules/navigation/navigation.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// import { SalesRoutingModule } from './sales-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddSaleComponent } from './add-sale/add-sale.component';
import { OrdersComponent } from './orders/orders.component';
import { SalesComponent } from './sales/sales.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModuleModule } from '@modules/shared-module/shared-module.module';

@NgModule({
    declarations: [OrdersComponent, SalesComponent, AddSaleComponent],
    imports: [
        CommonModule,
        RouterModule,
        NavigationModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        SharedModuleModule
    ],
    providers: [
        DatePipe
    ]
})
export class SalesModule { }
