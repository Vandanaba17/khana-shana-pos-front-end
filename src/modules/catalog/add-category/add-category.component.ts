import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppToastService } from '@modules/shared-module/services/app-toast.service';
import { CategoriesService } from './../categories.service';

@Component({
    selector: 'sb-add-category',
    templateUrl: './add-category.component.html',
    styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

    addCategoryForm!: FormGroup;

    attributesData: any = [];
    parentCategroryData: any;

    visibleInMenu = ['Yes', 'No'];
    displayMode = ['Products and Descrpition'];
    parentCategory = ['Yoga', 'Badminton'];
    status = ['active', 'inactive'];
    attribut = ['price', 'brand'];
    page = 1;
    isCollapsed = false;
    parentCategoryId: any

    // For validations
    get name() {
        return this.addCategoryForm.get('name');
    }

    constructor(
        private fb: FormBuilder,
        private categoryService: CategoriesService,
        private toast: AppToastService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.addCategoryForm = this.fb.group({
            name: ['', [Validators.required]],
        });
    }

    // For submitting Add category form data
    onSubmit(data: any) {

        if (this.addCategoryForm.invalid) {
            alert('Please fill all the required fields');
            this.addCategoryForm.markAllAsTouched();
            return;
        }

        this.categoryService
            .postCategory(data)
            .subscribe({
                next: (result: any) => {
                    // console.log(result)
                    this.toast.success('Success', 'Category Added successfully.')
                    this.router.navigate(['catalog/categories'])
                }, error: err => {
                    this.toast.error('Error', 'Server error.')
                }
            });
    }

    // For parent category listing
    getParentCategrory() {
        this.categoryService.getCategoriesData(this.page).subscribe({
            next: data => {
                this.parentCategroryData = data.category.data
                // console.log(this.parentCategroryData)
            }, error: err => {
                this.toast.error('Error', 'Server error.')
            }
        });
    }

    // To get parent categories id
    onItemChange(value: any) {
        // console.log(' Value is : ', value);
        this.parentCategoryId = value
    }

}
