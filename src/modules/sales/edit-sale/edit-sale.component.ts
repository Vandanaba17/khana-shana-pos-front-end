import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '@modules/catalog/product.service';
import { CustomerManagementService } from '@modules/customer-management/customer-management.service';
import { AppToastService } from '@modules/shared-module/services/app-toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SalesService } from '../sales.service';

@Component({
  selector: 'sb-edit-sale',
  templateUrl: './edit-sale.component.html',
  styleUrls: ['./edit-sale.component.scss']
})
export class EditSaleComponent implements OnInit {

  editSaleForm!: FormGroup
  qtyForm!: FormGroup
  customerForm!: FormGroup


  productData: any = [];
  addedProduct: any = [];
  newProduct: any = [];
  deletedProduct: any = [];
  customerData: any = [];

  payment_mode: any

  payment_mode_array = [
    {
      id: 1, name: 'Cash', alternate_name: 'cash'
    },
    {
      id: 2, name: 'UPI', alternate_name: 'upi'
    },
    {
      id: 3, name: 'Netbanking', alternate_name: 'net_banking'
    },
    {
      id: 3, name: 'Debit card', alternate_name: 'debit_card'
    },
    {
      id: 4, name: 'Credit card', alternate_name: 'credit_card'
    }
  ]

  id: any
  shipping_charge = 0;
  total = 0;
  semitotal = 0
  page = 1
  showloader: any
  searchValue: any
  customerName: any
  customerNumber: any
  customer_id: any

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private customerService: CustomerManagementService,
    private saleService: SalesService,
    private toast: AppToastService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.editSaleForm = this.fb.group({
      shipping_charge: [''],
      payment_mode: [''],
      notes: ['']
    })

    this.qtyForm = this.fb.group({
      quantity: ['']
    })

    this.customerForm = this.fb.group({
      customer_id: ['']
    })
    this.getProductsData()
    this.getCustomerData()

    this.id = this.route.snapshot.params.id


    // To get edit order form field values
    this.saleService.orderDetailData(this.id).subscribe((data: any) => {
      this.editSaleForm.patchValue({
        shipping_charge: data.order.shipping_charge,
        payment_mode: data.order.payment_mode,
        notes: data.order.notes
      })

      this.customerData.forEach((g: any) => {
        if (g.first_name == data.order.first_name) {
          this.customer_id = g.id
        }
      });

      this.addedProduct = data.items
      this.total = data.order.total_amount
      this.shipping_charge = data.order.shipping_charge
      this.customerName = data.order.first_name + ' ' + data.order.last_name
      this.customerNumber = data.order.phone_number
      console.log(data)
    })
  }

  getProductsData() {
    this.productService.getProducts().subscribe(data => {
      this.productData = data.products.data
      // console.log(this.productData);
    })
  }

  getCustomerData() {
    this.customerService.getCustomerData(this.page).subscribe(data => {
      this.customerData = data.customers
    })
  }

  onSelectProduct(data: any, qty: any) {
    console.log('Quantity', qty.quantity);
    this.productData.forEach((g: any) => {
      g.quantity = 0;
      g.subtotal = 0;
      if (g.id == data.id) {
        g.quantity += qty.quantity
        g.subtotal += (data.price * qty.quantity)
        this.addedProduct.push(g)
        this.newProduct.push(g)
      }

    });

    console.log('Added Product ', this.addedProduct);

    this.semitotal = this.addedProduct.map((a: any) => (a.subtotal)).reduce(function (a: any, b: any) {
      return a + b;
    })

    this.total += (data.quantity * data.price)
    this.calculateTotal()
  }



  onSelectCustomer(data: any) {
    this.customer_id = data.value.customer_id
    console.log('Customer id: ', this.customer_id);
    this.customerData.forEach((g: any) => {
      if (g.id == data.value.customer_id) {
        this.customerName = g.first_name + ' ' + g.last_name
        this.customerNumber = g.phone_number
      }
    });
  }

  openVerticallyCentered(content: any) {
    this.modalService.open(content, { centered: true });
  }

  onKey(event: any) {
    this.shipping_charge = Number(event.target.value);
    // console.log(typeof (this.shipping_charge));
    this.calculateTotal();
  }

  RemoveProduct(id: any) {

    this.deletedProduct = this.addedProduct.filter((item: any) => item.id == id);

    if (confirm('Are you sure you want to delete?')) {
      this.addedProduct = this.addedProduct.filter((item: any) => item.id !== id);
      console.log('afterdelete', this.deletedProduct);
    }

    if (this.addedProduct.length) {
      this.semitotal = this.addedProduct.map((a: any) => (a.subtotal)).reduce(function (a: any, b: any) {
        return a + b;
      })
    }
    this.calculateTotal()
  }

  calculateTotal() {
    this.total = Number(this.shipping_charge) + Number(this.semitotal);
  }

  onSubmit(data: any) {

    console.log('on submit: ', this.addedProduct);

    const addedProductSubmit: any = []

    if (this.deletedProduct.length) {
      this.deletedProduct.forEach((g: any) => {
        addedProductSubmit.push({
          product_id: g.product_id,
          category_id: g.category_id,
          order_id: this.id,
          flag: 'delete'
        })
        // console.log(g);
      });
    }

    if (this.addedProduct.length ) {
      this.newProduct.forEach((g: any) => {
        addedProductSubmit.push({
          order_id: this.id,
          product_id: g.id,
          category_id: g.category_id,
          price: g.price,
          quantity: g.quantity,
          subtotal: g.subtotal,
          flag: 'add'
        })
      })
    }
    console.log('Final: ', addedProductSubmit)

    console.log('addedProductSubmit: ', addedProductSubmit);

    const obj = {
      shipping_charge: data.shipping_charge,
      total_amount: this.total,
      products: addedProductSubmit,
      payment_mode: data.payment_mode,
      customer_id: this.customer_id,
      notes: data.notes
    }

    // console.log(obj);

    this.saleService.editOrder(this.id, obj).subscribe((result: any) => {
      console.log(result)
      this.toast.success('Success', 'Edited Successfully.')
      this.router.navigate(['/sales']);
    }, err => {
      this.toast.error('Error', 'Server error.')
    });
  }

}
