import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, map, take, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Enterprise } from '../models/enterprise';

interface LoginResponse {
  userName: string;
  userId: string;
  roleName: string;
  expiration: string;
  enterprises: Enterprise[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  baseUrl = 'http://localhost:6070/api/Auth';

  private readonly _isAdmin = new BehaviorSubject<boolean>(false);
  readonly isAdmin$ = this._isAdmin.asObservable();

  private readonly _currentEnterprise = new BehaviorSubject<Enterprise | null>(null);
  readonly currentEnterprise$ = this._currentEnterprise.asObservable();

  private readonly _currentUserName = new BehaviorSubject<string | null>(null);
  readonly currentUserName$ = this._currentUserName.asObservable();

  private userInfoKey = 'userInfo';

  constructor(private httpClient: HttpClient) {
  }

  login(login: string, password: string): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.baseUrl}/login`, { login, password }, {
      withCredentials: true
    }).pipe(
      tap(userInfo => {
        this.setUserInfo(userInfo);
      })
    );
  }

  private setUserInfo(userInfo: LoginResponse | null) {
    try {
      this._isAdmin.next(userInfo?.roleName === 'admin');
      this._currentUserName.next(userInfo?.userName ?? null);

      this.isAdmin$.pipe(take(1)).subscribe(isAdmin => {
        if (isAdmin)
        {
          this._currentEnterprise.next(null);
        }
        else
        {
          const enterprise = userInfo?.enterprises[0];
          this._currentEnterprise.next(enterprise ?? null);
        }
      });
    } catch (e) {
      console.error('Invalid JWT', e);
      this.logout();
    }
  }

  logout(): Observable<void> {
    return this.httpClient.post<void>(`${this.baseUrl}/logout`, {}, {
      withCredentials: true
    }).pipe(
      finalize(() => this.clearSession())
    );
  }

  isLoggedIn(): Observable<boolean> {
    return this.currentUserName$.pipe(
      map(name => !!name),
      take(1)
    );
  }

  checkAuth(): Observable<boolean> {
    return this.httpClient.get<LoginResponse>(`${this.baseUrl}/me`, {
      withCredentials: true
    }).pipe(
      map(userInfo => {
        this.setUserInfo(userInfo);
        localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
        return true;
      }),
      catchError(() => {
        this.clearSession();
        return of(false);
      })
    );
  }

  clearSession(): void {
    localStorage.removeItem(this.userInfoKey);
    this._isAdmin.next(false);
    this._currentEnterprise.next(null);
    this._currentUserName.next(null);
  }

}
