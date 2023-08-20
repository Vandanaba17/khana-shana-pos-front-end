import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppToastService } from '@modules/shared-module/services/app-toast.service';

import { VendorsService } from '../vendors.service';

@Component({
  selector: 'sb-edit-vendor',
  templateUrl: './edit-vendor.component.html',
  styleUrls: ['./edit-vendor.component.scss']
})
export class EditVendorComponent implements OnInit {

  editVendorForm!: FormGroup;
  id: any;
  showValidations = false;

  // For Validations
  get name() {
    return this.editVendorForm.get('name');
  }

  get phone() {
    return this.editVendorForm.get('phone_numbers');
  }

  get address() {
    return this.editVendorForm.get('address');
  }

  get stat() {
    return this.editVendorForm.get('status');
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toast: AppToastService,
    private vendorService: VendorsService
  ) { }

  ngOnInit(): void {
    this.editVendorForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        phone_numbers: ['', [Validators.maxLength(10), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
        address: [''],
        status: ['', [Validators.required]]
      }
    );
    // For vendor id
    this.id = this.route.snapshot.params.id

    // To get edit vendor form field values
    this.vendorService.patchVendorData(this.id).subscribe((data: any) => {
      this.editVendorForm.patchValue(data)
      console.log(data)
    })
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


  // Submit edit vendor form
  updateData(data: any) {

    if (this.editVendorForm.invalid) {
      alert('Please check the validations!')
      return;
    }

    this.vendorService.editVendor(this.id, data).subscribe({
      next: data => {
        console.log('Data updated successfully! ', data);
        this.router.navigate(['/pos/vendors']);
        this.toast.success('Success', 'Vendor Edited successfully.')
      }, error: err => {
        this.toast.error('Error', 'Server error.')
      }
    });
  }

}
