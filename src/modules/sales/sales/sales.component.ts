import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppToastService } from '@modules/shared-module/services/app-toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common'

import { SalesService } from '../sales.service';
import { UserDataService } from '@modules/pos/user-data.service';

@Component({
    selector: 'sb-sales',
    templateUrl: './sales.component.html',
    styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {

    orderData: any = [];
    orderDetail: any = [];
    itemDetail: any = [];
    total = 0
    subtotal = 0;
    pageSize = 10
    page = 1
    showloader: any
    length = 0
    searchValue: any
    resultDisplayArray: any
    newDate: any;
    discount_amount = 0;
    shopDetails: any;
    isMobile = false;

    constructor(
        private router: Router,
        private saleService: SalesService,
        private toast: AppToastService,
        private modalService: NgbModal,
        public datepipe: DatePipe,
    ) { }

    ngOnInit(): void {
        if (window.navigator.userAgent.toLowerCase().includes("mobi")
        ) {
            this.isMobile = true;

        } else {
            this.isMobile = false;
        }

        this.getOrderData()
        this.getshopDetails()
    }

    getshopDetails() {
        this.shopDetails = JSON.parse(localStorage.getItem('ShopDetails') || '{}');
    }
    getOrderData() {
        this.showloader = true
        this.saleService.getOrderData(this.page).subscribe({
            next: (data: any) => {

                data.orders.data.forEach((element: any) => {
                    if (element.payment_mode == 'cash') {
                        element.payment_mode = 'Cash';
                    }
                    else if (element.payment_mode == 'credit_card') {
                        element.payment_mode = 'Credit Card';
                    } else if (element.payment_mode == 'debit_card') {
                        element.payment_mode = 'Debit Card';
                    } else if (element.payment_mode == 'net_banking') {
                        element.payment_mode = 'Net Banking';
                    } else if (element.payment_mode == 'upi') {
                        element.payment_mode = 'UPI';
                    }
                })

                this.orderData = data.orders.data
                this.total = data.orders.total
                console.log(this.orderData);
                this.showloader = false;

                console.log('After', this.orderData);



            }, error: err => {
                this.toast.error('Error', 'Server error.')
                this.showloader = false
            }
        });
    }

    onPageChange(event: number) {
        this.page = event;
        this.getOrderData();
    }

    editSale(orderId: any) {
        // [routerLink]="['/sales/edit_sale/' + data.id]"
        this.router.navigate(['/sales/edit_sale/' + orderId]);
    }

    onClick() {
        this.router.navigate(['/sales/add_sale'])
    }

    // For deleting Item data
    deleteRow(id: number) {
        if (confirm('Are you sure you want to delete?')) {
            this.saleService.deleteOrder(id).subscribe({
                next: data => {
                    this.getOrderData();
                    this.toast.success('Success', 'Order Deleted Successfully.')
                }, error: err => {
                    this.toast.error('Error', 'Server error.')
                }
            });
        }
    }

    openXl(content: any) {
        this.modalService.open(content, { size: 'xl' });
        console.log(content);
    }

    getItems(items: any) {
        this.resultDisplayArray = [];
        for (let i = 0; i < items.length; i++) {
            this.resultDisplayArray += `<tr>
      <td style="text-align:start">${items[i].product_name} x${items[i].quantity}</td>
      <td>₹${items[i].price?.toFixed(2)}</td>
      <td>₹${items[i].subtotal?.toFixed(2)}</td>
      </tr>`;
        }
        // change code above this line
        console.log(this.resultDisplayArray);

        return this.resultDisplayArray;
    }
}

