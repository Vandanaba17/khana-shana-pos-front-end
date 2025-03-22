import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class CategoriesService {

    private url = environment.apiUrl + 'category/';


    constructor(private http: HttpClient) { }

    // For getting categories data
    getCategoriesData(page: number): Observable<any> {
        return this.http.get<any>(this.url + 'show?page=' + page);
    }

    // For deleting category data
    deleteCategory(id: number) {
        return this.http.get(this.url + 'delete/' + id)
    }

    // For adding Category data
    postCategory(data: any) {
        return this.http.post(this.url + 'insert', data)
    }

    // For editing category
    editCategory(id: number, data: any) {
        return this.http.put(this.url + 'edit/' + id, data)
    }

    // To get edit category form field values
    getEditCategoryData(id: number) {
        return this.http.get(this.url + 'show/' + id)
    }

}
