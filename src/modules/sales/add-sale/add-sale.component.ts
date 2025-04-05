import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '@modules/catalog/product.service';
import { AppToastService } from '@modules/shared-module/services/app-toast.service';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

import { SalesService } from '../sales.service';

@Component({
    selector: 'sb-add-sale',
    templateUrl: './add-sale.component.html',
    styleUrls: ['./add-sale.component.scss']
})
export class AddSaleComponent implements OnInit {

    @HostListener('document:keydown.shift.s')
    categoryData: any = [];
    addedProduct: any = [];
    orderDetail: any = [];
    itemDetail: any = [];
    activeIds: any = [];
    addSaleForm!: FormGroup
    qtyForm!: FormGroup
    discountForm!: FormGroup
    selectedCity: any
    pageSize = 100
    showProducts = false;
    shopDetails: any

    payment_mode: any

    today = new Date()
    dd = this.today.getDate();
    mm = this.today.getMonth() + 1; // January is 0!
    yyyy = this.today.getFullYear();

    curr_date: NgbDate = new NgbDate(this.yyyy, this.mm, this.dd);
    date = ''
    panels = ['First', 'Second', 'Third'];

    payment_mode_copy = [
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
    ];
    productQuantity: any = [];

    tableList: any = [];
    selectedTableId: any;

    qty = 1;
    shipping_charge = 0;
    discount_amount = 0;
    discount_store = 0;
    total = 0;
    semitotal = 0
    page = 1
    showloader: any
    searchValue: any
    showValidations = false;
    newDate: any;
    resultDisplayArray: any
    showDiscount: any;
    showDiscountOption = false;
    discount_type: any;
    table_number: any;
    default_table_number: any;
    showCartSummary = false;

    get quantity() {
        return this.qtyForm.get('quantity');
    }

    get getFormData(): FormArray {
        return <FormArray>this.qtyForm.get('quantity');
    }



    constructor(
        private productService: ProductService,
        private fb: FormBuilder,
        private modalService: NgbModal,
        private saleService: SalesService,
        private toast: AppToastService,
        private router: Router,
        private activeRoute: ActivatedRoute,
    ) { }

    ngOnInit(): void {

        this.addSaleForm = this.fb.group({
            shipping_charge: [0],
            order_date: [this.curr_date],
            payment_mode: ['cash'],
            notes: [''],
            table_number: []
        })

        this.discountForm = this.fb.group({
            discount: [0]
        })

        // this.qtyForm = this.fb.group({
        //     quantity: ['', [Validators.required]]
        // })

        this.qtyForm = this.fb.group({
            quantity: this.fb.array([])
        });

        this.activeRoute.queryParams.subscribe((params: any) => {
            if (params['table_number']) {
                this.default_table_number = params['table_number'];
            }
        });

        this.getProductsData()
        this.getshopDetails()
        // this.renderer.listen(document, 'keydown.shift.s', handler)
    }

    getshopDetails() {
        this.shopDetails = JSON.parse(localStorage.getItem('ShopDetails') || '{}');

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

    getProductsData() {
        this.categoryData = [];
        this.productService.getProducts(this.page).subscribe((data: any) => {
            data.data.forEach((element: any, index: any) => {
                console.log(element.products.length, 'len');

                if (element.products.length == 0) data.data.splice(index, 1);
            });

            data.data.forEach((element: any) => {
                element.products.forEach((pro: any) => {
                    pro.product_count = 0;
                });
            });
            this.categoryData = data.data;
            console.log(this.categoryData, 'pro');

            for (let i = 0; i < this.categoryData.length; i++) {
                this.activeIds.push("ngb-panel-" + i);
            }
            this.showProducts = true;
        })
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

    onTableChange(event: any) {
        console.log(event);
        this.tableList.forEach((element: any) => {
            if (element.res_table_number == event) {
                console.log(element.id);
                this.selectedTableId = element.id;
            }
        });

    }

    qtyClose() {
        this.qtyForm = this.fb.group({
            quantity: ['', [Validators.required]]
        })
    }

    onSelectDate(date: any) {
        console.log(date);
        this.date = date.year + '-' + date.month + '-' + date.day
        console.log(this.date);
    }

    onSelectProduct(data: any) {


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

        console.log(this.addedProduct, 'added');

        this.semitotal = this.addedProduct.map((a: any) => (a.subtotal)).reduce(function (a: any, b: any) {
            return a + b;
        })

        this.productQuantity[this.addedProduct.length - 1] = 1;

        console.log(this.productQuantity, 'quantity');


        this.total += (data.quantity * data.price);
        this.calculateTotal();
    }

    qtyChange(event: any, i: any) {
        console.log(event, 'val');

        let qty = Number(event?.target.value);
        console.log(qty);

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


        this.calculateTotal();
    }

    addDiscount(obj: any) {
        console.log(obj);
        if (obj.discount == true) {
            this.showDiscountOption = true;
        } else {
            this.showDiscountOption = false;
            this.discount_amount = 0;
            this.calculateTotal();
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
            console.log(this.discount_amount, 'dis amount');

        }
    }

    openVerticallyCentered(content: any) {
        this.modalService.open(content, { centered: true, size: 'sm' });
    }

    openModal(content: any) {
        this.modalService.open(content, { centered: true });
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
                alert('Shipping Charges cannot be greater than or equal to the total amount!');
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
            this.calculateTotal();
        }
    }

    removeProduct(id: any, catId: any) {
        if (confirm('Are you sure you want to delete?')) {
            this.addedProduct = this.addedProduct.filter((item: any) => item.id !== id);
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
        console.log(items);


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

    getOrderDetail(id: number) {
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

        })
    }

    onSubmit(data: any) {

        if (this.addSaleForm.invalid) {
            alert('Please fill all the required fields!');
            return;
        }

        if (this.addedProduct.length == 0) {
            alert('Please add atleast one product!');
            return;
        }

        // console.log(data);

        const addedProductSubmit: any = []

        this.addedProduct.forEach((g: any) => {
            addedProductSubmit.push({
                product_id: g.id,
                category_id: g.category_id,
                price: g.price,
                quantity: g.quantity,
                subtotal: g.subtotal
            })
        });
        console.log('addedProductSubmit: ', addedProductSubmit);

        if (this.date == '') {
            this.date = this.curr_date.year + '-' + this.curr_date.month + '-' + this.curr_date.day
        }

        this.table_number = data.table_number;
        const obj = {
            shipping_charge: this.shipping_charge,
            total_amount: this.total,
            order_date: this.date,
            products: addedProductSubmit,
            payment_mode: data.payment_mode,
            notes: data.notes,
            table_number: data.table_number,
            discount_amount: this.discount_amount,
            discount_type: this.discount_type
        }

        console.log(obj);

        this.saleService.postOrder(obj).subscribe({
            next: (result: any) => {
                console.log(result, 'result data')
                this.toast.success('Success', 'Sales Order Added Successfully.');
                this.getOrderDetail(result.order.id);
                this.router.navigate(['/sales']);
            }, error: err => {
                this.toast.error('Error', 'Server Error')
            }
        });
    }



}
