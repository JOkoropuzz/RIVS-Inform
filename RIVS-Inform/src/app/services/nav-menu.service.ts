import { inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavMenuService {
  authService = inject(AuthService);

  readonly enterpriseName$ = this.authService.currentEnterprise$.pipe(
    map(e => e?.Name ?? null)
  );

  readonly userName$ = this.authService.currentUserName$;
  
}
