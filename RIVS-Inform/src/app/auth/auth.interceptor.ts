import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  const authReq = req.clone({
    withCredentials: true 
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        handleUnauthorized(authService, router);
      }

      //if (error.status === 403) {
      //  router.navigate(['/access-denied']);
      //}

      return throwError(() => error);
    })
  );
};

function handleUnauthorized(authService: AuthService, router: Router): void {
  
  authService.clearSession();
  
  router.navigate(['/login'], {
    queryParams: {
      returnUrl: router.url,
      reason: 'session-expired'
    }
  });
}
