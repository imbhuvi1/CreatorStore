import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/portfolio.models';

interface LoginPayload { username: string; password: string; }
interface LoginResp { token: string; username: string; expiresInMinutes: number; }
const TOKEN_KEY = 'portfolio_admin_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  username = signal<string | null>(localStorage.getItem('portfolio_admin_username'));

  login(payload: LoginPayload): Observable<ApiResponse<LoginResp>> {
    return this.http.post<ApiResponse<LoginResp>>(`${environment.apiUrl}/admin/login`, payload).pipe(
      tap(r => {
        if (r.success && r.data) {
          localStorage.setItem(TOKEN_KEY, r.data.token);
          localStorage.setItem('portfolio_admin_username', r.data.username);
          this.token.set(r.data.token);
          this.username.set(r.data.username);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('portfolio_admin_username');
    this.token.set(null);
    this.username.set(null);
  }

  isAuthenticated(): boolean { return !!this.token(); }
}
