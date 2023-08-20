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

        console.log(data);
        this.auth.login(data).subscribe({
            next: (result: any) => {
                localStorage.setItem('token', result.access_token)
                localStorage.setItem('Firstname', result.user.first_name)
                localStorage.setItem('Lastname', result.user.lastname)
                localStorage.setItem('Email', result.user.email)
                localStorage.setItem('ShopDetails', JSON.stringify(result.shopDetails))
                this.router.navigate(['/sales']);
                this.userData = result.user
            }, error: error => {
                console.log('error', error);

                this.toast.show('Error', 'Email id or password is incorrect', { className: 'bg-danger text-light' });
            }
        });

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
