import { Component } from '@angular/core';
import { NavMenuService } from '../app/services/nav-menu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'RIVS-Inform';
  isUserLogIn = false;

  constructor(
    public navService: NavMenuService
  ) {
    this.navService.isUserLoggedIn.subscribe(value => this.isUserLogIn = value);
  }
}
