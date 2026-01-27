import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { take, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Enterprise } from '../models/enterprise';

interface LoginResponse {
  token: string;
  userName: string;
  userId: string;
  expiration: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  httpClient = inject(HttpClient);
  baseUrl = '/api/Auth';

  private readonly _isAdmin = new BehaviorSubject<boolean>(false);
  readonly isAdmin$ = this._isAdmin.asObservable();

  private readonly _currentEnterprise = new BehaviorSubject<Enterprise | null>(null);
  readonly currentEnterprise$ = this._currentEnterprise.asObservable();

  private readonly _currentUserName = new BehaviorSubject<string | null>(null);
  readonly currentUserName$ = this._currentUserName.asObservable();

  constructor() {
    const token = localStorage.getItem('jwt');
    if (token) {
      this.setToken(token);
    }
    else {
      this.logout();
    }
  }

  login(login: string, password: string): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.baseUrl}/login`, { login, password })
      .pipe(
        tap(res => {
          localStorage.setItem('jwt', res.token);
          this.setToken(res.token);
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  private setToken(token: string) {
    try {
      const payload: any = jwtDecode(token);
      const nameClaim = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
      this._isAdmin.next(nameClaim === 'admin');
      this._currentUserName.next(nameClaim);
      let enterprises: Enterprise[] = [];
      if (payload['Enterprises']) {
        enterprises = JSON.parse(payload['Enterprises']);
      }

      this.isAdmin$.pipe(take(1)).subscribe(isAdmin => {
        if (isAdmin) {
          this._currentEnterprise.next(null);
        } else {
          const enterprise = enterprises[0];
          this._currentEnterprise.next(enterprise);
        }
      });
    } catch (e) {
      console.error('Invalid JWT', e);
      this.logout();
    }
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this._isAdmin.next(false);
    this._currentEnterprise.next(null);
    this._currentUserName.next(null);
  }
 
  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt');
  }
  
}
