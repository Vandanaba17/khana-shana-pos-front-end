import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavigationModule } from '@modules/navigation/navigation.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { AddCategoryComponent } from './add-category/add-category.component';
import { AddProductComponent } from './add-product/add-product.component';
import { CategoriesComponent } from './categories/categories.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ProductsComponent } from './products/products.component';

@NgModule({
    declarations: [ProductsComponent,
        CategoriesComponent,
        AddProductComponent,
        EditProductComponent,
        AddCategoryComponent,
    ],

    imports: [
        CommonModule,
        RouterModule,
        NavigationModule,
        NgbModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule
    ]
})
export class CatalogModule { }
