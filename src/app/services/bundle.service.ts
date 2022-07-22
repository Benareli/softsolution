import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Bundle } from '../models/bundle.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'bundles';

@Injectable({
  providedIn: 'root'
})
export class BundleService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Bundle[]> {
    return this.http.get<Bundle[]>(baseUrl);
  }
  getTable(): Observable<Bundle[]>{
    return this.http.get(baseUrl)
      .pipe(map((response: any) => response.data as Bundle[]))
  }
  get(id: any): Observable<Bundle> {
    return this.http.get(`${baseUrl}/${id}`);
  }
  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }
  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }
  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }
  getByProduct(product: any): Observable<Bundle[]> {
    return this.http.get<Bundle[]>(`${baseUrl}/product/${product}`);
  }
  getByBundle(bundle: any): Observable<Bundle[]> {
    return this.http.get<Bundle[]>(`${baseUrl}/bundle/${bundle}`);
  }
}