import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { NavMenuService } from '../../services/nav-menu.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css'
})
export class NavMenuComponent {
  isExpanded = false;

  authService = inject(AuthService);
  router = inject(Router);

  constructor(
    public navService: NavMenuService
  ) { }

  changeUserName(value: any): void {
  }

  logout() {
    this.authService.logout();
    this.navService.userName!.next('');
    this.router.navigate(['/login']);
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
