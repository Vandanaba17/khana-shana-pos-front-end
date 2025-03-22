import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppToastService } from '@modules/shared-module/services/app-toast.service';

import { ProductService } from '../product.service';

@Component({
    selector: 'sb-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

    public productData: any = [];
    public length = 0;
    public total = 5;
    menuData: any = [];
    activeIds: any = [];
    page = 1;
    pageSize = 10;
    searchValue: any
    showloader: any
    activeId = 1;

    constructor(
        private productService: ProductService,
        private router: Router,
        private toast: AppToastService,
    ) {

    }

    ngOnInit() {

        this.getMenuData();
    }

    getMenuData() {
        this.productService.getProducts(this.page).subscribe((data: any) => {
            console.log(data, 'menudata');
            this.menuData = data.data;

            for (let i = 0; i < this.menuData.length; i++) {
                this.activeIds.push("ngb-panel-" + i);
            }
        })
    }
    // For navigating to add product form on click
    onClick() {
        this.router.navigate(['/catalog/addproduct']);
    }

    // For updating data on page change
    onPageChange(event: any) {
        this.page = event;
        this.getMenuData();
        console.log('Here >>>', this.page, this.productData);
    }

    // For deleting product
    deleteRow(id: number) {
        if (confirm('Are you sure you want to delete?')) {
            this.productService.deleteProducts(id).subscribe({
                next: data => {
                    this.getMenuData();
                    this.toast.success('Success', 'Product Deleted Successfully.')
                }, error: err => {
                    this.toast.error('Error', 'Server error.')
                }
            });
            console.log(this.productData);
        }
    }
}
