import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

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
  baseUrl = 'http://localhost:6070/api/Auth';
  
  login(login: string, password: string): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.baseUrl}/login`, { login, password })
      .pipe(
        tap(res => {
          localStorage.setItem('jwt', res.token);
          localStorage.setItem('nickNameUser', res.userName);
          localStorage.setItem('userId', res.userId);
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  logout(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('nickNameUser');
    localStorage.removeItem('userId');
  }
 
  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt')
      && !!localStorage.getItem('nickNameUser') && !!localStorage.getItem('userId');
  }
}
