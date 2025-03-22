import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavigationModule } from '@modules/navigation/navigation.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AddCustomerComponent } from './add-customer/add-customer.component';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
// import { EditCustomerAddressComponent } from './edit-customer-address/edit-customer-address.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';


@NgModule({
    declarations: [CustomerManagementComponent, AddCustomerComponent, EditCustomerComponent],
    imports: [
        CommonModule,
        NavigationModule,
        NgbModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule
        // CustomerManagementRoutingModule
    ]
})
export class CustomerManagementModule { }
