import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppToastService } from '@modules/shared-module/services/app-toast.service';

@Component({
    selector: 'sb-login',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './login.component.html',
    styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit {

    loginForm!: FormGroup;
    showValidations = false;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        public toast: AppToastService
    ) { }

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
        this.router.navigate(['/sales']);

        localStorage.setItem('user', '');
    }
}
