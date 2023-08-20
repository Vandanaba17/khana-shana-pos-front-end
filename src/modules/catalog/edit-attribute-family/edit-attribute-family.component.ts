import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppToastService } from '@modules/shared-module/services/app-toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AttributeFamilyService } from '../attribute-family.service';
import { AttributesService } from '../attributes.service';

@Component({
  selector: 'sb-edit-attribute-family',
  templateUrl: './edit-attribute-family.component.html',
  styleUrls: ['./edit-attribute-family.component.scss']
})
export class EditAttributeFamilyComponent implements OnInit {

  editFamilyForm!: FormGroup;
  addGroup!: FormGroup
  addAttributeForm!: FormGroup
  public attributeGroupData: any = [];
  public attributeDataList: any = [];
  public groupData: any = []
  public length = 0;
  public total = 0;
  attributeId: any
  familyId: any
  showloader: any
  page = 1;
  groupId: any
  attrId: any

  // For Validations

  // Edit Family Form
  get name() {
    return this.editFamilyForm.get('attribute_family_name');
  }

  get code() {
    return this.editFamilyForm.get('attribute_family_code');
  }

  get gName() {
    return this.editFamilyForm.get('gName');
  }

  get position() {
    return this.editFamilyForm.get('position');
  }

  get group_name() {
    return this.editFamilyForm.get('group_name');
  }

  // Add attribute form
  get attributeName() {
    return this.addAttributeForm.get('attributeName');
  }

  constructor(private fb: FormBuilder,
    private attribute: AttributesService,
    private family: AttributeFamilyService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private toast: AppToastService
  ) { }

  ngOnInit(): void {
    this.editFamilyForm = this.fb.group({
      attribute_family_code: ['', [Validators.required]],
      attribute_family_name: ['', [Validators.required]],
    });

    this.addGroup = this.fb.group({
      group_name: ['', [Validators.required]]
    })

    this.addAttributeForm = this.fb.group({
      attributeName: ['', [Validators.required]]
    })
    this.getAttributesGroupData()
    this.getGroup()
    this.getAttributesData()

    this.familyId = this.route.snapshot.params.id
    console.log(this.familyId);

  }

  // For attribute table listing in group
  getAttributesGroupData() {
    this.showloader = true
    this.family.showAttribute().subscribe({
      next: result => {
        this.attributeGroupData = result.attribute_group_show;
        this.length = this.attributeGroupData.length
        console.log(this.attributeGroupData, this.length)
        this.showloader = false
      }, error: err => {
        this.toast.error('Error', 'Server error.')
      }
    })
  }

  // For add attributes dropdown in add attribute modal
  getAttributesData() {
    this.showloader = true
    this.attribute.getAttributesData(this.page).subscribe({
      next: result => {
        this.attributeDataList = result.Attributes.data;
        this.length = result.Attributes.per_page;
        this.total = result.Attributes.total;
        this.showloader = false
        console.log(this.attributeDataList.id);
      }, error: err => {
        this.toast.error('Error', 'Server error.')
      }
    })
  }

  // Group listing in edit attribute family form
  getGroup() {
    this.family.getGroup().subscribe({
      next: result => {
        this.groupData = result.groups.data
        console.log(this.groupData)
      }, error: err => {
        this.toast.error('Error', 'Server error.')
      }
    })
  }

  // To submit edit attribute family form data
  updateData(data: any) {
    this.family.editFamily(this.familyId, data).subscribe({
      next: data => {
        console.log('Data updated successfully! ', data)
        this.router.navigate(['/catalog/products']);
        this.toast.success('Success', 'Attribute Family Edited successfully.')
      }, error: err => {
        this.toast.error('Error', 'Server error.')
      }
    })

  }

  // For adding group
  updateData2(data: any) {
    this.family.addGroup(data).subscribe({
      next: data => {
        console.log('Data added successfully! ', data)
        this.toast.success('Success', 'Group Added successfully.')
      }, error: err => {
        this.toast.error('Error', 'Server error.')
      }
    })
  }

  // For deleting attribute from group
  deleteRow(id: number) {
    if (confirm('Are you sure you want to delete?')) {
      this.attribute.deleteAttribute(id).subscribe({
        next: data => {
          this.getAttributesGroupData();
          this.toast.success('Success', 'Attribute Deleted successfully.')
        }, error: err => {
          this.toast.error('Error', 'Server error.')
        }
      })
      console.log('Deleted!');
    }
  }

  // For deleting group
  deleteGroup(id: number) {
    this.family.deleteGroup(id).subscribe({
      next: data => {
        this.toast.success('Success', 'Group Deleted successfully.')
        this.getGroup();
      }, error: err => {
        this.toast.error('Error', 'Server error.')
      }
    })
    console.log('Group deleted')
  }

  // For modal
  openVerticallyCentered(content: any) {
    this.modalService.open(content, { centered: true });
  }

  // To get attribute id
  onSelectName(id: any) {
    this.attributeId = id
    console.log(this.attributeId)
  }

  // For adding attribute in group
  addAttribute(groupid: number) {
    const group_id = groupid
    const attribute_family_id = this.familyId
    const data = { group_id, attribute_family_id }
    this.family.addAttribute(data, this.attributeId).subscribe({
      next: result => {
        this.toast.success('Success', 'Attribute Added successfully.')
        this.getAttributesGroupData();
        console.log(result);

      }, error: err => {
        this.toast.error('Error', 'Server error.')
      }
    })
    // console.log('Attribute family id: ', this.familyId);
    // console.log('Atttribute id: ', this.attributeId);
    // console.log('Group id: ', group_id);
  }
}
