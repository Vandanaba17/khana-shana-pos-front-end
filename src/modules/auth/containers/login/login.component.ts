import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppToastService } from '@modules/shared-module/services/app-toast.service';

import { AuthService } from './../../services/auth.service';

@Component({
    selector: 'sb-login',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './login.component.html',
    styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit {

    loginForm!: FormGroup;
    // regData: any;
    public userData: any = [];
    showValidations = false;

    constructor(
        public auth: AuthService,
        private fb: FormBuilder,
        private router: Router,
        public toast: AppToastService
    ) { }

    // get f() {
    //     return this.loginForm.controls;
    // }

    // credentials = {
    //     email: this.f.email.value,
    //     password: this.f.password.value
    // }
    get email() {
        return this.loginForm.get('email');
    }

    get password() {
        return this.loginForm.get('password');
    }

    ngOnInit() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required]],
            password: ['', [Validators.required]]
        })
    }

    onSubmit(data: any) {

        if (this.loginForm.invalid) {
            alert('Please fill all the required fields!');
            this.loginForm.markAllAsTouched();
            return;
        }

        this.router.navigate(['/sales']);


        // prepare parameter
        // this.auth.getUser(
        // .subscribe( data => this.regData = data)
        // console.log(this.loginForm.value)
        // this.auth.login(this.credentials).subscribe((response) =>
        //     console.log(response)
        // set token and user detail in local storage separtel

        localStorage.setItem('user', '');
        // }, (err) =>
        //     console.log(err)
        // }
    }
}
