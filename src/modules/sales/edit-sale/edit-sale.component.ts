import { TableManagementService } from './../table-management.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '@modules/catalog/product.service';
import { CustomerManagementService } from '@modules/customer-management/customer-management.service';
import { AppToastService } from '@modules/shared-module/services/app-toast.service';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    discountForm!: FormGroup


    categoryData: any = [];
    addedProduct: any = [];
    newProduct: any = [];
    deletedProduct: any = [];
    customerData: any = [];
    showCustomerDetail = true;
    orderDetail: any = [];
    itemDetail: any = [];
    newDate: any;
    showCartSummary = false;
    selectedCategory = 0;

    payment_mode: any

    payment_mode_array = [
        {
            id: 1, name: 'Cash', alternate_name: 'cash'
        },
        {
            id: 2, name: 'Credit card', alternate_name: 'credit_card'
        },
        {
            id: 3, name: 'Debit card', alternate_name: 'debit_card'
        },
        {
            id: 4, name: 'Netbanking', alternate_name: 'net_banking'
        },
        {
            id: 5, name: 'UPI', alternate_name: 'upi'
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

    curr_date!: NgbDate;
    year = 0
    month = 0
    day = 0
    date = ''
    pageSize = 100
    showValidations = false;
    showCustomerValidation = false;
    showProducts = false;
    addCustomerForm!: FormGroup;
    resultDisplayArray: any
    tableList: any = [];
    selectedTableId: any;
    productQuantity: any = [];
    showDiscountOption = false;
    discount_amount = 0;
    discount_type: any = "";
    discount_store = 0;
    table_number: any;
    markCheckBox = false;




    get customer() {
        return this.customerForm.get('customer_id');
    }

    get quantity() {
        return this.qtyForm.get('quantity');
    }

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
        private productService: ProductService,
        private fb: FormBuilder,
        private modalService: NgbModal,
        private customerService: CustomerManagementService,
        private saleService: SalesService,
        private toast: AppToastService,
        private router: Router,
        private route: ActivatedRoute,
        private TableManagementService: TableManagementService
    ) { }

    ngOnInit(): void {
        this.editSaleForm = this.fb.group({
            shipping_charge: [0],
            order_date: [],
            payment_mode: [''],
            notes: [''],
            table_number: []
        })

        this.discountForm = this.fb.group({
            discount: [0]
        })

        // this.qtyForm = this.fb.group({
        //     quantity: ['', [Validators.required]]
        // })

        this.customerForm = this.fb.group({
            customer_id: [null, [Validators.required]]
        })

        this.addCustomerForm = this.fb.group({
            first_name: ['', [Validators.required]],
            last_name: [''],
            phone_number: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]]
        })

        this.getProductsData()
        this.getCustomerData()
        this.getTableData()

        this.id = this.route.snapshot.params.id


        // To get edit order form field values
        this.saleService.orderDetailData(this.id).subscribe((data: any) => {
            console.log(data);

            if (data.order.order_date) {
                this.year = Number(data.order.order_date.substr(0, 4))
                this.month = Number(data.order.order_date.substring(5, 7))
                this.day = Number(data.order.order_date.substring(8, 10))
                this.curr_date = new NgbDate(this.year, this.month, this.day)
            }

            this.editSaleForm.patchValue({
                shipping_charge: data.order.shipping_charge,
                order_date: this.curr_date,
                payment_mode: data.order.payment_mode,
                notes: data.order.notes,
                // table_number: data.order.table_number
            })

            this.customer_id = Number(data.order.customer_id);

            // this.customerData.forEach((g: any) => {
            //   if (g.first_name == data.order.first_name) {
            //     this.customer_id = g.id
            //   }
            // });
            console.log('customerID', this.customer_id)

            data.items.forEach((element: any) => {
                element.product_count = element.quantity;

                this.categoryData.forEach((ele: any) => {

                    ele.products.forEach((prod: any) => {
                        if (prod.id == element.product_id) {
                            console.log(element.quantity, 'qu');

                            prod.product_count = element.quantity;
                        }
                    });
                });
            });

            console.log(this.categoryData, 'pro');

            this.addedProduct = data.items
            this.total = data.order.total_amount
            this.shipping_charge = data.order.shipping_charge
            if (this.addedProduct.length > 0) {
                this.semitotal = this.addedProduct.map((a: any) => (a.subtotal)).reduce(function (a: any, b: any) {
                    return a + b;
                })

                this.addedProduct.forEach((element: any) => {
                    this.productQuantity.push(element.quantity);
                });
            }

            if (data.order.discount_amount > 0) {
                let obj = {
                    discount: true
                }
                this.markCheckBox = true;
                this.discount_store = data.order.discount_amount;
                this.discount_type = data.order.discount_type;
                if (this.discount_type == "percentage") {
                    this.discount_amount = data.order.discount_amount;
                }
                this.addDiscount(obj);
            }

            if (data.order.first_name == null) {
                this.showCustomerDetail = false;
            } else {
                this.customerName = data.order.first_name + ' ' + data.order.last_name
                this.customerNumber = data.order.phone_number;
                this.showCustomerDetail = true;
                console.log(data)
            }

        })
    }

    getProductsData() {
        this.categoryData = [];
        this.productService.getProducts(this.page).subscribe((data: any) => {
            data.data.forEach((element: any, index: any) => {
                if (element.products.length == 0) data.data.splice(index, 1);
            });

            data.data.forEach((element: any) => {
                element.products.forEach((pro: any) => {
                    pro.product_count = 0;
                    pro.product_id = pro.id
                });
            });

            this.categoryData = data.data;
            this.selectedCategory = this.categoryData[0].id
            this.showProducts = true;
            // if (data.products.last_page > 1) {
            // for (let i = 2; i <= data.products.last_page; i++) {
            //     this.productService.getProducts(i).subscribe((ele: any) => {
            //         ele.forEach((element: any) => {
            //             element.product_count = 0;
            //         });

            //         this.categoryData = this.categoryData.concat(ele.products.data);
            //         console.log(ele.products.data);
            //     })
            // }
            // console.log(this.categoryData, 'pro data');

            // } else {
            //     this.showProducts = true;
            // }
            // this.categoryData = data.products.data
            // console.log(this.categoryData);
        })
    }

    getCustomerData() {
        this.saleService.getCustomerData(this.pageSize).subscribe((result: any) => {
            this.customerData = result.data.sort(function (a: any, b: any) {
                const nameA = a.first_name.toUpperCase(); // ignore upper and lowercase
                const nameB = b.first_name.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                // names must be equal
                return 0;
            })
        })
    }

    getTableData() {
        this.TableManagementService.getTableManagementData().subscribe((data: any) => {
            console.log('table0', data);
            data.data.forEach((element: any) => {
                if (element.is_table_occupied == 0 && element.is_table_active == 1) {
                    console.log('true', element.is_table_occupied, element.is_table_active);

                    this.tableList.push(element);
                }
            });
            console.log(this.tableList, 'tableList');

            // this.tableList = data.data;
            if (this.tableList.length > 0) {
                this.editSaleForm.get('table_number')?.setValue(this.tableList[0].res_table_number);
            } else {
            }
        })
    }

    searchCustomer(event: any) {
        console.log(event.term);
        this.customerService.searchCustomer(event.term).subscribe({
            next: (res: any) => {
                this.customerData = res.customers.data
                console.log(this.customerData);
            }, error: err => {
                this.toast.error('Error', 'Server error.')
                this.showloader = false
            }
        });
    }

    decreaseCount(catID: any, prodId: any, count: any) {
        this.categoryData.forEach((element: any, key: any) => {
            if (element.id == catID) {
                element.products.forEach((prod: any, key2: any) => {
                    if (prodId == prod.id) {
                        console.log(prod);
                        if (prod.product_count > 0) {
                            console.log(element, 'key');
                            prod.product_count = count - 1;
                        } else {
                            prod.product_count = 0;
                        }

                    }
                });
            }
        });
        this.onSelectProduct(this.categoryData);
    }

    increaseCount(catID: any, prodId: any, count: any) {

        this.categoryData.forEach((element: any, key: any) => {
            console.log(element, 'key');
            if (element.id == catID) {
                element.products.forEach((prod: any, key2: any) => {
                    if (prodId == prod.id) {
                        console.log(this.categoryData[key].products[key2]);
                        this.categoryData[key].products[key2].product_count = count + 1;
                    }
                });
            }
        });
        this.onSelectProduct(this.categoryData);
    }

    removeProduct(id: any, catId: any) {

        if (confirm('Are you sure you want to delete?')) {
            this.addedProduct = this.addedProduct.filter((item: any) => {
                console.log(item.product_id);

                item.product_id !== id
            });
            console.log(this.addedProduct, 'pro');

            // console.log('afterdelete', this.addedProduct);
            if (this.addedProduct.length == 0) {
                this.semitotal = 0
            } else {
                this.semitotal = this.addedProduct.map((a: any) => (a.subtotal)).reduce(function (a: any, b: any) {
                    return a + b;
                })
            }

            console.log(this.addedProduct);
            this.decreaseCount(catId, id, 1);
            setTimeout(() => { this.onKey(this.shipping_charge) }, 500);
            setTimeout(() => { this.calculateTotal() }, 500);
            this.toast.success('Success', 'Product deleted successfully.');
        }
    }

    qtyClose() {
        this.qtyForm = this.fb.group({
            quantity: ['', [Validators.required]]
        })
    }


    onSelectDate(date: any) {
        this.date = date.year + '-' + date.month + '-' + date.day
        console.log(this.date);
    }


    onSelectProduct(data: any) {

        // if (this.qtyForm.invalid) {
        //     this.showValidations = true;
        //     alert('Please enter quantity');
        //     return;
        // }

        let invalid;

        this.modalService.dismissAll();

        this.addedProduct = [];

        data.forEach((element: any) => {
            element.products.forEach((prod: any) => {
                if (prod.product_count > 0) {
                    prod.subtotal = prod.price * prod.product_count;
                    prod.quantity = prod.product_count;
                    this.addedProduct.push(prod);
                }
            });
        });

        // data.forEach((element: any) => {
        //     if (element.product_count > 0) {
        //         element.subtotal = element.price * element.product_count;
        //         element.quantity = element.product_count;
        //         this.addedProduct.push(element);
        //     }
        // });
        // this.addedProduct.forEach((g: any) => {
        //     if (data.product_name == g.product_name) {
        //         invalid = true
        //     }
        // })
        // if (invalid) {
        //     this.toast.warning('Warning', data.product_name + ' is already added.')
        //     return;
        // }
        // // console.log('Quantity', qty.quantity);
        // this.categoryData.forEach((g: any) => {
        //     // g.quantity = 0;
        //     // g.subtotal = 0;
        //     if (g.id == data.id) {
        //         g.quantity = 1;
        //         g.subtotal = data.price;
        //         g.name = g.category_name;
        //         this.addedProduct.push(g)
        //         this.newProduct.push(g)
        //     }
        // });

        // console.log('Added Product ', this.addedProduct);

        if (this.addedProduct.length > 0) {
            this.semitotal = this.addedProduct.map((a: any) => (a.subtotal)).reduce(function (a: any, b: any) {
                return a + b;
            })

            this.productQuantity[this.addedProduct.length - 1] = 1;
        }
        // this.toast.success('Success', 'Product added successfully.');
        this.qtyForm = this.fb.group({
            quantity: ['', [Validators.required]]
        })
        this.total += (data.quantity * data.price)
        this.calculateTotal(this.discount_amount)

    }

    qtyChange(event: any, i: any) {
        console.log(event, 'val');

        let qty = Number(event?.target.value);
        this.productQuantity[i] = qty;
        console.log(this.productQuantity);

        if (this.productQuantity[i] == 0) {
            console.log(true);
            this.productQuantity[i] = 1;
            qty = 1;
        }

        this.addedProduct[i].quantity = qty;
        this.addedProduct[i].subtotal = qty * this.addedProduct[i].price;
        this.semitotal = this.addedProduct.map((a: any) => (a.subtotal)).reduce(function (a: any, b: any) {
            return a + b;
        })

        console.log(this.addedProduct);

        this.calculateTotal(this.discount_amount);
    }

    addDiscount(obj: any) {
        console.log(obj);
        if (obj.discount == true) {
            this.showDiscountOption = true;
        } else {
            this.showDiscountOption = false;
            this.discount_amount = 0;
            this.calculateTotal(this.discount_amount);
        }
    }

    getDiscountType(event: any) {
        console.log(event);
        this.discount_type = event.target.value;
        this.calculateTotal(this.discount_amount);
    }

    getDiscountAmount(event: any) {

        console.log(typeof (event));

        let discount = 0;
        if (typeof (event) == 'object') {
            discount = event.target.value;
        } else {
            discount = event;
        }

        let showShipping = false;
        let total = 0;
        if (this.addedProduct.length != 0) {
            this.addedProduct.forEach((ele: any) => {
                total += ele.subtotal;
            })
            if (total <= discount) {
                alert('Discount cannot be greater than or equal to the total amount!');
                this.discount_amount = 0;
                this.total = total;
                showShipping = false;
            }
            else {
                showShipping = true;
            }
        }
        else {
            alert('Please add atleast one item to input discount!');
            this.discount_amount = 0;
            return;
        }

        if (showShipping) {
            this.discount_amount = Number(discount);
            this.calculateTotal(this.discount_amount);
        }
    }

    onSelectCustomer(data: any) {

        if (this.customerForm.invalid) {
            this.showCustomerValidation = true;
            alert('Please select customer');
            return;
        }

        this.modalService.dismissAll();
        this.showCustomerDetail = true;

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


    openModal(content: any) {
        this.modalService.open(content, { centered: true });
    }

    addCustomerClose() {
        this.addCustomerForm = this.fb.group({
            first_name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            phone_number: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]]
        })
    }

    onSubmitCustomer(data: any) {

        if (this.addCustomerForm.invalid) {
            alert('Please fill all the required fields!');
            return;
        }

        this.modalService.dismissAll();

        this.customerService.postCustomerData(data)
            .subscribe({
                next: (result: any) => {
                    console.log(result.customers)
                    this.toast.success('Success', 'Customer Added Successfully.')
                    this.getCustomerData();
                    this.getCustomerDetail(result.customers);
                }, error: err => {
                    this.toast.error('Error', 'Server error.')
                }
            });
        console.log('Form Submitted', (data));
    }

    getCustomerDetail(id: any) {
        this.customerService.editCustomerForm(id).subscribe((data: any) => {
            this.customerName = data.first_name + ' ' + data.last_name;
            this.customerNumber = data.phone_number;
            this.customer_id = id;
            this.showCustomerDetail = true;
        })
    }

    validateNumber(event: any) {

        var inp = String.fromCharCode(event.keyCode);

        if (/[0-9]/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    onTableChange(event: any) {
        console.log(event);
        this.tableList.forEach((element: any) => {
            if (element.res_table_number == event) {
                console.log(element.id);
                this.selectedTableId = element.id;
            }
        });

    }

    onKey(event: any) {

        console.log(typeof (event));

        let charges = 0;
        if (typeof (event) == 'object') {
            charges = event.target.value;
        } else {
            charges = event;
        }

        let showShipping = false;
        let total = 0;
        if (this.addedProduct.length != 0) {
            this.addedProduct.forEach((ele: any) => {
                total += ele.subtotal;
            })
            if (total <= charges) {
                // alert('Shipping Charges cannot be greater than or equal to the total amount!');
                this.shipping_charge = 0;
                this.total = total;
                showShipping = false;
            }
            else {
                showShipping = true;
            }
        }
        else {
            // alert('Please add atleast one item to input shipping charges!');
            this.shipping_charge = 0;
            return;
        }

        if (showShipping) {
            this.shipping_charge = Number(charges);
            this.calculateTotal(this.discount_amount);
        }
    }

    calculateTotal(discount?: any) {
        // console.log(discount);
        if (discount) {
            if (this.discount_type == "percentage") {
                console.log((Number(this.shipping_charge) + Number(this.semitotal)) * this.discount_amount);

                this.total = (Number(this.shipping_charge) + Number(this.semitotal)) * (100 - this.discount_amount) / 100;
                this.discount_store = (Number(this.shipping_charge) + Number(this.semitotal)) - this.total;
                console.log(this.discount_store);
            } else {
                this.total = Number(this.shipping_charge) + Number(this.semitotal) - Number(discount);
                this.discount_store = (Number(this.shipping_charge) + Number(this.semitotal)) - this.total;
                console.log(this.discount_store);
            }
        } else {
            this.total = Number(this.shipping_charge) + Number(this.semitotal);
            this.discount_store = 0;
        }
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


    openInvoice() {
        if (this.orderDetail.id != undefined) {

            let htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <style>
        .text-align {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          text-align: center
        }

      p {
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
      }

      .m-0 {
        margin-top: 0;
        margin-bottom: 0;
      }

      .font-bold {
        font-weight: bold;
      }
      .tax:before, .tax:after {
        content: "";
        flex: 1 1;
        border-bottom: 1px dashed #000;
        margin: auto;
      }

      .tax {
        display: flex;
        flex-direction: row;
      }

      .grid-container {
        display: grid;
        grid-template-columns: auto auto;
      }

      body {
        font-size: 10px;
        font-family: Consolas,monaco,monospace;
      }
}

  </style>
    <body>
      <p class="text-align"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABIQAAAYbCAYAAABufWGJAAAACXBIWXMAAAsTAAALEwEAmpwYAABBH2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMwNjcgNzkuMTU3NzQ3LCAyMDE1LzAzLzMwLTIzOjQwOjQyICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDphMTM5MTQ4Mi0zZTI5LTExZWQtODI1OS1mYjBkM2UzZjdlMTc8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6NWRkOGI3MzEtNDNiNS0xZjQ4LWIzODEtZjA5ZmQyYWUxZGNlPC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPjVDMDFFODIyMENCMzg3OTIzREQwNUYyM0EwNURGQ0RGPC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDoyYTlhNjIzYS1jYzdhLTJiNGQtODVmMi01MWNmZjdlYmM1ZWM8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMjItMDQtMTNUMTA6NDc6MjcrMDU6MzA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPmNvbnZlcnRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6cGFyYW1ldGVycz5mcm9tIGltYWdlL2pwZWcgdG8gaW1hZ2UvcG5nPC9zdEV2dDpwYXJhbWV0ZXJzPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+ZGVyaXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6cGFyYW1ldGVycz5jb252ZXJ0ZWQgZnJvbSBpbWFnZS9qcGVnIHRvIGltYWdlL3BuZzwvc3RFdnQ6cGFyYW1ldGVycz4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6MjhhN2RhZjQtNDNhZC01NDQ4LTllOTAtZWFhZWJlZDRhNTcyPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDIyLTA0LTEzVDEwOjQ3OjI3KzA1OjMwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjVkZDhiNzMxLTQzYjUtMWY0OC1iMzgxLWYwOWZkMmFlMWRjZTwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAyMi0wOS0yN1QxMTozMDoxOCswNTozMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4vPC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6U2VxPgogICAgICAgICA8L3htcE1NOkhpc3Rvcnk+CiAgICAgICAgIDx4bXBNTTpEZXJpdmVkRnJvbSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgIDxzdFJlZjppbnN0YW5jZUlEPnhtcC5paWQ6MmE5YTYyM2EtY2M3YS0yYjRkLTg1ZjItNTFjZmY3ZWJjNWVjPC9zdFJlZjppbnN0YW5jZUlEPgogICAgICAgICAgICA8c3RSZWY6ZG9jdW1lbnRJRD41QzAxRTgyMjBDQjM4NzkyM0REMDVGMjNBMDVERkNERjwvc3RSZWY6ZG9jdW1lbnRJRD4KICAgICAgICAgICAgPHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD41QzAxRTgyMjBDQjM4NzkyM0REMDVGMjNBMDVERkNERjwvc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICA8L3htcE1NOkRlcml2ZWRGcm9tPgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8cGhvdG9zaG9wOkNvbG9yTW9kZT4zPC9waG90b3Nob3A6Q29sb3JNb2RlPgogICAgICAgICA8eG1wOkNyZWF0ZURhdGU+MjAyMi0wNC0wNlQxODo0OTowMyswNTozMDwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDIyLTA5LTI3VDExOjMwOjE4KzA1OjMwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAyMi0wOS0yN1QxMTozMDoxOCswNTozMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cyk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHRpZmY6SW1hZ2VXaWR0aD4zMTQwPC90aWZmOkltYWdlV2lkdGg+CiAgICAgICAgIDx0aWZmOkltYWdlTGVuZ3RoPjIzNDY8L3RpZmY6SW1hZ2VMZW5ndGg+CiAgICAgICAgIDx0aWZmOkJpdHNQZXJTYW1wbGU+CiAgICAgICAgICAgIDxyZGY6U2VxPgogICAgICAgICAgICAgICA8cmRmOmxpPjg8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaT44PC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGk+ODwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwvdGlmZjpCaXRzUGVyU2FtcGxlPgogICAgICAgICA8dGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPjI8L3RpZmY6UGhvdG9tZXRyaWNJbnRlcnByZXRhdGlvbj4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6U2FtcGxlc1BlclBpeGVsPjM8L3RpZmY6U2FtcGxlc1BlclBpeGVsPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6RXhpZlZlcnNpb24+MDIyMTwvZXhpZjpFeGlmVmVyc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT42NTUzNTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MTE1NjwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4xNTYzPC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz7JxDEAAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAD9eSURBVHja7N3dciO5dq3R5A69/xM7gr7ormqVihLzB0hgYY5xdewTsW1TTGDhI8h6PJ/PDQAAAIAc//MSAAAAAGQRhAAAAADCCEIAAAAAYQQhAAAAgDCCEAAAAEAYQQgAAAAgjCAEAAAAEEYQAgAAAAgjCAEAAACEEYQAAAAAwghCAAAAAGEEIQAAAIAwghAAAABAGEEIAAAAIIwgBAAAABBGEAIAAAAIIwgBAAAAhBGEAAAAAMIIQgAAAABhBCEAAACAMIIQAAAAQBhBCAAAACCMIAQAAAAQRhACAAAACCMIAQAAAIQRhAAAAADCCEIAAAAAYQQhAAAAgDCCEAAAAEAYQQgAAAAgjCAEAAAAEEYQAgAAAAgjCAEAAACEEYQAAAAAwghCAAAAAGEEIQAAAIAwghAAAABAGEEI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AAAAgDCCEAAAAEAYQQgAAAAgjCAEAAAAEEYQAgAAAAgjCAEAAACEEYQAAAAAwghCAAAAAGEEIQAAAIAwghAAAABAGEEIAAAAIIwgBAAAABBGEAIAAAAIIwgBAAAAhBGEAAAAAMIIQgAAAABhBCEAAACAMIIQAAAAQBhBCAAAACCMIAQAAAAQRhACAAAACCMIAQAAAIQRhAAAAADCCEIAAAAAYQQhAAAAgDCCEAAAAEAYQQgAAAAgjCAEAAAAEEYQAgAAAAgjCAEAAACEEYQAAAAAwghCAAAAAGEEIQAAAIAwghAAAABAGEEIAAAAIIwgBAAAABBGEAIAAAAIIwgBAAAAhBGEAAAAAMIIQgAAAABhBCEAAACAMIIQAAAAQBhBCAAAACCMIAQAAAAQRhACAAAACCMIAQAAAIQRhAAAAADCCEIAAAAAYQQhAAAAgDCCEAAAAEAYQQgAAAAgjCAEAAAAEEYQAgAAAAgjCAEAAACEEYQAAAAAwghCAAAAAGEEIQAAAIAwghAAAABAGEEIAAAAIIwgBAAAABBGEAIAAAAIIwgBAAAAhBGEAAAAAMIIQgAAAABhBCEAAACAMIIQAAAAQBhBCAAAACCMIAQAAAAQRhACAAAACCMIAQAAAIQRhAAAAADCCEIAAAAAYQQhAAAAgDCCEAAAAEAYQQgAAAAgjCAEAAAAEEYQAgAAAAgjCAEAAACEEYQAAAAAwghCAAAAAGEEIQAAAIAwghAAAABAGEEIAAAAIIwgBAAAABBGEAIAAAAIIwgBAAAAhBGEAAAAAMIIQgAAAABhBCEAAACAMIIQAAAAQBhBCAAAACCMIAQAAAAQRhACAAAACCMIAQAAAIQRhAAAAADCCEIAAAAAYQQhAAAAgDCCEAAAAEAYQQgAAAAgjCAEAAAAEEYQAgAAAAgjCAEAAACEEYQAAAAAwghCAAAAAGEEIQAAAIAwghAAAABAGEEIAAAAIIwgBAAAABBGEAIAAAAIIwgBAAAAhBGEAAAAAMIIQgAAAABhBCEAAACAMIIQAAAAQBhBCAAAACCMIAQAAAAQRhACAAAACCMIAQAAAIQRhAAAAADCCEIAAAAAYQQhAAAAgDCCEAAAAEAYQQgAAAAgjCAEAAAAEEYQAgAAAAgjCAEAAACEEYQAAAAAwghCAAAAAGEEIQAAAIAwghAAAABAGEEIAAAAIIwgBAAAABBGEAIAAAAIIwgBAAAAhBGEAAAAAMIIQgAAAABhBCEAAACAMIIQAAAAQBhBCAAAACCMIAQAAAAQRhACAAAACCMIAQAAAIQRhAAAAADCCEIAAAAAYQQhAAAAgDCCEAAAAEAYQQgAAAAgjCAEAAAAEEYQAgAAAAgjCAEAAACEEYQAAAAAwghCAAAAAGEEIQAAAIAwghAAAABAGEEIAAAAIIwgBAAAABBGEAIAAAAIIwgBAAAAhBGEAAAAAMIIQgAAAABhBCEAAACAMIIQAAAAQBhBCAAAACCMIAQAAAAQRhACAAAACCMIAQAAAIQRhAAAAADCCEIAAAAAYQQhAAAAgDCCEAAAAEAYQQgAAAAgjCAEAAAAEEYQAgAAAAgjCAEAAACEEYQAAAAAwghCAAAAAGEEIQAAAIAwghAAAABAGEEIAAAAIIwgBAAAABBGEAIAAAAIIwgBAAAAhBGEAAAAAMIIQgAAAABhBCEAAACAMIIQAAAAQBhBCAAAACCMIAQAAAAQRhACAAAACCMIAQAAAIQRhAAAAADCCEIAAAAAYQQhAAAAgDCCEAAAAEAYQQgAAAAgjCAEAAAAEEYQAgAAAAgjCAEAAACEEYQAAAAAwghCAAAAAGEEIQAAAIAwghAAAABAGEEIAAAAIIwgBAAAABBGEAIAAAAIIwgBAAAAhBGEAAAAAMIIQgAAAABhBCEAAACAMIIQAAAAQBhBCAAAACCMIAQAAAAQRhACAAAACCMIAQAAAIQRhAAAAADCCEIAAAAAYQQhAAAAgDCCEAAAAEAYQQgAAAAgzP8PAA499T8Ed6t4AAAAAElFTkSuQmCC" alt="" width="25" /></p>
      <h3 class="text-align">Jamanvaar Kitchen</h3>
      <p class="text-align m-0">High quality meals</p>
      <p class="text-align m-0">(Takeaway, Delievery, Dining)</p>
      <p class="text-align">FF-122, Infocity Supermall 2, Infocity Gandhinagar-382007 </p>
      <p class="tax text-align">Order Summary</p>

        <p class="m-0">Date: <span class="font-bold">${this.newDate}</span></p>
        <p class="m-0">Order No.: <span class="font-bold">${this.orderDetail.id}</span></p>
        <p class="m-0">Payment mode: <span class="font-bold">${this.orderDetail.payment_mode}</span></p>
        <p class="m-0">Customer Name: : <span class="font-bold">${this.customerName ? this.customerName : '-'}</span></p>
        <p class="m-0">Table Number: <span class="font-bold">${this.table_number ? this.table_number : '-'}</span></p>

      <span class="tax" style="margin-top: 0.5rem; margin-bottom: 0.5rem;"></span>
      <table style="width:100%;">
        <thead>
          <th style="text-align:start">Item name</th>
          <th>Rate</th>
          <th>Amount</th>
        </thead>
        <tbody style="width:100%;text-align:center">
          ${this.getItems(this.itemDetail)}
          <tr>
            <td colspan="2"></td>
            <td colspan="1"><span class="tax"></span></td>
          </tr>
          <tr>
            <td colspan="2" style="text-align: end;">Subtotal: </td>
            <td>₹${Math.round(this.orderDetail.total_amount?.toFixed(2) - this.orderDetail.shipping_charge?.toFixed(2) + Number(this.discount_store?.toFixed(2))).toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="2" style="text-align: end;">Discount amt: </td>
            <td>₹${this.discount_store?.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="2" style="text-align: end;">Packaging charges: </td>
            <td>₹${this.orderDetail.shipping_charge?.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="3"><span class="tax"></span></td>
          </tr>
          <tr>
            <td colspan="2" style="text-align: end;">Total: </td>
            <td>₹${this.orderDetail.total_amount?.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="3"><span class="tax"></span></td>
          </tr>
        </tbody>
      </table>

      <p class="text-align">FSSAI No. 20722009000398</p>
      <p class="text-align m-0">Mo.: 6351637510</p>
      <p class="text-align m-0">Email: myjamanvaar@gmail.com</p>
      <p class="text-align">Thank you! Please visit again.</p>
      <p class="text-align" style="font-size: 25px; color: black; filter: grayscale(1);">&#128578;</p>
    </body>
  </html>
  `;
            let invoice = window.open("", "MsgWindow", "");
            invoice?.document.write(htmlContent);
            setTimeout(() => {
                invoice?.print();
                invoice?.focus();
                invoice?.close();
            });

        }
    }

    getOrderDetail(id: number, print: any) {
        this.saleService.orderDetailData(id).subscribe((data: any) => {
            console.log(data, 'order data');

            if (data.order.payment_mode == 'cash') {
                data.order.payment_mode = 'Cash';
            }
            else if (data.order.payment_mode == 'credit_card') {
                data.order.payment_mode = 'Credit Card';
            } else if (data.order.payment_mode == 'debit_card') {
                data.order.payment_mode = 'Debit Card';
            } else if (data.order.payment_mode == 'net_banking') {
                data.order.payment_mode = 'Net Banking';
            } else if (data.order.payment_mode == 'upi') {
                data.order.payment_mode = 'UPI';
            }

            this.orderDetail = data.order
            this.itemDetail = data.items

            this.newDate = this.orderDetail.order_date.slice(0, 10).split("-").reverse().join("-");
            console.log(this.newDate, 'newdate');

            console.log(this.itemDetail);

            this.getItems(this.itemDetail);

            if (print == true) {
                this.openInvoice();
            }

        })
    }

    onSubmit(data: any) {

        console.log('on submit: ', this.addedProduct);

        if (this.addedProduct.length == 0) {
            alert('Please add atleast one product');
            return;
        }

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

        if (this.addedProduct.length) {
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

            this.addedProduct.forEach((element: any) => {
                this.newProduct.forEach((ele2: any) => {
                    if (element.product_id != ele2.product_id) {
                        addedProductSubmit.push({
                            order_id: this.id,
                            quantity: element.quantity,
                            price: element.price,
                            subtotal: element.subtotal,
                            flag: 'edit'
                        })
                    }
                });
            });
        }
        console.log('Final: ', addedProductSubmit)

        console.log('addedProductSubmit: ', addedProductSubmit);
        if (this.date == '') {
            this.date = this.curr_date.year + '-' + this.curr_date.month + '-' + this.curr_date.day
        }

        console.log('on submit', this.customer_id);

        this.table_number = data.table_number;
        const obj = {
            shipping_charge: this.shipping_charge,
            order_date: this.date,
            total_amount: this.total,
            products: addedProductSubmit,
            payment_mode: data.payment_mode,
            customer_id: this.customer_id,
            notes: data.notes,
            table_number: data.table_number,
            discount_amount: this.discount_amount,
            discount_type: this.discount_type
        }

        console.log(obj);

        this.saleService.editOrder(this.id, obj).subscribe({
            next: (result: any) => {
                console.log(result)
                this.toast.success('Success', 'Sales Order Edited Successfully.');
                console.log(result.id);
                this.getOrderDetail(result.id, true);
                this.router.navigate(['/sales']);

                let table_name;
                if (this.customerName) {
                    table_name = this.customerName
                } else {
                    table_name = '-';
                }

                let tableData = {
                    table_number: data.table_number,
                    table_name: table_name,
                    table_occupied: 1,
                    table_active: 1
                }
                this.TableManagementService.editTableData(this.selectedTableId, tableData).subscribe({
                    next: data => {

                    }, error: err => {
                        this.toast.error('Error', 'Table could not be marked as occupied');
                    }
                })

            }, error: err => {
                this.toast.error('Error', 'Server error.')
            }
        });
    }

}
