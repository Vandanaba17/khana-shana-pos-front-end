/* tslint:disable: ordered-imports*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

/* Modules */
import { NavigationModule } from '@modules/navigation/navigation.module';

/* Components */
import * as authComponents from './components';

/* Containers */
import * as authContainers from './containers';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        NavigationModule,
        HttpClientModule
    ],
    providers: [],
    declarations: [...authContainers.containers, ...authComponents.components],
    exports: [...authContainers.containers, ...authComponents.components],
})
export class AuthModule {}
