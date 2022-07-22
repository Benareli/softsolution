import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Purchasedetail } from '../models/purchasedetail.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'purchasedetails';

@Injectable({
  providedIn: 'root'
})
export class PurchasedetailService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Purchasedetail[]> {
    return this.http.get<Purchasedetail[]>(baseUrl);
  }
  get(id: any): Observable<Purchasedetail> {
    return this.http.get(`${baseUrl}/${id}`);
  }
  getByPOId(po: any): Observable<Purchasedetail[]> {
    return this.http.get<Purchasedetail[]>(`${baseUrl}/po/${po}`);
  }
  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }
  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }
  updateReceiveAll(id: any, partner: any, wh: any, date: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/receiveAll/${id}/${partner}/${wh}/${date}`, data);
  }
  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }
  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }
}