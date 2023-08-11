import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

import { SearchUser, UserData } from './userData';



@Injectable({
    providedIn: 'root'
})
export class UserDataService {

    private url = environment.apiUrl + 'user/';

    constructor(private http: HttpClient) { }

    // For getting user data
    getUserData(page: number): Observable<UserData> {

        return this.http.get<UserData>(this.url + 'show?page=' + page);
    }

    // For deleting user data
    deleteUser(id: number) {
        return this.http.get(this.url + 'delete/' + id)
    }

    // For editing user data
    editUser(id: number, data: any) {
        return this.http.put(this.url + 'edit/' + id, data)
    }

    postUserData(data: any) {
        return this.http.post(this.url + 'insert', data);
    }


    // For searching user data
    searchUser(data: any): Observable<SearchUser> {
        return this.http.get<SearchUser>(this.url + 'search?query=' + data)
    }

    // To get edit user form field values
    editUserForm<FetchUser>(id: number) {
        return this.http.get<FetchUser>(this.url + 'show/' + id)
    }

    // For getting Shop Details
    getshopDetails() {
        return this.http.get(this.url + 'shop_details');
    }
}
