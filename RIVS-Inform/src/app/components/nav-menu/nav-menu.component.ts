import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { map } from 'rxjs';

//иконка выхода
const EXIT_ICON = `<svg fill="#5f6368"><path d="M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25Zm10.44 4.5-1.97-1.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.97-1.97H6.75a.75.75 0 0 1 0-1.5Z"></path></svg>`;


@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css'
})

export class NavMenuComponent {

  isExpanded = false;
  public isCollapsed: boolean = true;
  authService = inject(AuthService);
  router = inject(Router);

  readonly enterpriseName$ = this.authService.currentEnterprise$.pipe(
    map(e => e?.name ?? null)
  );

  readonly userName$ = this.authService.currentUserName$;

  constructor()
  {
    //регистрация иконки
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);
    iconRegistry.addSvgIconLiteral('logout', sanitizer.bypassSecurityTrustHtml(EXIT_ICON));
  }
  
  logout() {
    this.authService.logout();
    //this.navService.userName!.next('');
    this.router.navigate(['/login']);
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
