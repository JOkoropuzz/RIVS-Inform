import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { NavMenuService } from '../../services/nav-menu.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})


export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  constructor(
    public navService: NavMenuService
  ) { }

  loginResultMessage = '';

  protected loginForm = new FormGroup({
    login: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });


  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value)
        .subscribe((data: any) => {
          if (this.authService.isLoggedIn()) {
            this.router.navigate(['/home']);
            this.navService.userName!.next(this.loginForm.value.login!);
          }
          else {
            switch (data) {
              case 0: {
                this.loginResultMessage = 'Отсутствует связь с сервером';
                break;
              }
              case 400: {
                this.loginResultMessage = 'Неверный логин или пароль';
                break;
              }
              default: {
                this.loginResultMessage = 'Что-то пошло не так' 
                break;
              } 
            }
            
          }
        });
    }
  }
}
