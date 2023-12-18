import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { AuthData } from '../auth-data.model';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authListenerSubs: Subscription = new Subscription();

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authService
      .getAuthStatusListener()
      .subscribe((authStatus: boolean) => {
        this.isLoading = false;
      });
  }

  onLogin(form: NgForm) {
    this.isLoading = true;
    if (form.invalid) {
      return;
    }

    const authData: AuthData = {
      email: form.value.email,
      password: form.value.password,
    };

    this.authService.login(authData);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.authListenerSubs.unsubscribe();
  }
}
