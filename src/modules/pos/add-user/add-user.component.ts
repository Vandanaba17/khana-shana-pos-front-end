import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'sb-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  addUserForm!: FormGroup;

  get userName() {
    return this.addUserForm.get('userName');
  }

  get firstName() {
    return this.addUserForm.get('firstName');
  }

  get email() {
    return this.addUserForm.get('email');
  }

  outlet = ['Webkul Outlet', 'abc Outlet', 'wow Outlet'];
  status = ['active', 'inactive'];
  
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.addUserForm = this.fb.group( {
      userName: ['',[Validators.required]],
      firtName: ['',[Validators.required]],
      email: [''],
      password: ['',[Validators.required]],
      confirmPassword: ['',[Validators.required]],
      outlet:['',[Validators.required]],
      status: ['',[Validators.required]]
    });

  }

}
