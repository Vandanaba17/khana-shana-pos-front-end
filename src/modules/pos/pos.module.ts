import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavigationModule } from '@modules/navigation/navigation.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { AddOutletComponent } from './add-outlet/add-outlet.component';
import { AddUomComponent } from './add-uom/add-uom.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AddVendorComponent } from './add-vendor/add-vendor.component';
import { EditOutletComponent } from './edit-outlet/edit-outlet.component';
import { EditUomComponent } from './edit-uom/edit-uom.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EditVendorComponent } from './edit-vendor/edit-vendor.component';
import { OutletComponent } from './outlet/outlet.component';
import { PosRoutingModule } from './pos-routing.module';
import { UomComponent } from './uom/uom.component';
import { UsersListComponent } from './users-list/users-list.component';
import { VendorsComponent } from './vendors/vendors.component';


@NgModule({
    declarations: [UsersListComponent,
        AddUserComponent,
        OutletComponent,
        AddOutletComponent,
        EditUserComponent,
        EditOutletComponent,
        VendorsComponent,
        AddVendorComponent,
        EditVendorComponent,
        UomComponent,
        AddUomComponent,
        EditUomComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NavigationModule,
        RouterModule,
        NgbModule,
        NgSelectModule
    ]
})
export class PosModule { }
