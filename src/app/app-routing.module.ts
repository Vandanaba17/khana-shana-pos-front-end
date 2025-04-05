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
        path: 'auth',
        loadChildren: () =>
            import('modules/auth/auth-routing.module').then(m => m.AuthRoutingModule),
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
