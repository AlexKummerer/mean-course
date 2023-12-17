import { AuthData } from './../auth-data.model';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  isLoading = false;

constructor(public authService: AuthService) {}

  onSignUp(form: NgForm) {

    this.isLoading = true;
    if (form.invalid) {
      return;
    }
    const authData: AuthData = {
      email: form.value.email,
      password: form.value.password,
    };
    this.authService.createUser(authData);
  }


}
