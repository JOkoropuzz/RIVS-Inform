import { Component } from '@angular/core';
import { AuthService } from '../app/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'RIVS-Inform';
  
  constructor(public authService: AuthService) {
    //this.authService.logout();
  }
}
