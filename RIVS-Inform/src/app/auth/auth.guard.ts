import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { catchError, map, of, switchMap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn().pipe(
    switchMap(isLoggedIn => {
      if (isLoggedIn) {
        return of(true);
      }

      return authService.checkAuth().pipe(
        map(isAuthenticated =>
          isAuthenticated
            ? true
            : router.createUrlTree(['/login'], {
              queryParams: { returnUrl: state.url }
            })
        ),
        catchError(() =>
          of(router.createUrlTree(['/login']))
        )
      );
    })
  );
};
