import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, ContactRequest } from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);

  submit(payload: ContactRequest): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${environment.apiUrl}/contact`, payload);
  }
}
