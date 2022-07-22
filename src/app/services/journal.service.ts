import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Entry } from '../models/entry.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'journals';

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  constructor(private http: HttpClient) { }
  getAll(): Observable<Entry[]> {
    return this.http.get<Entry[]>(baseUrl);
  }
  get(id: any): Observable<Entry> {
    return this.http.get(`${baseUrl}/id/${id}`);
  }
}
