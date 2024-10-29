import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject, Inject } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  httpClient = inject(HttpClient);
  baseUrl = '/api';

  constructor(@Inject('apiUrl') private apiUrl: URL) { }

  login(data: any) {
    return this.httpClient.post(`${this.apiUrl}/login`, data)
      .pipe(tap((result) => {
        if (result) {
          localStorage.setItem('authUser', JSON.stringify(result));
        }
      }),
        catchError(error => {
          console.log(error);
          return of(false);
        })
      );
  }

  logout() {
    localStorage.removeItem('authUser');
  }

  isLoggedIn() {
    return localStorage.getItem('authUser') !== null;
  }
}
