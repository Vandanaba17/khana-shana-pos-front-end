import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppToastService } from '@modules/shared-module/services/app-toast.service';

import { CustomerManagementService } from '../customer-management.service';

@Component({
  selector: 'sb-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.scss']
})
export class CustomerManagementComponent implements OnInit {

  public customerData: any = [];
  public length = 0;
  public total = 0;
  public id = 0;
  page = 1;
  pageSize = 100;
  itemsPerPage: any;
  searchValue: any
  showloader: any

  constructor(
    private toast: AppToastService,
    private router: Router,
    private customerService: CustomerManagementService
  ) { }

  ngOnInit(): void {
    this.getCustomerData()
  }

  getCustomerData() {
    this.customerService.getCustomerData(this.page, this.pageSize).subscribe({
      next: (result: any) => {
        this.customerData = result.data
        this.total = result.total
        this.length = this.customerData.length
      }, error: err => {
        this.toast.error('Error', 'Server error.')
      }
    });
  }

  // For navigating to add product form on click
  onClick() {
    this.router.navigate(['/customer_management/addcustomer']);
  }

  // For updating data on page change
  onPageChange(event: any) {
    this.page = event;
    this.getCustomerData();
    console.log('Here >>>', this.page, this.customerData);
  }

  refreshItemsData(limit: any) {
    this.pageSize = limit
    this.getCustomerData()
  }

  // For deleting product
  deleteRow(id: number) {
    if (confirm('Are you sure you want to delete?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: data => {
          this.getCustomerData();
          this.toast.success('Success', 'Customer Deleted Successfully.')
        }, error: err => {
          this.toast.error('Error', 'Server error.')
        }
      });
    }
  }

  search(event: any) {
    this.showloader = true
    this.customerService.searchCustomer(this.searchValue).subscribe({
      next: (res: any) => {
        this.customerData = res.data
        this.length = this.customerData.length;
        this.total = res.total
        this.showloader = false
      }, error: err => {
        this.toast.error('Error', 'Server error.')
        this.showloader = false
      }
    });
  }


}
