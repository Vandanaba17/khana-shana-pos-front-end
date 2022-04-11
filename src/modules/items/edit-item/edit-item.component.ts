import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemGroupsService } from '@modules/item-groups/item-groups.service';
import { UomService } from '@modules/pos/uom.service';
import { AppToastService } from '@modules/shared-module/services/app-toast.service';

import { ItemsService } from '../items.service';

@Component({
  selector: 'sb-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit {

  editItemForm!: FormGroup
  public itemGroupsData: any = [];
  public unitData: any = [];
  public unitId: any
  public itemGroupId: any
  id: any


  get item_name() {
    return this.editItemForm.get('item_name');
  }

  get unit_id() {
    return this.editItemForm.get('unit_id');
  }

  get item_group_id() {
    return this.editItemForm.get('item_group_id');
  }

  constructor(
    private fb: FormBuilder,
    private itemService: ItemsService,
    private itemGroupService: ItemGroupsService,
    private unitService: UomService,
    private toast: AppToastService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.editItemForm = this.fb.group({
      item_name: ['', [Validators.required]],
      unit_id: ['', [Validators.required]],
      item_group_id: ['', [Validators.required]]
    })

    this.id = this.route.snapshot.params.id

    this.getUOMData();
    this.getItemGroupsData();

    // To get edit item form field values
    this.itemService.patchItemData(this.id).subscribe((data: any) => {
      this.editItemForm.patchValue(data)
      console.log(data)
    })
  }

  getItemGroupsData() {
    this.itemGroupService.getItemGroupsData().subscribe(data => {
      this.itemGroupsData = data.item_groups.data;
      console.log(data);
    })
  }

  getUOMData() {
    this.unitService.getUOMData().subscribe(data => {
      this.unitData = data.units.data;
      console.log(data);
    })
  }

  // For submitting edit item form data
  updateData(data: any) {
    this.itemService.editItem(this.id, data).subscribe(data => {
      console.log('Data updated successfully! ', data);
      this.router.navigate(['/items']);
      this.toast.success('Success', 'Edited successfully.')
    }, err => {
      this.toast.error('Error', 'Server error.')
    });
  }




}
