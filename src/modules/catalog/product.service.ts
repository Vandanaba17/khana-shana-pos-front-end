import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private url = environment.apiUrl + 'product';

    constructor(private http: HttpClient) { }

    // For getting products data
    getProducts(page: number): Observable<any> {
        return this.http.get<any>(this.url + '?page=' + page);
    }

    // For deleting products data
    deleteProducts(id: number) {
        return this.http.delete(this.url + '/' + id)
    }

    // For adding products data
    postProducts(data: any) {
        return this.http.post(this.url, data)
    }

    // For editing products data
    editProducts(id: number, data: any) {
        return this.http.put(this.url + '/' + id, data)
    }

    editPatchData(id: any): Observable<any> {
        return this.http.get<any>(this.url + '/' + id)
    }

    getLastPosition() {
        return this.http.get(this.url + '/last_position')
    }
}
