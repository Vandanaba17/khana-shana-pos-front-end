import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ItemGroupsService {

  private url = environment.apiUrl + 'item_groups';

  constructor(
    private http: HttpClient
  ) { }

  getItemGroupsData(page: number, limit: number): Observable<any> {
    return this.http.get<any>(this.url + '?page=' + page + '&limit=' + limit);
  }

  postItemGroupsData(data: any) {
    return this.http.post(this.url, data);
  }

  deleteItemGrpup(id: number) {
    return this.http.delete(this.url + '/' + id)
  }

  editItemGroup(id: number, data: any) {
    return this.http.put(this.url + '/' + id, data)
  }

  patchItemGroupData(id: number): Observable<any> {
    return this.http.get<any>(this.url + '/' + id);
  }

  searchItemGroup(page: any, data: any) {
    return this.http.get(this.url + '?page=' + page + '&&query=' + data)
  }

}
