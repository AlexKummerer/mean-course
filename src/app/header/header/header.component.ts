import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription = new Subscription();
  constructor(private authService: AuthService) {
    this.authListenerSubs = new Subscription();
  }

  ngOnInit(): void {
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }
  onLogout() {
    this.authService.logout();
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.authListenerSubs.unsubscribe();
  }
}
