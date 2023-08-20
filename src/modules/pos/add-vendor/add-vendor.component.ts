import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppToastService } from '@modules/shared-module/services/app-toast.service';

import { VendorsService } from '../vendors.service';

@Component({
  selector: 'sb-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.scss']
})
export class AddVendorComponent implements OnInit {

  addVendorForm!: FormGroup;
  showValidations = false;

  // For Validations
  get name() {
    return this.addVendorForm.get('name');
  }

  get phone() {
    return this.addVendorForm.get('phone_numbers');
  }

  get address() {
    return this.addVendorForm.get('address');
  }

  get stat() {
    return this.addVendorForm.get('status');
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private vendorService: VendorsService,
    private toast: AppToastService
  ) { }

  ngOnInit(): void {

    this.addVendorForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        phone_numbers: ['', [Validators.maxLength(10), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
        address: [''],
        status: [0, [Validators.required]]
      }
    );
  }

  validateNumber(event: any) {
    // const keyCode = event.keyCode;

    // const excludedKeys = [8, 9, 37, 39, 46];

    // if (!((keyCode >= 48 && keyCode <= 57) ||
    //     (keyCode >= 96 && keyCode <= 105) ||
    //     (excludedKeys.includes(keyCode)))) {
    //     event.preventDefault();
    // }

    var inp = String.fromCharCode(event.keyCode);

    if (/[0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  // For submitting add vendor form data
  onSubmit(data: any) {

    if (this.addVendorForm.invalid) {
      alert('Please fill all the required fileds');
      return;
    }

    this.vendorService
      .postVendorData(data)
      .subscribe({
        next: (result: any) => {
          console.log(result)
          this.toast.success('Success', 'Added Successfully.')
          this.router.navigate(['/pos/vendors']);

        }, error: err => {
          this.toast.error('Error', 'Server error.')
        }
      });
    console.log('Form Submitted', (data));
  }

}
