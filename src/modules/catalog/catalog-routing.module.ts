import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SBRouteData } from '@modules/navigation/models';
import { AddCategoryComponent } from './add-category/add-category.component';
import { AddProductComponent } from './add-product/add-product.component';
import { CatalogModule } from './catalog.module';
import { CategoriesComponent } from './categories/categories.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'products',
    },
    {
        path: 'products',
        canActivate: [],
        component: ProductsComponent,
        data: {
            title: 'Products',
            activeTopNav: 'Menu Items'
        } as SBRouteData,
    },
    {
        path: 'addproduct',
        canActivate: [],
        component: AddProductComponent,
        data: {
            title: 'Add Product',
            activeTopNav: 'Menu Items'
        } as SBRouteData,
    },
    {
        path: 'editproduct/:id',
        canActivate: [],
        component: EditProductComponent,
        data: {
            title: 'Edit Product',
            activeTopNav: 'Menu Items'
        } as SBRouteData,
    },
    {
        path: 'categories',
        canActivate: [],
        component: CategoriesComponent,
        data: {
            title: 'Categories',
            activeTopNav: 'Menu Categories'
        } as SBRouteData,
    },
    {
        path: 'addcategory',
        canActivate: [],
        component: AddCategoryComponent,
        data: {
            title: 'Add Category',
            activeTopNav: 'Menu Categories'
        } as SBRouteData,
    }
];

@NgModule({
    imports: [CatalogModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CatalogRoutingModule { }
