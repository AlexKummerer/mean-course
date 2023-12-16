import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { AuthData } from '../auth-data.model';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isLoading = false;

  constructor(public authService: AuthService) {}
  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const authData: AuthData = {
      email: form.value.email,
      password: form.value.password,
    };

    this.authService.login(authData);

  }
}
