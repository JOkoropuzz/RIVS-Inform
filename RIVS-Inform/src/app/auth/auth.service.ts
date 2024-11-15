import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

export interface LoginResult {
  token?: string,
  error?: number
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  httpClient = inject(HttpClient);
  baseUrl = 'http://localhost:64262/api';

  login(data: any) {
    return this.httpClient.post<LoginResult>(`${this.baseUrl}/user/login`, data)
      .pipe(tap((result) => {
        if (result.error != undefined && result.token != undefined) {
          localStorage.setItem('authUser', JSON.stringify(result.token));
          localStorage.setItem('nickNameUser', data.login);
        }
      }),
        catchError(error => {
          console.log(error);
          return of(error.status);
        })
      );
  }

  logout() {
    localStorage.removeItem('authUser');
    localStorage.removeItem('nickNameUser');
  }

  isLoggedIn() {
    return (localStorage.getItem('authUser') !== null
      && localStorage.getItem('nickNameUser') !== null);
  }
}
