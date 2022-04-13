import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, ReplaySubject } from 'rxjs';

import { User } from '../models';

const userSubject: ReplaySubject<User> = new ReplaySubject(1);

@Injectable()
export class UserService {

  private url = environment.apiUrl + 'auth/logout';

    constructor(
        private http: HttpClient
    ) {
        this.user = {
            id: '123',
            first_name: 'Start',
            lastname: 'Bootstrap',
            username: 'start_',
            email: 'no-reply@startbootstrap.com'
        };
    }

    set user(user: User) {
        userSubject.next(user);
    }

    get user$(): Observable<User> {
        return userSubject.asObservable();
    }

    createAuthrorizationHeader(): HttpHeaders {

        let headers = new HttpHeaders();
        const token: any = localStorage.getItem('token');

        headers = headers.append('Authorization', 'Bearer ' + token);
        console.log(headers);

        return headers;
      }

    logout() {

        const headers = this.createAuthrorizationHeader();
        return this.http.post(this.url, { headers })
    }
}
