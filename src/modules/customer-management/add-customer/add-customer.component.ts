import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AppToastService } from './../../shared-module/services/app-toast.service';
import { CustomerManagementService } from './../customer-management.service';

@Component({
  selector: 'sb-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit {

  addCustomerForm!: FormGroup

  get firstname() {
    return this.addCustomerForm.get('first_name');
  }

  get lastname() {
    return this.addCustomerForm.get('last_name');
  }

  get phone() {
    return this.addCustomerForm.get('phone_number');
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toast: AppToastService,
    private customerService: CustomerManagementService
  ) { }

  ngOnInit(): void {
    this.addCustomerForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: [''],
      phone_number: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]]
    })
  }

  validateNumber(event: any) {
    // const keyCode = event.keyCode;

    // const excludedKeys = [8, 9, 37, 39, 46];

    // if (!((keyCode >= 48 && keyCode <= 57) ||
    //   (keyCode >= 96 && keyCode <= 105) ||
    //   (excludedKeys.includes(keyCode)))) {
    //   event.preventDefault();
    //   return false;
    // } else {
    //   return true;
    // }

    // const charCode = (event.which) ? event.which : event.keyCode;
    // if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 95 || charCode > 105) && (charCode < 37 || charCode > 40)) {
    //   return false;
    // }
    // return true;

    var inp = String.fromCharCode(event.keyCode);

    if (/[0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  // For submitting add item group form data
  onSubmit(data: any) {

    if (this.addCustomerForm.invalid) {
      alert('Please fill all the required fields!');
      return;
    }

    this.customerService.postCustomerData(data)
      .subscribe({
        next: (result: any) => {
          console.log(result)
          this.toast.success('Success', 'Customer Added Successfully.')
          this.router.navigate(['/customer_management']);
        }, error: err => {
          this.toast.error('Error', 'Server error.')
        }
      });
    console.log('Form Submitted', (data));
  }

}
