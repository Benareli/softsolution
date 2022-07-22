import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Entry } from '../models/entry.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'entrys';

@Injectable({
  providedIn: 'root'
})
export class EntryService {
  constructor(private http: HttpClient) { }
  getAll(): Observable<Entry[]> {
    return this.http.get<Entry[]>(baseUrl);
  }
  get(id: any): Observable<Entry> {
    return this.http.get(`${baseUrl}/id/${id}`);
  }
  getJournal(journal: any): Observable<Entry> {
    return this.http.get(`${baseUrl}/journal/${journal}`);
  }
}
