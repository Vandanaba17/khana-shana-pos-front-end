import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationService } from '@modules/navigation/services';
import { DomSanitizer } from '@angular/platform-browser';
import { AppToastService } from '@modules/shared-module/services/app-toast.service';
import { UserDataService } from '@modules/pos/user-data.service';
@Component({
    selector: 'sb-top-nav',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './top-nav.component.html',
    styleUrls: ['top-nav.component.scss'],
})
export class TopNavComponent implements OnInit {

    showloader: any
    public userData: any = [];
    public length = 0;
    public total = 0;
    shopName: any;
    shopLogo: any;

    constructor(
    ) { }

    ngOnInit() {
        let shopDetails: any = JSON.parse(localStorage.getItem('ShopDetails') || '{}');
        this.shopName = shopDetails?.shop_name;
        this.shopLogo = shopDetails?.logo;
    }
}
