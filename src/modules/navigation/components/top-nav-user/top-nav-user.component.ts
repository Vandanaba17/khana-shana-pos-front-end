import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppToastService } from '@modules/shared-module/services/app-toast.service';

@Component({
    selector: 'sb-top-nav-user',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './top-nav-user.component.html',
    styleUrls: ['top-nav-user.component.scss'],
})
export class TopNavUserComponent implements OnInit {

    email = localStorage.getItem('Email')

    constructor(
        private router: Router,
        private toast: AppToastService
    ) { }
    ngOnInit() { }

    onClick() {
        localStorage.clear();
        this.router.navigate(['/auth/login']);
        this.toast.success('Success', 'Logged out Successfully.')

    }
}
